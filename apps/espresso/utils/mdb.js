const util = require('util');
const { MongoClient, ServerApiVersion } = require("mongodb");

let client = null;
let hackathonDB = null;
let hackathonColl = null;

// See https://mrvautin.com/re-use-mongodb-database-connection-in-routes/

function getConnectionString() {
    return process.env.AZURE_COSMOSDB_MONGO_VCORE_CONN_STR;
}

function getHackathonDbName() {
    return process.env.AZURE_HACKATHON_DBNAME || 'dev';
}

function getHackathonCollName() {
    return process.env.AZURE_HACKATHON_COLLNAME || 'hackathon';
}

function connectToMongo() {
    var uri = getConnectionString();
    console.log(util.format('mdb.js uri: %s', uri));

    client = new MongoClient(uri, {
        useNewUrlParser: true
    });
    console.log('mdb.js created client, connecting...');
    client.connect();
    console.log('mdb.js connected');

    console.log(util.format('mdb.js getHackathonDbName: %s', getHackathonDbName()));
    console.log(util.format('mdb.js getHackathonCollName: %s', getHackathonCollName()));

    hackathonDB = client.db(getHackathonDbName());
    console.log(util.format('mdb.js hackathonDB: %s', hackathonDB));

    hackathonColl = hackathonDB.collection(getHackathonCollName());
    console.log(util.format('mdb.js hackathonColl: %s', hackathonColl));

    return client;
}

function getMongoClient() {
    return client;
}

function getHackathonDB() {
    return hackathonDB;
}

function getHackathonColl() {
    return hackathonColl;
}

function closeMongoClient() {
    client.close();
}

module.exports = {
    connectToMongo,
    getConnectionString,
    getMongoClient,
    closeMongoClient,
    getHackathonDbName,
    getHackathonCollName,
    getHackathonDB,
    getHackathonColl
};
