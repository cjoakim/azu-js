// Unit tests for class Config
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern Config

import fs from "fs";
import path from "path";
import util from "util";

import { Config } from "./Config";


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

test("Config: platform methods", async () => {
    try {
        let platform : string = Config.platform();
        let win : boolean = Config.isWindows();
        let mac : boolean = Config.isMac();
        let linux : boolean = Config.isLinux();
        console.log(util.format(
            'platform: %s, win: %s, mac: %s, linux: %s', platform, win, mac, linux));
    }
    catch (error) {
        expect(true).toBe(false);
    }
});
