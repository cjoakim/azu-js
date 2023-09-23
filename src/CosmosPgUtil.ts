
// TODO - implement

import util from "util";

export class CosmosPgUtil {

    acctUriEnvVar : string;
    acctKeyEnvVar : string;
    acctUri       : string;
    acctKey       : string;
    verbose       : boolean;

    // Pass in the names of the environment variables that contain the
    // Azure Cosmos DB account URI and Key.
    constructor(
        acctUriEnvVar : string,
        acctKeyEnvVar : string,
        verbose?: boolean) {

        try {

        }
        catch (error) {
            console.log(error);
        }
    }

    dispose() : void {
        return;
    }

}
