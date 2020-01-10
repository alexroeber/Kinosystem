import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PlatzverkaufComponent} from "./platzverkauf/platzverkauf.component";
import {BezahlungComponent} from "./bezahlung/bezahlung.component";
import {PlatzButtonComponent} from "./platz-button/platz-button.component";
import {PlatzplanComponent} from "./platzplan/platzplan.component";


@NgModule({
  declarations: [PlatzverkaufComponent, BezahlungComponent, PlatzButtonComponent, PlatzplanComponent],
  exports: [
    PlatzverkaufComponent
  ],
  imports: [
    CommonModule
  ]
})
export class PlatzverkaufModule {
}
