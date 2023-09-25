#!/bin/bash

# Bash script to install and list the npm packages for this app.
#
# Chris Joakim, 2023

mkdir -p ./tmp

npm install

npm list
