import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from "@angular/core";
import { Web3Service } from "./web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  wheel: any;
  resultNumber: number = 0;
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

  constructor(
    private rd: Renderer2,
    private web3: Web3Service){}

  ngOnInit() {
    // $(".wheel img").css("transform", "rotate(" + this.perfecthalf + "deg)");
  }

  public metamaskConnect(){
    console.log("Metamask connect trigger");
    this.web3.connectToMetaMask();
  }

  public getRandomInt(min:any, max:any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public spin() {
    this.spin_number = this.resultNumber;
    this.step = this.roulette_numbers.findIndex((n) => n === this.spin_number);
    console.log(
      "Rolling #",
      this.spin_number,
      this.roulette_numbers[this.step]
    );
  }

  public wheelSpin() {
    this.spin();

    // Blur the wheel during the animation
    this.blurWheel = true;
    // $(".wheel img").css("filter", "blur(2px)");

    // Specify angle of rotation
    this.currentLength = this.step * this.adj + this.perfecthalf;

    // See if we need to increase the revolutions (in case it has to do full circle)
    if (this.currentLength + 360 * this.revolutions < this.lastLength)
      this.revolutions++;

    // Add 1 or more random revolutions for animation
    this.revolutions += this.getRandomInt(1, 3);

    // Adjust by revolutions
    this.currentLength += 360 * this.revolutions;

    var numofsecs = this.currentLength - 360 * this.revolutions;

    this.rd.setStyle(this.wheelImg, 'transform', `rotate(${this.currentLength}deg)`)
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

  /**Web3 contract methods */
  public getAllTables(){
    this.web3.getTables().then((result: any)=>{
      console.log(result);
    })
  }

  public callPublicMint(){
    this.web3.publicMint().then((result: any)=>{
      console.log(result);
    })
  }

  public getBalanceOf(){
    this.web3.balanceOf().then((result: any)=>{
      console.log(result);
    })
  }
}