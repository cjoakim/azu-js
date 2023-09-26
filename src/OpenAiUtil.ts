
// Utility class for Azure OpenAI
// Chris Joakim, Microsoft, 2023

import util from "util";
import { v4 as uuidv4 } from 'uuid';

import {
    AzureKeyCredential,
    Embeddings,
    GetEmbeddingsOptions,
    OpenAIClient
} from "@azure/openai";

export class OpenAiUtil {

    acctUrlEnvVar : string;
    acctKeyEnvVar : string;
    embDepEnvVar  : string;
    acctUrl       : string;
    acctKey       : string;
    embDeployment : string;
    oaiClient     : OpenAIClient;
    verbose : boolean = false;

    // Pass in the names of the environment variables that contain the
    // Azure OpenAI account Url and Key.
    constructor(
        acctUrlEnvVar : string,
        acctKeyEnvVar : string,
        embDepEnvVar  : string,
        verbose?: boolean) {

        try {
            // set instance variables.
            // example environment variable names; AZURE_OPENAI_URL and AZURE_OPENAI_KEY1 
            this.acctUrlEnvVar = acctUrlEnvVar;
            this.acctKeyEnvVar = acctKeyEnvVar;
            this.embDepEnvVar  = embDepEnvVar;
            this.verbose = verbose;
            // read given environment variables
            this.acctUrl = process.env[acctUrlEnvVar] as string;
            this.acctKey = process.env[acctKeyEnvVar] as string;
            this.embDeployment = process.env[embDepEnvVar] as string;
            // validate
            if (!this.acctUrl) {
                throw Error(
                    util.format('OpenAI acctUrl not populated per env var: %s', this.acctUrlEnvVar));
            }
            if (!this.acctKey) {
                throw Error(
                    util.format('OpenAI acctKey not populated per env var: %s', this.acctKeyEnvVar));
            }
            if (!this.embDeployment) {
                throw Error(
                    util.format('OpenAI embeddings deployment not populated per env var: %s', this.embDepEnvVar));
            }
            if (this.verbose == true) {
                console.log(util.format('  url: %s -> %s', this.acctUrlEnvVar, this.acctUrl));
                console.log(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));
                console.log(util.format('  emb: %s -> %s', this.embDepEnvVar,  this.embDeployment));
            }
            this.oaiClient = new OpenAIClient(this.acctUrl, new AzureKeyCredential(this.acctKey));
        }
        catch (error) {
            console.log(error);
        }
    }

    dispose() : void {
        this.oaiClient = null;
    }

    async generateEmbeddings(
        input: string[],
        options: GetEmbeddingsOptions = { requestOptions: {} }
      ): Promise<Embeddings> {
        try {
            // See https://github.com/Azure/azure-sdk-for-js/blob/%40azure/openai_1.0.0-beta.5/sdk/openai/openai/src/OpenAIClient.ts
            return await this.oaiClient.getEmbeddings(this.embDeployment, input, options);
        }
        catch (error) {
            console.log(error);
        }
    }

    generateUuid() : string {
        return uuidv4();
    }
}
