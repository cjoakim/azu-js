
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { CosmosMongoUtil } from "./CosmosMongoUtil";
import { FileUtil } from "./FileUtil";
import exp from "constants";

// State retained across tests
let acctUriEnvVar : string = 'AZURE_COSMOSDB_NOSQL_URI';
let acctKeyEnvVar : string = 'AZURE_COSMOSDB_NOSQL_RW_KEY1';

let mongoUtil : CosmosMongoUtil = null;

beforeAll(() => {
    mongoUtil = initCosmosMongoUtil();
});

function initCosmosMongoUtil() : CosmosMongoUtil {
    return new CosmosMongoUtil(acctUriEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}
