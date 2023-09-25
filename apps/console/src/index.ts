
import {
    BlobUtil,
    FileUtil,
    CosmosNoSqlUtil,
    OpenAiUtil
} from "azu-js";

import fs from "fs";
import path from "path";
import util from "util";

let func = process.argv[2];
let fu   = new FileUtil();

console.log('========================================');
console.log(util.format('func: %s', func));

switch (func) {
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
    let acctUriEnvVar : string = 'AZURE_OPENAI_URL';
    let acctKeyEnvVar : string = 'AZURE_OPENAI_KEY1';
    let embDepEnvVar  : string = 'AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT';
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
    console.log("node .\\dist\\index.js files");
    console.log("node .\\dist\\index.js storage");
    console.log("node .\\dist\\index.js cosmos_nosql");
    console.log("node .\\dist\\index.js cosmos_mongo");
    console.log("node .\\dist\\index.js cosmos_pg");
    console.log("node .\\dist\\index.js embeddings");
    console.log('');
}
