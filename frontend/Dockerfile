FROM node:24

WORKDIR /cinemind/frontend

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npx", "vite", "--host" ]