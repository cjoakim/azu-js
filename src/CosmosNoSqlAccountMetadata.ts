// Utility class for Azure Cosmos DB NoSQL APIs
// Chris Joakim, Microsoft, 2023

import util from "util";
import { v4 as uuidv4 } from 'uuid';

import {
    BulkOperationType,
    ConnectionMode,
    ConnectionPolicy,
    Container,
    CosmosClient,
    Database,
    DatabaseResponse,
    DatabaseAccount,
    DatabaseDefinition,
    DiagnosticNodeInternal,
    FeedOptions,
    FeedResponse,
    ItemResponse,
    Offer,
    OfferDefinition,
    OfferResponse,
    OperationInput,
    PatchOperation,
    PartitionKeyDefinition,
    PatchOperationType,
    ResourceResponse,
    SqlQuerySpec,
    SqlParameter,
    ContainerDefinition
  } from "@azure/cosmos";

import { FileUtil } from "./FileUtil";
import { NoSqlQueryUtil } from "./NoSqlQueryUtil";


export class NoSqlMeta {

    raw   : object = null;
    type  : string = null;
    id    : string = null;
    rid   : string = null;
    self  : string = null;
    offer : NoSqlMeta = null;
    key   : string = null;
    containers : Array<NoSqlMeta> = null;

    constructor(obj_type : string, raw_data : object) {
        this.type = ('' + obj_type).toLowerCase();
        this.raw  = raw_data;
        this.id   = raw_data['id'];
        this.rid  = raw_data['_rid'];
        this.self = raw_data['_self'];
        this.key  = util.format('%s|%s|%s', this.type, this.id, this.self);

        if (this.isDb()) {
            this.containers = new Array<NoSqlMeta>();
        }
    }

    isDb() : boolean {
        return this.type === 'db';
    }

    isContainer() : boolean {
        return this.type === 'coll';
    }

    isOffer() : boolean {
        return this.type === 'offer';
    }

    addContainer(m : NoSqlMeta) : void {

    }
}

export class CosmosNoSqlAccountMetadata {

    databases  : Array<DatabaseDefinition>  = new Array<DatabaseDefinition>();
    containers : Array<ContainerDefinition> = new Array<ContainerDefinition>();
    offers     : Array<OfferDefinition>     = new Array<OfferDefinition>();

    constructor() {}

    weave() : Array<object> {
        // "weave" the databases, containers, and offers in the given metadata
        // object into a sorted list of objects suitable for presenting in a
        // HTML page or other report.
        // TODO - implement
        let fu : FileUtil = new FileUtil();
        let metaArray = new Array<NoSqlMeta>();
        let dictionary = {};

        // Collect the raw databases and containers into an array of Meta objects
        this.databases.forEach(data => { 
            let m = new NoSqlMeta('db', data);
            dictionary[m.self] = m.id;
            metaArray.push(m);
        });
        this.containers.forEach(data => { 
            let m = new NoSqlMeta('coll', data);
            dictionary[m.self] = m.id;
            metaArray.push(m);
        });

        // Assign the offers to the databases or containers
        this.offers.forEach(data => { 
            let resourceId = data['resource'];
            let assigned = false;
            console.log('weave: processing offer: ' + resourceId);
            metaArray.forEach(m => {
                if (m.self === resourceId) {
                    m.offer = new NoSqlMeta('offer', data);
                    console.log(util.format('weave: assigning offer %s to %s', resourceId, m.key));
                    assigned = true;
                }
            });
            if (!assigned) {
                console.log(util.format('weave: warning offer not assigned %s', resourceId));
            }
        });

        // Assign the containers to the databases
        metaArray.forEach(m1 => { 
            if (m1.isDb()) {
                metaArray.forEach(m2 => { 
                    if (m2.isContainer()) {
                        // example self values: dbs/gm8hAA==/  dbs/gm8hAA==/colls/gm8hAOJUuwE=/
                        if (m2.self.startsWith(m1.self)) {
                            m1.addContainer(m2);
                        }
                    }
                });
            }
        });

        fu.writeTextFileSync('tmp/meta-dict.json', JSON.stringify(dictionary, null, 2));
        fu.writeTextFileSync('tmp/meta-array.json', JSON.stringify(metaArray, null, 2));
        return null;
    }
}
