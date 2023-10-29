/**
 * Utility classes related to the metadata for Azure Cosmos DB NoSQL API
 * databases, containers, and offers (throughput).
 * Chris Joakim, Microsoft, 2023
 */

import util from "util";

import {
    DatabaseDefinition,
    OfferDefinition,
    ContainerDefinition
} from "@azure/cosmos";

/**
 * Abstract base class for NoSqlDBMeta, NoSqlContainerMeta, and NoSqlOfferMeta.
 * Attributes include the id (i.e. - name), the _rid, and the _self identifiers.
 */
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

    /**
     * Return true if this instance is a database, else return false.
     */
    isDb() : boolean {
        return this.type === 'db';
    }

    /**
     * Return true if this instance is a container, else return false.
     */
    isContainer() : boolean {
        return this.type === 'container';
    }

    /**
     * Return true if this instance is an offer (i.e. - throughput descriptor),
     * else return false.
     */
    isOffer() : boolean {
        return this.type === 'offer';
    }

    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune() : void {
        this.raw = null;
        delete this['raw'];
        delete this['key'];
    }
}

/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API database, including its containers and offers.
 */
export class NoSqlDBMeta extends BaseNoSqlMeta {

    containers : Array<NoSqlContainerMeta> = null;

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

    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune() : void {
        super.prune();
        this.containers.forEach(c => { c.prune(); });
    }
}

/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API container, including its offer.
 * Attributes include the inherited id (i.e. - name), _rid, _self,
 * as well as the partitionKey(s), defaultTtl, and analyticalTtl.
 */
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

    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune() : void {
        super.prune();
    }
}

/**
 * Instances of this class represent the metadata for a given
 * Cosmos DB NoSQL API offer, or "throughput descriptor", 
 * for either a database or container.
 */
export class NoSqlOfferMeta extends BaseNoSqlMeta {

    constructor(raw_data : object) {
        super(raw_data);
        this.type = 'offer';
        this.throughput = raw_data['content'];
    }

    /**
     * Delete unnecessary properties from this instance so as to make
     * the JSON string representation smaller and more pertinent.
     */
    prune() : void {
        super.prune();
    }
}

/**
 * Instances of this class represent the complete set of raw metadata
 * for a given Cosmos DB NoSQL API account, including its databases,
 * containers, and offers.  This raw metadata is obtained by SDK methods,
 * and the raw data is refined and correlated into the above XxxMeta classes.
 * 
 */
export class CosmosNoSqlAccountMeta {

    databases  : Array<DatabaseDefinition>  = new Array<DatabaseDefinition>();
    containers : Array<ContainerDefinition> = new Array<ContainerDefinition>();
    offers     : Array<OfferDefinition>     = new Array<OfferDefinition>();

    constructor() {}

    /**
     * This method is used to "weave", or correlate, the raw database, container,
     * and offer metadata into a sorted list of objects suitable for presenting
     * in a HTML page or other report.  It returns an array of NoSqlDBMeta objects,
     * which contain the appropriate NoSqlContainerMeta and NoSqlOfferMeta objects.
     * NoSqlOfferMeta objects can be either at the database or container lerve.
     */
    weave() : Array<object> {
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
