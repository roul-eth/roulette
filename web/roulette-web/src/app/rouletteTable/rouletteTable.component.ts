import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from "@angular/core";

import { Web3Service } from "../web3.service";
import { SplashScreenService } from '../splashScreen/splashscreen.service';
import { Router } from "@angular/router";


@Component({
  selector: 'roulettetable',
  templateUrl: './rouletteTable.component.html',
  styleUrls: ['./rouletteTable.component.less']
})
export class RouletteTableComponent implements OnInit {

  wheel: any;
  resultNumber: any = 5;
  tokenBalance: number = 0;
  totalBets: number = 0;
  casinoTablesArray = [];
  availableTokens: number = 0;
  endOfRound = false;

  // DOm Manipulate wheel spin
  @ViewChild('wheel')
  set wheelRef(v: ElementRef) {
    setTimeout(()=>{
      this.wheel = v.nativeElement;
      this.wheelImg = v.nativeElement;
    })
  }

  // Setup rotation angle of each #
  perfecthalf = ((1 / 37) * 360) / 2;

  // Adjustment for each rotation
  adj = 9.7;

  // Roulette #s
  roulette_numbers = [
    0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10,
    23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32,
  ];
  // Initial variables
  spin_number = 0;
  step = 0;
  lastLength = 0;
  revolutions = 0;
  currentLength = this.perfecthalf;

  //wheel operations
  blurWheel = false;
  wheelImg: any;

  //vars 
  mintTableAmount: number = 0;

  //Bet Coin Selects
  rouletteCoin  = {
    coinOneSelected: false,
    coinFiveSelected: false,
    coinTenSelected: false,
    coinTwentyFiveSelected: false,
    coinFiftySelected: false
  }

  selectedPositions: any[] = [];
  selectedPositionsfront: any[] = [];
  selectedbetsArray: any[] = [];
  

  constructor(
    private rd: Renderer2,
    public  web3: Web3Service,
    private splashscreen: SplashScreenService,
    private route: Router){}

  ngOnInit() {
    this.web3.accountChanged.subscribe((data:any)=>{
      if(data == null || data == ''){
        this.back();
      }else{
        this.getBalanceOf()
      }
    });

    this.web3.randomNumRequest.subscribe((data:any)=>{
      console.log("randomNumRquest", data);
      this.resultNumber = '';
      this.wheelSpin();
    })

    this.web3.responceRecieved.subscribe((data:any)=>{
      console.log("responceRecieved", data);
      
    })

    this.web3.winingNumRecieved.subscribe((data:any)=>{
      console.log("winingNumRecieved", data);
      this.resultNumber = data;
      this.wheelSpin();
    })

    setTimeout(()=>{
      console.log("SplashScreem stop")
      this.splashscreen.stop();
    }, 10);

    this.getBalanceOf();

    this.getRoundInfo();
  }

  ngOnDestroy(){
    // this.splashscreen.start();
    console.log("Roulette Table Destroyed")
  }


  back(): void{
    this.route.navigate([".."]);
  }

