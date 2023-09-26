
# PowerShell script to install and list the npm packages for this app.
#
# Chris Joakim, Microsoft, 2023

New-Item -ItemType Directory -Force -Path .\tmp | out-null

npm install

npm list
