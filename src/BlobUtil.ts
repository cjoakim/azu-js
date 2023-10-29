/**
 * Utility class for Azure Blob Storage.
 * Chris Joakim, Microsoft, 2023
 */

import fs from "fs";
import util from "util";

import {
    BlobServiceClient,
    BlockBlobClient,
    BlobDownloadResponseParsed,
    ContainerCreateIfNotExistsResponse,
    ContainerDeleteIfExistsResponse,
    StorageSharedKeyCredential
} from '@azure/storage-blob';

import { AzuLogger } from "./AzuLogger";

// See https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-typescript-get-started

export class BlobUtil {
    
    public acctName : string;
    public acctKey  : string;

    private sharedKeyCred : StorageSharedKeyCredential;
    private blobSvcClient : BlobServiceClient;
    private logger : AzuLogger;

    /**
     * Pass in the names of the environment variables that contain the
     * Azure Storage account Name and Key.
     */
    constructor(
        public acctNameEnvVar : string,
        public acctKeyEnvVar  : string) {

        try {
            this.logger   = AzuLogger.buildDefaultLogger('BlobUtil');
            this.acctName = process.env[acctNameEnvVar] as string;
            this.acctKey  = process.env[acctKeyEnvVar] as string;
            if (!this.acctName) {
                throw Error(
                    util.format('Storage acctName not populated per env var: %s', this.acctNameEnvVar));
            }
            if (!this.acctKey) {
                throw Error(
                    util.format('Storage acctKey not populated per env var: %s', this.acctKeyEnvVar));
            }
            this.logger.debug(util.format('  url: %s -> %s', this.acctNameEnvVar, this.acctName));
            this.logger.debug(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));

            this.sharedKeyCred = new StorageSharedKeyCredential(
                this.acctName,
                this.acctKey
            );
            this.blobSvcClient = new BlobServiceClient(
                `https://${this.acctName}.blob.core.windows.net`,
                this.sharedKeyCred
            );
            this.logger.debug(util.format('  blobSvcClient: %s', this.blobSvcClient));
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Return a list of the containers in the storage account,
     * as an array of objects with their details.
     */
    async listContainersAsync() : Promise<Object[]> {
        try {
            let results = [];
            for await (const container of this.blobSvcClient.listContainers()) {
                results.push(container);
            }
            return results;
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Return a list of the blobs in the given container in the storage account,
     * as an array of objects with their details.
     */
    async listContainerAsync(containerName : string) : Promise<Object[]> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            let results = [];

            for await (const blob of containerClient.listBlobsFlat({
                includeMetadata:  false,
                includeSnapshots: false,
                includeTags:      false,
                includeVersions:  false,
                prefix: ''
              })) {
                results.push(blob);
            }
            return results;
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Create a container with the given name.
     */
    async createContainerAsync(containerName : string) : Promise<ContainerCreateIfNotExistsResponse> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            return await containerClient.createIfNotExists();
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Delete the container with the given name.
     */
    async deleteContainerAsync(containerName : string) : Promise<ContainerDeleteIfExistsResponse> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            return await containerClient.deleteIfExists();
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Upload a blob to the given container and blob name, from the given
     * ReadStream.
     */
    async uploadBlobFromReadStreamAsync(
        containerName: string,
        blobName:      string,
        readStream:    fs.ReadStream) : Promise<void> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.uploadStream(readStream);
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }

    /**
     * Download the given blob name to a local file.
     */
    async downloadToFileAsync(
        containerName: string,
        blobName:      string,
        filePath:      string) : Promise<BlobDownloadResponseParsed> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            const blockBlobClient: BlockBlobClient = containerClient.getBlockBlobClient(blobName);
            return await blockBlobClient.downloadToFile(filePath);
        }
        catch (error) {
            this.logger.errorException(error);
        }
    }
}
