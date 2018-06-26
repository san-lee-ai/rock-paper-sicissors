import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3'
var ETHEREUM_CLIENT = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var gameABI = [ { constant: false,
    inputs: [ [Object], [Object], [Object] ],
    name: 'sendCoin',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function' },
  { constant: true,
    inputs: [],
    name: 'player',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'view',
    type: 'function' },
  { constant: true,
    inputs: [ [Object] ],
    name: 'getBalanceInEth',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'view',
    type: 'function' },
  { constant: true,
    inputs: [ [Object], [Object] ],
    name: 'convert',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'pure',
    type: 'function' },
  { constant: true,
    inputs: [],
    name: 'dealer',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'view',
    type: 'function' },
  { constant: false,
    inputs: [ [Object], [Object], [Object] ],
    name: 'compare',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function' },
  { constant: true,
    inputs: [ [Object] ],
    name: 'getBalance',
    outputs: [ [Object] ],
    payable: false,
    stateMutability: 'view',
    type: 'function' },
  { inputs: [ [Object], [Object] ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'constructor' },
  { anonymous: false,
    inputs: [ [Object], [Object] ],
    name: 'GameState',
    type: 'event' },
  { anonymous: false,
    inputs: [ [Object], [Object] ],
    name: 'GameEnded',
    type: 'event' },
  { anonymous: false,
    inputs: [ [Object], [Object], [Object] ],
    name: 'Transfer',
    type: 'event' } ]

var gameAddress = '0xbbb2e7cec963b1241b7a9965940853e77f157863'

var byteCode = '0x606060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630b40bd881461008857806348db5f89146101015780637bd703e81461015657806396e4ee3d146101a35780639de2ee21146101e3578063f731955d14610238578063f8b2cb4f146102e6575b600080fd5b341561009357600080fd5b6100e7600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610333565b604051808215151515815260200191505060405180910390f35b341561010c57600080fd5b610114610490565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016157600080fd5b61018d600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506104b6565b6040518082815260200191505060405180910390f35b34156101ae57600080fd5b6101cd60048080359060200190919080359060200190919050506104d2565b6040518082815260200191505060405180910390f35b34156101ee57600080fd5b6101f66104df565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561024357600080fd5b61026b6004808035906020019091908035906020019091908035906020019091905050610504565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ab578082015181840152602081019050610290565b50505050905090810190601f1680156102d85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102f157600080fd5b61031d600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061087d565b6040518082815260200191505060405180910390f35b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156103855760009050610489565b81600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190505b9392505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006104cb6104c48361087d565b60026104d2565b9050919050565b6000818302905092915050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61050c6108c6565b6000838514156105fa576040805190810160405280601181526020017f546965642c20706c617920616761696e2e00000000000000000000000000000081525091507f8636accafe6e543252248bfbd3f92b39b3f233272c8670fda09bb18edb80e2f582846040518080602001838152602001828103825284818151815260200191508051906020019080838360005b838110156105b757808201518184015260208101905061059c565b50505050905090810190601f1680156105e45780820380516001836020036101000a031916815260200191505b50935050505060405180910390a1819150610875565b600090506000851415610699576001841415610651576040805190810160405280600b81526020017f506c6179657220776f6e21000000000000000000000000000000000000000000815250915060019050610694565b6002841415610693576040805190810160405280600b81526020017f4465616c657220776f6e2100000000000000000000000000000000000000000081525091505b5b6107cd565b60018514156107345760008414156106e8576040805190810160405280600b81526020017f4465616c657220776f6e21000000000000000000000000000000000000000000815250915061072f565b600284141561072e576040805190810160405280600b81526020017f506c6179657220776f6e210000000000000000000000000000000000000000008152509150600190505b5b6107cc565b60028514156107cb576000841415610787576040805190810160405280600b81526020017f506c6179657220776f6e210000000000000000000000000000000000000000008152509150600190506107ca565b60018414156107c9576040805190810160405280600b81526020017f4465616c657220776f6e2100000000000000000000000000000000000000000081525091505b5b5b5b5b7f8636accafe6e543252248bfbd3f92b39b3f233272c8670fda09bb18edb80e2f582846040518080602001838152602001828103825284818151815260200191508051906020019080838360005b8381101561083657808201518184015260208101905061081b565b50505050905090810190601f1680156108635780820380516001836020036101000a031916815260200191505b50935050505060405180910390a18191505b509392505050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6020604051908101604052806000815250905600a165627a7a72305820810f0744f1f898619d176ea82cf9e08fca4a8da91672fcc41215f43602b36ed70029'

var gameContract = ETHEREUM_CLIENT.eth.contract(gameABI, byteCode, { from: ETHEREUM_CLIENT.eth.accounts[1], gas: 3000000, gasPrice: 5 });

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerFund: null,
      delaerFund: null,
      results: ''
    }
  }

  componentWillMount() {
      console.log(ETHEREUM_CLIENT, gameContract, ETHEREUM_CLIENT.eth.accounts[0])

      //ETHEREUM_CLIENT.eth.contract.deployed().then(function(temp) { temp.getBalanceInEth(ETHEREUM_CLIENT.eth.accounts[0]).then(console.log);})

      // const deployed = gameContract.new({
      //    from: ETHEREUM_CLIENT.eth.accounts[0],
      //    data: byteCode,
      //    gas: 3000000,
      //    gasPrice: 5
      // }, (error, contract) => {
      //     if (error) {
      //       console.log('deployed', error);
      //     } else {
      //var results = gameContract.at(ETHEREUM_CLIENT.eth.accounts[0]).getBalanceInEth(ETHEREUM_CLIENT.eth.accounts[0])
            var results = gameContract.getBalanceInEth(ETHEREUM_CLIENT.eth.accounts[0])
            this.setState({
              results
            })
      //     }
      //   }
      // )


      // this.props.promise.then(value => {. this.setState({value});.

      // var data = geektContract.getUsers()
      // this.setState({
      //   firstNames: String(data[0]).split(','),
      //   lastNames: String(data[1]).split(','),
      //   ages: String(data[2]).split(',')
      // })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {this.state.results}
        </p>
      </div>
    );
  }
}

export default App;
