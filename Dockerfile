FROM node:16.13.1-alpine3.14

WORKDIR /workspace

COPY package.json yarn.lock /workspace/

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start:prod"]