// Unit tests for class OpenAiUtil
// Chris Joakim, Microsoft, 2023

import { OpenAiUtil } from "./OpenAiUtil";
import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

// State retained across tests
let acctUriEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_URL');
let acctKeyEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_KEY');
let embDepEnvVar  : string = Config.lookupEnvVarName('ENV_OPENAI_EMB_DEP');

let oaiUtil : OpenAiUtil = null;

beforeAll(() => {
    oaiUtil = initOpenAiUtil();
});

function initOpenAiUtil() : OpenAiUtil {
    return new OpenAiUtil(acctUriEnvVar, acctKeyEnvVar, embDepEnvVar);
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

    let e = await oaiUtil.generateEmbeddings([text]);
    //console.log(e);
    // {
    //     data: [ { embedding: [Array], index: 0 } ],
    //     usage: { promptTokens: 329, totalTokens: 329 }
    // }
    let embeddingsArray = e.data[0]['embedding'];
    let tokens = e.usage['totalTokens']
    expect(embeddingsArray.length).toBe(1536);
    expect(tokens).toBeGreaterThan(300);
    expect(tokens).toBeLessThan(400);
});
