import {Component, EventEmitter, Input, OnChanges, Output} from "@angular/core";
import {Vorstellung} from "../../materialien/Vorstellung";
import {Tagesplan} from "../../materialien/Tagesplan";

/**
 * Equivalent zum VorstellungsAuswaehlWerkzeug
 */
@Component({
  selector: "vorstellungsauswahl",
  templateUrl: "./vorstellungsauswahl.component.html",
  styleUrls: ["./vorstellungsauswahl.component.scss"]
})
export class VorstellungsauswahlComponent implements OnChanges {
  @Input() tagesplan: Tagesplan;
  @Output() vorstellungChanged: EventEmitter<Vorstellung>;

  ausgewaehlteVorstellung: Vorstellung;

  constructor() {
    this.vorstellungChanged = new EventEmitter<Vorstellung>();
  }

  /**
   * UI-Methode, Reaktion auf die Auswahl einer anderen Vorstellung
   * Setzt die ausgewählte Vorstellung.
   */
  onVorstellung(vorstellung: Vorstellung): void {
    this.ausgewaehlteVorstellung = vorstellung;
    this.vorstellungChanged.emit(vorstellung);
  }

  ngOnChanges(): void {
    this.onVorstellung(this.tagesplan.getVorstellungen()[0]);
  }
}
