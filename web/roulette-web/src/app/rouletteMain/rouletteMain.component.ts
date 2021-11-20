import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from "@angular/core";
import { Router } from '@angular/router'
import { Web3Service } from "../web3.service";
import { SplashScreenService } from '../splashScreen/splashscreen.service';


@Component({
  selector: 'rouletteMain',
  templateUrl: './rouletteMain.component.html',
  styleUrls: ['./rouletteMain.component.less']
})
export class RouletteMainComponent implements OnInit {

  connectedToMetaMask: boolean = false;
  resultNumber: number = 0;
  tokenBalance: number = 0;
  casinoTablesArray = [];

  //vars 
  mintTableAmount: number = 0;

  constructor(
    private web3: Web3Service,
    private splashscreen: SplashScreenService,
    private router: Router){}

  ngOnInit() {

    this.web3.accountChanged.subscribe((data:any)=>{
      if(data != undefined && data != ''){
        this.web3Changed(true);
      }else{
        this.web3Changed(false);
      }
    })

    setTimeout(()=>{
      console.log("SplashScreem stop")
      this.splashscreen.stop();
    }, 1000);
  }

  public web3Changed(connected: boolean){
    if(connected){
      this.connectedToMetaMask = true;
    }else{
      this.connectedToMetaMask = false;
    }
  }

  public async connectToTable(address: string){
    // pass to web3 to instantiate roulette Table inst. then on success route to Roulette Table
    await this.web3.connectToRouletteTable(address).then((res: any)=>{

      this.splashscreen.start();
      //route to table page
      this.router.navigate(['/rouletteTable', address]);
    })
  }


  /**Web3 contract methods */
  public getAllTables(){
    this.web3.getTables().then((result: any)=>{
      console.log(result);
      this.casinoTablesArray = result;
    })
  }

  public callPublicMint(){
    this.web3.publicMint().then((result: any)=>{
      console.log(result);
    })
  }

  public mintTable(){
    this.web3.mintTable(this.mintTableAmount).then((result:any)=>{
      console.log("Mint table", result);
    })
  }

  public getBalanceOf(){
    this.web3.balanceOf().then((result: any)=>{
      this.tokenBalance = result;
      // console.log(result);
    })
  }
}