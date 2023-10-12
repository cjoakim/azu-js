
## azu-js typings, version 0.9.8

### BlobUtil.d.ts

```
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
    constructor(acctNameEnvVar: string, acctKeyEnvVar: string, verbose?: boolean);
    listContainersAsync(): Promise<Object[]>;
    listContainerAsync(containerName: string): Promise<Object[]>;
    createContainerAsync(containerName: string): Promise<ContainerCreateIfNotExistsResponse>;
    deleteContainerAsync(containerName: string): Promise<ContainerDeleteIfExistsResponse>;
    uploadBlobFromReadStreamAsync(containerName: string, blobName: string, readStream: fs.ReadStream): Promise<void>;
    downloadToFileAsync(containerName: string, blobName: string, filePath: string): Promise<BlobDownloadResponseParsed>;
}

```

### CogSearchUtil.d.ts

```
import { FileUtil } from "./FileUtil";
export interface CogSearchResponse {
    url: string;
    method: string;
    body: string;
    status: number;
    respData: object;
    error: boolean;
}
export declare class CogSearchUtil {
    acctURI: string;
    acctName: string;
    adminKey: string;
    queryKey: string;
    apiVersion: string;
    fileUtil: FileUtil;
    version: string;
    doHttpReq: boolean;
    constructor(acctUriEnvVar: string, acctNameEnvVar: string, acctAdminKeyEnvVar: string, acctQueryKeyEnvVar: string, apiVersion: string, verbose?: boolean);
    dispose(): void;
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
    private modifyIndex;
    createIndexer(name: string, schema_file: string): Promise<CogSearchResponse>;
    updateIndexer(name: string, schema_file: string): Promise<CogSearchResponse>;
    deleteIndexer(name: string): Promise<CogSearchResponse>;
    resetIndexer(name: string): Promise<CogSearchResponse>;
    runIndexer(name: string): Promise<CogSearchResponse>;
    private modifyIndexer;
    createCosmosNoSqlDatasource(accountNameEnvVarName: string, accountKeyEnvVarName: string, databaseName: string, containerName: string): Promise<CogSearchResponse>;
    cosmosdbNoSqlConnectionString(acct: string, key: string, database: string): string;
    cosmosdbNoSqlDatasourcePostBody(): Object;
    deleteDatasource(name: string): Promise<CogSearchResponse>;
    blobDatasourceName(container: string): string;
    cosmosdbNosqlDatasourceName(dbname: string, container: string): string;
    createSynmap(name: string, schema_file: string): Promise<CogSearchResponse>;
    updateSynmap(name: string, schema_file: string): Promise<CogSearchResponse>;
    deleteSynmap(name: string): Promise<CogSearchResponse>;
    private modifySynmap;
    searchIndex(indexName: string, searchParams: object): Promise<CogSearchResponse>;
    lookupDoc(indexName: string, docKey: string): Promise<CogSearchResponse>;
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
export declare class Config {
    static LIB_NAME: string;
    static LIB_VERSION: string;
    static LIB_AUTHOR: string;
    static LIB_LICENSE: string;
    static ASU_JS_CONFIG_FILE: string;
    private static _config;
    static platform(): string;
    static isWindows(): boolean;
    static isMac(): boolean;
    static isLinux(): boolean;
    static lookupEnvVarName(normalizedName: string): string;
    static readConfigFile(): Object;
    static writeSampleConfigFile(): boolean;
}

```

### CosmosNoSqlAccountMetadata.d.ts

