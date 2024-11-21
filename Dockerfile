FROM node:18-alpine

# working directory
WORKDIR /app

COPY package*.json ./

# install dependency
RUN npm install 

# copy application files
COPY . .

RUN npm run build

EXPOSE 8000

# run application
CMD [ "npm", "run", "start:prod" ]