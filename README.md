# azu-js

Project bootstrapping code, implemented in TypeScript, for fast Development in Azure.
The focus is on **Azure Cosmos DB, Azure Blob Storage, and Azure OpenAI**.

The intent of this package is to:
- Provide Azure and Cosmos DB users a fast and working on-ramp codebase to use
- Provide a reusable codebase for myself, for various Cosmos DB projects and demos
  - The above two are the **azu-js package** itself, at https://www.npmjs.com/package/azu-js
- Provide example apps for customers, with simple and reliable deployment in minutes
  - These will be in this GitHub repo, but not embedded into the azu-js package at npmjs.com

## Npm Dependencies Links

- **@azure/cosmos**
  - https://www.npmjs.com/package/@azure/cosmos
  - https://learn.microsoft.com/en-us/javascript/api/@azure/cosmos/?view=azure-node-latest
  - https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob/?view=azure-node-latest
  - https://devblogs.microsoft.com/cosmosdb/announcing-javascript-sdk-v4/
  - https://github.com/Azure/azure-sdk-for-js

- **@azure/storage-blob**
  - https://www.npmjs.com/package/@azure/storage-blob
  - https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/storage/storage-blob

## Project Roadmap

- **azu-js package functionality**
  - Add support for **Azure OpenAI**
    - https://learn.microsoft.com/en-us/javascript/api/overview/azure/openai-readme?view=azure-node-preview
  - Add support for the **Cosmos DB PostgreSQL API**
  - Add support for the **Cosmos DB Mongo vCore API**
  - Generally focus on the free Azure Services for Developers and startups
    - https://azure.microsoft.com/en-us/pricing/free-services
  - All provisioning functionality is out-of-scope; use the az CLI, ARM, Bicep, etc. instead

- **Create example applications that use the azu-js package**
  - The example apps will only be in this GitHub repo, and NOT embedded in the azu-js npm package
  - Create a non-trivial containerized **Express web application** for deployment to:
    - **Azure App Service, Azure Container Instances (ACI), and Azure Container Apps (ACA)**
    - Provide Docker containerization scripts
    - Provide a public image on DockerHub
    - Provide az CLI deployment scripts
  - Add an example **Azure Function** triggered by the Cosmos DB Change-Feed
  - Intented users of these apps are both customers and Microsoft teammates
