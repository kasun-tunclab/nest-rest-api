FROM node:16.13.1-alpine3.14

WORKDIR /workspace

COPY dist bin

COPY node_modules node_modules

RUN ls

CMD ["node", "bin/main"]