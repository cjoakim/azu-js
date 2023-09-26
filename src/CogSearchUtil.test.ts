
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { CogSearchUtil } from "./CogSearchUtil";
import { FileUtil } from "./FileUtil";

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
