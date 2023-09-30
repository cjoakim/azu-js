# azu-js

Reusable code, implemented in TypeScript, for rapid application Development in **Azure**.

The focus is on the **Azure Cosmos DB, Azure OpenAI, Azure Cognitive Search, and Azure Blob Storage** PaaS services.

See the console_app/ directory, and the unit tests, for example use of the azu-js package.

See the TypeScript typings documentation at https://github.com/cjoakim/azu-js/tree/main/docs.

---

## azu-js Current Implementation State and Roadmap

| Functionality                   | v0.9.4 Support | Codebase State       | Implementation Class   |
| ------------------------------- | -------------- | -------------------- | ---------------------- |
| Azure Blob Storage              | yes            | Implemented          | BlobUtil               |
| Local Filesystem                | yes            | Implemented          | FileUtil               |
| Azure Cosmos DB NoSQL API       | yes            | Implemented          | CosmosNoSqlUtil        |
| Azure OpenAI                    | yes            | Implemented (1)      | OpenAiUtil             |
| Azure Cognitive Search          | yes            | Implemented (2)      | CogSearchUtil          |
| Azure Cosmos DB Mongo API       | no             | Not yet implemented  | CosmosMongoUtil        |
| Azure Cosmos DB PostgreSQL API  | no             | Not yet implemented  | CosmosPgUtil           |
| PaaS Service Provisioning       | no             | NOT Planned          | (3)                    |

#### Footnotes

- (1) embeddings implemented
- (2) supports both traditional and vector search
- (3) PaaS service provisioning functionality is not planned; use az CLI, ARM, Bicep, Terraform, etc. instead
