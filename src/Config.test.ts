
// Unit tests for class Config
// Chris Joakim, Microsoft, 2023

import fs from "fs";
import path from "path";
import util from "util";

import { Config } from "./Config";
import { FileUtil } from "./FileUtil";


test("Config: writeSampleConfigFile", async () => {
    let writeResult : boolean = Config.writeSampleConfigFile();
    expect(writeResult).toBe(true);
});

test("Config: readConfigFile", async () => {
    let config : Object = Config.readConfigFile();
    expect(config['ENV_NOSQL_URI']).toBe('AZURE_COSMOSDB_NOSQL_URI');
});

test("Config: lookupEnvVarName", async () => {
    let searchURL = Config.lookupEnvVarName('ENV_SEARCH_URL');
    let something = Config.lookupEnvVarName('SOMETHING_NOT_DEFINED');
    expect(searchURL).toBe('AZURE_SEARCH_URL');
    expect(something).toBe(null);
});
