// Unit tests for class CosmosNoSqlUtil
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern CosmosNoSqlUtil

import {
    BulkOperationType,
    ConnectionMode,
    ConnectionPolicy,
    Container,
    ContainerDefinition,
    CosmosClient,
    DatabaseAccount,
    DatabaseDefinition,
    FeedResponse,
    ItemResponse,
    FeedOptions,
    Offer,
    OfferDefinition,
    OperationInput,
    PatchOperation,
    PatchOperationType,
    PartitionKeyDefinition,
    ResourceResponse,
    SqlQuerySpec,
    SqlParameter,
    JSONArray,
    JSONObject
  } from "@azure/cosmos";

import { CosmosNoSqlUtil, BulkLoadResult } from "./CosmosNoSqlUtil";
import {
    BaseNoSqlMeta,
    NoSqlDBMeta,
    NoSqlContainerMeta,
    NoSqlOfferMeta,
    CosmosNoSqlAccountMeta } from "./CosmosNoSqlAccountMetadata";

import { Config } from "./Config";
import { FileUtil } from "./FileUtil";
import { CosmosNoSqlQuerySpecUtil } from "./CosmosNoSqlQuerySpecUtil";

// State retained across tests
let acctUriEnvVar : string = Config.lookupEnvVarName('ENV_NOSQL_URI');
let acctKeyEnvVar : string = Config.lookupEnvVarName('ENV_NOSQL_RW_KEY');

export const overrideConnectionPolicy: ConnectionPolicy = Object.freeze({
    connectionMode: ConnectionMode.Gateway,
    requestTimeout: 10000,
    enableEndpointDiscovery: true,
    preferredLocations: [],
    retryOptions: {
      maxRetryAttemptCount: 3,
      fixedRetryIntervalInMilliseconds: 0,
      maxWaitTimeInSeconds: 10,
    },
    useMultipleWriteLocations: true,
    endpointRefreshRateInMs: 100000,
    enableBackgroundEndpointRefreshing: true,
});

let cu : CosmosNoSqlUtil = null;
let fu : FileUtil = new FileUtil();

beforeAll(() => {
    cu = initCosmosNoSqlUtil();
});

function initCosmosNoSqlUtil() : CosmosNoSqlUtil {
    return new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar);
}

function epochTime() : number {
    return Date.now().valueOf();
}

test("CosmosNoSqlUtil: constructor, getDatabaseAccountAsync(), endpoints, nd dispose()", async () => {
    expect(cu.acctUriEnvVar).toBe(acctUriEnvVar);
    expect(cu.acctKeyEnvVar).toBe(acctKeyEnvVar);
    expect(cu.acctUri).toBe('https://gbbcjcdbnosql.documents.azure.com:443/');
    expect(cu.acctKey).toContain('GPwIHU');
    
    expect(cu.connectionPolicy).toBe(cu.getDefaultConnectionPolicy());

    let rr : ResourceResponse<DatabaseAccount> = await cu.getDatabaseAccountAsync();
    expect(rr.statusCode).toBe(200);

    expect(await cu.getReadEndpointAsync()).toBe('https://gbbcjcdbnosql-eastus.documents.azure.com:443/');
    expect(await cu.getWriteEndpointAsync()).toBe('https://gbbcjcdbnosql-eastus.documents.azure.com:443/');
});

test("CosmosNoSqlUtil: constructor with override ConnectionPolicy", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    expect(cu.connectionPolicy).toBe(overrideConnectionPolicy);
});

test("CosmosNoSqlUtil: readPartitionKeyDefinitionAsync", async () => {
    cu.setCurrentDatabaseAsync('dev');
    expect(cu.currentDbName).toBe('dev');
    expect(cu.currentDb).toBeTruthy();
    expect(cu.currentDb.id).toBe('dev');

    cu.setCurrentContainerAsync('unittests');
    expect(cu.currentContainer).toBeTruthy();
    expect(cu.currentContainer.id).toBe('unittests');

    let pkDef : PartitionKeyDefinition = await cu.readPartitionKeyDefinitionAsync('dev', 'unittests');
    expect(pkDef).toBeTruthy();
    // { paths: [ '/pk' ], kind: 'Hash', version: 2 }
    expect(pkDef.paths.length).toBe(1);
    expect(pkDef.paths[0]).toBe('/pk');
});

test("CosmosNoSqlUtil: listDatabasesAsync", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let databases : Array<DatabaseDefinition> = await cu.listDatabasesAsync();
    for (const db of databases) {
        //console.log(db);
    }
    expect(databases.length).toBeGreaterThan(0);
});

test("CosmosNoSqlUtil: listContainersAsync", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let containers : Array<ContainerDefinition> = await cu.listContainersAsync('dev');
    for (const c of containers) {
        //console.log(c);
    }
    expect(containers.length).toBeGreaterThan(0);
});

