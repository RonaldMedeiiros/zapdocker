const fs = require("fs");
const wppconnect = require("@wppconnect-team/wppconnect");
const OpenAI = require('openai');
require('dotenv').config();
const SESSION_FILE_PATH = "./sessoes/whatsapp-session.json";
const express = require('express');
const qrcode = require('qrcode');
const app = express();
const port = 3000;

let qrCodeData = '';
let sessionConnected = false;

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const conversations = {};
const sessionData = {};

wppconnect
    .create({
        session: "minha-sessao",
        useChrome: true,
        catchQR: (base64Qrimg, asciiQR, attempts, urlCode) => {
          qrCodeData = base64Qrimg; // Atualiza a variável qrCodeData
          sessionData.urlCode = urlCode;
          return urlCode;
        },
        statusFind: (statusSession, session) => {
          console.log('Status Session: ', statusSession);
          if (statusSession === 'isLogged') {
              sessionConnected = true;
          }
        },
        headless: true,
        devtools: false,
        useChrome: true,
        debug: false,
        logQR: true,
        browserWS: '',
        autoClose: 120000, // Atualiza o QR code a cada 30 segundos
        disableSpins: true,
        disableWelcome: true,
        updatesLog: true,
        persistentSession: true,
        sessionDataPath: SESSION_FILE_PATH,
        puppeteerOptions: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Flags de segurança
        }
      })
    .then((client) => start(client))
    .catch((error) => console.error(error));

async function gptmsg(msg) {
    if (msg.from.endsWith('@g.us') && !msg.body.includes('@5567935056680')) {
        return;
    }
    
    let messages = conversations[msg.from] || [
        { role: "system", content: `
                Você é um assistente especializado em TI.
                Explique de forma objetiva e concisa, em até 200 tokens, os conceitos de virtualização e containers. Inclua as seguintes informações:

                1. Virtualização: Defina o que é virtualização, mencionando o papel dos hipervisores.
                2. Benefícios: Destaque dois benefícios principais da virtualização.
                3. Containers: Defina o que são containers e como eles se diferenciam da virtualização.
                4. Vantagens dos Containers: Mencione duas vantagens dos containers em relação à virtualização.

                Limite sua resposta a 200 tokens, mantendo o foco apenas nesses tópicos.
            ` }
    ];

    
    messages.push({ role: "user", content: msg.body });

    let completion;
    let isUnique = false;

    while (!isUnique) {
        completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4o-mini",
        });

        
        isUnique = !messages.some(message => message.role === "assistant" && message.content === completion.choices[0].message.content);

        if (isUnique) {
            messages.push({ role: "assistant", content: completion.choices[0].message.content });
        }
    }

    conversations[msg.from] = messages;
    console.log(messages);

    return completion.choices[0].message.content; 
}

function start(client) {
  client.onMessage(async (message) => {
      // Filtra para evitar enviar para listas de transmissão, status ou newsletters
      if (message.from === 'status@broadcast' || message.from.includes('@g.us') || message.from.includes('@broadcast') || message.from.includes('@newsletter')) {
          return; // Ignora mensagens vindas do status, grupos ou listas de transmissão
      }

      const gptResponse = await gptmsg(message);

      if (!gptResponse) {
          return;
      }

      client.startTyping(message.from);

      setTimeout(async () => {

          // Verifica se a mensagem de destino é para um contato individual
          if (message.from.endsWith('@c.us')) {
              client.sendText(message.from, gptResponse)
                  .then((result) => {
                      console.log('Resultado: ', result);
                  })
                  .catch((erro) => {
                      console.error('Erro ao enviar: ', erro);
                  });
          }

          setTimeout(() => {
              client.stopTyping(message.from);
          }, 3000);
      }, 2000);
  });
}

// Servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para verificar o status da sessão
app.get('/session-status', (req, res) => {
    if (sessionConnected) {
        res.send('Sessão conectada com sucesso!');
    } else {
        res.status(404).send('Sessão não conectada.');
    }
});

// Configura a rota para exibir o QR code
app.get('/qrcode', (req, res) => {
  if (qrCodeData) {
      res.send(`<img src="${qrCodeData}" alt="QR Code">`);
  } else {
      res.send('QR Code ainda não gerado.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});