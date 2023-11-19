
import {
    BulkOptions,
    PriorityLevel,
    RequestOptions } from "@azure/cosmos";

import {
    BlobUtil,
    BulkLoadResult,
    Config,
    FileUtil,
    CosmosNoSqlUtil,
    OpenAiUtil,
    CogSearchUtil
} from "azu-js";

import fs from "fs";
import path from "path";
import { json } from "stream/consumers";
import util from "util";

export interface CogSearchResponse {
    url:      string;
    method:   string;
    body:     string;
    status:   number;
    respData: object;
    error:    boolean;
}

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
    case "search":
        search();
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
    let obj = fu.readJsonObjectFile('../data/usa-states.json');
    console.log(obj);

    console.log('--- readJsonArrayFile');
    let airports = fu.readJsonArrayFile('../data/world-airports-50.json');
    console.log(airports[0]);
}

async function search() {
    let subfunc = process.argv[3];
    let apiVersion : string = '2023-07-01-Preview';
    let name : string = null;
    let searchName   : string = null;
    let searchDict   : object = null;
    let searchParams : object = null;
    let schemaFile   : string = null;
    let playerId     : string = null;
    let resp : CogSearchResponse = null;

    // Pass in YOUR environment variable names which contain these values.
    let csu : CogSearchUtil = new CogSearchUtil(
        'AZURE_SEARCH_URL',
        'AZURE_SEARCH_NAME',
        'AZURE_SEARCH_ADMIN_KEY',
        'AZURE_SEARCH_QUERY_KEY',
        apiVersion,
        true);

    switch (subfunc) {
        case "delete_datasource":
            resp = await csu.deleteDatasource(process.argv[4]);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "delete_index":
            resp = await csu.deleteIndex(process.argv[4]);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "delete_indexer":
            resp = await csu.deleteIndexer(process.argv[4]);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "create_cosmos_nosql_datasource":
            let accountNameEnvVarName = process.argv[4];
            let accountKeyEnvVarName = process.argv[5];
            let dbname = process.argv[6];
            let collection = process.argv[7];
            resp = await csu.createCosmosNoSqlDatasource(accountNameEnvVarName, accountKeyEnvVarName, dbname, collection);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "create_index":
            name = process.argv[4];
            schemaFile = process.argv[5];
            resp = await csu.createIndex(name, schemaFile);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "create_indexer":
            name = process.argv[4];
            schemaFile = process.argv[5];
            resp = await csu.createIndexer(name, schemaFile);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "get_indexer_status":
            name = process.argv[4];
            resp = await csu.getIndexerStatus(name);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "list_datasources":
            resp = await csu.listDatasources();
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "list_indexes":
            resp = await csu.listIndexes();
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "list_indexers":
            resp = await csu.listIndexers();
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "named_search":
            searchDict = fu.readJsonObjectFile('cogsearch/named_searches.json');
            name = process.argv[4];
            searchName = process.argv[5];
            searchParams = searchDict[searchName];
            resp = await csu.searchIndex(name, searchParams);
            console.log(JSON.stringify(resp, null, 2));
            break;
        case "vector_search":
            // First lookup the named player to get their embedding value 
            name = process.argv[4];
            playerId = process.argv[5];
            let lookupParams = {
                "count":   "true",
                "search":  "playerID eq 'xxx'",
                "orderby": "playerID",
                "select":  "id,playerID,nameFirst,nameLast,primary_position,embeddings_str,embeddings"
            }
            lookupParams['search'] = util.format("playerID eq '%s'", playerId);
            let lookupResp = await csu.searchIndex(name, lookupParams);
            //console.log(JSON.stringify(resp, null, 2));

            if (lookupResp.status == 200) {
                // Construct the vector search parameters, then execute the vector search
                let embeddings = lookupResp.respData['value'][0]['embeddings'];
                let vectorSearchParams = {};
                let vector = {};
                vector['value'] = embeddings
                vector['fields'] = 'embeddings'
                vector['k'] = 10
                vectorSearchParams['count'] = "true";
                vectorSearchParams['select'] = 'id,playerID,nameFirst,nameLast,primary_position';
                vectorSearchParams['orderby'] = "playerID";
                vectorSearchParams['vectors'] = [ vector ];
                let vectorSearchResp = await csu.searchIndex(name, vectorSearchParams);
                console.log(JSON.stringify(vectorSearchResp, null, 2));
            }
            break;
        default:
            console.log(util.format("search, unknown subfunction: %s", subfunc));
            break;
    }
}

async function storage() {
    let acctNameEnvVar : string = 'AZURE_STORAGE_ACCOUNT';
    let acctKeyEnvVar : string = 'AZURE_STORAGE_KEY';
    let bu = new BlobUtil(acctNameEnvVar, acctKeyEnvVar);

    let containersList = await bu.listContainersAsync();
    console.log(containersList)
}

async function embeddings() {
    let acctUriEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_URL');
    let acctKeyEnvVar : string = Config.lookupEnvVarName('ENV_OPENAI_KEY');
    let embDepEnvVar  : string = Config.lookupEnvVarName('ENV_OPENAI_EMB_DEP');

    let oaiUtil = new OpenAiUtil(acctUriEnvVar, acctKeyEnvVar, embDepEnvVar);
    let fu = new FileUtil();
    let text = fu.readTextFileSync('../data/gettysburg-address.txt');

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

    // let acctUriEnvVar : string = Config.lookupEnvVarName('ENV_NOSQL_URI');
    // let acctKeyEnvVar : string = Config.lookupEnvVarName('ENV_NOSQL_RW_KEY');
    // let cu : CosmosNoSqlUtil = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar);
    // cu.setPriorityLevel(PriorityLevel.Low);
    // let airports : Array<object> = fu.readJsonArrayFile('../data/world-airports-50.json');

    // let blr1: BulkLoadResult = await cu.loadContainerBulkAsync(
    //     'dev', 'unittests', 'create', airports, true, 50, bulkOptions(), lowPriorityOptions());
    // fu.writeTextFileSync('tmp/bulk_load_create_result.json', JSON.stringify(blr1, null, 2));
}

function lowPriorityOptions() : RequestOptions {
    let opts = {};
    opts['priorityLevel'] = PriorityLevel.Low;
    return opts;
}

function highPriorityOptions() : RequestOptions {
    let opts = {};
    opts['priorityLevel'] = PriorityLevel.High;
    return opts;
}

function bulkOptions() : BulkOptions {
    let opts = {};
    opts['continueOnError'] = false;
    return opts;
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
