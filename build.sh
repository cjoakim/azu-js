#!/bin/bash

# Bash script to compile and unit-test this app.
#
# Chris Joakim, Microsoft, 2023

rm tmp/*.*

npm run build

npm run test
