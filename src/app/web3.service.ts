declare const window: any;

import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: Web3;
  private contract: any;
  private contractABI: any = [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "enum RockPaperScissors.Move",
          "name": "playerMove",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "enum RockPaperScissors.Move",
          "name": "houseMove",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "result",
          "type": "string"
        }
      ],
      "name": "GameResult",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "enum RockPaperScissors.Move",
          "name": "_playerMove",
          "type": "uint8"
        }
      ],
      "name": "playGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "betAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]


  constructor() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      // window.ethereum.request({ method: 'eth_requestAccounts' });
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider(environment.bnbTestnet));
    }
    this.contract = new this.web3.eth.Contract(this.contractABI, environment.contractAddress);

    this.checkConnection();
  }


  private async checkConnection() {
    try {
      const isConnected = await this.web3.eth.net.isListening();
      console.log('Web3 is connected:', isConnected);
    } catch (error) {
      console.error('Error checking Web3 connection:', error);
    }
  }

  public async playGame(playerMove: number, fromAddress: string) {
    const betAmount = this.web3.utils.toWei('0.01', 'ether');

    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      const gasLimit = 200000;

      const transaction = await this.contract.methods.playGame(playerMove).send({
        from: fromAddress,
        value: betAmount,
        gasPrice: gasPrice,
        gas: gasLimit
      });

      console.log('Transaction successful:', transaction);
      return transaction;
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please check your wallet or try again later.');
    }
  }

  public async getContractBalance() {
    return await this.contract.methods.getContractBalance().call();
  }


}
