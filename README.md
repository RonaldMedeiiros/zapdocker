# Aplicação Node.js com Docker

## Descrição
Esta aplicação é uma solução baseada em Node.js que utiliza o framework wppconnect para integração com o WhatsApp. Além disso, ela usa a API da OpenAI para responder automaticamente a mensagens, fornecendo respostas geradas por inteligência artificial.

## Ferramentas Utilizadas
- **Node.js**: Plataforma JavaScript no lado do servidor.
- **WppConnect**: Biblioteca para automação do WhatsApp Web.
- **OpenAI API**: Integração com o modelo GPT para geração de respostas.
- **Docker**: Plataforma de containerização que garante a consistência da aplicação em diferentes ambientes.

## Docker

### Construção da Imagem
O Dockerfile define como a imagem da aplicação será construída. Um exemplo de Dockerfile:

```Dockerfile
FROM node:18

RUN apt-get update && apt-get install -y chromium

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
```
Para construir a imagem Docker da aplicação, use o seguinte comando:

```bash
docker build -t zapdocker/teste-ronaldo .
```

## Execução do Container
Após a construção da imagem, o container pode ser iniciado com o comando:

```bash
docker run -d -p 3000:3000 --name teste-ronaldo-container zapdocker/teste-ronaldo
```
Isso cria e executa o container com o nome teste-ronaldo-container, que estará acessível na porta 3000.

Vantagens do Docker
Isolamento: Cada aplicação roda em um container isolado, sem interferir com outras.
Consistência: Funciona da mesma forma em qualquer ambiente, seja em desenvolvimento, teste ou produção.
Portabilidade: Pode ser facilmente transferida e executada em diferentes máquinas.
Conclusão
O Docker facilita o desenvolvimento e a implantação da aplicação, garantindo que ela rode de forma consistente em diferentes ambientes, simplificando o gerenciamento e escalabilidade.