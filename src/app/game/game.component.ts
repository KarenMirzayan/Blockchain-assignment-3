declare const window: any;

import {Component, OnInit} from '@angular/core';
import {Web3Service} from "../web3.service";
import {CommonModule} from "@angular/common";
import { ChangeDetectorRef } from '@angular/core';
import { History} from "./history";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  public currentAccount: string | null = null;
  public gameResult: string | null = null;
  public outcome: string | null = null;
  public processing = false;

  public history: History[] = [];
  public total: number = 0;

  constructor(private web3Service: Web3Service, private cdRef: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.connectWallet();
  }


  async play(move: number) {
    this.processing = true;
    if (!this.currentAccount) {
      alert('Please connect your wallet first!');
      this.processing = false;
      return;
    }

    try {
      const receipt = await this.web3Service.playGame(move, this.currentAccount);
      this.processGameResult(receipt);
    } catch (error) {
      console.error('Error playing the game', error);
    }
    this.processing = false;
  }

  async connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.currentAccount = accounts[0];

        this.cdRef.detectChanges();

        console.log('Connected account:', this.currentAccount);
      } catch (error) {
        console.error('User rejected the connection', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  }

  processGameResult(receipt: any) {
    const event = receipt.events.GameResult;
    if (event) {
      let { playerMove, houseMove, result } = event.returnValues;
      const playerMoveNum = Number(playerMove);
      const houseMoveNum = Number(houseMove);

      const moves = ["rock", "paper", "scissors"]
      this.gameResult = `You played ${moves[playerMoveNum]}, house played ${moves[houseMoveNum]}. Result: ${result}`;

      let amount = 0;
      if (result == "Draw") {
        this.outcome = "You have been refunded"
        amount = 0;
      }
      else if (result == "Win") {
        this.outcome = "You won 0.01 ETH"
        amount = 0.01;
      }
      else if (result == "Lose") {
        this.outcome = "You lost 0.01 ETH"
        amount = -0.01;
      }

      this.history.push(
        {
          move: moves[playerMoveNum],
          result: result,
          amount: amount
        }
      )

      this.total = this.calcTotal()
    }
  }

  public calcTotal(): number {
    return this.history.reduce((a, b) => {
      return a + b.amount
    }, 0);
  }

  // async getContractBalance() {
  //   this.contractBalance = await this.web3Service.getContractBalance();
  // }
  protected readonly Math = Math;
}
