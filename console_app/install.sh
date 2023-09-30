#!/bin/bash

# Bash script to install and list the npm packages for this app.
#
# Chris Joakim, Microsoft, 2023

rm -rf ./node_modules
rm package-lock.json

mkdir -p ./node_modules
mkdir -p ./tmp

npm install

npm list
