import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";

@Component({
  selector: "platzplan",
  templateUrl: "./platzplan.component.html",
  styleUrls: ["./platzplan.component.scss"]
})
export class PlatzplanComponent implements OnChanges {
  @Input() anzahlReihen: number;
  @Input() anzahlSitzeProReihe: number;
  @Output() selectionChange: EventEmitter<Set<Platz>>;

  platzplan: Platz[][];
  verkauftePlaetze: Set<Platz>;
  ausgewaehltePlaetze: Set<Platz>;

  constructor() {
    this.selectionChange = new EventEmitter<Set<Platz>>();
    this.verkauftePlaetze = new Set<Platz>();
    this.ausgewaehltePlaetze = new Set<Platz>();
  }

  onPlatz(platz: Platz) {
    if (this.ausgewaehltePlaetze.has(platz)) {
      this.ausgewaehltePlaetze.delete(platz);
    } else {
      this.ausgewaehltePlaetze.add(platz);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.buildNewPlatzplan();
  }

  private buildNewPlatzplan() {
    this.platzplan = new Array(this.anzahlReihen);
    this.verkauftePlaetze.clear();
    this.ausgewaehltePlaetze.clear();
    for (let reihe = 0; reihe < this.anzahlReihen; reihe++) {
      this.platzplan[reihe] = new Array(this.anzahlSitzeProReihe);
      for (let sitz = 0; sitz < this.anzahlSitzeProReihe; sitz++) {
        this.platzplan[reihe][sitz] = new Platz(reihe, sitz);
      }
    }
  }
}
