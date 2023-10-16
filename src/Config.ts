/**
 * Utility class for configuration such as environment variables.
 * Chris Joakim, Microsoft, 2023
 */

import os from "os";

import { FileUtil } from "./FileUtil";

export class Config {
    
    public static LIB_NAME            : string = 'azu-js';
    public static LIB_VERSION         : string = '1.0.0';
    public static LIB_AUTHOR          : string = 'Chris Joakim';
    public static LIB_LICENSE         : string = 'MIT';
    public static ASU_JS_CONFIG_FILE  : string = 'azu-js-config.json';
    private static _config            : Object = null;

    /**
     * Return the name of the platform where this node.js process is running.
     * Possible values are 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'.
     */
    static platform() : string {
        return os.platform();
    }

    /**
     * Return true if the current platform is Windows, else return false. 
     */
    static isWindows() : boolean {
        let p : string = os.platform().toLowerCase();
        if (this.isMac()) {
            return false;  // 'darwin' contains 'win'!
        }
        return p.includes('win');
    }

    /**
     * Return true if the current platform is Apple macOS, else return false. 
     */
    static isMac() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('darwin');
    }

    /**
     * Return true if the current platform is Linux, else return false. 
     */
    static isLinux() : boolean {
        let p : string = os.platform().toLowerCase();
        return p.includes('linux');
    }

    /**
     * Return your mapped environment variable name for the given normalized name,
     * or null if it is not defined. The mapping is defined in file 'azu-js-config.json'.
     */
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

    /**
     * Read the standard configuration file used by the azu-js package;
     * 'azu-js-config.json' in the current working directory.
     * This file should contain a JSON object with key/value pairs
     * that map the normalized environment variable names to your
     * specified environment variable names.
     */
    static readConfigFile() : Object {
        if (this._config == null) {
            this._config = new FileUtil().readJsonObjectFile(Config.ASU_JS_CONFIG_FILE);
        }
        return this._config;
    }

    /**
     * Create an example 'azu-js-config.json' file.
     */
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
