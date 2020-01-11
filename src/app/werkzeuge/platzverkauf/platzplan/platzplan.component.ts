import {Component, EventEmitter, Output} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";

@Component({
  selector: "platzplan",
  templateUrl: "./platzplan.component.html",
  styleUrls: ["./platzplan.component.scss"]
})
export class PlatzplanComponent {
  @Output() selectionChange: EventEmitter<void>;

  platzplan: Platz[][];
  verkauftePlaetze: HashSet<Platz>;
  ausgewaehltePlaetze: HashSet<Platz>;

  constructor() {
    this.selectionChange = new EventEmitter<void>();
    this.verkauftePlaetze = new HashSet<Platz>();
    this.ausgewaehltePlaetze = new HashSet<Platz>();
  }

  onPlatz(platz: Platz) {
    if (this.ausgewaehltePlaetze.contains(platz)) {
      this.ausgewaehltePlaetze.remove(platz);
    } else {
      this.ausgewaehltePlaetze.add(platz);
    }
    this.selectionChange.emit();
  }

  public setAnzahlPlaetze(anzahlReihen: number, anzahlSitzeProReihe: number) {
    this.platzplan = new Array(anzahlReihen);
    this.verkauftePlaetze.clear();
    this.ausgewaehltePlaetze.clear();
    for (let reihe = 0; reihe < anzahlReihen; reihe++) {
      this.platzplan[reihe] = new Array(anzahlSitzeProReihe);
      for (let sitz = 0; sitz < anzahlSitzeProReihe; sitz++) {
        this.platzplan[reihe][sitz] = new Platz(reihe, sitz);
      }
    }
    this.selectionChange.emit();
  }

  public markierePlatzAlsVerkauft(platz: Platz) {
    this.verkauftePlaetze.add(platz);
  }

  public getAusgewaehltePlaetze() {
    return new HashSet<Platz>(this.ausgewaehltePlaetze);
  }
}
