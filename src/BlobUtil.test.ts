import fs from "fs";
import path from "path";
import util from "util";

// Unit tests for class BlobUtil
// Chris Joakim, Microsoft, 2023

import {
    BlobDownloadResponseParsed,
    ContainerCreateIfNotExistsResponse,
    ContainerDeleteIfExistsResponse
} from '@azure/storage-blob';

import { BlobUtil } from "./BlobUtil";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

// State retained across tests
let acctNameEnvVar : string = Config.lookupEnvVarName('ENV_STORAGE_ACCT');
let acctKeyEnvVar  : string = Config.lookupEnvVarName('ENV_STORAGE_KEY');
let bu : BlobUtil = null;

beforeAll(() => {
    bu = initBlobUtil();
});

function initBlobUtil() {
    let acctNameEnvVar : string = 'AZURE_STORAGE_ACCOUNT';
    let acctKeyEnvVar : string = 'AZURE_STORAGE_KEY';
    return new BlobUtil(acctNameEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

function containerNamePresentInList(list: Array<Object>, containerName: string) : boolean {
    try {
        let result : boolean = false;
        list.forEach( (blob) => {
            let name : string = blob['name'];
            if (name === containerName) {
                result = true;
            }
        });
        return result;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

function blobNamePresentInList(list: Array<Object>, blobName: string) : boolean {
    try {
        let result : boolean = false;
        list.forEach( (blob) => {
            let name : string = blob['name'];
            if (name === blobName) {
                result = true;
            }
        });
        return result;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

test("BlobUtil: constructor", () => {
    expect(bu.acctNameEnvVar).toBe(acctNameEnvVar);
    expect(bu.acctKeyEnvVar).toBe(acctKeyEnvVar);
    expect(bu.acctName).toBe('gbbcjstorage');
    expect(bu.acctKey).toContain('HHFgZ');
});

test("BlobUtil: listContainers", async () => {
    let containersList = await bu.listContainersAsync();
    let outfile =  util.format('tmp%scontainers-list.json', path.sep);
    let fu = new FileUtil();
    fu.writeTextFileSync(outfile, JSON.stringify(containersList, null, 2));
    expect(containersList.length).toBeGreaterThan(0);
    expect(containersList.length).toBeLessThan(1000);
    let present : boolean = containerNamePresentInList(containersList, 'wrangled');
    expect(present).toBe(true);
});

test("BlobUtil: listContainer", async () => {
    let containerName : string = 'wrangled';
    let blobList = await bu.listContainerAsync(containerName);
    let expectedBlobName = 'partition_key_stats_from_synapse.csv';
    //console.log("results in test code:\n" + JSON.stringify(blobList, null, 2));
    expect(blobList.length).toBeGreaterThan(0);
    expect(blobList.length).toBeLessThan(1000);
    let present : boolean = blobNamePresentInList(blobList, expectedBlobName);
    expect(present).toBe(true);
});

test("BlobUtil: createContainer and deleteContainer", async () => {
    let epoch : number = epochTime();
    let containerName : string = `test-container-${epoch}`;

    let resp1 : ContainerCreateIfNotExistsResponse =
        await bu.createContainerAsync(containerName);
    expect(resp1.succeeded).toBe(true);

    let blobList = await bu.listContainerAsync(containerName);
    expect(blobList.length).toBe(0);

    let resp2 : ContainerDeleteIfExistsResponse =
        await bu.deleteContainerAsync(containerName);
    expect(resp2.succeeded).toBe(true);
});

test("BlobUtil: uploadBlobFromReadStream and downloadToFile", async () => {
    let containerName : string = 'wrangled';
    let epoch : number = epochTime();
    let newBlobName : string = `package-${epoch}.json`;

    let readStream = fs.createReadStream('package.json');
    let uploadResult = await bu.uploadBlobFromReadStreamAsync(containerName, newBlobName, readStream);

    let blobList = await bu.listContainerAsync(containerName);
    let present : boolean = blobNamePresentInList(blobList, newBlobName);
    expect(present).toBe(true);

    let outfile =  util.format('tmp%sdownloaded-%s.json', path.sep, epochTime());
    let downloadResp : BlobDownloadResponseParsed = await bu.downloadToFileAsync(containerName, newBlobName, outfile);
    expect(downloadResp._response.status).toBe(200);

    let fu = new FileUtil();
    let downloadedObj = fu.readJsonObjectFile(outfile);
    expect(downloadedObj['name']).toBe('azu-js');
});
