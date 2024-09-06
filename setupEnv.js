const fs = require('fs');
const readline = require('readline');

const envFilePath = './.env';

function createEnvFile(apiKey) {
    const envContent = `OPENAI_API_KEY=${apiKey}\n`;
    fs.writeFileSync(envFilePath, envContent, { flag: 'w' });
    console.log('Arquivo .env criado com sucesso!');
}

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
