
// Utility class for Azure Cosmos DB Mongo and vCore APIs
// Chris Joakim, Microsoft, 2023

import util from "util";
import { v4 as uuidv4 } from 'uuid';

export class CosmosMongoUtil {

    acctUriEnvVar : string;
    acctKeyEnvVar : string;
    vCoreEnvVar   : string;
    acctUri       : string;
    acctKey       : string;
    currentDbName : string = '';
    currentContainerName : string = '';
    verbose : boolean = false;

    // Pass in the names of the environment variables that contain the
    // Azure Cosmos DB account URI and Key.
    constructor(
        acctUriEnvVar : string,
        acctKeyEnvVar : string,
        vCoreEnvVar?  : string,
        verbose?: boolean) {

        try {
            // set instance variables
            this.acctUriEnvVar = acctUriEnvVar;
            this.acctKeyEnvVar = acctKeyEnvVar;
            this.vCoreEnvVar   = vCoreEnvVar;
            this.verbose = verbose;

            // TODO - connect to RU vs vCore
            // read given environment variables
            // this.acctUri = process.env[acctUriEnvVar] as string;
            // this.acctKey = process.env[acctKeyEnvVar] as string;
            // validate
            // if (!this.acctUri) {
            //     throw Error(
            //         util.format('Cosmos DB acctUri not populated per env var: %s', this.acctUriEnvVar));
            // }
            // if (!this.acctKey) {
            //     throw Error(
            //         util.format('Cosmos DB acctKey not populated per env var: %s', this.acctKeyEnvVar));
            // }
            // if (this.verbose == true) {
            //     console.log(util.format('  url: %s -> %s', this.acctUriEnvVar, this.acctUri));
            //     console.log(util.format('  key: %s -> %s', this.acctKeyEnvVar, this.acctKey));
            // }
        }
        catch (error) {
            console.log(error);
        }
    }

    dispose() : void {
    }


    generateUuid() : string {
        return uuidv4();
    }

}
