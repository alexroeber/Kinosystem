import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Vorstellung} from "../../materialien/Vorstellung";
import {Tagesplan} from "../../materialien/Tagesplan";
import {Datum} from "../../fachwerte/Datum";
import {Kinosaal} from "../../materialien/Kinosaal";
import {Film} from "../../materialien/Film";
import {FSK} from "../../fachwerte/FSK";
import {Uhrzeit} from "../../fachwerte/Uhrzeit";
import {Geldbetrag} from "../../fachwerte/Geldbetrag";

@Component({
  selector: "vorstellungsauswahl",
  templateUrl: "./vorstellungsauswahl.component.html",
  styleUrls: ["./vorstellungsauswahl.component.scss"]
})
export class VorstellungsauswahlComponent {
  @Input() tagesplan: Tagesplan;
  @Output() vorstellungChanged: EventEmitter<Vorstellung>;

  ausgewaehlteVorstellung: Vorstellung;

  constructor() {
    this.tagesplan = new Tagesplan(Datum.heute());
    const saal = new Kinosaal("Name", 50, 50);
    const film = new Film("Dies ist ein Film", 120, FSK.FSK0, false);
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(1, 0),
      new Uhrzeit(3, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(3, 0),
      new Uhrzeit(5, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(5, 0),
      new Uhrzeit(7, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(7, 0),
      new Uhrzeit(9, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(9, 0),
      new Uhrzeit(11, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.tagesplan.fuegeVorstellungHinzu(new Vorstellung(saal, film, new Uhrzeit(11, 0),
      new Uhrzeit(13, 0), Datum.heute(), Geldbetrag.parseGeldbetrag(5, 0)));
    this.vorstellungChanged = new EventEmitter<Vorstellung>();
  }

  onVorstellung(vorstellung: Vorstellung) {
    this.ausgewaehlteVorstellung = vorstellung;
    this.vorstellungChanged.emit(vorstellung);
  }
}
