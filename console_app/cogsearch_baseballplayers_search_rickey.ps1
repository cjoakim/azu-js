# Search the baseballplayers index, for just Rickey Henderson.
#
# Chris Joakim, Microsoft

New-Item -ItemType Directory -Force -Path .\tmp | out-null

del tmp\*search*.json

python cogsearch_main.py vector_search_like baseballplayers henderi01

echo 'done'
