# PowerShell script to start the Express server locally.
# Chris Joakim, Microsoft, 2023

$env:DEBUG='microsvc1:*'

node ./bin/www
