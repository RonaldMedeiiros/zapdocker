
FROM node:18


RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 3000


CMD [ "bash", "-c", "if [ -f .env ]; then echo '.env já existe. Iniciando a aplicação...'; npm start; else echo '.env não encontrado. Criando o .env...'; node setupEnv.js && npm start; fi" ]
