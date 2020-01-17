import {Component, Input, OnChanges, ViewChild} from "@angular/core";
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
export class PlatzverkaufComponent implements OnChanges {
  @ViewChild("platzplan", {static: true}) platzplan: PlatzplanComponent;
  @Input() vorstellung: Vorstellung;

  aktuellerPreis: Geldbetrag;
  istVerkaufenMoeglich: boolean;
  istStornierenMoeglich: boolean;
  bezahlungLaeuft: boolean;

  constructor() {
  }

  reagiereAufNeuePlatzAuswahl() {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.aktualisiereVerkaufenMoeglich(plaetze);
    this.aktualisiereStornierenMoeglich(plaetze);
    this.aktualisierePreisAnzeige(plaetze);
  }

  verkaufePlaetze(abgeschlossen: boolean) {
    if (abgeschlossen) {
      this.vorstellung.verkaufePlaetze(this.platzplan.getAusgewaehltePlaetze());
      this.aktualisierePlatzplan();
    }
    this.bezahlungLaeuft = false;
  }

  stornierePlaetze() {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.vorstellung.stornierePlaetze(plaetze);
    this.aktualisierePlatzplan();
  }

  ngOnChanges() {
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