test("CosmosNoSqlUtil: getAccountOffersAsync", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let offerDefs : Array<OfferDefinition> = await cu.getAccountOffersAsync();
    for (const offer of offerDefs) {
        //console.log(JSON.stringify(offer, null, 2));
    }
    expect(offerDefs.length).toBeGreaterThan(0);
});

test("CosmosNoSqlUtil: getAccountMetadataAsync", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let metadata : CosmosNoSqlAccountMeta = await cu.getAccountMetadataAsync();
    fu.writeTextFileSync('tmp/cosmos_account_metadata.json', JSON.stringify(metadata, null, 2));
    expect(metadata.offers.length).toBeGreaterThan(0);
    expect(metadata.databases.length).toBeGreaterThan(0);
    expect(metadata.containers.length).toBeGreaterThan(0);
});

test("CosmosNoSqlUtil CosmosAccountMetadata: weave", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let metadata : CosmosNoSqlAccountMeta = await cu.getAccountMetadataAsync();
    let databases : Array<object> = metadata.weave();
    let dbThroughputPopulated : boolean = false;
    let dbThroughputNotPopulated : boolean = false;
    fu.writeTextFileSync('tmp/cosmos_account_metadata_weave.json', JSON.stringify(databases, null, 2));
    expect(databases.length).toBeGreaterThan(0);
    expect(databases.length).toBeLessThan(10);

    databases.forEach(db => { 
        expect(db['type']).toBe('db');
        expect(db['id'].length).toBeGreaterThan(0);
        expect(db['rid'].length).toBeGreaterThan(0);
        expect(db['self'].slice(0, 4)).toBe('dbs/');
        if (db['throughput']) {
            dbThroughputPopulated = true;
        }
        else {
            dbThroughputNotPopulated = true;
        }

        db['containers'].forEach(c => { 
            expect(c['type']).toBe('container');
            expect(c['id'].length).toBeGreaterThan(0);
            expect(c['rid'].length).toBeGreaterThan(0);
            expect(c['self']).toContain('/colls/');
            expect(c['partitionKey'].length).toBeGreaterThan(0);
        });
    });
    expect(dbThroughputPopulated).toBe(true);
    expect(dbThroughputNotPopulated).toBe(true);
});

test("CosmosNoSqlUtil: crud operations", async () => {
    let dbName = 'dev';
    let cName = 'unittests';
    cu.setCurrentDatabaseAsync(dbName);
    cu.setCurrentContainerAsync(cName);

    let epoch : number = epochTime();
    let pk : string = 'pk_' + epoch;
    let id : string = cu.generateUuid();
    expect(id.length).toBe(36);

    // Insert
    let doc : Object = {};
    doc['id'] = id;
    doc['pk'] = pk;
    doc['epoch'] = epoch;
    let itemResp : ItemResponse<Object> = await cu.insertDocumentAsync('dev', 'unittests', doc);
    expect(itemResp.resource.id).toBe(id);
    expect(itemResp.resource['pk']).toBe(pk);
    expect(itemResp.resource['epoch']).toBe(epoch);
    expect(itemResp.statusCode).toBe(201);
    let rc : string = '' + itemResp.headers['x-ms-request-charge'];
    let ru : number = Number.parseFloat(rc);
    expect(ru).toBeGreaterThan(1);
    expect(ru).toBeLessThan(10);

    // Point Read
    let readResp : ItemResponse<Object> = await cu.pointReadAsync(dbName, cName, id, pk);
    expect(readResp.statusCode).toBe(200);
    let doc2 : Object = readResp.resource;
    expect(doc2['id']).toBe(id);
    expect(doc2['pk']).toBe(pk);
    expect(doc2['epoch']).toBe(epoch);
    rc = '' + readResp.headers['x-ms-request-charge'];
    ru = Number.parseFloat(rc);
    expect(ru).toBeGreaterThan(0.1);
    expect(ru).toBeLessThan(1.1);

    // Query all
    let qu = new CosmosNoSqlQuerySpecUtil();
    let spec : SqlQuerySpec = qu.querySpec('select * from c offset 0 limit 1');
    expect(spec['query']).toBe('select * from c offset 0 limit 1');
    expect(spec['parameters'].length).toBe(0);
    let feedResp = await cu.queryAsync(dbName, cName, spec);
    let docCount = 0;
    for (const item of feedResp.resources) {
        docCount++;
    }
    expect(docCount).toBeGreaterThan(0);

    // Query with params
    let params = [];
    params.push({name: "@epoch", value: epoch});
    spec = qu.querySpec('select * from things t where t.epoch=@epoch', params);
    expect(spec['query']).toBe('select * from things t where t.epoch=@epoch');
    expect(spec['parameters'].length).toBe(1);

    feedResp = await cu.queryAsync(dbName, cName, spec);
    docCount = 0;
    let updateDoc : Object = null;
    for (const item of feedResp.resources) {
        docCount++;
        expect(item['epoch']).toBe(epoch);
        updateDoc = item;
    }
    expect(docCount).toBeGreaterThan(0);

    // Update the document
    updateDoc['message'] = 'new attribute added';
    let updateResp = await cu.upsertDocumentAsync(dbName, cName, updateDoc);
    expect(updateResp.statusCode).toBe(200);

    feedResp = await cu.queryAsync(dbName, cName, spec);
    docCount = 0;
    for (const item of feedResp.resources) {
        expect(item['epoch']).toBe(epoch);
        expect(item['message']).toBe('new attribute added');
    }

    // Patch the document TODO


    
    // Delete document
    // See https://learn.microsoft.com/en-us/rest/api/cosmos-db/http-status-codes-for-cosmosdb
    let deleteResp : ItemResponse<Object> = await cu.deleteDocumentAsync(dbName, cName, id, pk);
    expect(deleteResp.statusCode).toBe(204);
    try {
        deleteResp = await cu.deleteDocumentAsync(dbName, cName, id, pk);
        expect('an exception on the second delete should have been thrown').toBe('but one wasnt');

    }
    catch (err: any) {
        let msg : string = '' + err;
        expect(msg).toContain('Entity with the specified id does not exist in the system');
    }
});