  public getRandomInt(min:any, max:any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public spin() {
    
    this.spin_number = Number.parseInt(this.resultNumber);
    this.step = this.roulette_numbers.findIndex((n) => n === this.spin_number);
    console.log(
      "Rolling #",
      this.spin_number,
      this.roulette_numbers[this.step]
    );
  }

  public wheelSpin() {
    if (this.resultNumber !== ''){
      this.spin();
    }
    console.log("wheel start:", this.revolutions);
    // Blur the wheel during the animation
    this.blurWheel = true;
    // $(".wheel img").css("filter", "blur(2px)");

    // Specify angle of rotation
    this.currentLength = this.step * this.adj + this.perfecthalf;

    // See if we need to increase the revolutions (in case it has to do full circle)
    if (this.currentLength + 360 * this.revolutions < this.lastLength)
      this.revolutions++;

    // Add 1 or more random revolutions for animation
    if (this.resultNumber !== ''){
      if(this.revolutions > 5000){
        this.revolutions = 4;
      }
      this.revolutions += this.getRandomInt(1, 3);
    }else{
      this.revolutions += 5000; 
    }

    console.log(this.revolutions);
    // Adjust by revolutions
    this.currentLength += 360 * this.revolutions;

    var numofsecs = this.currentLength - 360 * this.revolutions;
    // var numofsecs = 1000;

    console.log("current Lengths", this.currentLength);

    this.rd.setStyle(this.wheel, 'transform', `rotate(${this.currentLength}deg)`)
    // $(".wheel img").css("transform", "rotate(" + this.currentLength + "deg)");

    setInterval(()=>{
      this.blurWheel = false;
    }, numofsecs);
    // setTimeout(function () {
    //   // $(".wheel img").css("filter", "blur(0px)");
    //   this.blurWheel = false;
    // }, 10);

    this.lastLength = this.currentLength;
  }

  //Bet Tables 
  public clearBets(){
    this.selectedPositions = [];
    this.selectedPositionsfront = [];
    this.selectedbetsArray = [];
    this.totalBets = 0;
  }

  public calculateBet(){
    let total = 0;
    for(const [key, value] of Object.entries(this.rouletteCoin)){
      if(value == true){
        total += this.getBetAmountSelected(key);
      }
    }
    this.totalBets += total;

    return total;
  }
  public positionSelected(id: any){
    // check if id in array
    let idFound = false;
    let pos = 0;
    this.selectedPositions.forEach((obj, index)=>{
      if(obj.betId == id){
        idFound = true;
        pos = index;
      }
    })

    
    // remove if found
    if(idFound){
      this.selectedPositions.splice(pos, 1);
      this.selectedPositionsfront.splice(pos, 1);
      this.selectedbetsArray.splice(pos, 1);
    }else{
      //build the object:
      let obj = {
        from: this.web3.activeAccount,
        amount: this.calculateBet(),
        betId: id
      }
      this.selectedPositions.push(obj);
      this.selectedPositionsfront.push(obj);
      this.selectedbetsArray.push(id);
      console.log(this.selectedPositions);
    }
    
  }

  public getNumColor(num: number){
    switch(num){
      case 1:
      case 3:
      case 5:
      case 7:
      case 9:
      case 12:
      case 14:
      case 16:
      case 18:
      case 19:
      case 21:
      case 23:
      case 25:
      case 27:
      case 30:
      case 32:
      case 34:
      case 36:
      case 45:
        return 'red';

      case 2:
      case 4:
      case 6:
      case 8:
      case 10:
      case 11:
      case 13:
      case 15:
      case 17:
      case 20:
      case 22:
      case 24:
      case 26:
      case 28:
      case 29:
      case 31:
      case 33:
      case 35:
      case 46:
        return 'black';
      default:
        return '';
    }

  }

  public getIdLabel(id: number){

    switch(id){
      case 37:
      case 38:
      case 39:
        return '2 to 1';

      case 40:
        return '1st 12';

      case 41:
        return '2nd 12';

      case 42:
        return '23rd 12';

      case 43:
        return '1 to 18';

      case 44:
        return 'EVEN';

      case 45:
        return 'RED';

      case 46:
        return 'BLACK';

      case 47:
        return 'ODD';

      case 48:
        return '19 to 36';

      default: return id;
    }

  }

  public getBetAmountSelected(coinSelected: string) {

    switch(coinSelected){
      case 'coinOneSelected':
        return 1;
      case 'coinFiveSelected':
        return 5;
      case 'coinTenSelected':
        return 10;
      case 'coinTwentyFiveSelected':
        return 25;
      case 'coinFiftySelected':
        return 50;
      default: return 0;
    }
  }

  /**Web3 contract methods */
  public placeBets(){
    
    console.log("selPOs", this.selectedPositions);
    this.web3.sendBets(this.selectedPositions).then((data: any)=>{
      console.log("place bets", data)
    });
  }

  public getRoundInfo(){
    this.web3.roundsInfo().then((data: any)=>{
      console.log("getRoundInfo",data);
    })
  }

  public getBalanceOf(){
    this.web3.balanceOf();
  }

}
