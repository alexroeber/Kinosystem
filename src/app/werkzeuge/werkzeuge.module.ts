import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {KasseComponent} from "./kasse/kasse.component";
import {DatumsauswahlComponent} from "./datumsauswahl/datumsauswahl.component";
import {VorstellungsauswahlComponent} from "./vorstellungsauswahl/vorstellungsauswahl.component";


@NgModule({
  declarations: [KasseComponent, DatumsauswahlComponent, VorstellungsauswahlComponent],
  exports: [
    KasseComponent
  ],
  imports: [
    CommonModule
  ]
})
export class WerkzeugeModule {
}
