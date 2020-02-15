import {Component, Input, OnChanges, ViewChild} from "@angular/core";
import {Vorstellung} from "../../../materialien/Vorstellung";
import {Geldbetrag} from "../../../fachwerte/Geldbetrag";
import {PlatzplanComponent} from "../platzplan/platzplan.component";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";

/**
 * Equivalent zum Platzverkaufswerkzeug
 * Die einzige Stelle, an der nicht nur über Databinding kommuniziert wird. Mit dem Platzplan wird über das
 * Beobachtermuster kommuniziert.
 */
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

  /**
   * UI-Methode, Reaktion auf das selectionChange-Event
   * Aktualisiert die Anzeige.
   */
  reagiereAufNeuePlatzAuswahl(): void {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.aktualisiereVerkaufenMoeglich(plaetze);
    this.aktualisiereStornierenMoeglich(plaetze);
    this.aktualisierePreisAnzeige(plaetze);
  }

  /**
   * UI-Methode, Reaktion auf das abgeschlossen-Event
   * Verkauft die ausgewählten Plätze.
   */
  verkaufePlaetze(abgeschlossen: boolean): void {
    if (abgeschlossen) {
      this.vorstellung.verkaufePlaetze(this.platzplan.getAusgewaehltePlaetze());
      this.aktualisierePlatzplan();
    }
    this.bezahlungLaeuft = false;
  }

  /**
   * UI-Methode, Reaktion auf den Stornieren-Button
   * Storniert ausgewählte verkaufte Plätze.
   */
  stornierePlaetze(): void {
    const plaetze = this.platzplan.getAusgewaehltePlaetze();
    this.vorstellung.stornierePlaetze(plaetze);
    this.aktualisierePlatzplan();
  }

  ngOnChanges(): void {
    this.aktualisierePlatzplan();
  }

  /**
   * Interne Methode, die die Preisanzeige auf den korrekten Wert setzt.
   * @param plaetze die Plätze dessen Preis berechnet werden soll.
   */
  private aktualisierePreisAnzeige(plaetze: HashSet<Platz>): void {
    if (this.vorstellung) {
      this.aktuellerPreis = this.vorstellung.getPreisFuerPlaetze(plaetze);
    } else {
      this.aktuellerPreis = Geldbetrag.parseGeldbetrag(0, 0);
    }
  }

  /**
   * Interne Methode, die entscheidet, ob der Verkaufen-Button aktiv sein soll.
   * @param plaetze die Plätze, die alle verkaufbar sein sollen
   */
  private aktualisiereVerkaufenMoeglich(plaetze: HashSet<Platz>): void {
    this.istVerkaufenMoeglich = plaetze.size() && this.vorstellung.sindVerkaufbar(plaetze);
  }

  /**
   * Interne Methode, die entscheidet, ob der Stornieren-Button aktiv sein soll.
   * @param plaetze die Plätze, die alle stornierbar sein sollen
   */
  private aktualisiereStornierenMoeglich(plaetze: HashSet<Platz>): void {
    this.istStornierenMoeglich = plaetze.size() && this.vorstellung.sindStornierbar(plaetze);
  }

  /**
   * Interne Methode, die den Platzplan aktualisiert. (Größe, verkaufte Plätze)
   */
  private aktualisierePlatzplan(): void {
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
