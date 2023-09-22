
import fs from "fs";

export class FileUtil {
    
    constructor() {
    }

    readTextFileSync(infile: string) : string {
        try {
            return fs.readFileSync(infile, 'utf-8');
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
