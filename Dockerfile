#  Node.js LTS version
FROM node:18-alpine

# set working directory
WORKDIR /app

# copy package.json
COPY package*.json ./

# install dependencies
RUN npm install

COPY . .

# build
RUN npm run build

# expose port 3000
EXPOSE 7000

# run applicaiton
CMD [ "npm", "run", "start:prod" ]