import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from "@angular/core";
import { SplashScreenService } from "./splashscreen.service"


@Component({
  selector: 'splashScreen',
  templateUrl: './splashscreen.component.html',
  styleUrls: ['./splashscreen.component.less']
})
export class SplashScreenComponent implements OnInit {
    // The screen starts with the maximum opacity
    public opacityChange = 1;
    public splashTransition: any;
    // First access the splash is visible
    public showSplash = true;
    readonly ANIMATION_DURATION = 1;

    constructor(  private splashScreenService: SplashScreenService){

    }

    ngOnInit(){
        this.splashScreenService.subscribe((res:any)=>{
            console.log("Subscribed splashscreen", res)
            this.hideSplashScreen();
        })
    }

    private hideSplashScreen(){
        // Setting the transition
        this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
        this.opacityChange = 0;
        setTimeout(() => {
            // After the transition is ended the showSplash will be hided
            this.showSplash = !this.showSplash;
        }, 1000);
    }
}