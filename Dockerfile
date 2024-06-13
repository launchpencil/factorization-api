FROM node
WORKDIR /app
COPY index.js .
COPY package.json .
RUN npm i
CMD ["node", "index.js"]