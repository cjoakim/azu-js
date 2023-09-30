
// Unit tests for class CogSearchUtil
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern CogSearchUtil

import fs from "fs";
import path from "path";
import util from "util";

import { CogSearchUtil, CogSearchResponse } from "./CogSearchUtil";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

let acctUriEnvVar      : string = Config.lookupEnvVarName('ENV_SEARCH_URL');
let acctNameEnvVar     : string = Config.lookupEnvVarName('ENV_SEARCH_NAME');
let acctAdminKeyEnvVar : string = Config.lookupEnvVarName('ENV_SEARCH_ADMIN_KEY');
let acctQueryKeyEnvVar : string = Config.lookupEnvVarName('ENV_SEARCH_QUERY_KEY');

let apiVersion : string = '2023-07-01-Preview';
let su : CogSearchUtil = null;

beforeAll(() => {
    su = initCogSearchUtil();
    su.doHttpReq = false;
});

function initCogSearchUtil() : CogSearchUtil {
    return new CogSearchUtil(
        acctUriEnvVar,
        acctNameEnvVar,
        acctAdminKeyEnvVar,
        acctQueryKeyEnvVar,
        apiVersion);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("CogSearchUtil: constructor", async () => {
    expect(true).toBe(true);

    expect(su.acctName.length).toBeGreaterThan(6);
    expect(su.acctURI.length).toBeGreaterThan(6);
    expect(su.acctURI).toContain('https://');
    expect(su.acctURI).toContain('.search.windows.net');
    expect(su.apiVersion).toBe(apiVersion);
});

test("CogSearchUtil: url methods", async () => {

    expect(su.listIndexesUrl()).toContain('.search.windows.net/indexes?api-version=2023-07-01-Preview');
    expect(su.listIndexersUrl()).toContain('.search.windows.net/indexers?api-version=2023-07-01-Preview');
    expect(su.listDatasourcesUrl()).toContain('.search.windows.net/datasources?api-version=2023-07-01-Preview');

    // TODO - test more URL methods
});


test("CogSearchUtil: listIndexes", async () => {
    let resp : CogSearchResponse = await su.listIndexes();
    console.log(resp);
    expect(resp.status).toBe(0);
});

test("CogSearchUtil: createDatasource", async () => {
    let accountNameEnvVarName = 'AZURE_COSMOSDB_NOSQL_ACCT';
    let accountKeyEnvVarName = 'AZURE_COSMOSDB_NOSQL_RO_KEY1';
    let dbname = 'dev'
    let collection = 'baseball';
    let resp : CogSearchResponse = 
        await su.createCosmosNoSqlDatasource(
            accountNameEnvVarName, accountKeyEnvVarName, dbname, collection);
    console.log('createCosmosNoSqlDatasource resp:');
    console.log(resp);
    expect(resp.status).toBe(0);
    expect(resp.method).toBe('POST');
    expect(resp['body']['name']).toBe('cosmosdb-nosql-dev-baseball');
});

test("CogSearchUtil: createIndex", async () => {
    let infile = 'console_app/cogsearch/baseballplayers_index.json'
    let resp : CogSearchResponse = 
        await su.createIndex('baseballplayers', infile);
    // console.log('createIndex resp:');
    // console.log(resp);
    expect(resp.status).toBe(0);
    expect(resp.method).toBe('POST');
    expect(resp['body']['name']).toBe('baseballplayers');
});

test("CogSearchUtil: createIndexer", async () => {
    let infile = 'console_app/cogsearch/baseballplayers_index.json'
    let resp : CogSearchResponse = 
        await su.createIndexer('baseballplayers', infile);
    // console.log('createIndex resp:');
    // console.log(resp);
    expect(resp.status).toBe(0);
    expect(resp.method).toBe('POST');
    expect(resp['body']['name']).toBe('baseballplayers');
});
