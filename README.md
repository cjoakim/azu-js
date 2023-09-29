# azu-js

Reusable code, implemented in TypeScript, for rapid application Development in **Azure**.

The focus is on the **Azure Cosmos DB, Azure OpenAI, Azure Cognitive Search, and Azure Blob Storage** PaaS services.

See the console_app/ directory, and the unit tests, for example use of the azu-js package.

---

## azu-js Current Implementation State and Roadmap

| Functionality                   | v0.9.3 Support    | Codebase State       | Implementation Class   |
| ------------------------------- | ----------------- | -------------------- | ---------------------- |
| Azure Blob Storage              | yes               | Implemented          | BlobUtil               |
| Local Filesystem                | yes               | Implemented          | FileUtil               |
| Azure Cosmos DB NoSQL API       | yes               | Implemented          | CosmosNoSqlUtil        |
| Azure OpenAI                    | yes               | Implemented(1)       | OpenAiUtil             |
| Azure Cognitive Search          | tbd               | Work-in-progress     | CogSearchUtil          |
| Azure Cosmos DB Mongo API       | no                | Not yet implemented  | CosmosMongoUtil        |
| Azure Cosmos DB PostgreSQL API  | no                | Not yet implemented  | CosmosPgUtil           |
| PaaS Service Provisioning       | no                | NOT Planned          | use az CLI, Bicep, etc |

(1) = embeddings implemented
