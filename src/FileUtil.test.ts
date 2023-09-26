
// Unit tests for class FileUtil
// Chris Joakim, Microsoft, 2023

import path from "path";
import util from "util";

import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

function epochTime() : number {
    return Date.now().valueOf();
}

test("FileUtil: writeTextFileSync and readTextFileSync", () => {
    let fu = new FileUtil();
    let epoch : number = epochTime();
    let outfile : string = util.format('tmp%stest-file-%s.txt', path.sep, epoch);
    let content : string = util.format("this is a test file.\n%s", epoch);

    let successful : boolean = fu.writeTextFileSync(outfile, content);
    expect(successful).toBe(true);

    let data : string = fu.readTextFileSync(outfile);
    expect(data).toBe(content);
});

test("FileUtil: readJsonObjectFile", () => {
    let fu = new FileUtil();
    let obj = fu.readJsonObjectFile('data/usa-states.json');
    let expected = 102;
    expect(Object.keys(obj).length).toBe(expected);
    expect(obj['NC']).toBe('North Carolina');
});

test("FileUtil: readJsonArrayFile", () => {
    let fu = new FileUtil();
    let airports = fu.readJsonArrayFile('data/world-airports-50.json');
    expect(airports.length).toBe(50);
    let cdg = airports[8]
    expect(cdg['name']).toBe('Charles De Gaulle');
});
