
# PowerShell script to install and list the npm packages for this app.
#
# Chris Joakim, Microsoft, 2023

del package-lock.json
del node_modules
del tmp 

# C:\Users\chjoakim\AppData\Local\npm-cache\_logs\2023-09-28T21_35_12_397Z-debug-0.log

copy ..\..\package-console.json .\package.json

New-Item -ItemType Directory -Force -Path .\tmp | out-null

npm install

npm list
