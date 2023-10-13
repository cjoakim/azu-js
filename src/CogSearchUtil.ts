/**
 * Utility classes for Azure Cognitive Search.
 * Chris Joakim, Microsoft, 2023
 */

import util from "util";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * This interface represents a response from the CogSearchUtil class
 * in the azu-js package.  Essentially all methods of class CogSearchUtil
 * return an instance of this interface.
 */
export interface CogSearchResponse {
    url:      string;
    method:   string;
    body:     string;
    status:   number;
    respData: object;
    error:    boolean;
}

/**
 * This class executes all functionality against an Azure Cognitive Search
 * PaaS service, but using the REST/HTTPS API rather than the Azure SDK.
 */
export class CogSearchUtil {

    acctURI    : string = null;
    acctName   : string = null;
    adminKey   : string = null;
    queryKey   : string = null;
    apiVersion : string = null;
    fileUtil   : FileUtil = new FileUtil();
    version    : string = null;
    doHttpReq  : boolean = true;

    /**
     * Pass in the names of the environment variables that contain the
     * Azure Cognitive Search URI, name, admin and query keys, and the
     * API version identifier.
     */
    constructor(
        acctUriEnvVar  : string,
        acctNameEnvVar : string,
        acctAdminKeyEnvVar : string,
        acctQueryKeyEnvVar : string,
        apiVersion : string,
        verbose?: boolean) {

        try {
            this.acctURI = process.env[acctUriEnvVar] as string;
            this.acctName = process.env[acctNameEnvVar] as string;
            this.apiVersion = apiVersion;
            this.adminKey = process.env[acctAdminKeyEnvVar];
            this.queryKey = process.env[acctQueryKeyEnvVar];
            this.version  = Config.LIB_VERSION
        }
        catch (error) {
            console.log(error);
        }
    }

    // API Invoking methods - their names are self-explanatory.

