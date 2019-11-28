import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PlatzverkaufComponent} from "./platzverkauf/platzverkauf.component";
import {BezahlungComponent} from "./bezahlung/bezahlung.component";


@NgModule({
  declarations: [PlatzverkaufComponent, BezahlungComponent],
  imports: [
    CommonModule
  ]
})
export class PlatzverkaufModule {
}
