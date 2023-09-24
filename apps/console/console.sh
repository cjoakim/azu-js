#!/bin/bash

tsc

node dist/index.js files > tmp/files.txt

node dist/index.js embeddings > tmp/embeddings.txt

cat tmp/files.txt

cat tmp/embeddings.txt

