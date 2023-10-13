
## azu-js typings, version 0.9.9

### BlobUtil.d.ts

```
/**
 * Utility class for Azure Blob Storage.
 * Chris Joakim, Microsoft, 2023
 */
/// <reference types="node" />
import fs from "fs";
import { BlobDownloadResponseParsed, ContainerCreateIfNotExistsResponse, ContainerDeleteIfExistsResponse } from '@azure/storage-blob';
export declare class BlobUtil {
    acctNameEnvVar: string;
    acctKeyEnvVar: string;
    verbose: boolean;
    acctName: string;
    acctKey: string;
    private sharedKeyCred;
    private blobSvcClient;
    /**
     * Pass in the names of the environment variables that contain the
     * Azure Storage account Name and Key.
     */
    constructor(acctNameEnvVar: string, acctKeyEnvVar: string, verbose?: boolean);
    /**
     * Return a list of the containers in the storage account,
     * as an array of objects with their details.
     */
    listContainersAsync(): Promise<Object[]>;
    /**
     * Return a list of the blobs in the given container in the storage account,
     * as an array of objects with their details.
     */
    listContainerAsync(containerName: string): Promise<Object[]>;
    /**
     * Create a container with the given name.
     */
    createContainerAsync(containerName: string): Promise<ContainerCreateIfNotExistsResponse>;
    /**
     * Delete the container with the given name.
     */
    deleteContainerAsync(containerName: string): Promise<ContainerDeleteIfExistsResponse>;
    /**
     * Upload a blob to the given container and blob name, from the given
     * ReadStream.
     */
    uploadBlobFromReadStreamAsync(containerName: string, blobName: string, readStream: fs.ReadStream): Promise<void>;
    /**
     * Download the given blob name to a local file.
     */
    downloadToFileAsync(containerName: string, blobName: string, filePath: string): Promise<BlobDownloadResponseParsed>;
}

```

### CogSearchUtil.d.ts

