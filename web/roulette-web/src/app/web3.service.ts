import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
const Web3 = require('web3');
var Contract = require('web3-eth-contract');


declare let require: any;
declare let window: any;

export class Web3Service{
    private web3: any;
    private chainId: any;
    private networkId: any;
    // private contracts: {};
    public activeAccount: any; // tracks what account address is currently used.
    public accounts = []; // metamask or other accounts

    /** this Subject is like a Event fired. When wallet address (account) is changed then this gets fired. 
    *   we can use something similar to track other events. 
    */ 

    private accountChangeSubject = new BehaviorSubject<string>("");
    accountChanged = this.accountChangeSubject.asObservable();

    constructor(){
        if(window.ethereum === undefined){
            alert('Non-Ethereum browser detected. Install Metamask');
        } else {
            if (typeof window.web3 !== 'undefined') {
                this.web3 = window.web3.currentProvider;
                console.log('EthService :: constructor :: window.web3 is set');
            } else {
                this.web3 = new Web3.providers.HttpProvider('http://localhost:7545');
                console.log('EthService :: constructor :: window.ethereum web3 http provider set');
            }
            console.log('Web3Service :: constructor :: this.web3');
            console.log(this.web3);
            window.web3 = new Web3(window.ethereum);
            
        }
    }

    public async connectToMetaMask(){
        const self: this = this;

        self.chainId = await window.ethereum.request({
            method: 'eth_chainId'
        });

        self.networkId = await window.ethereum.request({
            method: 'net_version'
        });

        console.log("Chain ID: " + self.chainId + ", network ID: " + self.networkId)

        await window.ethereum.request({method: 'eth_requestAccounts'}).then((data: any)=>{
            console.log("accounts", data);
        });
    }

}