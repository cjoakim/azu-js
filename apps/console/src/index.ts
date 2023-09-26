
import {
    BlobUtil,
    Config,
    FileUtil,
    CosmosNoSqlUtil,
    OpenAiUtil
} from "azu-js";

import fs from "fs";
import path from "path";
import { json } from "stream/consumers";
import util from "util";

let func = process.argv[2];
let fu   = new FileUtil();

console.log('========================================');
console.log(util.format('func: %s', func));

switch (func) {
    case "config":
        config();
        break;
    case "files":
        files();
        break;
    case "storage":
        storage();
        break;
    case "cosmos_nosql":
        cosmos_nosql();
        break;
    case "cosmos_mongo":
        cosmos_mongo();
        break;
    case "cosmos_pg":
        cosmos_pg();
        break;
    case "embeddings":
        embeddings();
        break;
    default:
        displayCommandLineExamples();
        break;
}

function config() {
    Config.writeSampleConfigFile();
    Config.readConfigFile();
    console.log(JSON.stringify(Config.readConfigFile(), null, 4));
    console.log(util.format("ENV_OPENAI_URL: %s", Config.lookupEnvVarName('ENV_OPENAI_URL')));
}

function files() {
    let epoch : number = epochTime();
    let outfile : string = util.format('tmp%stest-file-%s.txt', path.sep, epoch);
    let content : string = util.format("this is a test file.\n%s", epoch);

    console.log('--- writeTextFileSync');
    let successful : boolean = fu.writeTextFileSync(outfile, content);
    console.log(successful);

    console.log('--- readTextFileSync');
    let data : string = fu.readTextFileSync(outfile);
    console.log(data);

    console.log('--- readJsonObjectFile');
    let obj = fu.readJsonObjectFile('../../data/usa-states.json');
    console.log(obj);

    console.log('--- readJsonArrayFile');
    let airports = fu.readJsonArrayFile('../../data/world-airports-50.json');
    console.log(airports[0]);
}

function storage() {
    console.log('TODO - implement');
}

async function embeddings() {
    let acctUriEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_URL');
    let acctKeyEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_KEY');
    let embDepEnvVar  : string = Config.lookupEnvVarName('ENV_OPENAI_EMB_DEP');

    let oaiUtil = new OpenAiUtil(acctUriEnvVar, acctKeyEnvVar, embDepEnvVar);
    let fu = new FileUtil();
    let text = fu.readTextFileSync('../../data/gettysburg-address.txt');

    let e = await oaiUtil.generateEmbeddings([text]);
    console.log(e);
    let embeddingsArray = e.data[0]['embedding'];
    let tokens = e.usage['totalTokens']
    console.log(util.format(" tokens:\n%s",tokens));
    console.log(util.format('  embeddings length: %s',embeddingsArray.length));
    fu.writeTextFileSync('tmp/embeddings_str.txt', text);
    fu.writeTextFileSync('tmp/embeddings.json', JSON.stringify(e, null, 4));
}

function cosmos_nosql() {
    console.log('TODO - implement');
}

function cosmos_mongo() {
    console.log('TODO - implement');
}

function cosmos_pg() {
    console.log('TODO - implement');
}

function epochTime() : number {
    return Date.now().valueOf();
}

function displayCommandLineExamples() {
    console.log('');
    console.log("node .\\dist\\index.js config");
    console.log("node .\\dist\\index.js files");
    console.log("node .\\dist\\index.js storage");
    console.log("node .\\dist\\index.js cosmos_nosql");
    console.log("node .\\dist\\index.js cosmos_mongo");
    console.log("node .\\dist\\index.js cosmos_pg");
    console.log("node .\\dist\\index.js embeddings");
    console.log('');
}
