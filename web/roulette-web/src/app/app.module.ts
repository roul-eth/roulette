import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouletteTableModule } from './rouletteTable/rouletteTable.module'
import { RouletteMainModule } from './rouletteMain/rouletteMain.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenComponent } from './splashScreen/splashscreen.component';

//services
import { Web3Service } from './web3.service'
import { SplashScreenService } from './splashScreen/splashscreen.service';

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouletteTableModule,
    RouletteMainModule
  ],
  providers: [Web3Service, SplashScreenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
