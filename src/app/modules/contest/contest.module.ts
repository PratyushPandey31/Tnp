import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import this
import { ContestListComponent } from './components/contest-list/contest-list.component';

@NgModule({
  declarations: [ContestListComponent],
  imports: [
    CommonModule,
    FormsModule // 2. Add this here
  ],
  exports: [ContestListComponent]
})
export class ContestModule { }