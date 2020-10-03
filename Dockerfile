FROM node:14.11.0

WORKDIR /usr/src/app
COPY . .
RUN npm install
EXPOSE 5000
