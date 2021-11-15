import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

// Services
import { Web3Service } from './web3.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [Web3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