```
/**
 * Utility classes for Azure Cognitive Search.
 * Chris Joakim, Microsoft, 2023
 */
import { FileUtil } from "./FileUtil";
/**
 * This interface represents a response from the CogSearchUtil class
 * in the azu-js package.  Essentially all methods of class CogSearchUtil
 * return an instance of this interface.
 */
export interface CogSearchResponse {
    url: string;
    method: string;
    body: string;
    status: number;
    respData: object;
    error: boolean;
}
/**
 * This class executes all functionality against an Azure Cognitive Search
 * PaaS service, but using the REST/HTTPS API rather than the Azure SDK.
 */
export declare class CogSearchUtil {
    acctURI: string;
    acctName: string;
    adminKey: string;
    queryKey: string;
    apiVersion: string;
    fileUtil: FileUtil;
    version: string;
    doHttpReq: boolean;
    /**
     * Pass in the names of the environment variables that contain the
     * Azure Cognitive Search URI, name, admin and query keys, and the
     * API version identifier.
     */
    constructor(acctUriEnvVar: string, acctNameEnvVar: string, acctAdminKeyEnvVar: string, acctQueryKeyEnvVar: string, apiVersion: string, verbose?: boolean);
    listIndexes(): Promise<CogSearchResponse>;
    listIndexers(): Promise<CogSearchResponse>;
    listDatasources(): Promise<CogSearchResponse>;
    getIndex(name: string): Promise<CogSearchResponse>;
    getIndexer(name: string): Promise<CogSearchResponse>;
    getIndexerStatus(name: string): Promise<CogSearchResponse>;
    getDatasource(name: string): Promise<CogSearchResponse>;
    createIndex(name: string, schema_file: string): Promise<CogSearchResponse>;
    updateIndex(name: string, schema_file: string): Promise<CogSearchResponse>;
    deleteIndex(name: string): Promise<CogSearchResponse>;
    /**
     * Private method invoked above to create, update, or delete an index.
     */
    private modifyIndex;
    createIndexer(name: string, schema_file: string): Promise<CogSearchResponse>;
    updateIndexer(name: string, schema_file: string): Promise<CogSearchResponse>;
    deleteIndexer(name: string): Promise<CogSearchResponse>;
    resetIndexer(name: string): Promise<CogSearchResponse>;
    runIndexer(name: string): Promise<CogSearchResponse>;
    /**
     * Private method invoked above to create, update, or delete an indexer.
     */
    private modifyIndexer;
    createCosmosNoSqlDatasource(accountNameEnvVarName: string, accountKeyEnvVarName: string, databaseName: string, containerName: string): Promise<CogSearchResponse>;
    cosmosdbNoSqlConnectionString(acct: string, key: string, database: string): string;
    /**
     * Return a template Object for creating a Datasource.
     * This Object should be further modified by the calling method.
     */
    cosmosdbNoSqlDatasourcePostBody(): Object;
    deleteDatasource(name: string): Promise<CogSearchResponse>;
    blobDatasourceName(container: string): string;
    cosmosdbNosqlDatasourceName(dbname: string, container: string): string;
    createSynmap(name: string, schema_file: string): Promise<CogSearchResponse>;
    updateSynmap(name: string, schema_file: string): Promise<CogSearchResponse>;
    deleteSynmap(name: string): Promise<CogSearchResponse>;
    /**
     * Private method invoked above to create, update, or delete a synmap (i.e. - synonyms).
     */
    private modifySynmap;
    /**
     * Execute a given search against a given index.
     */
    searchIndex(indexName: string, searchParams: object): Promise<CogSearchResponse>;
    /**
     * Lookup one specific document in the given index.
     */
    lookupDoc(indexName: string, docKey: string): Promise<CogSearchResponse>;
    /**
     * This is the primary method in this class.  It executes all HTTP requests.
     * The axios library is used to execute the HTTP requests;
     * see https://www.npmjs.com/package/axios
     */
    private invokeHttpRequest;
    private buildAxiosRequestConfig;
    private buildResponseObject;
    listIndexesUrl(): string;
    listIndexersUrl(): string;
    listDatasourcesUrl(): string;
    listSkillsetsUrl(): string;
    getIndexUrl(name: string): string;
    getIndexerUrl(name: string): string;
    getIndexerStatusUrl(name: string): string;
    getDatasourceUrl(name: string): string;
    getSkillsetUrl(name: string): string;
    createIndexUrl(): string;
    modifyIndexUrl(name: string): string;
    createIndexerUrl(): string;
    modifyIndexerUrl(name: string): string;
    resetIndexerUrl(name: string): string;
    runIndexerUrl(name: string): string;
    createDatasourceUrl(): string;
    modifyDatasourceUrl(name: string): string;
    createSynmapUrl(): string;
    modifySynmapUrl(name: string): string;
    createSkillsetUrl(): string;
    modifySkillsetUrl(name: string): string;
    searchIndexUrl(idx_name: string): string;
    lookupDocUrl(index_name: string, doc_key: string): string;
}

```

### Config.d.ts

```
/**
 * Utility class for configuration such as environment variables.
 * Chris Joakim, Microsoft, 2023
 */
export declare class Config {
    static LIB_NAME: string;
    static LIB_VERSION: string;
    static LIB_AUTHOR: string;
    static LIB_LICENSE: string;
    static ASU_JS_CONFIG_FILE: string;
    private static _config;
    /**
     * Return the name of the platform where this node.js process is running.
     * Possible values are 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'.
     */
    static platform(): string;
    /**
     * Return true if the current platform is Windows, else return false.
     */
    static isWindows(): boolean;
    /**
     * Return true if the current platform is Apple macOS, else return false.
     */
    static isMac(): boolean;
    /**
     * Return true if the current platform is Linux, else return false.
     */
    static isLinux(): boolean;
    /**
     * Return your mapped environment variable name for the given normalized name,
     * or null if it is not defined. The mapping is defined in file 'azu-js-config.json'.
     */
    static lookupEnvVarName(normalizedName: string): string;
    /**
     * Read the standard configuration file used by the azu-js package;
     * 'azu-js-config.json' in the current working directory.
     * This file should contain a JSON object with key/value pairs
     * that map the normalized environment variable names to your
     * specified environment variable names.
     */
    static readConfigFile(): Object;
    /**
     * Create an example 'azu-js-config.json' file.
     */
    static writeSampleConfigFile(): boolean;
}

```

