
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

test("CogSearchUtil: constructor and headers", async () => {
    expect(true).toBe(true);

    expect(su.acctName.length).toBeGreaterThan(6);
    expect(su.acctURI.length).toBeGreaterThan(6);
    expect(su.acctURI).toContain('https://');
    expect(su.acctURI).toContain('.search.windows.net');
    expect(su.apiVersion).toBe(apiVersion);

    let ah = su.adminHeaders;
    expect(ah['Content-Type']).toBe('application/json');
    expect(ah['api-key'].length).toBeGreaterThan(30);

    let qh = su.queryHeaders;
    expect(qh['Content-Type']).toBe('application/json');
    expect(qh['api-key'].length).toBeGreaterThan(30);
});

test("CogSearchUtil: url methods", async () => {

    expect(su.listIndexesUrl()).toContain('.search.windows.net/indexes?api-version=2023-07-01-Preview');
    expect(su.listIndexersUrl()).toContain('.search.windows.net/indexers?api-version=2023-07-01-Preview');
    expect(su.listDatasourcesUrl()).toContain('.search.windows.net/datasources?api-version=2023-07-01-Preview');

    // TODO - test each URL method
});


test("CogSearchUtil: listIndexes", async () => {

    console.log(su.adminHeaders);
    let resp : CogSearchResponse = await su.listIndexes();
    console.log(resp);


    expect(resp.status).toBe(200);
});

