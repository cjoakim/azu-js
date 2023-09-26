
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

    // list_indexers_url(): string {
    //     return '{}/indexers?api-version={}'.format(self.search_url, self.search_api_version)

    // list_datasources_url(): string {
    //     return '{}/datasources?api-version={}'.format(self.search_url, self.search_api_version)

    // list_skillsets_url(): string {
    //     return '{}/skillsets?api-version={}'.format(self.search_url, self.search_api_version)

    // get_index_url(self, name):
    //     return '{}/indexes/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // get_indexer_url(self, name):
    //     return '{}/indexers/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // get_indexer_status_url(self, name):
    //     return '{}/indexers/{}/status?api-version={}'.format(self.search_url, name, self.search_api_version)

    // get_datasource_url(self, name):
    //     return '{}/datasources/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // get_skillset_url(self, name):
    //     return '{}/skillsets/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // create_index_url(): string {
    //     return '{}/indexes?api-version={}'.format(self.search_url, self.search_api_version)

    // modify_index_url(self, name):
    //     return '{}/indexes/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // create_indexer_url(): string {
    //     return '{}/indexers?api-version={}'.format(self.search_url, self.search_api_version)

    // modify_indexer_url(self, name):
    //     return '{}/indexers/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // reset_indexer_url(self, name):
    //     return '{}/indexers/{}/reset?api-version={}'.format(self.search_url, name, self.search_api_version)

    // run_indexer_url(self, name):
    //     return '{}/indexers/{}/run?api-version={}'.format(self.search_url, name, self.search_api_version)

    // create_datasource_url(): string {
    //     return '{}/datasources?api-version={}'.format(self.search_url, self.search_api_version)

    // modify_datasource_url(self, name):
    //     return '{}/datasources/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // create_synmap_url(): string {
    //     return '{}/synonymmaps?api-version={}'.format(self.search_url, self.search_api_version)

    // modify_synmap_url(self, name):
    //     return '{}/synonymmaps/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // create_skillset_url(): string {
    //     return '{}/skillsets?api-version={}'.format(self.search_url, self.search_api_version)

    // modify_skillset_url(self, name):
    //     return '{}/skillsets/{}?api-version={}'.format(self.search_url, name, self.search_api_version)

    // search_index_url(self, idx_name):
    //     return '{}/indexes/{}/docs/search?api-version={}'.format(self.search_url, idx_name, self.search_api_version)

    // lookup_doc_url(self, index_name, doc_key):
    //     return '{}/indexes/{}/docs/{}?api-version={}'.format(self.search_url, index_name, doc_key, self.search_api_version)


}
