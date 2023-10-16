# azu-js

Reusable code, implemented in TypeScript, for rapid application Development in **Azure**.

The focus is on the **Azure Cosmos DB, Azure OpenAI, Azure Cognitive Search, and Azure Blob Storage** PaaS services.

See the console_app/ directory, and the unit tests, for example use of the azu-js package.

See the azu-js typings and interfaces documentation at https://github.com/cjoakim/azu-js/tree/main/docs.

The npm package is available here: https://www.npmjs.com/package/azu-js?activeTab=readme

---

## azu-js Current Implementation State and Roadmap

| Functionality                   | v1.0.0 Support  | Codebase State       | Implementation Class   |
| ------------------------------- | --------------- | -------------------- | ---------------------- |
| Azure Blob Storage              | yes             | Implemented          | BlobUtil               |
| Local Filesystem                | yes             | Implemented          | FileUtil               |
| Azure Cosmos DB NoSQL API       | yes             | Implemented          | CosmosNoSqlUtil        |
| Azure OpenAI                    | yes             | Implemented (1)      | OpenAiUtil             |
| Azure Cognitive Search          | yes             | Implemented (2)      | CogSearchUtil          |
| Azure Cosmos DB Mongo API       | no              | Not yet implemented  | CosmosMongoUtil        |
| Azure Cosmos DB PostgreSQL API  | no              | Not yet implemented  | CosmosPgUtil           |
| PaaS Service Provisioning       | no              | NOT Planned          | (3)                    |

#### Footnotes

- (1) embeddings and dalle image generation are implemented
- (2) supports both traditional and vector search
- (3) PaaS service provisioning functionality is not planned; please use az CLI, ARM, Bicep, Terraform, etc. instead

### Dependencies

Your application should include the following:

```
    "dependencies": {
        "@azure/cosmos": "4.0.0",
        "@azure/openai": "^1.0.0-beta.6",
        "@azure/storage-blob": "^12.16.0",
        "axios": "^1.5.1",
        "uuid": "^9.0.1"
        "azu-js": "1.0.0"
    },
```
