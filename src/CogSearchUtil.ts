
// Utility class for Azure Cognitive Search
// Chris Joakim, Microsoft, 2023
//
// See https://learn.microsoft.com/en-us/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest
// See https://www.npmjs.com/package/@azure/search-documents

import util from "util";
import { FileUtil } from "./FileUtil";

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
    SearchClient,
    SearchIndexClient,
    SearchIndexerClient,
    AzureKeyCredential,
} from '@azure/search-documents';

export interface CogSearchResponse {
    url:    string;
    method: string;
    status: number;
    data:   Object;
    error:  boolean;
}

export class CogSearchUtil {

    acctURI      : string = null;
    acctName     : string = null;
    adminKey     : string = null;
    queryKey     : string = null;
    adminHeaders : Object = null;
    queryHeaders : Object = null;
    apiVersion   : string = null;
    fileUtil     : FileUtil = new FileUtil();

    // Pass in the names of the environment variables that contain the
    // configuration values.
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

            this.adminHeaders = this.buildHttpHeader(acctAdminKeyEnvVar);
            this.queryHeaders = this.buildHttpHeader(acctQueryKeyEnvVar);
        }
        catch (error) {
            console.log(error);
        }
    }

    private buildHttpHeader(keyEnvVarName) : Object {
        let headers = {};
        headers['Content-Type'] = 'application/json';
        headers['api-key'] = process.env['' + keyEnvVarName] as string;
        return headers;
    }

    dispose() : void {
        return;
    }

    // API Invoking methods:

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

    // Index methods 

    async createIndex(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('create', name, schema_file);
    }

    async updateIndex(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('update', name, schema_file);
    }

    async deleteIndex(name : string) : Promise<CogSearchResponse> {
        return await this.modifyIndex('delete', name);
    }

    private async modifyIndex(action : string, name : string, schemaFile? : string) : Promise<CogSearchResponse> {

        let schema : object = null;
        let url    : string = null;
        let method : string = null;

        if (action in ['create', 'update']) {
            let schema : object = this.fileUtil.readJsonObjectFile(schemaFile);
        }
        switch (action) {
            case "create":
                method = 'POST';
                url = this.createIndexUrl();
                break;
            case "update":
                method = 'PUT';
                url = this.modifyIndexUrl(name);
                break;
            case "delete":
                method = 'DELETE';
                url = this.modifyIndexUrl(name);
                break;
        }
        return this.invokeHttpRequest(url, method, this.adminKey, schema);
    }

    // Indexer methods

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

    private async modifyIndexer(action : string, name : string, schemaFile? : string) : Promise<CogSearchResponse> {

        let schema : object = null;
        let url    : string = null;
        let method : string = null;

        if (action in ['create', 'update']) {
            let schema : object = this.fileUtil.readJsonObjectFile(schemaFile);
        }
        switch (action) {
            case "create":
                method = 'POST';
                url = this.createIndexerUrl();
                break;
            case "update":
                method = 'PUT';
                url = this.modifyIndexerUrl(name);
                break;
            case "delete":
                method = 'DELETE';
                url = this.modifyIndexerUrl(name);
                break;
        }
        return this.invokeHttpRequest(url, method, this.adminKey, schema);
    }

    // Datastore methods

    // def create_cosmos_nosql_datasource(self, acct_envvar, key_envvar, dbname, container):
    //     acct = os.environ[acct_envvar]
    //     key  = os.environ[key_envvar]
    //     conn_str = self.cosmos_nosql_datasource_name_conn_str(acct, key, dbname)
    //     body = self.cosmosdb_nosql_datasource_post_body()
    //     body['name'] = self.cosmos_nosql_datasource_name(dbname, container)
    //     body['credentials']['connectionString'] = conn_str
    //     body['container']['name'] = container
    //     body['dataDeletionDetectionPolicy'] = None
    //     body['encryptionKey'] = None
    //     body['identity'] = None

    //     url = self.create_datasource_url()
    //     function = 'create_cosmos_nosql_datasource_{}_{}'.format(dbname, container)
    //     self.http_request(function, 'post', url, self.admin_headers, body)

    async deleteDatasource(name : string) : Promise<CogSearchResponse> {
        let url = this.modifyDatasourceUrl(name);
        return this.invokeHttpRequest(url, 'DELETE', this.adminKey);
    }

    // Synonym Map methods

    async createSynmap(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('create', name, schema_file);
    }

    async updateSynmap(name : string, schema_file : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('update', name, schema_file);
    }

    async deleteSynmap(name : string) : Promise<CogSearchResponse> {
        return await this.modifySynmap('delete', name);
    }

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

    // Search and Lookup methods

    async searchIndex(indexName : string, docKey : string, searchParams: object) : Promise<CogSearchResponse> {
        let url = this.searchIndexUrl(indexName);
        return this.invokeHttpRequest(url, 'POST', this.queryKey, searchParams);
    }

    async lookupDoc(indexName : string, docKey : string) : Promise<CogSearchResponse> {
        let url = this.lookupDocUrl(indexName, docKey);
        return this.invokeHttpRequest(url, 'POST', this.queryKey, );
    }

    private async invokeHttpRequest(url: string, method: string, key: string, data?: Object) : Promise<CogSearchResponse> {
        let opts = this.buildAxiosRequestConfig(url, method, key);
        let respObj  = this.buildResponseObject(opts);
        try {
            const result = await axios(opts);
            respObj.status = result.status;
            if (result.status === 200 && result.data) {
                respObj.data = result.data;
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
            url:    opts.url,
            method: opts.method,
            status: 0,
            data:   null,
            error:  false
        };
    }

    // URL methods below:

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
