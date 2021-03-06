/**
 * Utility classes for the Azure Cosmos DB NoSQL API -
 * such as CRUD operations, bulk loading, and metadata.
 * Chris Joakim, Microsoft, 2023
 */

import util from "util";
import { v4 as uuidv4 } from 'uuid';

import {
    BulkOptions,
    BulkOperationType,
    ConnectionMode,
    ConnectionPolicy,
    Container,
    CosmosClient,
    Database,
    DatabaseResponse,
    DatabaseAccount,
    DatabaseDefinition,
    DiagnosticNodeInternal,
    FeedOptions,
    FeedResponse,
    ItemResponse,
    JSONObject,
    Offer,
    OfferDefinition,
    OfferResponse,
    OperationInput,
    PatchOperation,
    PartitionKeyDefinition,
    PatchRequestBody,
    PatchOperationType,
    PriorityLevel,
    RequestOptions,
    ResourceResponse,
    SharedOptions,
    SqlQuerySpec,
    SqlParameter,
    ContainerDefinition,
    BulkOperationResponse
  } from "@azure/cosmos";

import { CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";
import { AppLogger } from "./AppLogger";

/**
 * A CosmosClient may specify its ConnectionPolicy object.
 * This is the default ConnectionPolicy used in azu-js.
 */
export const defaultCosmosConnectionPolicy: ConnectionPolicy = Object.freeze({
    connectionMode: ConnectionMode.Gateway,
    requestTimeout: 60000,
    enableEndpointDiscovery: true,
    preferredLocations: [],
    retryOptions: {
      maxRetryAttemptCount: 9,
      fixedRetryIntervalInMilliseconds: 0,
      maxWaitTimeInSeconds: 30,
    },
    useMultipleWriteLocations: true,
    endpointRefreshRateInMs: 300000,
    enableBackgroundEndpointRefreshing: true,
});

/**
 * Instances of this class are used to return the aggregate results
 * from a "loadContainerBulkAsync" method call in class CosmosNoSqlUtil below.
 */
export class BulkLoadResult {
    inputDocumentCount: number = 0;
    startTime     : number = -1;
    endTime       : number = -1;
    elapsedTime   : number = -1;
    batchSize     : number = -1;
    batchCount    : number = 0;
    totalRUs      : number = 0;
    responseCodes : object = {};

    constructor() {
        this.startTime = this.timeNow();
    }

    /**
     * Individual BulkOperationResponse results are aggregated
     * in this method.  For example, a bulk load may execute ten
     * "batches" of n-number of documents; each batch is aggregated
     * here.
     */
    increment(bulkOpResp : BulkOperationResponse) {
        this.batchCount++;
        bulkOpResp.forEach(opResp => {
            if (this.responseCodes[opResp.statusCode]) {
                this.responseCodes[opResp.statusCode]++;
            }
            else {
                this.responseCodes[opResp.statusCode] = 1;
            }
            this.totalRUs = this.totalRUs + opResp.requestCharge;
        });
    }

    /**
     * Start the internal elapsed time clock.
     */
    start() {
        this.startTime = this.timeNow();
    }

    /**
     * Stop the internal elapsed time clock and calculate elapsed time.
     */
    finish() {
        this.endTime = this.timeNow();
        this.elapsedTime = this.endTime - this.startTime;
    }

    /**
     * Get and return the current epoch time value.
     */
    private timeNow() : number {
        return new Date().getTime();
    }
}

/**
 * Utility class for the Azure Cosmos DB NoSQL API -
 * such as CRUD operations, bulk loading, and metadata.
 */
export class CosmosNoSqlUtil {
    acctUriEnvVar : string;
    acctKeyEnvVar : string;
    acctUri       : string;
    acctKey       : string;
    currentDbName : string = '';
    currentDb     : Database = null;
    currentContainerName : string = '';
    currentContainer     : Container = null;
    connectionPolicy : ConnectionPolicy = null;
    priorityLevel : PriorityLevel = null;
    maxIntegratedCacheStalenessInMs = -1;
    sharedOptions : SharedOptions = null;
    cosmosClient : CosmosClient = null;
    verbose : boolean = false;
    logger  : AppLogger;

    /**
     * Pass in the names of the environment variables that contain the
     * Azure Cosmos DB account URI and Key.  The ConnectionPolicy arg
     * enables you to set preferred regions and other similar params.
     */
    constructor(
        acctUriEnvVar : string,
        acctKeyEnvVar : string,
        connPolicy? : ConnectionPolicy,
        verbose?: boolean) {

        this.logger = AppLogger.buildDefaultLogger('CosmosNoSqlUtil');

        try {
            // set instance variables
            this.acctUriEnvVar = acctUriEnvVar;
            this.acctKeyEnvVar = acctKeyEnvVar;
            this.verbose = verbose;
            // read given environment variables
            this.acctUri = process.env[acctUriEnvVar] as string;
            this.acctKey = process.env[acctKeyEnvVar] as string;
            // validate
            if (!this.acctUri) {
                throw Error(
                    util.format('Cosmos DB acctUri not populated per env var: %s', this.acctUriEnvVar));
            }
            if (!this.acctKey) {
                throw Error(
                    util.format('Cosmos DB acctKey not populated per env var: %s', this.acctKeyEnvVar));
            }

            this.logger.debug(util.format('  url: %s -> %s', this.acctUriEnvVar, this.acctUri));
            this.logger.debug(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));
            if (!connPolicy) {
                this.connectionPolicy = defaultCosmosConnectionPolicy;
            }
            else {
                this.connectionPolicy = connPolicy;
            }

            // priorityLevel and maxIntegratedCacheStalenessInMs are specified in the
            // SharedOptions object
            this.sharedOptions = this.buildSharedOptions();

            this.cosmosClient = new CosmosClient({
                endpoint: this.acctUri,
                key: this.acctKey,
                connectionPolicy: this.connectionPolicy
            });
            this.logger.debug(util.format('  cosmosClient: %s', this.cosmosClient));
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    getDefaultConnectionPolicy() : ConnectionPolicy {
        return defaultCosmosConnectionPolicy;
    }

    setPriorityLevel(level : PriorityLevel) : void {
        this.priorityLevel = level;
        this.sharedOptions = this.buildSharedOptions();
    }

    unsetPriorityLevel() : void {
        this.priorityLevel = null;
        this.sharedOptions = this.buildSharedOptions();
    }

    setMaxIntegratedCacheStalenessInMs(maxIntegratedCacheStalenessInMs : number) : void {
        this.maxIntegratedCacheStalenessInMs = maxIntegratedCacheStalenessInMs;
        this.sharedOptions = this.buildSharedOptions();
    }

    /**
     * Create and return an instance of the SharedOptions interface.
     * It may contain 'priorityLevel' and 'maxIntegratedCacheStalenessInMs'.
     */
    buildSharedOptions() : SharedOptions {
        let opts = {};
        if (this.priorityLevel) {
            opts['priorityLevel'] = this.priorityLevel;
        }
        if (this.maxIntegratedCacheStalenessInMs > 0) {
            opts['maxIntegratedCacheStalenessInMs'] = this.maxIntegratedCacheStalenessInMs;
        }
        this.logger.debug(util.format('cosmosClient, buildSharedOptions: %s', opts));
        return opts;
    }

    /**
     * Close/dispose the CosmosClient SDK instance.
     */
    dispose() {
        if (this.cosmosClient) {
            this.cosmosClient.dispose();
            this.cosmosClient = null;
        }
    }

    async getDatabaseAccountAsync() : Promise<ResourceResponse<DatabaseAccount>> {
        return this.cosmosClient.getDatabaseAccount(this.sharedOptions);
    }

    async getReadEndpointAsync() : Promise<string> {
        return this.cosmosClient.getReadEndpoint();
    }

    async getWriteEndpointAsync() : Promise<string> {
        return this.cosmosClient.getWriteEndpoint();
    }

    async listDatabasesAsync() : Promise<Array<DatabaseDefinition>> {
        let feedResp = await this.cosmosClient.databases.readAll(this.sharedOptions).fetchAll();
        let databases = new Array<DatabaseDefinition>();
        for (const db of feedResp.resources) {
            databases.push(db);
        }
        return databases;
    }

    async listContainersAsync(dbName: string) : Promise<Array<ContainerDefinition>> {
        let feedResp = await
            this.cosmosClient.database(dbName).containers.readAll(this.sharedOptions).fetchAll();
        let containers = new Array<ContainerDefinition>();
        for (const container of feedResp.resources) {
            containers.push(container);
        }
        return containers;
    }

    async getAccountOffersAsync() : Promise<Array<OfferDefinition>> {
        let offerDefs : Array<OfferDefinition> = new Array<OfferDefinition>();
        let resp = await
            this.cosmosClient.offers.readAll(this.sharedOptions).fetchAll();
        for (const offer of resp.resources) {
            offerDefs.push(offer);
        }
        return offerDefs;
    }

    async getAccountMetadataAsync() : Promise<CosmosNoSqlAccountMeta> {
        let metadata : CosmosNoSqlAccountMeta = new CosmosNoSqlAccountMeta();
        let offerDefs : Array<OfferDefinition> = await this.getAccountOffersAsync();
        for (const offer of offerDefs) {
            metadata.offers.push(offer);
        }
        let databases : Array<DatabaseDefinition> = await this.listDatabasesAsync();
        for (const db of databases) {
            metadata.databases.push(db);
        }
        for (const db of metadata.databases) {
            let dbName = db.id;  // db.id is the database name
            let containers : Array<ContainerDefinition> = await this.listContainersAsync(db.id);
            for (const c of containers) {
                metadata.containers.push(c);
            }
        }
        return metadata;
    }

    async setCurrentDatabaseAsync(dbName: string) : Promise<void> {
        if (this.currentDbName !== dbName) {
            this.currentDbName = dbName;
            this.currentDb = this.cosmosClient.database(dbName);
        }
        return;
    }

    async setCurrentContainerAsync(cName: string) : Promise<void> {
        if (this.currentContainerName !== cName) {
            this.currentContainerName = cName;
            this.currentContainer = this.currentDb.container(cName);
        }
    }

    async readPartitionKeyDefinitionAsync(dbName: string, cName: string) : Promise<PartitionKeyDefinition> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        let pkDef = await this.currentContainer.readPartitionKeyDefinition(new DiagnosticNodeInternal());
        return pkDef.resource
    }

    async insertDocumentAsync(dbName: string, cName: string, doc: Object) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.create(doc, this.sharedOptions);
    }

    async pointReadAsync(dbName: string, cName: string, id: string, pk: string) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.item(id, pk).read(this.sharedOptions);
    }

    async queryAsync(dbName: string, cName: string, querySpec: SqlQuerySpec) : Promise<FeedResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.query(querySpec, this.sharedOptions).fetchAll()
    }

    async upsertDocumentAsync(dbName: string, cName: string, doc: Object) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.upsert(doc, this.sharedOptions);
    }

    async patchDocumentAsync(dbName: string, cName: string, id: string, pk: string, operations: Array<PatchOperation>) : Promise<ItemResponse<Object>> {
        // https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/cosmosdb/cosmos/test/public/functional/item/item.spec.ts
        // https://learn.microsoft.com/en-us/azure/cosmos-db/partial-document-update-getting-started
        // See the comments at the end of this module which shows the PatchOperation definition.
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.item(id, pk).patch(operations, this.sharedOptions);
    }

    async deleteDocumentAsync(dbName: string, cName: string, id: string, pk: string) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.item(id, pk).delete(this.sharedOptions);
    }

    async loadContainerSequentialAsync(dbName: string, cName: string, documents: Array<Object>): Promise<number> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName)

        let count = 0;
        for (let doc of documents) {
            count++
            this.logger.debug(util.format('---: %s of %s', count, documents.length));
            this.logger.debug(util.format('doc: %s', doc));
            let result = await this.currentContainer.items.create(doc, this.sharedOptions);
            this.logger.debug(util.format('result: %s', result));
        }
        return count;
    }

    /**
     * Execute a bulk-load or bulk-upsert of the given documents into the
     * given database and container.  These operations are executed in
     * batches of up to 50 documents per batch, per the given batchSize.
     * An instance of class BulkLoadResult is returned - it contains the
     * aggregated/summarized resuls of the bulk operation.  This includes
     * document counts, elapsed time, RU consumption, and response codes
     * counts.
     * 
     * For Low or High Priority requests, specify either PriorityLevel.Low or
     * PriorityLevel.High as the value of 'priorityLevel' in the RequestOptions
     * arg.
     */
    async loadContainerBulkAsync(
        dbName: string,
        cName:  string,
        operationName: string,
        documents: Array<object>,
        generateIds: boolean = false,
        givenBatchSize: number = 50,
        bulkOptions?: BulkOptions,
        reqOptions?: RequestOptions): Promise<BulkLoadResult> {

        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        let jsonObjects : JSONObject[] = this.buildJsonObjectArray(documents, generateIds);
        let batchSize = this.normalizedBatchSize(givenBatchSize);

        let operationType : any = BulkOperationType.Create; // default to Create unless explicitly Upsert
        if (operationName.toLocaleLowerCase().trim() === 'upsert') {
            operationType = BulkOperationType.Upsert;
        }
        let bulkLoadResult : BulkLoadResult = new BulkLoadResult();  // this is the method return object
        bulkLoadResult.inputDocumentCount = documents.length;
        bulkLoadResult.batchSize = batchSize;
        bulkLoadResult.start()

        let operations = new Array<OperationInput>();

        for (let i = 0; i < jsonObjects.length; i++) {
            let resourceBody = jsonObjects[i];
            let op: OperationInput = {
                operationType,
                resourceBody
            };
            operations.push(op);
            // execute a batch of batchSize operations while iterating through
            // the input document array.
            if (operations.length >= batchSize) {
                await this.executeBulkBatch(operations, bulkLoadResult, bulkOptions, reqOptions);
                //operations = new Array<OperationInput>();
                operations.length = 0
            }
        }
        // execute the last batch if necessary
        if (operations.length > 0) {
            await this.executeBulkBatch(operations, bulkLoadResult, bulkOptions, reqOptions);
        }
        bulkLoadResult.finish();
        return bulkLoadResult;
    }

    private async executeBulkBatch(
        operations : Array<OperationInput>,
        blr : BulkLoadResult,
        bulkOptions?: BulkOptions,
        reqOptions?: RequestOptions) : Promise<boolean> {

        let bulkOpResp : BulkOperationResponse =
            await this.currentContainer.items.bulk(operations, bulkOptions, reqOptions);
        blr.increment(bulkOpResp);
        return true;
    }

    private buildJsonObjectArray(documents : Array<object>, generateIds : boolean) : JSONObject[] {
        let jsonObjects : JSONObject[] = new Array<JSONObject>();
        documents.forEach(doc => {
            // deal with the awkward JSONObject interface; make tsc think that the
            // object is a dictionary and has a 'key' with both type and value string.
            let obj = { dict: <{ [key: string]: string }> doc };
            if (generateIds) {
                doc['id'] = this.generateUuid();
            }
            // obj['dict'] is the original/given document, an object.
            // but it may have been augmented with a new uuid.
            jsonObjects.push(obj['dict']); 
        });
        return jsonObjects;
    }

    /**
     * Return a batch size value between 1 and 50 from the given value.
     */
    private normalizedBatchSize(n : number) : number {
        if (n < 1) {
            return 1;
        }
        if (n > 50) {
            return 50;
        }
        return n;
    }

    /**
     * Create and return a uuid v4 as a string value.
     */
    generateUuid() : string {
        return uuidv4();
    }
}

// Including these SDK definitions for reference only:

// export type PatchOperation = ExistingKeyOperation | RemoveOperation;

// export const PatchOperationType = {
//   add: "add",
//   replace: "replace",
//   remove: "remove",
//   set: "set",
//   incr: "incr",
// } as const;

// export type ExistingKeyOperation = {
//   op: keyof typeof PatchOperationType;
//   value: any;
//   path: string;
// };

// export type RemoveOperation = {
//   op: "remove";
//   path: string;
// };

// export type PatchRequestBody =
//   | {
//       operations: PatchOperation[];
//       condition?: string;
//     }
//   | PatchOperation[];
