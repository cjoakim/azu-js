// Utility class for local filesystem operations.
// To read huge text files, consider using a line-by-line
// streaming approach in your application code.
// Chris Joakim, Microsoft, 2023

import fs from "fs";
import os from "os";

export class FileUtil {
    
    constructor() {
    }

    cwd() : string {
        return process.cwd();
    }

    listFiles(dir: string) : Array<string> {
        return fs.readdirSync(dir);
    }

    readTextFileSync(infile: string) : string {
        try {
            let buf = fs.readFileSync(infile, 'utf8');
            return buf.toString();
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    readTextFileAsLinesSync(infile: string) : Array<string> {
        try {
            let text = this.readTextFileSync(infile);
            if (text == null) {
                return null;
            }
            else {
                return text.split("\n");
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    writeTextFileSync(outfile: string, data: string) : boolean {
        try {
            fs.writeFileSync(outfile, data);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }

    readJsonArrayFile(infile: string): Array<Object> {
        try {
            let str : string = fs.readFileSync(infile, 'utf8');
            return JSON.parse(str);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    readJsonObjectFile(infile: string): Object {
        try {
            let str : string = fs.readFileSync(infile, 'utf8');
            return JSON.parse(str);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
