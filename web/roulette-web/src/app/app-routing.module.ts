import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouletteTableComponent } from './rouletteTable/rouletteTable.component'
import { RouletteMainComponent } from './rouletteMain/rouletteMain.component'

const routes: Routes = [
  {path: '', component: RouletteMainComponent},
  {path: 'rouletteTable/:id', component: RouletteTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
