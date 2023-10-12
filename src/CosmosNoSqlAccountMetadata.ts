// Utility class for Azure Cosmos DB NoSQL APIs
// Chris Joakim, Microsoft, 2023

import util from "util";

import {
    DatabaseDefinition,
    OfferDefinition,
    ContainerDefinition
  } from "@azure/cosmos";

export abstract class BaseNoSqlMeta {

    raw         : object = null;
    type        : string = null;
    id          : string = null;
    rid         : string = null;
    self        : string = null;
    throughput? : object = null;
    key         : string = null;

    constructor(raw_data : object) {
        this.type = 'pending';
        this.raw  = raw_data;
        this.id   = raw_data['id'];
        this.rid  = raw_data['_rid'];
        this.self = raw_data['_self'];
        this.key  = util.format('%s|%s|%s', this.type, this.id, this.self);
    }

    isDb() : boolean {
        return this.type === 'db';
    }

    isContainer() : boolean {
        return this.type === 'container';
    }

    isOffer() : boolean {
        return this.type === 'offer';
    }

    prune() : void {
        this.raw = null;
        delete this['raw'];
        delete this['key'];
    }
}

export class NoSqlDBMeta extends BaseNoSqlMeta {

    partitionKey  : Array<object> = null;
    defaultTtl    : string = null;
    analyticalTtl : string = null;
    containers    : Array<NoSqlContainerMeta> = null;

    constructor(raw_data : object) {
        super(raw_data);
        this.type = 'db';
        this.containers = new Array<NoSqlContainerMeta>();
    }

    addContainerMeta(container : NoSqlContainerMeta) : void {
        if (container) {
            this.containers.push(container);
        }
    }

    prune() : void {
        super.prune();
        this.containers.forEach(c => { c.prune(); });
    }
}

export class NoSqlContainerMeta extends BaseNoSqlMeta {

    partitionKey  : Array<object> = null;
    defaultTtl    : string = null;
    analyticalTtl : string = null;

    constructor(raw_data : object) {
        super(raw_data);
        this.type = 'container';
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

    prune() : void {
        super.prune();
        delete this['partitionKey'];
        delete this['defaultTtl'];
        delete this['analyticalTtl'];
    }
}

export class NoSqlOfferMeta extends BaseNoSqlMeta {

    constructor(raw_data : object) {
        super(raw_data);
        this.type = 'offer';
        this.throughput = raw_data['content'];
    }

    prune() : void {
        super.prune();
    }
}

export class CosmosNoSqlAccountMeta {

    databases  : Array<DatabaseDefinition>  = new Array<DatabaseDefinition>();
    containers : Array<ContainerDefinition> = new Array<ContainerDefinition>();
    offers     : Array<OfferDefinition>     = new Array<OfferDefinition>();

    constructor() {}

    weave() : Array<object> {
        // "weave" the databases, containers, and offers data in this metadata
        // object into a sorted list of objects suitable for presenting in a
        // HTML page or other report.
        let dbArray = new Array<NoSqlDBMeta>();
        let containerArray = new Array<NoSqlContainerMeta>();
        let dictionary = {};

        // Collect the raw databases and containers into an array of Meta objects
        this.databases.forEach(data => { 
            let db = new NoSqlDBMeta(data);
            dictionary[db.self] = db.id;
            dbArray.push(db);
        });
        this.containers.forEach(data => { 
            let c = new NoSqlContainerMeta(data);
            dictionary[c.self] = c.id;
            containerArray.push(c);
        });

        // Assign the offers to the databases or containers
        this.offers.forEach(data => { 
            let resourceId = data['resource'];
            dbArray.forEach(db => {
                if (db.self === resourceId) {
                    db.throughput = data['content'];
                }
            });
            containerArray.forEach(c => {
                if (c.self === resourceId) {
                    c.throughput = data['content'];
                }
            });
        });

        // Assign the containers to the databases
        containerArray.forEach(c => {
            dbArray.forEach(db => {
                if (c.self.startsWith(db.self)) {
                    db.addContainerMeta(c);
                }
            });
        });

        dbArray.forEach(db => { db.prune(); });
        return dbArray;
    }
}
