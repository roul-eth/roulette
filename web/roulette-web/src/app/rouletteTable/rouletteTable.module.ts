import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

//component
import { RouletteTableComponent } from './rouletteTable.component';
//directives
import { HoverHighlightDirective } from '../directives/hoverDirective';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RouletteTableComponent,
    HoverHighlightDirective,
  ],
  imports: [
      CommonModule,
      FormsModule
  ],
  providers: [],
  bootstrap: [RouletteTableComponent]
})
export class RouletteTableModule { }
