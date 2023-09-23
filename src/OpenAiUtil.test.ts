
// TODO - implement

import fs from "fs";
import path from "path";
import util from "util";

import { OpenAiUtil } from "./OpenAiUtil";
import { FileUtil } from "./FileUtil";

// State retained across tests
let acctUriEnvVar : string = 'AZURE_OPENAI_URL';
let acctKeyEnvVar : string = 'AZURE_OPENAI_KEY1';

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

test("OpenAiUtil: generateEmbeddings", async () => {
    let fu = new FileUtil();
    let text = fu.readTextFileSync('data/gettysburg-address.txt');
    expect(text.length).toBeGreaterThan(1400);
    expect(text.length).toBeLessThan(1500);
    console.log(text);

    let e = await oaiUtil.generateEmbeddings([text]);
    console.log(e);
    //console.log(e.usage);
});
