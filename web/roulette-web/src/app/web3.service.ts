/**by Dinesh Selvam -  PheoDScop#3470*/
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
const Web3 = require('web3');
var Contract = require('web3-eth-contract');

// Import contract abi (json)
import CasinoLibrary from '../assets/CasinoLibrary.json';
import RouletteSpin from '../assets/RouletteSpinCasino.json';

declare let require: any;
declare let window: any;

export class Web3Service{
    private web3: any;
    private chainId: any;
    private networkId: any;
    // private contracts: {};
    public activeAccount: any; // tracks what account address is currently used.
    public accounts = []; // metamask or other accounts

    public RouletteSpinCasinoInstance: any;
    public CasinoLibraryInstance: any;

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
            Contract.setProvider(this.web3);
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
            this.activeAccount = data[0];
        }).catch((err: any)=>{
            console.log("Account Request failed", err);
        }).then(()=>{

            // read contract abi
            try {
                // Get the contract instance.
                // let deployedNetwork = RouletteSpin.networks[self.networkId];

                self.RouletteSpinCasinoInstance = new Contract(RouletteSpin.abi, '0x9A3F1D93e36C1A6915B170f910F377A1896C92cB');

                console.log("Roulette Instance: ",self.RouletteSpinCasinoInstance);

                // self.RouletteSpinCasinoInstance.methods.balanceOf(self.activeAccount).call().then(
                //     function(result: any){
                //         console.log("balanceOf", result);
                //         return result;
                //     }
                // )

                // self.CasinoLibraryInstance = new Web3Contract(CasinoLibrary.abi, '0x922FB30799FeA1A6992554Bc3d5991cB13665FEf');
                // console.log("CasinoLibrary Instance: ",self.CasinoLibraryInstance);

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Failed to load web3, accounts contracts. Check console for details.`);
                console.log(error);
            }
        });
    }

    /**RouletteSpin Casino methods */

    public mint(userAddress: string, amount: number){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.mint(userAddress, amount).send().then((result: any)=>{
            // console.log("mint called by owner of RouletteSpinCasino", result);
            return result;
        })
    }

    public publicMint(){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.publicMint().send({from: this.activeAccount}).then((result: any)=>{
            // console.log("publicMint", result);
            return result;
        })
    }

    public mintTable(amount: number){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.mintTable(amount).send({from:this.activeAccount }).then((result: any)=>{
            // console.log("new table address", result);
            return result;
        })
    }

    public getTables(){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.getTables().call().then((result: any)=>{
            // console.log("all tables", result);
            return result;
        })
    }

    public deposit(fromPlayer: string, amount: number){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.deposit(fromPlayer, amount).send({from:this.activeAccount}).then((result: any)=>{
            // console.log("deposit from player and amount", result);
            return result;
        })
    }

    public fund(tableaddress: string, amount: number){
        const self: this = this;
        return self.RouletteSpinCasinoInstance.methods.fund(tableaddress, amount).send({from:this.activeAccount}).then((result: any)=>{
            // console.log("fund table with amount", result);
            return result;
        })
    }

    public async balanceOf(){
        const self: this = this;
        // const result = await  self.RouletteSpinCasinoInstance.methods.balanceOf(this.activeAccount).send({from:this.activeAccount});

        // return result;

      console.log({contract: self.RouletteSpinCasinoInstance, account: this.activeAccount});
        return self.RouletteSpinCasinoInstance.methods.balanceOf(this.activeAccount).call()
            .then(
                function(result: any){
                    // console.log("balanceOf", result);
                    return result;
                }
            )
    }

}
