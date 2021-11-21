/**by Dinesh Selvam -  PheoDScop#3470*/
import { BehaviorSubject } from "rxjs";
import { environment } from '../environments/environment';

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
    private readonly web3: any;
    private chainId: any;
    private networkId: any;

    public activeAccount: any; // tracks what account address is currently used.
    public accounts = []; // metamask or other accounts address

    public tokenBalance: number = 0;


    public RandomNumberInstance: any;
    public RouletteSpinInstance: any;
    public RouletteTableInstance: any;
    public TableNftInstance: any;

    /** this Subject is like a Event fired. When wallet address (account) is changed then this gets fired.
    *   we can use something similar to track other events.
    */
    private accountChangeSubject = new BehaviorSubject<string>("");
    accountChanged = this.accountChangeSubject.asObservable();

    private randomNumRequestSubject = new BehaviorSubject<any>('');
    randomNumRequest = this.randomNumRequestSubject.asObservable();

    private randomNumResponceSubject = new BehaviorSubject<any>('');
    responceRecieved = this.randomNumResponceSubject.asObservable();

    private winningNumberSubject = new BehaviorSubject<any>('');
    winingNumRecieved = this.winningNumberSubject.asObservable();

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

        return setInterval(function () {
            if (self.activeAccount != window.web3.currentProvider.selectedAddress) {
                self.updateActiveAccount();
            }
        }, 100);
    }

    public updateActiveAccount() {

        if(window.web3.currentProvider.selectedAddress !== null){
            this.activeAccount = window.web3.currentProvider.selectedAddress;
            //change of account ==> update all pages and go back to main. 
            this.accountChangeSubject.next(window.web3.currentProvider.selectedAddress);
        }else{
            this.activeAccount = '';
            this.accountChangeSubject.next("");
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

                self.RandomNumberInstance = new Contract(RandomNumberConsumer.abi, environment.rncInstance);
                console.log("RandomNumberInstance: ",self.RandomNumberInstance);

                self.RouletteSpinInstance = new Contract(RouletteSpinCasino.abi, environment.casinoInstance);
                console.log("RouletteSpinInstance: ",self.RouletteSpinInstance);

                self.TableNftInstance = new Contract(TableNFT.abi, environment.tableNFTInstance);
                console.log("TableNftInstance: ",self.TableNftInstance);

                self.balanceOf();

                //subscribe to events
                self.subscribeToRandomNumberEvents();

                self.subscribeToRouletteSpinCasino();

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
        console.log("subscribe randomNumber events");
        // self.RandomNumberInstance.events.RandomNumberRequest({
        //     topics: ['RandomNumberRequest', 'ResponseReceived']
        // }, function(error:any, event:any){
        //     console.log(event)
        // })

        self.RandomNumberInstance.events.RandomNumberRequest()
        .on('data', (event: any)=>{
            console.log("RandomNumber Request", event);
            if(event.event == 'RandomNumberRequest'){
                this.randomNumRequestSubject.next(true);
            }
        })

        self.RandomNumberInstance.events.ResponseReceived()
        .on('data', (event: any)=>{
            console.log("Responce Received", event);
            if(event.event == 'ResponseReceived'){
                this.randomNumResponceSubject.next(event);
            }
        })
    }

    /**RouletteSpin Casino methods */

    public subscribeToRouletteSpinCasino() {
        const self: this = this;
        console.log("subscribe roulette spin casino events");
        self.RouletteSpinInstance.events.winningNumberDrawn()
            .on('data', (event:any)=>{
                console.log("Winning Number", event.retunValues.winningNumber);
                this.winningNumberSubject.next(event.retunValues.winningNumber)
            })
    }

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

    public getWinningNumber(roundId: number){
        const self: this = this;
        return self.RouletteSpinInstance.methods.getWinningNumber(roundId).call().then((data: any)=>{
            return data;
        })
    }

    public async balanceOf(){
        const self: this = this;
        console.log({contract: self.RouletteSpinInstance, account: this.activeAccount});
        if(self.RouletteSpinInstance !== undefined && this.activeAccount !== ''){
            return self.RouletteSpinInstance.methods.balanceOf(this.activeAccount).call()
                .then(
                    function(result: any){
                    self.tokenBalance = result;
                    }
                )   
        }
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

    public roundsInfo(){
        const self: this = this;
        return self.RouletteTableInstance.methods.roundsInfo().call().then((data: any)=>{
            return data;
        })
    }
}
