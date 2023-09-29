
# PowerShell script to install and list the npm packages for this app.
#
# Chris Joakim, Microsoft, 2023

Remove-Item -Path "node_modules" -Confirm -Recurse -Force | out-null
Remove-Item package-lock.json | out-null

New-Item -ItemType Directory -Force -Path .\tmp | out-null

npm install

npm list
