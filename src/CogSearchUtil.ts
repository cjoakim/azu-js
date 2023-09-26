
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

    // Pass in the names of the environment variables that contain the
    // Azure Cosmos DB account URI and Key.
    constructor(
        acctUriEnvVar : string,
        acctKeyEnvVar : string,
        verbose?: boolean) {

        try {

        }
        catch (error) {
            console.log(error);
        }
    }

    dispose() : void {
        return;
    }
}
