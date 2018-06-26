dApp game with Solidity, Truffle, Ganache

Truffle for Smart-Contract
The first thing I’ll do is set up a Truffle “test-bed” that will allow me to easily test compiling my smart contract.

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
Solidity smart contract for the game
Create a contract called RockPaperSicissors.sol in the contracts directory that was created by truffle init command

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
In real world, you have to pay gas if you call a state-changing function. Reading data out of these “storage” structures is free. Now, you could run Truffle test compile/deploy commands against a real Ethereum node, but that would cost real Ether, plus it’s time-consuming and memory consuming to run your own node if you don’t need to. So we do a quick few install commands:

Compiling & Testing a Smart-Contract
It’s really easy using simple Truffle commands, but first we actually need a local Ethereum node to test against. Ganache CLI, part of the Truffle suite of Ethereum development tools, is the command line version of Ganache, your personal blockchain for Ethereum development.

$ npm install -g ganache-cli (if you don’t have installed ganache yet.)

$ ganache-cli

Listening on localhost:8545 means that we’re ready for test deployment. You’ll need to modify the file /migrations/2_deploy_contracts.js to include the name of your smart-contract, for truffle to know to compile and deploy it. We do this command:

$ truffle compile

If all goes well, you’ll see a message saying it’s “saving artifacts”, and no error messages.

test deployment of your smart-contract onto your ganache node

First, modify truffle.js

module.exports = {
   networks: {
   development: {
   host: "localhost",
   port: 8545,
   network_id: "*" // Match any network id
  }
 }
};
$ truffle migrate

Using network 'development'.

Network up to date.
Whenever you update source code, you need to redeploy it by using —reset option. It would be convenient to do by truffle compile && truffle migrate —reset

￼Screen Shot 2018-04-06 at 7.58.43 AM.jpg

Play the Rock, Paper, Scissors game
You can play it with truffle console by calling functions directly.

List of accounts
web3.eth.accounts
Screen Shot 2018-04-06 at 8.02.35 AM.jpg
￼
First, set dealer and player
RockPaperScissors.deployed().then(function(temp){temp.setDealer(web3.eth.accounts[0], 1000).then(console.log);})
￼Screen Shot 2018-04-06 at 8.04.43 AM.jpg
Now, accounts[0] with address ‘0x64ab94de897cecfbc83e7b703e4a35038d267efc’ is a dealer with 1000 coins.
RockPaperScissors.deployed().then(function(temp){temp.setPlayer(web3.eth.accounts[1], 1000).then(console.log);})
Screen Shot 2018-04-06 at 8.05.50 AM.jpg

Now, accounts[1] with address ‘0x90f82f326db5b3b3ece4f683ff1a28f2e20cb109’ is a player with 1000 coins.

Check the initial fund 1000 coins for both parties
RockPaperScissors.deployed().then(function(temp){temp.getBalanceInEth(web3.eth.accounts[0]).then(console.log);})
RockPaperScissors.deployed().then(function(temp){temp.getBalanceInEth(web3.eth.accounts[1]).then(console.log);})
Screen Shot 2018-04-06 at 8.09.04 AM.jpg
￼

Start a game by calling compare function with option for dealer and player (Rock: 0, Paper: 1, Scissors: 2) with betting amount. For example, following command has dealer got rock, player got paper, and bet 500 coins. Obviously the winner is player. (Remember, Paper can wrap Rock :-) Player will receive 500 coins from dealer’s balances.

RockPaperScissors.deployed().then(function(temp){temp.compare(0, 1, 500).then(console.log);})
￼Screen Shot 2018-04-06 at 8.14.46 AM.jpg

Of course, you can check the balances by calling getBalanceInEth function.
￼
Screen Shot 2018-04-06 at 8.15.38 AM.jpg
You can play the game until one of the parties will lose all fund (bankrupted).
