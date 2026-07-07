FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install -g @expo/ngrok

RUN npm install

COPY . .

EXPOSE 8081
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["npx", "expo", "start", "--tunnel"]
