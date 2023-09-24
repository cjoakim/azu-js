#!/bin/bash

tsc

node dist/index.js files > tmp/files.txt

cat tmp/files.txt

