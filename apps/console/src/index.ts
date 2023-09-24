
import {
    BlobUtil,
    FileUtil,
    CosmosNoSqlUtil
} from "azu-js";

import fs from "fs";
import path from "path";
import util from "util";

let func = process.argv[2];
console.log('========================================');
console.log(util.format('func: %s', func));

switch (func) {
    case "files":
        files();
        break;
    case "storage":
        storage();
        break;
    case "embeddings":
        embeddings();
        break;
    default:
        displayCommandLineExamples();
        break;
}

function files() {

    let fu = new FileUtil();
    let epoch : number = epochTime();
    let outfile : string = util.format('tmp%stest-file-%s.txt', path.sep, epoch);
    let content : string = util.format("this is a test file.\n%s", epoch);

    let successful : boolean = fu.writeTextFileSync(outfile, content);
    console.log(util.format("writeTextFileSync, outfile: %s, successful: %s", outfile, successful));

    let data : string = fu.readTextFileSync(outfile);
    console.log(data);

    let obj = fu.readJsonObjectFile('../../data/usa-states.json');
    console.log(obj);

    let airports = fu.readJsonArrayFile('../../data/world-airports-50.json');
    console.log(airports);
}

function storage() {

}

function embeddings() {

}

function xxx() {
    console.log(util.format('  xxx; count: %s', 1));
}

function epochTime() : number {
    return Date.now().valueOf();
}

function displayCommandLineExamples() {
    console.log('');
    console.log("node .\\dist\\index.js files");
    console.log("node .\\dist\\index.js storage");
    console.log("node .\\dist\\index.js embeddings");
    console.log('');
}
