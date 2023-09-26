
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { CogSearchUtil } from "./CogSearchUtil";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

let searchNameEnvVar : string = Config.lookupEnvVarName('ENV_SEARCH_NAME');
let adminKeyEnvVar   : string = Config.lookupEnvVarName('ENV_SEARCH_ADMIN_KEY');
let queryKeyEnvVar   : string = Config.lookupEnvVarName('ENV_SEARCH_QUERY_KEY');
let searchUtil : CogSearchUtil = null;

beforeAll(() => {
    searchUtil = initCogSearchUtil();
});

function initCogSearchUtil() : CogSearchUtil {
    return null;  //new CogSearchUtil(acctUriEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("CogSearchUtil: constructor", async () => {
    expect(true).toBe(true);
});