```
import { DatabaseDefinition, OfferDefinition, ContainerDefinition } from "@azure/cosmos";
export declare abstract class BaseNoSqlMeta {
    raw: object;
    type: string;
    id: string;
    rid: string;
    self: string;
    throughput?: object;
    key: string;
    constructor(raw_data: object);
    isDb(): boolean;
    isContainer(): boolean;
    isOffer(): boolean;
    prune(): void;
}
export declare class NoSqlDBMeta extends BaseNoSqlMeta {
    partitionKey: Array<object>;
    defaultTtl: string;
    analyticalTtl: string;
    containers: Array<NoSqlContainerMeta>;
    constructor(raw_data: object);
    addContainerMeta(container: NoSqlContainerMeta): void;
    prune(): void;
}
export declare class NoSqlContainerMeta extends BaseNoSqlMeta {
    partitionKey: Array<object>;
    defaultTtl: string;
    analyticalTtl: string;
    constructor(raw_data: object);
    prune(): void;
}
export declare class NoSqlOfferMeta extends BaseNoSqlMeta {
    constructor(raw_data: object);
    prune(): void;
}
export declare class CosmosNoSqlAccountMeta {
    databases: Array<DatabaseDefinition>;
    containers: Array<ContainerDefinition>;
    offers: Array<OfferDefinition>;
    constructor();
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
import { ConnectionPolicy, Container, CosmosClient, Database, DatabaseAccount, DatabaseDefinition, FeedResponse, ItemResponse, OfferDefinition, PartitionKeyDefinition, ResourceResponse, SqlQuerySpec, ContainerDefinition } from "@azure/cosmos";
import { CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";
export declare const defaultCosmosConnectionPolicy: ConnectionPolicy;
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
    constructor(acctUriEnvVar: string, acctKeyEnvVar: string, connPolicy?: ConnectionPolicy, verbose?: boolean);
    getDefaultConnectionPolicy(): ConnectionPolicy;
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
    queryContainerAsync(dbName: string, cName: string, query: string): Promise<Object[]>;
    insertDocumentAsync(dbName: string, cName: string, doc: Object): Promise<ItemResponse<Object>>;
    pointReadAsync(dbName: string, cName: string, id: string, pk: string): Promise<ItemResponse<Object>>;
    queryAsync(dbName: string, cName: string, querySpec: SqlQuerySpec): Promise<FeedResponse<Object>>;
    upsertDocumentAsync(dbName: string, cName: string, doc: Object): Promise<ItemResponse<Object>>;
    deleteDocumentAsync(dbName: string, cName: string, id: string, pk: string): Promise<ItemResponse<Object>>;
    loadContainerAsync(dbName: string, cName: string, documents: Array<Object>): Promise<number>;
    generateUuid(): string;
}

```

### FileUtil.d.ts

```
export declare class FileUtil {
    constructor();
    cwd(): string;
    listFiles(dir: string): Array<string>;
    readTextFileSync(infile: string): string;
    readTextFileAsLinesSync(infile: string): Array<string>;
    writeTextFileSync(outfile: string, data: string): boolean;
    readJsonArrayFile(infile: string): Array<Object>;
    readJsonObjectFile(infile: string): Object;
}

```

### OpenAiUtil.d.ts

```
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
    constructor(acctUrlEnvVar: string, acctKeyEnvVar: string, embDepEnvVar: string, verbose?: boolean);
    dispose(): void;
    generateEmbeddings(input: string[], options?: GetEmbeddingsOptions): Promise<Embeddings>;
    generateUuid(): string;
}

```

### index.d.ts

```
import { BlobUtil } from "./BlobUtil";
import { CogSearchResponse, CogSearchUtil } from "./CogSearchUtil";
import { Config } from "./Config";
import { CosmosNoSqlQuerySpecUtil } from "./CosmosNoSqlQuerySpecUtil";
import { CosmosNoSqlUtil, defaultCosmosConnectionPolicy } from "./CosmosNoSqlUtil";
import { FileUtil } from "./FileUtil";
import { OpenAiUtil } from "./OpenAiUtil";
import { BaseNoSqlMeta, NoSqlDBMeta, NoSqlContainerMeta, NoSqlOfferMeta, CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";
export { BlobUtil };
export { CogSearchResponse, CogSearchUtil };
export { Config };
export { CosmosNoSqlQuerySpecUtil };
export { CosmosNoSqlUtil, defaultCosmosConnectionPolicy };
export { FileUtil };
export { BaseNoSqlMeta, NoSqlDBMeta, NoSqlContainerMeta, NoSqlOfferMeta, CosmosNoSqlAccountMeta };
export { OpenAiUtil };

```