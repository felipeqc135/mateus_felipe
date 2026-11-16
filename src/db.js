require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function conectar() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log('Conectado ao MongoDB!');
  }
  return client.db('meu_banco');
}

module.exports = { conectar, client };