### CosmosNoSqlAccountMetadata.d.ts

```
/**
 * Utility classes related to the metadata for Azure Cosmos DB NoSQL API
 * databases, containers, and offers (throughput).
 * Chris Joakim, Microsoft, 2023
 */
import { DatabaseDefinition, OfferDefinition, ContainerDefinition } from "@azure/cosmos";
/**
 * Abstract base class for NoSqlDBMeta, NoSqlContainerMeta, and NoSqlOfferMeta.
 * Attributes include the id (i.e. - name), the _rid, and the _self identifiers.
 */
export declare abstract class BaseNoSqlMeta {
    raw: object;
    type: string;
    id: string;
    rid: string;
    self: string;
    throughput?: object;
    key: string;
    constructor(raw_data: object);
    /**
     * Return true if this instance is a database, else return false.
     */
    isDb(): boolean;
    /**
     * Return true if this instance is a container, else return false.
     */
    isContainer(): boolean;
    /**
     * Return true if this instance is an offer (i.e. - throughput descriptor),
     * else return false.
     */
    isOffer(): boolean;
    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune(): void;
}
/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API database, including its containers and offers.
 */
export declare class NoSqlDBMeta extends BaseNoSqlMeta {
    containers: Array<NoSqlContainerMeta>;
    constructor(raw_data: object);
    addContainerMeta(container: NoSqlContainerMeta): void;
    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune(): void;
}
/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API container, including its offer.
 * Attributes include the inherited id (i.e. - name), _rid, _self,
 * as well as the partitionKey(s), defaultTtl, and analyticalTtl.
 */
export declare class NoSqlContainerMeta extends BaseNoSqlMeta {
    partitionKey: Array<object>;
    defaultTtl: string;
    analyticalTtl: string;
    constructor(raw_data: object);
    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune(): void;
}
/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API offer, or "throughput descriptor",
 * for either a database or container.
 */
export declare class NoSqlOfferMeta extends BaseNoSqlMeta {
    constructor(raw_data: object);
    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune(): void;
}
/**
 * Instances of this class represent the complete set of raw metadata
 * for a given Cosmos DB NoSQL API account, including its databases,
 * containers, and offers.  This raw metadata is obtained by SDK methods,
 * and the raw data is refined and correlated into the above XxxMeta classes.
 *
 */
export declare class CosmosNoSqlAccountMeta {
    databases: Array<DatabaseDefinition>;
    containers: Array<ContainerDefinition>;
    offers: Array<OfferDefinition>;
    constructor();
    /**
     * This method is used to "weave", or correlate, the raw database, container,
     * and offer metadata into a sorted list of objects suitable for presenting
     * in a HTML page or other report.  It returns an array of NoSqlDBMeta objects,
     * which contain the appropriate NoSqlContainerMeta and NoSqlOfferMeta objects.
     * NoSqlOfferMeta objects can be either at the database or container lerve.
     */
    weave(): Array<object>;
}

```

### CosmosNoSqlQuerySpecUtil.d.ts

```
import { SqlQuerySpec } from "@azure/cosmos";
export declare class CosmosNoSqlQuerySpecUtil {
    constructor();
    querySpec(sql: string, parameters?: string[]): SqlQuerySpec;
}

```

### CosmosNoSqlUtil.d.ts

