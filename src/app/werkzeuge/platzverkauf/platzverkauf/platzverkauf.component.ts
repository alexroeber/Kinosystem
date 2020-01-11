import {Component, OnInit, ViewChild} from "@angular/core";
import {Vorstellung} from "../../../materialien/Vorstellung";
import {Geldbetrag} from "../../../fachwerte/Geldbetrag";
import {PlatzplanComponent} from "../platzplan/platzplan.component";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";

@Component({
  selector: "platzverkauf",
  templateUrl: "./platzverkauf.component.html",
  styleUrls: ["./platzverkauf.component.scss"]
})
export class PlatzverkaufComponent implements OnInit {
  @ViewChild("platzplan", {static: true}) platzplan: PlatzplanComponent;
  aktuellerPreis: Geldbetrag;
  istVerkaufenMoeglich: boolean;
  istStornierenMoeglich: boolean;
  private vorstellung: Vorstellung;

  constructor() {
  }

  reagiereAufNeuePlatzAuswahl() {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.aktualisiereVerkaufenMoeglich(plaetze);
    this.aktualisiereStornierenMoeglich(plaetze);
    this.aktualisierePreisAnzeige(plaetze);
  }

  verkaufePlaetze() {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.vorstellung.verkaufePlaetze(plaetze);
    this.aktualisierePlatzplan();
  }

  stornierePlaetze() {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.vorstellung.stornierePlaetze(plaetze);
    this.aktualisierePlatzplan();
  }

  ngOnInit() {
    this.aktualisierePlatzplan();
  }

  public setVorstellung(vorstellung: Vorstellung) {
    this.vorstellung = vorstellung;
    this.aktualisierePlatzplan();
  }

  private aktualisierePreisAnzeige(plaetze: HashSet<Platz>) {
    if (this.vorstellung) {
      this.aktuellerPreis = this.vorstellung.getPreisFuerPlaetze(plaetze);
    } else {
      this.aktuellerPreis = Geldbetrag.parseGeldbetrag(0, 0);
    }
  }

  private aktualisiereVerkaufenMoeglich(plaetze: HashSet<Platz>) {
    this.istVerkaufenMoeglich = plaetze.size() && this.vorstellung.sindVerkaufbar(plaetze);
  }

  private aktualisiereStornierenMoeglich(plaetze: HashSet<Platz>) {
    this.istStornierenMoeglich = plaetze.size() && this.vorstellung.sindStornierbar(plaetze);
  }

  private aktualisierePlatzplan() {
    if (this.vorstellung) {
      const saal = this.vorstellung.getKinosaal();
      this.platzplan.setAnzahlPlaetze(saal.getAnzahlReihen(), saal.getAnzahlSitzeProReihe());
      saal.getPlaetze().forEach(platz => {
        if (this.vorstellung.istPlatzVerkauft(platz)) {
          this.platzplan.markierePlatzAlsVerkauft(platz);
        }
      });
    } else {
      this.platzplan.setAnzahlPlaetze(0, 0);
    }
  }
}
