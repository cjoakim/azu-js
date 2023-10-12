// Utility class for configuration such as environment variables
// Chris Joakim, Microsoft, 2023

import os from "os";

import { FileUtil } from "./FileUtil";

export class Config {
    
    public static LIB_NAME            : string = 'azu-js';
    public static LIB_VERSION         : string = '0.9.9';
    public static LIB_AUTHOR          : string = 'Chris Joakim';
    public static LIB_LICENSE         : string = 'MIT';
    public static ASU_JS_CONFIG_FILE  : string = 'azu-js-config.json';
    private static _config            : Object = null;

    static platform() : string {
        // Possible values are 'aix', 'darwin', 'freebsd','linux', 'openbsd', 'sunos', and 'win32'.
        return os.platform();
    }

    static isWindows() : boolean {
        let p : string = os.platform().toLowerCase();
        if (this.isMac()) {
            return false;  // 'darwin' contains 'win'!
        }
        return p.includes('win');
    }

    static isMac() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('darwin');
    }

    static isLinux() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('linux');
    }

    static lookupEnvVarName(normalizedName: string) : string {
        this.readConfigFile();
        if (!normalizedName) {
            return null;
        }
        if (this._config.hasOwnProperty(normalizedName)) {
            return this._config[normalizedName];
        }
        return null;
    }

    static readConfigFile() : Object {
        if (this._config == null) {
            this._config = new FileUtil().readJsonObjectFile(Config.ASU_JS_CONFIG_FILE);
        }
        return this._config;
    }

    static writeSampleConfigFile() : boolean {
        try {
            let data = {};
            data['ENV_NOSQL_URI']        = 'AZURE_COSMOSDB_NOSQL_URI';
            data['ENV_NOSQL_RW_KEY']     = 'AZURE_COSMOSDB_NOSQL_RW_KEY1';
            data['ENV_VCORE_CONN_STR']   = 'AZURE_COSMOSDB_MONGO_VCORE_CONN_STR';
            data['ENV_OPENAI_URL']       = 'AZURE_OPENAI_URL';
            data['ENV_OPENAI_KEY']       = 'AZURE_OPENAI_KEY1';
            data['ENV_OPENAI_EMB_DEP']   = 'AZURE_OPENAI_EMBEDDINGS_DEPLOYMENT';
            data['ENV_SEARCH_URL']       = 'AZURE_SEARCH_URL';
            data['ENV_SEARCH_NAME']      = 'AZURE_SEARCH_NAME';
            data['ENV_SEARCH_ADMIN_KEY'] = 'AZURE_SEARCH_ADMIN_KEY';
            data['ENV_SEARCH_QUERY_KEY'] = 'AZURE_SEARCH_QUERY_KEY';
            data['ENV_STORAGE_ACCT']     = 'AZURE_STORAGE_ACCOUNT';
            data['ENV_STORAGE_KEY']      = 'AZURE_STORAGE_KEY';
            let fu = new FileUtil();
            fu.writeTextFileSync(Config.ASU_JS_CONFIG_FILE, JSON.stringify(data, null, 2));
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
}
