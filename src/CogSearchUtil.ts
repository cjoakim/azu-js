
// Utility class for Azure Cognitive Search
// Chris Joakim, Microsoft, 2023
//
// See https://learn.microsoft.com/en-us/javascript/api/overview/azure/search-documents-readme?view=azure-node-latest
// See https://www.npmjs.com/package/@azure/search-documents

import util from "util";

import {
    SearchClient,
    SearchIndexClient,
    SearchIndexerClient,
    AzureKeyCredential,
} from '@azure/search-documents';


export class CogSearchUtil {

    acctURI      : string = null;
    acctName     : string = null;
    adminHeaders : Object = null;
    queryHeaders : Object = null;
    apiVersion   : string = null;

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

    create_synmapUrl(): string {
        return util.format("%s/synonymmaps?api-version=%s", this.acctURI, this.apiVersion);
    }

    modify_synmapUrl(name : string) : string {
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
