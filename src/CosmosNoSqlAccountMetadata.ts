// Utility class for Azure Cosmos DB NoSQL APIs
// Chris Joakim, Microsoft, 2023

import util from "util";

import {
    DatabaseDefinition,
    OfferDefinition,
    ContainerDefinition
  } from "@azure/cosmos";

export class NoSqlMeta {

    raw     : object = null;
    type    : string = null;
    id      : string = null;
    rid     : string = null;
    self    : string = null;
    throughput : object = null;
    key     : string = null;
    partitionKey  : Array<object> = null;
    defaultTtl    : string = null;
    analyticalTtl : string = null;
    containers    : Array<NoSqlMeta> = null;

    constructor(objType : string, raw_data : object) {
        this.type = ('' + objType).toLowerCase();

        if (objType === 'offer') {
            this.throughput = raw_data['content'];
        }
        else {
            this.raw = raw_data
        }
        this.raw  = raw_data;
        this.id   = raw_data['id'];
        this.rid  = raw_data['_rid'];
        this.self = raw_data['_self'];
        this.key  = util.format('%s|%s|%s', this.type, this.id, this.self);

        if (this.isDb()) {
            this.containers = new Array<NoSqlMeta>();
        }
        if (this.isContainer()) {
            this.partitionKey = [];
            if (raw_data['partitionKey']) {
                this.partitionKey = raw_data['partitionKey']['paths'];
            }
            if (raw_data['defaultTtl']) {
                this.defaultTtl = '' + raw_data['defaultTtl'];
            }
            if (raw_data['analyticalStorageTtl']) {
                this.analyticalTtl = '' + raw_data['analyticalStorageTtl'];
            }
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
        this.containers.push(m);
    }

    pruneDb() : void {
        this.raw = null;
        delete this['raw'];
        delete this['key'];
        delete this['partitionKey'];
        delete this['defaultTtl'];
        delete this['analyticalTtl'];

        this.containers.forEach(c => { 
            delete c['raw'];
            delete c['key'];
            delete c['containers'];
        });
    }
}

export class CosmosNoSqlAccountMetadata {

    databases  : Array<DatabaseDefinition>  = new Array<DatabaseDefinition>();
    containers : Array<ContainerDefinition> = new Array<ContainerDefinition>();
    offers     : Array<OfferDefinition>     = new Array<OfferDefinition>();

    constructor() {}

    weave() : Array<object> {
        // "weave" the databases, containers, and offers data in this metadata
        // object into a sorted list of objects suitable for presenting in a
        // HTML page or other report.
        let metaArray = new Array<NoSqlMeta>();
        let dbArray = new Array<NoSqlMeta>();
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
            metaArray.forEach(m => {
                if (m.self === resourceId) {
                    m.throughput = data['content'];
                }
            });
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

        metaArray.forEach(m => { 
            if (m.isDb()) {
                m.pruneDb();
                dbArray.push(m);
            }
        });
        return dbArray;
    }
}
