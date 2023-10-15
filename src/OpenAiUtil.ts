/**
 * Utility class for Azure OpenAI.
 * Chris Joakim, Microsoft, 2023
 */

import fs from "fs";
import util from "util";
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
    AzureKeyCredential,
    Embeddings,
    GetEmbeddingsOptions,
    ImageGenerationOptions,
    ImageGenerations,
    OpenAIClient
} from "@azure/openai";

import { FileUtil } from "./FileUtil";

export class OpenAiUtil {

    acctUrlEnvVar : string;
    acctKeyEnvVar : string;
    embDepEnvVar  : string;
    acctUrl       : string;
    acctKey       : string;
    embDeployment : string;
    openaiClient  : OpenAIClient;
    verbose       : boolean = false;

    /**
     * Pass in the names of the environment variables that contain the
     * Azure OpenAI account Url and Key.
     */
    constructor(
        acctUrlEnvVar : string,
        acctKeyEnvVar : string,
        embDepEnvVar  : string,
        verbose?: boolean) {

        try {
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
            this.openaiClient = new OpenAIClient(this.acctUrl, new AzureKeyCredential(this.acctKey));
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Close/dispose the OpenAIClient SDK instance.
     */
    dispose() : void {
        this.openaiClient = null;
    }

    /**
     * Generate and return embeddings for the given input text.
     * The embeddings can be used for vector searching with 
     * Azure Cosmos DB and/or Azure Cognitive Search.
     */
    async generateEmbeddings(
        input: string[],
        options: GetEmbeddingsOptions = { requestOptions: {} }
      ): Promise<Embeddings> {
        try {
            // See https://github.com/Azure/azure-sdk-for-js/blob/%40azure/openai_1.0.0-beta.5/sdk/openai/openai/src/OpenAIClient.ts
            return await this.openaiClient.getEmbeddings(this.embDeployment, input, options);
        }
        catch (error) {
            console.log(error);
        }
    }

    /**
     * Generate an image with Dalle from the given text prompt, and optional options.
     * The ImageGenerations response object contains a list of one or more objects
     * which include a 'url' parameter that can be used to HTTP GET the actual image bytes.
     * The url can then be passed to the 'downloadGeneratedImage(url, outfile)' method below below.
     */
    async generateDalleImage(
        prompt: string,
        options? : ImageGenerationOptions) : Promise<ImageGenerations> {

        return await this.openaiClient.getImages(prompt, options);
        
        // The response object looks like this.
        // {
        //  created: 1970-01-20T15:29:43.613Z,
        //  data: [
        //     {
        //     url: 'https://dalleproduse.blob.core.windows.net/private/images/b101857e-8f54-4216-bd15-7a0f9c9a4d41/generated_00.png?se=2023-10-16T15%3A26%3A59Z&sig=U0lWRFCDDjhE5PLkRXSS9oZXU6awFc8DF2D5uq7XuBk%3D&ske=2023-10-16T08%3A21%3A44Z&skoid=09ba021e-c417-441c-b203-c81e5dcd7b7f&sks=b&skt=2023-10-09T08%3A21%3A44Z&sktid=33e01921-4d64-4f8c-a055-5bdaffd5e33d&skv=2020-10-02&sp=r&spr=https&sr=b&sv=2020-10-02'
        //     }
        //  ]
        // }
    }

    async downloadGeneratedImage(url : string, outfile : string) : Promise<boolean> {
        if (!url) {
            return false;
        }
        if (!outfile) {
            return false;
        }
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });
        try {
            return new Promise((resolve, reject) => {
                response.data.pipe(fs.createWriteStream(outfile))
                    .on('error', () => reject(false))
                    .once('close', () => resolve(true))
            });
        }
        catch(error) {
            console.log(error);
            return false;
        }
    }
}
