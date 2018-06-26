# dApp game with Solidity, Truffle, Ganache

`originally published March 2018 as a part of dApp course by Siraj's The School of AI`

__Truffle for Smart-Contract__

The first thing I’ll do is set up a Truffle “test-bed” that will allow me to easily test compiling my smart contract.

```
$ npm install -g truffle
/usr/local/bin/truffle -> /usr/local/lib/node_modules/truffle/build/cli.bundled.js
+ truffle@4.1.5
added 92 packages in 4.008s

$ truffle init
Downloading...
Unpacking...
Setting up...
Unbox successful. Sweet!

Commands:

  Compile:        truffle compile
  Migrate:        truffle migrate
  Test contracts: truffle test
```

__Solidity smart contract for the game__

_Create a contract called RockPaperSicissors.sol in the contracts directory that was created by truffle init command_

```
pragma solidity ^0.4.17;

contract RockPaperScissors {
  // Parameters of the game.
  address public owner;
  address public dealer;
  address public player;

  uint public dealerFund;
  uint public playerFund;

  // Set to true at the end, disallows any change
  bool ended;

  // Events that will be fired on changes.
  event GameState(string winner, uint amount);
  event GameEnded(address winner, uint amount);

  // for MetaCoin
  mapping (address => uint) balances;
	event Transfer(address indexed _from, address indexed _to, uint256 _value);

  /// Create a RockPaperScissors game
  /// You can assign owner to do some admin stuff.
  function RockPaperScissors() public {
    owner = msg.sender;
  }

  function setDealer(address _dealer, uint _fund) public returns (bool success) {
    dealer = _dealer;
    balances[dealer] = _fund;
    return true;
  }

  function setPlayer(address _player, uint _fund) public returns (bool success) {
    player = _player;
    balances[player] = _fund;
    return true;
  }

  /// compare actions to determine winner
  /// 0: rock, 1: paper, 2: scissor
  function compare(uint dealerAction, uint playerAction, uint bettingAmount) public returns (string results){
    if (dealerAction == playerAction) {
      results = 'Tied, play again.';
      GameState(results, bettingAmount);
      return results;
    }

    // dtermine who is winner.
    bool isPlayerWinner = false;
    if (dealerAction == 0) {
      if (playerAction == 1) {
        results = 'Player won!';
        isPlayerWinner = true;
      } else if (playerAction == 2) {
        results = 'Dealer won!';
      }
    } else if (dealerAction == 1) {
      if (playerAction == 0) {
        results = 'Dealer won!';
      } else if (playerAction == 2) {
        results = 'Player won!';
        isPlayerWinner = true;
      }
    } else if (dealerAction == 2) {
      if (playerAction == 0) {
        results = 'Player won!';
        isPlayerWinner = true;
      } else if (playerAction == 1) {
        results = 'Dealer won!';
      }
    }

    GameState(results, bettingAmount);

    // send betting amount
    if (isPlayerWinner) {
      if(sendCoin(dealer, player, bettingAmount)) {
        // continue game
      } else {
        // end of game
        ended = true;
        results = 'Dealer got bankrupted!';
        GameEnded(player, getBalanceInEth(player));
      }
    } else {
      if (sendCoin(player, dealer, bettingAmount)) {
        // continue game
      } else {
        // end of game
        ended = true;
        results = 'Player got bankrupted!';

        GameEnded(dealer, getBalanceInEth(dealer));
      }
    }

    return results;
  }

  function sendCoin(address sender, address receiver, uint amount) public returns(bool sufficient) {
    if (balances[sender] < amount) return false;
    balances[sender] -= amount;
    balances[receiver] += amount;
    Transfer(sender, receiver, amount);
    return true;
  }

  function getBalanceInEth(address addr) public view returns(uint){
    return convert(getBalance(addr), 1);
  }

  function convert(uint amount,uint conversionRate) public pure returns (uint convertedAmount) {
		return amount * conversionRate;
	}

  function getBalance(address addr) public view returns(uint) {
    return balances[addr];
  }
}
```

In real world, you have to pay gas if you call a state-changing function. Reading data out of these “storage” structures is free. Now, you could run Truffle test compile/deploy commands against a real Ethereum node, but that would cost real Ether, plus it’s time-consuming and memory consuming to run your own node if you don’t need to. So we do a quick few install commands:

__Compiling & Testing a Smart-Contract__

It’s really easy using simple Truffle commands, but first we actually need a local Ethereum node to test against. Ganache CLI, part of the Truffle suite of Ethereum development tools, is the command line version of Ganache, your personal blockchain for Ethereum development.

`$ npm install -g ganache-cli (if you don’t have installed ganache yet.)`

`$ ganache-cli`

