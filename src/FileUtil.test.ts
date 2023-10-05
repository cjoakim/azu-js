// Unit tests for class FileUtil
// Chris Joakim, Microsoft, 2023

// npm test --testPathPattern FileUtil

import path from "path";
import util from "util";

import { Config } from "./Config";
import { FileUtil } from "./FileUtil";

function epochTime() : number {
    return Date.now().valueOf();
}

test("FileUtil: cwd", () => {
    let fu = new FileUtil();
    let cwd : string = fu.cwd();
    let endsWell : boolean = cwd.endsWith('azu-js');
    //console.log(cwd);
    expect(cwd).toContain('azu-js');
    expect(endsWell).toBe(true);
});

test("FileUtil: listFiles", () => {
    let fu = new FileUtil();
    let files = fu.listFiles('dist');
    //console.log(files);
    expect(files).toContain('FileUtil.js');
    expect(files).toContain('FileUtil.d.ts');
    expect(files.length).toBe(28);
});

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

test("FileUtil: readTextFileAsLinesSync", () => {
    let fu = new FileUtil();
    let lines : Array<string> = fu.readTextFileAsLinesSync('data/gettysburg-address.txt');
    expect(lines.length).toBe(20);
    expect(lines[0]).toBe('Four score and seven years ago our fathers brought forth on this continent, a new nation,');
    expect(lines[18]).toBe('– and that government of the people, by the people, for the people, shall not perish from the earth.');
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

test("FileUtil: gen console app package.json", () => {
    let fu = new FileUtil();
    let obj = fu.readJsonObjectFile('package.json');
    obj['name'] = 'console_app';
    obj['description'] = 'console app using azu-js';
    obj['dependencies']['azu-js'] = util.format('file:../azu-js-%s.tgz', obj['version']);
    expect(Object.keys(obj).length).toBeGreaterThan(6);
    expect(Object.keys(obj).length).toBeLessThan(20);
    fu.writeTextFileSync('console_app/package.json', JSON.stringify(obj, null, 4));
});

test("FileUtil: gen documentation", () => {
    let fu = new FileUtil();
    let filesList = fu.listFiles('dist');
    let outArray = [];
    //console.log(filesList);

    outArray.push('');
    outArray.push('## azu-js typings, version ' + Config.LIB_VERSION);

    for (let f of filesList) {
        if (f.endsWith('.d.ts')) {
            if (!f.includes('test')) {
                outArray.push('');
                outArray.push('### ' + f);
                outArray.push('');
                outArray.push("```");
                let text = fu.readTextFileSync('dist/' + f);
                outArray.push(text);
                outArray.push("```");
            }
        }
    }
    let s = outArray.join("\n");
    let outfile = util.format("docs/typings-%s.md", Config.LIB_VERSION);
    fu.writeTextFileSync(outfile, s);
});
