
// Utility class for Azure Cosmos DB NoSQL APIs
// Chris Joakim, Microsoft, 2023

import util from "util";
import { v4 as uuidv4 } from 'uuid';

import {
    BulkOperationType,
    ConnectionMode,
    ConnectionPolicy,
    Container,
    CosmosClient,
    Database,
    DatabaseResponse,
    DatabaseAccount,
    DiagnosticNodeInternal,
    FeedOptions,
    FeedResponse,
    ItemResponse,
    OperationInput,
    PatchOperation,
    PartitionKeyDefinition,
    PatchOperationType,
    ResourceResponse,
    SqlQuerySpec,
    SqlParameter
  } from "@azure/cosmos";


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


export class QueryUtil {

    constructor() {}

    // Return an instance of the SqlQuerySpec interface
    // See https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/sqlqueryspec?view=azure-node-latest

    querySpec(sql: string, parameters?: string[]) : SqlQuerySpec {
        let params = [];
        if (parameters) {
            params = parameters;
        }
        return { query: sql, parameters: params };
    }
}


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
    cosmosClient : CosmosClient = null;
    verbose : boolean = false;

    // Pass in the names of the environment variables that contain the
    // Azure Cosmos DB account URI and Key.
    constructor(
        acctUriEnvVar : string,
        acctKeyEnvVar : string,
        connPolicy? : ConnectionPolicy,
        verbose?: boolean) {

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
            if (this.verbose == true) {
                console.log(util.format('  url: %s -> %s', this.acctUriEnvVar, this.acctUri));
                console.log(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));
            }
            if (!connPolicy) {
                this.connectionPolicy = defaultCosmosConnectionPolicy;
            }
            else {
                this.connectionPolicy = connPolicy;
            }

            this.cosmosClient = new CosmosClient({
                endpoint: this.acctUri,
                key: this.acctKey,
                connectionPolicy: this.connectionPolicy
            });
            if (this.verbose == true) {
                console.log(util.format('  cosmosClient: %s', this.cosmosClient));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    getDefaultConnectionPolicy() : ConnectionPolicy {
        return defaultCosmosConnectionPolicy;
    }

    dispose() {
        if (this.cosmosClient) {
            this.cosmosClient.dispose();
            this.cosmosClient = null;
        }
    }

    async getDatabaseAccountAsync() : Promise<ResourceResponse<DatabaseAccount>> {
        return this.cosmosClient.getDatabaseAccount();
    }

    async getReadEndpointAsync() : Promise<string> {
        return this.cosmosClient.getReadEndpoint();
    }

    async getWriteEndpointAsync() : Promise<string> {
        return this.cosmosClient.getWriteEndpoint();
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

    async queryContainerAsync(dbName: string, cName: string, query: string): Promise<Object[]> { 
        return null;
    }

    async insertDocumentAsync(dbName: string, cName: string, doc: Object) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.create(doc);
    }

    async pointReadAsync(dbName: string, cName: string, id: string, pk: string) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.item(id, pk).read();
    }

    async queryAsync(dbName: string, cName: string, querySpec: SqlQuerySpec) : Promise<FeedResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.query(querySpec).fetchAll()
    }

    async upsertDocumentAsync(dbName: string, cName: string, doc: Object) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.items.upsert(doc);
    }

    async deleteDocumentAsync(dbName: string, cName: string, id: string, pk: string) : Promise<ItemResponse<Object>> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName);
        return await this.currentContainer.item(id, pk).delete();
    }

    async loadContainerAsync(dbName: string, cName: string, documents: Array<Object>): Promise<number> {
        this.setCurrentDatabaseAsync(dbName);
        this.setCurrentContainerAsync(cName)

        let count = 0;
        for (let doc of documents) {
            count++
            console.log(util.format('---: %s of %s', count, documents.length));
            console.log(util.format('doc: %s', doc));
            let result = await this.currentContainer.items.create(doc);
            console.log(util.format('result: %s', result));
        }
        return count;
    }

    generateUuid() : string {
        return uuidv4();
    }

}