    async listIndexes() : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.listIndexesUrl(), 'GET', this.adminKey);
    }

    async listIndexers() : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.listIndexersUrl(), 'GET', this.adminKey);
    }

    async listDatasources() : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.listDatasourcesUrl(), 'GET', this.adminKey);
    }

    async getIndex(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.getIndexUrl(name), 'GET', this.adminKey);
    }

    async getIndexer(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.getIndexerUrl(name), 'GET', this.adminKey);
    }

    async getIndexerStatus(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.getIndexerStatusUrl(name), 'GET', this.adminKey);
    }

    async getDatasource(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.getDatasourceUrl(name), 'GET', this.adminKey);
    }

    // Index methods - their names are self-explanatory.

    async createIndex(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('create', name, schema_file);
    }

    async updateIndex(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('update', name, schema_file);
    }

    async deleteIndex(name : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('delete', name);
    }

    /**
     * Private method invoked above to create, update, or delete an index.
     */
    private async modifyIndex(action : string, name : string, schemaFile? : string) : Promise<CogSearchResponse> {

        let schema : object = null;
        let url    : string = null;
        let method : string = null;

        switch (action) {
            case "create":
                method = 'POST';
                url    = this.createIndexUrl();
                schema = this.fileUtil.readJsonObjectFile(schemaFile);
                break;
            case "update":
                method = 'PUT';
                url    = this.modifyIndexUrl(name);
                schema = this.fileUtil.readJsonObjectFile(schemaFile);
                break;
            case "delete":
                method = 'DELETE';
                url = this.modifyIndexUrl(name);
                break;
        }
        return this.invokeHttpRequest(url, method, this.adminKey, schema);
    }

    // Indexer methods - their names are self-explanatory.

    async createIndexer(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndexer('create', name, schema_file);
    }

    async updateIndexer(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndexer('update', name, schema_file);
    }

    async deleteIndexer(name : string) : Promise<CogSearchResponse> {
        return await this.modifyIndexer('delete', name);
    }

    async resetIndexer(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.resetIndexerUrl(name), 'POST', this.adminKey);
    }

    async runIndexer(name : string) : Promise<CogSearchResponse> {
        return this.invokeHttpRequest(this.runIndexerUrl(name), 'POST', this.adminKey);
    }

    /**
     * Private method invoked above to create, update, or delete an indexer.
     */
    private async modifyIndexer(action : string, name : string, schemaFile? : string) : Promise<CogSearchResponse> {

        let schema : object = null;
        let url    : string = null;
        let method : string = null;

        switch (action) {
            case "create":
                method = 'POST';
                url    = this.createIndexerUrl();
                schema = this.fileUtil.readJsonObjectFile(schemaFile);
                break;
            case "update":
                method = 'PUT';
                url    = this.modifyIndexerUrl(name);
                schema = this.fileUtil.readJsonObjectFile(schemaFile);
                break;
            case "delete":
                method = 'DELETE';
                url    = this.modifyIndexerUrl(name);
                break;
        }
        return this.invokeHttpRequest(url, method, this.adminKey, schema);
    }

    // Datasource methods - their names are self-explanatory.

    async createCosmosNoSqlDatasource(
        accountNameEnvVarName : string,
        accountKeyEnvVarName :string,
        databaseName : string,
        containerName : string) : Promise<CogSearchResponse> {

        let acctName = process.env[accountNameEnvVarName];
        let acctKey = process.env[accountKeyEnvVarName];
        let url = this.createDatasourceUrl();
        let body = this.cosmosdbNoSqlDatasourcePostBody();
        // overlay specific attributes in the post data
        body['name'] = this.cosmosdbNosqlDatasourceName(databaseName, containerName);
        body['credentials']['connectionString'] = this.cosmosdbNoSqlConnectionString(acctName, acctKey, databaseName);
        body['container']['name'] = containerName;
        body['dataDeletionDetectionPolicy'] = null;
        body['encryptionKey'] = null;
        body['identity'] = null
        return this.invokeHttpRequest(url, 'POST', this.adminKey, body);
    }

    cosmosdbNoSqlConnectionString(acct : string, key : string, database : string) : string {
        return util.format("AccountEndpoint=https://%s.documents.azure.com;AccountKey=%s;Database=%s", acct, key, database);
    }

    /**
     * Return a template Object for creating a Datasource.
     * This Object should be further modified by the calling method.
     */
    cosmosdbNoSqlDatasourcePostBody() : Object {
        return {
            'name': '... populate me ...',
            'type': 'cosmosdb',
            'credentials': {
                'connectionString': '... populate me ...'
            },
            'container': {
                'name': '... populate me ...',
                'query': null
            },
            'dataChangeDetectionPolicy': {
                '@odata.type': '#Microsoft.Azure.Search.HighWaterMarkChangeDetectionPolicy',
                'highWaterMarkColumnName': '_ts'
            }
        }
    }

    async deleteDatasource(name : string) : Promise<CogSearchResponse> {
        let url = this.modifyDatasourceUrl(name);
        return this.invokeHttpRequest(url, 'DELETE', this.adminKey);
    }

    blobDatasourceName(container : string) : string {
        return util.format('azureblob-%s', container);
    }

    cosmosdbNosqlDatasourceName(dbname : string, container : string) : string {
        return util.format('cosmosdb-nosql-%s-%s', dbname, container);
    }

    // Synonym Map methods - their names are self-explanatory.

    async createSynmap(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('create', name, schema_file);
    }

    async updateSynmap(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('update', name, schema_file);
    }

    async deleteSynmap(name : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('delete', name);
    }

    /**
     * Private method invoked above to create, update, or delete a synmap (i.e. - synonyms).
     */
    private async modifySynmap(action : string, name : string, schemaFile? : string) : Promise<CogSearchResponse> {

        let schema : object = null;
        let url    : string = null;
        let method : string = null;

        if (action in ['create', 'update']) {
            let schema : object = this.fileUtil.readJsonObjectFile(schemaFile);
        }
        switch (action) {
            case "create":
                method = 'POST';
                url = this.createSynmapUrl();
                break;
            case "update":
                method = 'PUT';
                url = this.modifySynmapUrl(name);
                break;
            case "delete":
                method = 'DELETE';
                url = this.modifySynmapUrl(name);
                break;
        }
        return this.invokeHttpRequest(url, method, this.adminKey, schema);
    }

    /**
     * Execute a given search against a given index.
     */
    async searchIndex(indexName : string, searchParams: object) : Promise<CogSearchResponse> {
        let url = this.searchIndexUrl(indexName);
        return this.invokeHttpRequest(url, 'POST', this.queryKey, searchParams);
    }

    /**
     * Lookup one specific document in the given index.
     */
    async lookupDoc(indexName : string, docKey : string) : Promise<CogSearchResponse> {
        let url = this.lookupDocUrl(indexName, docKey);
        return this.invokeHttpRequest(url, 'POST', this.queryKey, );
    }

    /**
     * This is the primary method in this class.  It executes all HTTP requests.
     * The axios library is used to execute the HTTP requests;
     * see https://www.npmjs.com/package/axios
     */
    private async invokeHttpRequest(
        url:    string, 
        method: string, 
        key:    string,
        data:   Object = null) : Promise<CogSearchResponse> {

        let opts = this.buildAxiosRequestConfig(url, method, key, data);
        let respObj  = this.buildResponseObject(opts);
        try {
            if (this.doHttpReq) {
                const result = await axios(opts);
                respObj.status = result.status;
                if (result.status === 200 && result.data) {
                    respObj.respData = result.data;
                }
            }
        }
        catch (error) {
            respObj.error = true;
            console.log(error);
        }
        return respObj;
    }

    private buildAxiosRequestConfig(url: string, method: string, key: string, data: object = null) : AxiosRequestConfig {
        // See https://axios-http.com/docs/req_config
        // 'data' attribute is only applicable for HTTP methods 'PUT', 'POST', 'DELETE', and 'PATCH'
        return {
            method: method.toUpperCase(),
            url:    url,
            data:   data,
            headers: {
                'Content-Type': 'application/json',
                'api-key': key
            },
            timeout: 30000
        };
    }

    private buildResponseObject(opts: AxiosRequestConfig) : CogSearchResponse {
        return {
            url:      opts.url,
            method:   opts.method,
            body:     opts.data,
            status:   0,
            respData: null,
            error:    false
        };
    }

    // URL methods below - their names are self-explanatory.

    listIndexesUrl() : string {
        return util.format("%s/indexes?api-version=%s", this.acctURI, this.apiVersion);
    }

    listIndexersUrl(): string {
        return util.format("%s/indexers?api-version=%s", this.acctURI, this.apiVersion);
    }

    listDatasourcesUrl(): string {
        return util.format("%s/datasources?api-version=%s", this.acctURI, this.apiVersion);
    }

    listSkillsetsUrl(): string {
        return util.format("%s/skillsets?api-version=%s", this.acctURI, this.apiVersion);
    }

    getIndexUrl(name : string) : string {
        return util.format("%s/indexes/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    getIndexerUrl(name : string) : string {
        return util.format("%s/indexers/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    getIndexerStatusUrl(name : string) : string {
        return util.format("%s/indexers/%s/status?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    getDatasourceUrl(name : string) : string {
        return util.format("%s/datasources/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    getSkillsetUrl(name : string) : string {
        return util.format("%s/skillsets/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    createIndexUrl(): string {
        return util.format("%s/indexes?api-version=%s", this.acctURI, this.apiVersion);
    }

    modifyIndexUrl(name : string) : string {
        return util.format("%s/indexes/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    createIndexerUrl(): string {
        return util.format("%s/indexers?api-version=%s", this.acctURI, this.apiVersion);
    }

    modifyIndexerUrl(name : string) : string {
        return util.format("%s/indexers/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    resetIndexerUrl(name : string) : string {
        return util.format("%s/indexers/%s/reset?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    runIndexerUrl(name : string) : string {
        return util.format("%s/indexers/%s/run?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    createDatasourceUrl(): string {
        return util.format("%s/datasources?api-version=%s", this.acctURI, this.apiVersion);
    }

    modifyDatasourceUrl(name : string) : string {
        return util.format("%s/datasources/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    createSynmapUrl(): string {
        return util.format("%s/synonymmaps?api-version=%s", this.acctURI, this.apiVersion);
    }

    modifySynmapUrl(name : string) : string {
        return util.format("%s/synonymmaps/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    createSkillsetUrl(): string {
        return util.format("%s/skillsets?api-version=%s", this.acctURI, this.apiVersion);
    }

    modifySkillsetUrl(name : string) : string {
        return util.format("%s/skillsets/%s?api-version=%s", this.acctURI, name, this.apiVersion);
    }

    searchIndexUrl(idx_name : string) : string {
        return util.format("%s/indexes/%s/docs/search?api-version=%s", this.acctURI, idx_name, this.apiVersion);
    }

    lookupDocUrl(index_name : string, doc_key : string) : string {
        return util.format("%s/indexes/%s/docs/%s?api-version=%s", this.acctURI, index_name, doc_key, this.apiVersion);
    }
}
