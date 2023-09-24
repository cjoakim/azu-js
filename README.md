# azu-js

Reusable code, implemented in TypeScript, for rapid application Development in **Azure**.
The focus is on the **Azure Cosmos DB, Azure Blob Storage, and Azure OpenAI** PaaS services.

The intent of the **azu-js npm package** is to:
- Provide Azure and Cosmos DB users a solid codebase to reference and use
- The intended audience for the azu-js npm package is **Software Developers**

The intent of **the GitHub repo** is to:
- Be the home of the azu-js package
- Provide examples, or **reference apps**, which use azu-js
  - Provide simple and reliable **az CLI** deployment scripts
  - Leverage Docker and public container images on DockerHub
  - Target Azure Container Instances (ACS) and Azure Container Apps (ACA)
  - The reference apps are intended for customer POCs as well as peer Microsoft Specialists and CSAs

---

## azu-js Current Implementation State and Roadmap

| Functionality                   | v0.9.2 Support    | Codebase State    | Implementation Class   |
| ------------------------------- | ----------------- | ----------------- | ---------------------- |
| Azure Cosmos DB NoSQL API       | yes               | Implemented       | CosmosNoSqlUtil        |
| Azure Cosmos DB Mongo API       | no                | work-in-progress  | CosmosMongoUtil        |
| Azure Cosmos DB PostgreSQL API  | no                | work-in-progress  | CosmosPgUtil           |
| Azure OpenAI                    | no                | Implemented(1)    | OpenAiUtil             |
| Azure Blob Storage              | yes               | Implemented       | BlobUtil               |
| Local Filesystem                | yes               | Implemented       | FileUtil               |
| PaaS Service Provisioning       | no                | Not Planned       | use az CLI, Bicep, etc |

(1) = embeddings implemented

---

## Reference Application State and Roadmap

| Functionality                      | Codebase State    | Impl Directory    | DockerHub Image |
| ---------------------------------- | ----------------- | ----------------- | --------------- |
| Console App                        | started           | apps/console      | N/A             |
| Express Web App w/Cosmos NoSql     | started           | apps/espresso     | TBD             |
| Express Web App also with w/OpenAI | planned           | TBD               | TBD             |
| Change-Feed Azure Function         | planned           | TBD               | TBD             |

---

## Npm Dependencies Links

- **@azure/cosmos**
  - https://www.npmjs.com/package/@azure/cosmos
  - https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/?view=azure-node-latest
  - https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest
  - https://devblogs.microsoft.com/cosmosdb/announcing-javascript-sdk-v4/
  - https://github.com/Azure/azure-sdk-for-js

- **pg**
  - https://learn.microsoft.com/en-us/azure/cosmos-db/postgresql/quickstart-app-stacks-nodejs
  - https://node-postgres.com
  - https://www.npmjs.com/package/pg

- **mongodb**
  - https://learn.microsoft.com/en-us/azure/cosmos-db/mongodb/vcore/tutorial-nodejs-web-app
  - https://github.com/Azure-Samples/msdocs-azure-cosmos-db-mongodb-mern-web-app
  - https://www.npmjs.com/package/mongodb
  - https://github.com/mongodb/node-mongodb-native

- **@azure/storage-blob**
  - https://www.npmjs.com/package/@azure/storage-blob
  - https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob

---

## Other Links and Documentation

### TypeScript, VSC, GitHub Co-Pilot

- https://www.typescriptlang.org
- https://www.typescriptlang.org/docs/handbook/intro.html
- https://www.typescriptlang.org/docs/
- https://code.visualstudio.com/docs/languages/typescript
- https://code.visualstudio.com/blogs/2023/03/30/vscode-copilot

### Cosmos DB Change-Feed and Azure Functions

- https://learn.microsoft.com/en-us/azure/cosmos-db/change-feed
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-custom-container

### Related Repos and Presentations

- **Cosmos DB, OpenAI, and Vector Search, Python Day**
  - https://github.com/cjoakim/azure-cosmos-db-vector-search-openai-python
- **AltGraph with Cosmos DB NoSQL API**
  - https://github.com/cjoakim/azure-cosmosdb-altgraph
- **Azure Synapse Link**
  - https://github.com/cjoakim/azure-cosmosdb-synapse-link
- **Azure Cognitive Search**
  - https://github.com/cjoakim/azure-cognitive-examples
- **m26-js**
  - https://www.npmjs.com/package/m26-js
  - https://github.com/cjoakim/m26-js