```
/**
 * Utility classes for the Azure Cosmos DB NoSQL API -
 * such as CRUD operations, bulk loading, and metadata.
 * Chris Joakim, Microsoft, 2023
 */
import { BulkOptions, ConnectionPolicy, Container, CosmosClient, Database, DatabaseAccount, DatabaseDefinition, FeedResponse, ItemResponse, OfferDefinition, PartitionKeyDefinition, RequestOptions, ResourceResponse, SqlQuerySpec, ContainerDefinition, BulkOperationResponse } from "@azure/cosmos";
import { CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";
/**
 * A CosmosClient may specify its ConnectionPolicy object.
 * This is the default ConnectionPolicy used in azu-js.
 */
export declare const defaultCosmosConnectionPolicy: ConnectionPolicy;
/**
 * Instances of this class are used to return the aggregate results
 * from a "loadContainerBulkAsync" method call in class CosmosNoSqlUtil below.
 */
export declare class BulkLoadResult {
    inputDocumentCount: number;
    startTime: number;
    endTime: number;
    elapsedTime: number;
    batchSize: number;
    batchCount: number;
    totalRUs: number;
    responseCodes: object;
    constructor();
    /**
     * Individual BulkOperationResponse results are aggregated
     * in this method.  For example, a bulk load may execute ten
     * "batches" of n-number of documents; each batch is aggregated
     * here.
     */
    increment(bulkOpResp: BulkOperationResponse): void;
    /**
     * Start the internal elapsed time clock.
     */
    start(): void;
    /**
     * Stop the internal elapsed time clock and calculate elapsed time.
     */
    finish(): void;
    /**
     * Get and return the current epoch time value.
     */
    private timeNow;
}
/**
 * Utility class for the Azure Cosmos DB NoSQL API -
 * such as CRUD operations, bulk loading, and metadata.
 */
export declare class CosmosNoSqlUtil {
    acctUriEnvVar: string;
    acctKeyEnvVar: string;
    acctUri: string;
    acctKey: string;
    currentDbName: string;
    currentDb: Database;
    currentContainerName: string;
    currentContainer: Container;
    connectionPolicy: ConnectionPolicy;
    cosmosClient: CosmosClient;
    verbose: boolean;
    /**
     * Pass in the names of the environment variables that contain the
     * Azure Cosmos DB account URI and Key.  The ConnectionPolicy arg
     * enables you to set preferred regions and other similar params.
     */
    constructor(acctUriEnvVar: string, acctKeyEnvVar: string, connPolicy?: ConnectionPolicy, verbose?: boolean);
    getDefaultConnectionPolicy(): ConnectionPolicy;
    /**
     * Close/dispose the CosmosClient SDK instance.
     */
    dispose(): void;
    getDatabaseAccountAsync(): Promise<ResourceResponse<DatabaseAccount>>;
    getReadEndpointAsync(): Promise<string>;
    getWriteEndpointAsync(): Promise<string>;
    listDatabasesAsync(): Promise<Array<DatabaseDefinition>>;
    listContainersAsync(dbName: string): Promise<Array<ContainerDefinition>>;
    getAccountOffersAsync(): Promise<Array<OfferDefinition>>;
    getAccountMetadataAsync(): Promise<CosmosNoSqlAccountMeta>;
    setCurrentDatabaseAsync(dbName: string): Promise<void>;
    setCurrentContainerAsync(cName: string): Promise<void>;
    readPartitionKeyDefinitionAsync(dbName: string, cName: string): Promise<PartitionKeyDefinition>;
    insertDocumentAsync(dbName: string, cName: string, doc: Object): Promise<ItemResponse<Object>>;
    pointReadAsync(dbName: string, cName: string, id: string, pk: string): Promise<ItemResponse<Object>>;
    queryAsync(dbName: string, cName: string, querySpec: SqlQuerySpec): Promise<FeedResponse<Object>>;
    upsertDocumentAsync(dbName: string, cName: string, doc: Object): Promise<ItemResponse<Object>>;
    deleteDocumentAsync(dbName: string, cName: string, id: string, pk: string): Promise<ItemResponse<Object>>;
    loadContainerSequentialAsync(dbName: string, cName: string, documents: Array<Object>): Promise<number>;
    /**
     * Execute a bulk-load or bulk-upsert of the given documents into the
     * given database and container.  These operations are executed in
     * batches of up to 50 documents per batch, per the given batchSize.
     * An instance of class BulkLoadResult is returned - it contains the
     * aggregated/summarized resuls of the bulk operation.  This includes
     * document counts, elapsed time, RU consumption, and response codes
     * counts.
     */
    loadContainerBulkAsync(dbName: string, cName: string, operationName: string, documents: Array<object>, generateIds?: false, givenBatchSize?: number, bulkOptions?: BulkOptions, reqOptions?: RequestOptions): Promise<BulkLoadResult>;
    private executeBulkBatch;
    private buildJsonObjectArray;
    /**
     * Return a batch size value between 1 and 50 from the given value.
     */
    private normalizedBatchSize;
    /**
     * Create and return a uuid v4 as a string value.
     */
    generateUuid(): string;
}

```

