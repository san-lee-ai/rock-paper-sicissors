module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      // from: "0x4a012fce65d7f1fbe2ecaa4a0bac8558495a3fcb",
      gas: 2000000
    }
  }
};
