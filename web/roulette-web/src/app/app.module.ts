import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SplashScreenComponent } from './splashScreen/splashscreen.component';

//services
import { Web3Service } from './web3.service'
import { SplashScreenService } from './splashScreen/splashscreen.service';

//directives
import { HoverHighlightDirective } from './directives/hoverDirective';

@NgModule({
  declarations: [
    AppComponent,
    HoverHighlightDirective,
    SplashScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [Web3Service, SplashScreenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
