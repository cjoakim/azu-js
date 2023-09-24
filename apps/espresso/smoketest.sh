#!/bin/bash

# bash script to invoke the microservice endpoints for 'smoke testing'.
# Chris Joakim, Microsoft, 2023

rm tmp/smoketest*

curl -v http://localhost:3001/heartbeat     > tmp/smoketest_heartbeat.json
sleep 1

curl -v http://localhost:3001/heartbeat/env > tmp/smoketest_heartbeat_env.json
sleep 1

curl -v http://localhost:3001/people/henderi01/person   > tmp/smoketest_people_person.json
sleep 1

curl -v http://localhost:3001/people/henderi01/batting  > tmp/smoketest_people_batting.json
sleep 1 

curl -v http://localhost:3001/people/henderi01/pitching > tmp/smoketest_people_pitching.json
sleep 1

curl -v http://localhost:3001/people/henderi01/alldocs  > tmp/smoketest_people_alldocs.json
sleep 1

ls -al tmp/ | grep smoketest

echo 'done'
