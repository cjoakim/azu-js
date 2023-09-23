
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { CosmosPgUtil } from "./CosmosPgUtil";
import { FileUtil } from "./FileUtil";

let pgUtil : CosmosPgUtil = null;

beforeAll(() => {
    pgUtil = initCosmosPgUtil();
});

function initCosmosPgUtil() : CosmosPgUtil {
    return null;  //new CosmosPgUtil(acctUriEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("CosmosPgUtil: constructor", async () => {
    expect(true).toBe(true);
});

