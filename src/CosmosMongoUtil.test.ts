
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { CosmosMongoUtil } from "./CosmosMongoUtil";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";
import exp from "constants";

// State retained across tests
let vcoreConnStrEnvVar : string = Config.lookupEnvVarName('ENV_VCORE_CONN_STR');

let mongoUtil : CosmosMongoUtil = null;

beforeAll(() => {
    mongoUtil = initCosmosMongoUtil();
});

function initCosmosMongoUtil() : CosmosMongoUtil {
    return new CosmosMongoUtil(null, null, vcoreConnStrEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("CosmosMongoUtil: constructor", async () => {
    expect(true).toBe(true);
});
