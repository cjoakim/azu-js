
## azu-js typings

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
import { CogSearchResponse } from "./Interfaces";
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
    static lookupEnvVarName(normalizedName: string): string;
    static readConfigFile(): Object;
    static writeSampleConfigFile(): boolean;
}

```

### CosmosNoSqlUtil.d.ts

```
import { ConnectionPolicy, Container, CosmosClient, Database, DatabaseAccount, FeedResponse, ItemResponse, PartitionKeyDefinition, ResourceResponse, SqlQuerySpec } from "@azure/cosmos";
export declare const defaultCosmosConnectionPolicy: ConnectionPolicy;
export declare class QueryUtil {
    constructor();
    querySpec(sql: string, parameters?: string[]): SqlQuerySpec;
}
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
    writeTextFileSync(outfile: string, data: string): boolean;
    readJsonArrayFile(infile: string): Array<Object>;
    readJsonObjectFile(infile: string): Object;
}

```

### Interfaces.d.ts

```
export interface CogSearchResponse {
    url: string;
    method: string;
    body: string;
    status: number;
    respData: object;
    error: boolean;
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
import { Config } from "./Config";
import { CogSearchResponse } from "./Interfaces";
import { FileUtil } from "./FileUtil";
import { BlobUtil } from "./BlobUtil";
import { CosmosNoSqlUtil, defaultCosmosConnectionPolicy, QueryUtil } from "./CosmosNoSqlUtil";
import { CogSearchUtil } from "./CogSearchUtil";
import { OpenAiUtil } from "./OpenAiUtil";
export { Config };
export { CogSearchResponse };
export { FileUtil };
export { BlobUtil };
export { CosmosNoSqlUtil, defaultCosmosConnectionPolicy, QueryUtil };
export { CogSearchUtil };
export { OpenAiUtil };

```