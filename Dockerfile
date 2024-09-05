# Posso usar qualquer imagem do Node.js, mas a versão 20 é uma das mais recente
FROM node:18

# libs que são necessárias para o Puppeteer funcionar e abrir o chrome no container
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

# Definindo o diretório de trabalho no container
WORKDIR /usr/src/app

# Copiando os arquivos package.json e package-lock.json para o container (onde estão contidos os módulos do Node.js)
COPY package*.json ./

# Instalando as dependências do Node.js e Puppeteer
RUN npm install

# Copiando o restante dos arquivos da aplicação para o container
COPY . .

# Expondo a porta que o app utiliza
EXPOSE 3000

# Comando para iniciar a aplicação (script que está no package.json)
CMD [ "npm", "start" ]
