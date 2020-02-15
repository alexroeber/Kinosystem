import {Component, Input} from "@angular/core";
import {Kino} from "../../materialien/Kino";
import {Datum} from "../../fachwerte/Datum";
import {Tagesplan} from "../../materialien/Tagesplan";
import {Vorstellung} from "../../materialien/Vorstellung";

/**
 * Equivalent zum Kassenwerkzeug
 */
@Component({
  selector: "kasse",
  templateUrl: "./kasse.component.html",
  styleUrls: ["./kasse.component.scss"]
})
export class KasseComponent {
  @Input() kino: Kino;

  tagesplan: Tagesplan;
  vorstellung: Vorstellung;

  constructor() {
  }

  /**
   * UI-Methode, Reaktion auf das dateChanged-Event
   * Setzt den Tagesplan des ausgewählten Datums.
   */
  dateChanged(datum: Datum): void {
    this.tagesplan = this.kino.getTagesplan(datum);
  }

  /**
   * UI-Methode, Reaktion auf das vorstellungChanged-Event
   * Setzt die ausgewählte Vorstellung.
   */
  vorstellungChanged(vorstellung: Vorstellung): void {
    this.vorstellung = vorstellung;
  }
}
