
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { OpenAiUtil } from "./OpenAiUtil";
import { FileUtil } from "./FileUtil";

// State retained across tests
let acctUriEnvVar : string = 'AZURE_COSMOSDB_NOSQL_URI';
let acctKeyEnvVar : string = 'AZURE_COSMOSDB_NOSQL_RW_KEY1';

let oaiUtil : OpenAiUtil = null;

beforeAll(() => {
    oaiUtil = initOpenAiUtil();
});

function initOpenAiUtil() : OpenAiUtil {
    return new OpenAiUtil(acctUriEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("OpenAiUtil: constructor", async () => {
    expect(true).toBe(true);
});
