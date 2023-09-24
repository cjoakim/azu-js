FROM node:18-alpine

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/bin

WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]


# Docker Commands:
# docker build -t cjoakim/espresso . 
# docker scout quickview
# docker image ls cjoakim/espresso:latest
# docker run --rm cjoakim/espresso:latest ls -alR > tmp/docker-container-contents.txt
# docker run -d -e PORT=3000 -p 3000:3000 cjoakim/espresso:latest
# docker ps
# docker stop -t 2 86b125ed43e5  (where 86b125ed43e5 is the CONTAINER ID from 'docker ps')

# Docker Hub:
# docker push cjoakim/espresso:latest

# Azure Container Registry:
# az acr login --name youracr
# docker tag cjoakim/espresso:latest cjoakimacr.azurecr.io/espresso:latest
# docker push youracr.azurecr.io/espresso:latest
# az acr repository list --name youracr --output table