test("CosmosNoSqlUtil: bulk create and upsert", async () => {
    cu = new CosmosNoSqlUtil(acctUriEnvVar, acctKeyEnvVar, overrideConnectionPolicy);
    let dbName = 'dev';
    let cName  = 'unittests';
    cu.setCurrentDatabaseAsync(dbName);
    cu.setCurrentContainerAsync(cName);
    let airports : Array<object> = fu.readJsonArrayFile('data/world-airports-50.json');
    expect(airports.length).toBe(50);

    airports.forEach(a => { a['id'] = cu.generateUuid(); });
    fu.writeTextFileSync('tmp/bulk_airports.json', JSON.stringify(airports, null, 2));

    // first create the 50 airport documents
    let blr1: BulkLoadResult = await cu.loadContainerBulkAsync(dbName, cName, 'create', airports, false);
    fu.writeTextFileSync('tmp/bulk_load_create_result.json', JSON.stringify(blr1, null, 2));
    expect(blr1.batchSize).toBe(50);
    expect(blr1.batchCount).toBe(1);
    expect(blr1.elapsedTime).toBeGreaterThan(10);
    expect(blr1.elapsedTime).toBeLessThan(3000);
    expect(blr1.totalRUs).toBeGreaterThan(250);
    expect(blr1.totalRUs).toBeLessThan(5000);
    expect(blr1.responseCodes[200]).toBe(undefined);
    expect(blr1.responseCodes[201]).toBe(50);
    expect(blr1.responseCodes[404]).toBe(undefined);

    // next upsert the 50 airport documents
    airports.forEach(obj => { obj['updated'] = 1; });
    let blr2 : BulkLoadResult = await cu.loadContainerBulkAsync(dbName, cName, 'upsert', airports, false, 20);
    fu.writeTextFileSync('tmp/bulk_load_upsert1_result.json', JSON.stringify(blr2, null, 2));
    expect(blr2.batchSize).toBe(20);
    expect(blr2.batchCount).toBe(3);  // batches of 20, 20, 10 = 3
    expect(blr2.elapsedTime).toBeGreaterThan(10);
    expect(blr2.elapsedTime).toBeLessThan(3000);
    expect(blr2.totalRUs).toBeGreaterThan(250);
    expect(blr2.totalRUs).toBeLessThan(5000);
    expect(blr2.responseCodes[200]).toBe(50);
    expect(blr2.responseCodes[201]).toBe(undefined);
    expect(blr2.responseCodes[404]).toBe(undefined);

    // next upsert the 50 airport documents
    airports.forEach(obj => { obj['updated'] = 2; });
    let blr3 : BulkLoadResult = await cu.loadContainerBulkAsync(dbName, cName, 'upsert', airports, false, 999);
    fu.writeTextFileSync('tmp/bulk_load_upsert2_result.json', JSON.stringify(blr3, null, 2));
    expect(blr3.batchSize).toBe(50);  // normalized from 999 to 50
    expect(blr3.batchCount).toBe(1);
    expect(blr3.elapsedTime).toBeGreaterThan(10);
    expect(blr3.elapsedTime).toBeLessThan(3000);
    expect(blr3.totalRUs).toBeGreaterThan(250);
    expect(blr3.totalRUs).toBeLessThan(5000);
    expect(blr3.responseCodes[200]).toBe(50);
    expect(blr3.responseCodes[201]).toBe(undefined);
    expect(blr3.responseCodes[404]).toBe(undefined);
});
