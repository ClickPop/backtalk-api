FROM node:14.11.0
ARG PORT
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV:-development}
RUN echo "NODE_ENV: ${NODE_ENV:-development}"
WORKDIR /usr/src/app
COPY . .
EXPOSE $PORT
RUN npm install