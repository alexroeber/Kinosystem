import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {Datum} from "../../fachwerte/Datum";

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

  zurueck() {
    this.ausgewaehltesDatum = this.ausgewaehltesDatum.vorherigerTag();
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }

  weiter() {
    this.ausgewaehltesDatum = this.ausgewaehltesDatum.naechsterTag();
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }

  ngOnInit() {
    this.dateChanged.emit(this.ausgewaehltesDatum);
  }
}
