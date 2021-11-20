import { Component, OnInit } from "@angular/core";
import { Web3Service } from "./web3.service";
import { SplashScreenService } from './splashScreen/splashscreen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  
  connectedToMetaMask: boolean = false;

  ngOnInit() {

    this.web3.accountChanged.subscribe((data:any)=>{
      if(data != undefined && data != ''){
        this.web3Changed(true);
      }else{
        this.web3Changed(false);
      }
    })

    // setTimeout(()=>{
    //   console.log("SplashScreem stop")
    //   this.splashscreen.stop();
    // }, 1000);
  }

  public web3Changed(connected: boolean){
    if(connected){
      this.connectedToMetaMask = true;
    }else{
      this.connectedToMetaMask = false;
    }
  }


  constructor(private web3: Web3Service,
    private splashscreen: SplashScreenService){}

  public metamaskConnect(){
    console.log("Metamask connect trigger");
    this.web3.connectToMetaMask();
  }

}