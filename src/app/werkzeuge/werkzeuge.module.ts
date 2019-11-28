import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {KasseComponent} from "./kasse/kasse.component";
import {DatumsauswahlComponent} from "./datumsauswahl/datumsauswahl.component";
import {VorstellungsauswahlComponent} from "./vorstellungsauswahl/vorstellungsauswahl.component";
import {PlatzverkaufModule} from "./platzverkauf/platzverkauf.module";


@NgModule({
  declarations: [KasseComponent, DatumsauswahlComponent, VorstellungsauswahlComponent],
  exports: [
    KasseComponent
  ],
  imports: [
    CommonModule,
    PlatzverkaufModule
  ]
})
export class WerkzeugeModule {
}
