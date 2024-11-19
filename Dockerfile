#  Node.js LTS version
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# copy package.json
COPY package*.json ./

# install dependencies
RUN npm install

COPY . .

# build nest applicaion
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

COPY .env ./

EXPOSE 3000

CMD [ "node", "dist/main.js" ]