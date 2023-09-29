#!/bin/bash

# Bash script to execute the various command-line functions of this app.
#
# Chris Joakim, Microsoft, 2023

tsc

rm tmp/*.*

node dist/index.js files        > tmp/files.txt
node dist/index.js storage      > tmp/storage.txt
node dist/index.js embeddings   > tmp/embeddings.txt
node dist/index.js cosmos_nosql > tmp/cosmos_nosql.txt
node dist/index.js cosmos_mongo > tmp/cosmos_mongo.txt
node dist/index.js cosmos_pg    > tmp/cosmos_pg.txt

cat tmp/files.txt
cat tmp/storage.txt
cat tmp/embeddings.txt
cat tmp/cosmos_nosql.txt
cat tmp/cosmos_mongo.txt
cat tmp/cosmos_pg.txt
