# azu-js

- Reusable code, implemented in TypeScript, for rapid application Development in **Azure**
- Augments the official Cosmos DB SDK for JavaScript; https://github.com/Azure/azure-sdk-for-js
- The focus is on the **Azure Cosmos DB, Azure OpenAI, Azure Cognitive Search, and Azure Blob Storage**
- See the unit tests and the console_app/ directory for example use of the azu-js package
- See the azu-js typings and interfaces documentation at https://github.com/cjoakim/azu-js/tree/main/docs
- The npm package is available here: https://www.npmjs.com/package/azu-js?activeTab=readme
- Reference Web app at https://github.com/cjoakim/azure-cosmos-db-ts-web
- Developed by Chris Joakim, Azure Cosmos DB Global Black Belt

---

## azu-js Current Implementation State and Roadmap

| Functionality                   | v1.0.1 Support  | Codebase State       | Implementation Class   |
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

Your application package.json file should include the following:

```
    "dependencies": {
        "@azure/cosmos": "4.0.0",
        "@azure/openai": "^1.0.0-beta.6",
        "@azure/storage-blob": "^12.16.0",
        "axios": "^1.5.1",
        "uuid": "^9.0.1"
        "azu-js": "1.0.1"
    },
```

### Version History

| Version |    Date    | Changes                                                         |
| ------- | ---------- | --------------------------------------------------------------- |
|  1.0.1  | 2023/10/21 | Added CosmosDBUtil#patchDocumentAsync                           |
|  1.0.0  | 2023/10/16 | First GA release with new TypeScript codebase                   |
|  0.1.x  | 2017       | Alpha versions, implemented in JavaScript                       |
