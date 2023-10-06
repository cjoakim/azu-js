
# PowerShell script to compile and unit-test this app.
#
# Chris Joakim, Microsoft, 2023

del tmp\test*
del tmp\down*

npm run build

npm run test
