/**by Dinesh Selvam -  PheoDScop#3470*/
import { Injectable, OnInit } from "@angular/core";
import { BehaviorSubject, reduce } from "rxjs";
const Web3 = require('web3');
var Contract = require('web3-eth-contract');

/**
 * Import contract abi (json) from 
 * Casino Library, TableNFT
 * RandomNumberConsumer, RouleteeSpinCasino, RouletteTable
*/
import CasinoLibrary from '../assets/CasinoLibrary.json';
import RandomNumberConsumer from '../assets/RandomNumberConsumer.json';
import RouletteSpinCasino from '../assets/RouletteSpinCasino.json';
import RouletteTable from '../assets/RouletteTable.json';
import TableNFT from '../assets/TableNFT.json';

declare let require: any;
declare let window: any;

export class Web3Service {
    // web3 provider vars
    private web3: any;
    private chainId: any;
    private networkId: any;

    public activeAccount: any; // tracks what account address is currently used.
    public accounts = []; // metamask or other accounts address


    public CasinoLibraryInstance: any;
    public RandomNumberInstance: any;
    public RouletteSpinInstance: any;
    public RouletteTableInstance: any;
    public TableNftInstance: any;

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
                console.log('Constructor :: window.web3 - Metamask is set');
            } else {
                this.web3 = new Web3.providers.HttpProvider('http://localhost:7545');
                console.log('Constructor :: window.ethereum web3 HTTP provider set');
            }
            console.log(this.web3);
            window.web3 = new Web3(window.ethereum);
            Contract.setProvider(this.web3);
        }
    }

    public accountChecker(){
        const self: this = this;

        let accountCheckInterval = setInterval(function () {
            if (self.activeAccount != window.web3.currentProvider.selectedAddress) {
                self.updateActiveAccount();
            }
        }, 100);
    }

    public updateActiveAccount() {

        if(window.web3.currentProvider.selectedAddress !== undefined){
            this.activeAccount = window.web3.currentProvider.selectedAddress;
            this.accountChangeSubject.next(window.web3.currentProvider.selectedAddress);
        }else{
            // call disconnected subject 
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

        await window.ethereum.request({method: 'eth_requestAccounts'}).then((data: any)=>{
            console.log("accounts", data);
            this.activeAccount = data[0];

            console.log("selected add ", window.web3.currentProvider.selectedAddress);

            //set up Behaviour Subject to detect changes to connected account. 
            self.accountChangeSubject.next(window.web3.currentProvider.selectedAddress);

            self.accountChecker();

        }).catch((err: any)=>{
            console.log("Account Request failed", err);
        }).then(()=>{

            // read contract abi
            try {
                
                // contracts deployed address need to be manually added to the below instance. Hook up a envVar file from where you can strip the contract address. 
                // self.CasinoLibraryInstance = new Contract(CasinoLibrary.abi, '0x9A3F1D93e36C1A6915B170f910F377A1896C92cB');
                // console.log("CasinoLibraryInstance: ",self.CasinoLibraryInstance);

                self.RandomNumberInstance = new Contract(RandomNumberConsumer.abi, '0xf468fA5c149bb92DbCa46593f03764cdcf25FB9a');
                console.log("RandomNumberInstance: ",self.RandomNumberInstance);

                self.RouletteSpinInstance = new Contract(RouletteSpinCasino.abi, '0x691FF08B4967fC3B1f928716d1cb411F23a7A298');
                console.log("RouletteSpinInstance: ",self.RouletteSpinInstance);

                self.TableNftInstance = new Contract(TableNFT.abi, '0xfBC3a0629D7d5AC00f45D26B2A50BD3D78b8c03e');
                console.log("TableNftInstance: ",self.TableNftInstance);

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Failed to load web3, accounts contracts. Check console for details.`);
                console.log(error);
            }
        });
    }

    public async connectToRouletteTable(address: string) {
        const self: this = this;

        try {    
            self.RouletteTableInstance = new Contract(RouletteTable.abi, address);
            console.log("RouletteTableInstance: ",self.RouletteTableInstance);

            return true;

        } catch (error) {
            // Catch any errors for any of the above operations.
                alert(`Failed to load RouletteTable abi. Check console for details.`);
                console.log(error);
                return false;
        }
    }

    /**
     * RandomNumberConsumer 
     */
    public subscribeToRandomNumberEvents(){
        const self: this = this;
        self.RandomNumberInstance.events.RandomNumberRequest({
            topics: ['RandomNumberRequest', 'ResponseReceived']
        }, function(error:any, event:any){
            console.log(event)
        })
    }

    /**RouletteSpin Casino methods */

    public mint(userAddress: string, amount: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.mint(userAddress, amount).send().then((result: any)=>{
            // console.log("mint called by owner of RouletteSpinCasino", result);
            return result;
        })
    }

    public publicMint(){
        const self: this = this;
        return self.RouletteSpinInstance.methods.publicMint().send({from: this.activeAccount}).then((result: any)=>{
            // console.log("publicMint", result);
            return result;
        })
    }

    public mintTable(amount: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.mintTable(amount).send({from:this.activeAccount }).then((result: any)=>{
            // console.log("new table address", result);
            return result;
        })
    }

    public getTables(){
        const self: this = this;
        return self.RouletteSpinInstance.methods.getTables().call().then((result: any)=>{
            // console.log("all tables", result);
            return result;
        })
    }

    public deposit(fromPlayer: string, amount: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.deposit(fromPlayer, amount).send({from:this.activeAccount}).then((result: any)=>{
            // console.log("deposit from player and amount", result);
            return result;
        })
    }

    public fund(tableaddress: string, amount: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.fund(tableaddress, amount).send({from:this.activeAccount}).then((result: any)=>{
            // console.log("fund table with amount", result);
            return result;
        })
    }

    public getWinningNumber(roundId: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.getWinningNumber(roundId).call().then((data: any)=>{
            return data;
        })
    }

    public async balanceOf(){
        const self: this = this;
        console.log({contract: self.RouletteSpinInstance, account: this.activeAccount});
            return self.RouletteSpinInstance.methods.balanceOf(this.activeAccount).call()
                .then(
                    function(result: any){
                    // console.log("balanceOf", result);
                    return result;
                    }
                )
    }

    /**
     * Roulette Table
     */

    public getBets(){
        const self:this = this;
        return self.RouletteTableInstance.methods.getBets().call().then((data: any)=>{
            return data;
        })
    }

    // send array of bets to RouletteTable
    public sendBets(bets: any){
        const self:this = this;
        return self.RouletteTableInstance.methods.bet(bets).send({from: this.activeAccount}).then((data: any)=>{
            return data;
        })
    }
}
