# Delete and recreate the baseballplayers indexing.
#
# Note: delete in the sequence of indexer, index, datasource
# but recreate in the opposite sequence of datasource, index, indexer
#
# Chris Joakim, Microsoft, 2023

Write-Output 'deleting output tmp/ files ...'
New-Item -ItemType Directory -Force -Path .\tmp | out-null
del tmp\*.*

Write-Output '============================================================'
node dist/main.js search delete_indexer baseballplayers > tmp/search_delete_indexer.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search delete_index baseballplayers > tmp/search_delete_index.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search delete_datasource cosmosdb-nosql-dev-baseballplayers > tmp/search_delete_datasource.txt
sleep 30

Write-Output '============================================================'
node dist/main.js search create_cosmos_nosql_datasource AZURE_COSMOSDB_NOSQL_ACCT AZURE_COSMOSDB_NOSQL_RO_KEY1 dev baseballplayers > tmp/search_create_datasource.txt
sleep 10

Write-Output '============================================================'
node dist/main.js search create_index baseballplayers baseballplayers_index.json > tmp/search_create_index.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search create_indexer baseballplayers baseballplayers_indexer.json > tmp/search_create_indexer.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search get_indexer_status baseballplayers > tmp/search_get_indexer_status.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search list_datasources > tmp/search_list_datasources.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search list_indexes > tmp/search_list_indexes.txt
sleep 5

Write-Output '============================================================'
node dist/main.js search list_indexers > tmp/search_list_indexers.txt

echo 'done'
