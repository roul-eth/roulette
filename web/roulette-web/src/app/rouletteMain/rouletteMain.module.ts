import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

//component
import { RouletteMainComponent } from './rouletteMain.component';
//directives
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    RouletteMainComponent,
  ],
  imports: [
      CommonModule,
      FormsModule
  ],
  providers: [],
  bootstrap: [RouletteMainComponent]
})
export class RouletteMainModule { }