### FileUtil.d.ts

```
/**
 * Utility class for local filesystem operations.
 *
 * To read huge text files, consider using a line-by-line streaming approach
 * in your application code rather than using this class.
 * Chris Joakim, Microsoft, 2023
 */
export declare class FileUtil {
    constructor();
    /**
     * Return the current directory where this node.js process is running.
     */
    cwd(): string;
    /**
     * Return a list of files in the given directory.
     */
    listFiles(dir: string): Array<string>;
    /**
     * Read the given filename and return its contents as a text string.
     */
    readTextFileSync(infile: string): string;
    /**
     * Read the given filename and return its contents an array
     * of strings, one per line.
     */
    readTextFileAsLinesSync(infile: string): Array<string>;
    /**
     * Write the given string/text content to the given filename.
     * Return true if successful, else false.
     */
    writeTextFileSync(outfile: string, data: string): boolean;
    /**
     * Read the given JSON Array file and return its parsed contents.
     * The file contents must begin and end with the '[' and ']' characters.
     */
    readJsonArrayFile(infile: string): Array<Object>;
    /**
     * Read the given JSON Array file and return its parsed contents.
     * The file contents must begin and end with the '{' and '}' characters.
     */
    readJsonObjectFile(infile: string): Object;
}

```

### index.d.ts

```
/**
 * Define the classes exported/exposed by the azu-js NPM package.
 * Chris Joakim, Microsoft, 2023
 */
import { BlobUtil } from "./BlobUtil";
import { CogSearchResponse, CogSearchUtil } from "./CogSearchUtil";
import { Config } from "./Config";
import { CosmosNoSqlQuerySpecUtil } from "./CosmosNoSqlQuerySpecUtil";
import { CosmosNoSqlUtil, defaultCosmosConnectionPolicy, BulkLoadResult } from "./CosmosNoSqlUtil";
import { FileUtil } from "./FileUtil";
import { OpenAiUtil } from "./OpenAiUtil";
import { BaseNoSqlMeta, NoSqlDBMeta, NoSqlContainerMeta, NoSqlOfferMeta, CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";
export { BlobUtil };
export { CogSearchResponse, CogSearchUtil };
export { Config };
export { CosmosNoSqlQuerySpecUtil };
export { CosmosNoSqlUtil, defaultCosmosConnectionPolicy, BulkLoadResult };
export { FileUtil };
export { BaseNoSqlMeta, NoSqlDBMeta, NoSqlContainerMeta, NoSqlOfferMeta, CosmosNoSqlAccountMeta };
export { OpenAiUtil };

```

### OpenAiUtil.d.ts

```
/**
 * Utility class for Azure OpenAI.
 * Chris Joakim, Microsoft, 2023
 */
import { Embeddings, GetEmbeddingsOptions, OpenAIClient } from "@azure/openai";
export declare class OpenAiUtil {
    acctUrlEnvVar: string;
    acctKeyEnvVar: string;
    embDepEnvVar: string;
    acctUrl: string;
    acctKey: string;
    embDeployment: string;
    oaiClient: OpenAIClient;
    verbose: boolean;
    /**
     * Pass in the names of the environment variables that contain the
     * Azure OpenAI account Url and Key.
     */
    constructor(acctUrlEnvVar: string, acctKeyEnvVar: string, embDepEnvVar: string, verbose?: boolean);
    /**
     * Close/dispose the OpenAIClient SDK instance.
     */
    dispose(): void;
    /**
     * Generate and return embeddings for the given input text.
     * The embeddings can be used for vector searching with
     * Azure Cosmos DB and/or Azure Cognitive Search.
     */
    generateEmbeddings(input: string[], options?: GetEmbeddingsOptions): Promise<Embeddings>;
}

```