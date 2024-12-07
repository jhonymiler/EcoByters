module.exports = {
  networks: {
    development: {
      host: "ganache", // Endereço do Ganache
      port: 8545,           // Porta padrão do Ganache
      network_id: "*",      // Qualquer network id
      gas: 0,         // Limite de gas
      gasPrice: 0 // Preço do gas
    },
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    },
  },
};
