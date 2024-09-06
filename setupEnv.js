const fs = require('fs');
const readline = require('readline');

// Caminho do arquivo .env
const envFilePath = './.env';

// Função para criar o .env
function createEnvFile(apiKey) {
    const envContent = `OPENAI_API_KEY=${apiKey}\n`;
    fs.writeFileSync(envFilePath, envContent, { flag: 'w' });
    console.log('Arquivo .env criado com sucesso!');
}

// Função para perguntar ao usuário a chave da API
async function promptForApiKey() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Por favor, insira sua OpenAI API Key: ', (apiKey) => {
            rl.close();
            resolve(apiKey);
        });
    });
}

// Função principal de verificação e criação do .env
async function setupEnv() {
    if (fs.existsSync(envFilePath)) {
        console.log('Arquivo .env já existe. Pulando a criação.');
    } else {
        console.log('Arquivo .env não encontrado.');
        const apiKey = await promptForApiKey();
        createEnvFile(apiKey);
    }
}

setupEnv();
