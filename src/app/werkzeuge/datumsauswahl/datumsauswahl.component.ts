import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Datum} from "../../fachwerte/Datum";

/**
 * Equivalent zum DatumAuswaehlWerkzeug
 */
@Component({
  selector: "datumsauswahl",
  templateUrl: "./datumsauswahl.component.html",
  styleUrls: ["./datumsauswahl.component.scss"]
})
export class DatumsauswahlComponent implements OnInit {
  @Output() dateChanged: EventEmitter<Datum>;

  ausgewaehltesDatum: Datum;

  constructor() {
    this.dateChanged = new EventEmitter<Datum>();
    this.ausgewaehltesDatum = Datum.heute();
  }

  /**
   * UI-Methode, Reaktion auf den "zurück"-Pfeil
   * Wählt den vorherigen Tag aus.
   */
  zurueck(): void {
    this.ausgewaehltesDatum = this.ausgewaehltesDatum.vorherigerTag();
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }

  /**
   * UI-Methode, Reaktion auf den "weiter"-Pfeil
   * Wählt den nächsten Tag aus.
   */
  weiter(): void {
    this.ausgewaehltesDatum = this.ausgewaehltesDatum.naechsterTag();
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }

  ngOnInit(): void {
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }
}