Listening on localhost:8545 means that we’re ready for test deployment. You’ll need to modify the file /migrations/2_deploy_contracts.js to include the name of your smart-contract, for truffle to know to compile and deploy it. We do this command:

`$ truffle compile`

If all goes well, you’ll see a message saying it’s “saving artifacts”, and no error messages.

test deployment of your smart-contract onto your ganache node

First, modify truffle.js 
```
module.exports = {
   networks: {
   development: {
   host: "localhost",
   port: 8545,
   network_id: "*" // Match any network id
  }
 }
};
```

```
$ truffle migrate
Using network 'development'.

Network up to date.
```

Whenever you update source code, you need to redeploy it by using —reset option. It would be convenient to do by `truffle compile && truffle migrate —reset `

__Play the Rock, Paper, Scissors game__

You can play it with truffle console by calling functions directly. 

1. List of accounts 
web3.eth.accounts
￼
1. Set dealer and player
RockPaperScissors.deployed().then(function(temp){temp.setDealer(web3.eth.accounts[0], 1000).then(console.log);})
￼
Now, accounts[0] with address ‘0x64ab94de897cecfbc83e7b703e4a35038d267efc’ is a dealer with 1000 coins.

RockPaperScissors.deployed().then(function(temp){temp.setPlayer(web3.eth.accounts[1], 1000).then(console.log);})
￼
Now, accounts[1] with address ‘0x90f82f326db5b3b3ece4f683ff1a28f2e20cb109’ is a player with 1000 coins.

Check the initial fund 1000 coins for both parties
RockPaperScissors.deployed().then(function(temp){temp.getBalanceInEth(web3.eth.accounts[0]).then(console.log);})
RockPaperScissors.deployed().then(function(temp){temp.getBalanceInEth(web3.eth.accounts[1]).then(console.log);})
￼

Start a game by calling compare function with option for dealer and player (Rock: 0, Paper: 1, Scissors: 2) with betting amount. For example, following command has dealer got rock, player got paper, and bet 500 coins. Obviously the winner is player. (Remember, Paper can wrap Rock :-) Player will receive 500 coins from dealer’s balances. 
RockPaperScissors.deployed().then(function(temp){temp.compare(0, 1, 500).then(console.log);})
￼

Of course, you can check the balances by calling getBalanceInEth function.
￼

You can play the game until one of the parties will lose all fund (bankrupted).

 

```
$ npm install -g create-react-app


truffle(development)> JSON.stringify(Geekt.abi)
'[{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"constant":false,"inputs":[{"name":"badUser","type":"address"}],"name":"removeUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"badImage","type":"bytes32"}],"name":"removeImage","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"handle","type":"string"},{"name":"city","type":"bytes32"},{"name":"state","type":"bytes32"},{"name":"country","type":"bytes32"}],"name":"registerNewUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"imageURL","type":"string"},{"name":"SHA256notaryHash","type":"bytes32"}],"name":"addImageToUser","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUsers","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"getUser","outputs":[{"name":"","type":"string"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32"},{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllImages","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"userAddress","type":"address"}],"name":"getUserImages","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"SHA256notaryHash","type":"bytes32"}],"name":"getImage","outputs":[{"name":"","type":"string"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]'
truffle(development)> Geekt.address
'0x0a13af482ceea2d6634dfe3be249270d2fb153d3'


$ geth attach ipc://Users/shlee/dvlp/dApp/0Mining/privchain/geth.ipc
Welcome to the Geth JavaScript console!

instance: Geth/v1.8.2-stable/darwin-amd64/go1.10
coinbase: 0x48675b859b6c3785cb2fe3df9c2437c424f7abca
at block: 0 (Wed, 31 Dec 1969 19:00:00 EST)
 datadir: /Users/shlee/dvlp/dApp/0Mining/privchain
 modules: admin:1.0 debug:1.0 eth:1.0 miner:1.0 net:1.0 personal:1.0 rpc:1.0 txpool:1.0 web3:1.0

> personal.listAccounts
["0x48675b859b6c3785cb2fe3df9c2437c424f7abca"]
> web3.eth.coinbase
"0x48675b859b6c3785cb2fe3df9c2437c424f7abca"
> 
```
$ create-react-app app

Success! Created app at /Users/shlee/dvlp/dApp/4Game/rock-paper-scissors-dapp/app
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd app
  yarn start

Happy hacking!



Function state mutability can be restricted to pure
	function convert(uint amount,uint conversionRate) public view returns (uint convertedAmount)

Function declared as pure, but this expression (potentially) reads from the environment or state and thus requires "view".


http://truffleframework.com/tutorials/pet-shop

https://blockgeeks.com/guides/solidity/

￼
￼
