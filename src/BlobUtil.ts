
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

// See https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-typescript-get-started

export class BlobUtil {
    
    public acctName: string;
    public acctKey:  string;
    private sharedKeyCred : StorageSharedKeyCredential;
    private blobSvcClient : BlobServiceClient;

    // Pass in the names of the environment variables that contain the
    // Azure Storage account Name and Key.
    constructor(
        public acctNameEnvVar : string,
        public acctKeyEnvVar : string,
        public verbose : boolean = false) {

        try {
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
            if (this.verbose == true) {
                console.log(util.format('  url: %s -> %s', this.acctNameEnvVar, this.acctName));
                console.log(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));
            }
            this.sharedKeyCred = new StorageSharedKeyCredential(
                this.acctName,
                this.acctKey
            );
            this.blobSvcClient = new BlobServiceClient(
                `https://${this.acctName}.blob.core.windows.net`,
                this.sharedKeyCred
            );
            if (this.verbose == true) {
                console.log(util.format('  blobSvcClient: %s', this.blobSvcClient));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async listContainersAsync() : Promise<Object[]> {
        try {
            let results = [];
            for await (const container of this.blobSvcClient.listContainers()) {
                results.push(container);
            }
            return results;
        }
        catch (error) {
            console.log(error);
        }
    }

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
            console.log(error);
        }
    }

    async createContainerAsync(containerName : string) : Promise<ContainerCreateIfNotExistsResponse> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            return await containerClient.createIfNotExists();
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteContainerAsync(containerName : string) : Promise<ContainerDeleteIfExistsResponse> {
        try {
            let containerClient = await this.blobSvcClient.getContainerClient(containerName);
            return await containerClient.deleteIfExists();
        }
        catch (error) {
            console.log(error);
        }
    }

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
            console.log(error);
        }
    }

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
            console.log(error);
        }
    }
}
