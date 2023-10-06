import {
    SqlQuerySpec,
    SqlParameter
  } from "@azure/cosmos";

// This class is used to create instances of the SqlQuerySpec interface.
// See https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/sqlqueryspec?view=azure-node-latest

export class CosmosNoSqlQuerySpecUtil {

    constructor() {}

    querySpec(sql: string, parameters?: string[]) : SqlQuerySpec {
        let params = [];
        if (parameters) {
            params = parameters;
        }
        return { query: sql, parameters: params };
    }
}
