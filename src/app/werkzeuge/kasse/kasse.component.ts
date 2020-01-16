import {Component, Input} from "@angular/core";
import {Kino} from "../../materialien/Kino";
import {Datum} from "../../fachwerte/Datum";
import {Tagesplan} from "../../materialien/Tagesplan";
import {Vorstellung} from "../../materialien/Vorstellung";

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

  dateChanged(datum: Datum) {
    this.tagesplan = this.kino.getTagesplan(datum);
  }

  vorstellungChanged(vorstellung: Vorstellung) {
    this.vorstellung = vorstellung;
  }
}
