import {ok} from "assert";
import {Kinosaal} from "./Kinosaal";
import {Uhrzeit} from "../fachwerte/Uhrzeit";
import {Datum} from "../fachwerte/Datum";
import {Geldbetrag} from "../fachwerte/Geldbetrag";
import {Film} from "./Film";
import {Platz} from "../fachwerte/Platz";
import {HashSet} from "../shared/HashSet";

/**
 * Eine Vorstellung, für die Plätze verkauft und storniert werden können. Die
 * Vorstellung speichert zum einen die Daten der eigentlichen Vorstellung (wann
 * und wo läuft welcher Film) und zum anderen, welche Plätze für diese
 * Vorstellung bereits verkauft wurden.
 */
export class Vorstellung {
  private readonly verkauft: boolean[][];
  private anzahlVerkauftePlaetze: number;

  /**
   * Erstellt eine neue Vorstellung.
   *
   * @param kinosaal der Kinosaal, in dem die Vorstellung laeuft.
   * @param film der Film, der in dieser Vorstellung gezeigt wird.
   * @param anfangszeit die Anfangszeit der Vorstellung.
   * @param endzeit die Endzeit der Vorstellung.
   * @param datum das Datum der Vorstellung
   * @param preis der Verkaufspreis als int für Karten zu dieser Vorstellung.
   *
   * @require truthy kinosaal
   * @require truthy film
   * @require truthy anfangszeit
   * @require truthy endzeit
   * @require truthy datum
   * @require truthy preis
   *
   * @ensure getKinosaal() === kinosaal
   * @ensure getFilm() === film
   * @ensure getAnfangszeit() === anfangszeit
   * @ensure getEndzeit() === endzeit
   * @ensure getDatum() === datum
   * @ensure getPreis() === preis
   */
  public constructor(private readonly kinosaal: Kinosaal, private readonly film: Film, private readonly anfangszeit: Uhrzeit,
                     private readonly endzeit: Uhrzeit, private readonly datum: Datum, private readonly preis: Geldbetrag) {
    ok(kinosaal, "Vorbedingung verletzt: truthy saal");
    ok(film, "Vorbedingung verletzt: truthy film");
    ok(anfangszeit, "Vorbedingung verletzt: truthy anfangszeit");
    ok(endzeit, "Vorbedingung verletzt: truthy endzeit");
    ok(datum, "Vorbedingung verletzt: truthy datum");
    ok(preis, "Vorbedingung verletzt: truthy datum");

    this.verkauft = [];
    for (let i = 0; i < kinosaal.getAnzahlReihen(); i++) {
      this.verkauft[i] = [];
      for (let j = 0; j < kinosaal.getAnzahlSitzeProReihe(); j++) {
        this.verkauft[i][j] = false;
      }
    }
    this.anzahlVerkauftePlaetze = 0;
  }

  /**
   * Gibt den Kinosaal zurück, in dem diese Vorstellung läuft.
   *
   * @ensure truthy result
   */
  public getKinosaal(): Kinosaal {
    return this.kinosaal;
  }

  /**
   * Gibt den Film zurück, der in dieser Vorstellung gezeigt wird.
   *
   * @ensure truthy result
   */
  public getFilm(): Film {
    return this.film;
  }

  /**
   * Gibt die Uhrzeit zurück, zu der diese Vorstellung beginnt.
   *
   * @ensure truthy result
   */
  public getAnfangszeit(): Uhrzeit {
    return this.anfangszeit;
  }

  /**
   * Gibt die Uhrzeit zurück, zu der diese Vorstellung endet.
   *
   * @ensure truthy result
   */
  public getEndzeit(): Uhrzeit {
    return this.endzeit;
  }

  /**
   * Gibt das Datum zurück, an dem diese Vorstellung läuft.
   *
   * @ensure truthy result
   */
  public getDatum(): Datum {
    return this.datum;
  }

  /**
   * Gibt den Verkaufspreis als int für Karten zu dieser Vorstellung zurück.
   *
   * @ensure result > 0
   */
  public getPreis(): Geldbetrag {
    return this.preis;
  }

  /**
   * Prüft, ob der angegebene Sitzplatz in dieser Vorstellung vorhanden ist.
   *
   * @param platz der Sitzplatz.
   * @return <code>true</code>, falls der Platz existiert, <code>false</code> sonst.
   *
   * @require truthy platz
   */
  public hatPlatz(platz: Platz): boolean {
    ok(platz, "Vorbedingung verletzt: truthy platz");

    return this.kinosaal.hatPlatz(platz);
  }

  /**
   * Prüft, ob alle angegebenen Sitzplätze in dieser Vorstellung vorhanden
   * sind.
   *
   * @param plaetze die Sitzplätze.
   * @return true, falls alle Plätze existieren, false sonst.
   *
   * @require truthy plaetze
   */
  public hatPlaetze(plaetze: HashSet<Platz>): boolean {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");

    let result = true;
    plaetze.forEach(p => {
      result = result && this.hatPlatz(p);
    });
    return result;
  }

  /**
   * Gibt den Gesamtpreis für die angegebenen Plätze zurücke
   *
   * @param plaetze die Sitzplätze.
   * @return Gesamtpreis
   *
   * @require truthy plaetze
   * @require hatPlaetze(plaetze)
   */
  public getPreisFuerPlaetze(plaetze: HashSet<Platz>): Geldbetrag {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");

    return Geldbetrag.multipliziere(this.preis, plaetze.size());
  }

  /**
   * Gibt an, ob ein bestimmter Platz bereits verkauft ist.
   *
   * @param platz der Sitzplatz.
   * @return <code>true</code>, falls der Platz verkauft ist, <code>false</code> sonst.
   *
   * @require truthy platz
   * @require hatPlatz(platz)
   */
  public istPlatzVerkauft(platz: Platz): boolean {
    ok(platz, "Vorbedingung verletzt: truthy platz");
    ok(this.hatPlatz(platz), "Vorbedingung verletzt: hatPlatz(platz)");

    return this.verkauft[platz.getReihe()][platz.getSitz()];
  }

  /**
   * Verkauft einen Platz.
   *
   * @param platz der Sitzplatz.
   *
   * @require truthy platz
   * @require hatPlatz(platz)
   * @require !istPlatzVerkauft(platz)
   *
   * @ensure istPlatzVerkauft(platz)
   */
  public verkaufePlatz(platz: Platz): void {
    ok(platz, "Vorbedingung verletzt: truthy platz");
    ok(this.hatPlatz(platz), "Vorbedingung verletzt: hatPlatz(platz)");
    ok(!this.istPlatzVerkauft(platz), "Vorbedingung verletzt: !istPlatzVerkauft(platz)");

    this.verkauft[platz.getReihe()][platz.getSitz()] = true;
    this.anzahlVerkauftePlaetze++;
  }

  /**
   * Storniert einen Platz.
   *
   * @param platz der Sitzplatz.
   *
   * @require truthy platz
   * @require hatPlatz(platz)
   * @require istPlatzVerkauft(rplatz)
   *
   * @ensure !istPlatzVerkauft(platz)
   */
  public stornierePlatz(platz: Platz): void {
    ok(platz, "Vorbedingung verletzt: truthy platz");
    ok(this.hatPlatz(platz), "Vorbedingung verletzt: hatPlatz(platz)");
    ok(this.istPlatzVerkauft(platz), "Vorbedingung verletzt: istPlatzVerkauft(platz)");

    this.verkauft[platz.getReihe()][platz.getSitz()] = false;
    this.anzahlVerkauftePlaetze--;
  }

  /**
   * Gibt die Anzahl verkaufter Plätze zurück.
   */
  public getAnzahlVerkauftePlaetze(): number {
    return this.anzahlVerkauftePlaetze;
  }

  /**
   * Verkauft die gegebenen Plätze.
   *
   * @require truthy plaetze
   * @require hatPlaetze(plaetze)
   * @require sindVerkaufbar(plaetze)
   *
   * @ensure alle angegebenen Plätze sind verkauft
   */
  public verkaufePlaetze(plaetze: HashSet<Platz>): void {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");
    ok(this.sindVerkaufbar(plaetze), "Vorbedingung verletzt: sindVerkaufbar(plaetze)");

    plaetze.forEach(platz => {
      this.verkaufePlatz(platz);
    });
  }

  /**
   * Prüft, ob die gegebenen Plätze alle verkauft werden können. Dafür wird
   * geschaut, ob keiner der gegebenen Plätze bisher verkauft ist.
   *
   * Liefert true, wenn alle Plätze verkaufbar sind, sonst false.
   *
   * @require truthy plaetze
   * @require hatPlaetze(plaetze)
   */
  public sindVerkaufbar(plaetze: HashSet<Platz>): boolean {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");

    let result = true;
    plaetze.forEach(p => {
      result = result && !this.istPlatzVerkauft(p);
    });
    return result;
  }

  /**
   * Storniert die gegebenen Plätze.
   *
   * @require truthy plaetze
   * @require hatPlaetze(plaetze)
   * @require sindStornierbar(plaetze)
   *
   * @ensure alle angegebenen Plätze sind storniert
   */
  public stornierePlaetze(plaetze: HashSet<Platz>): void {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");
    ok(this.sindStornierbar(plaetze), "Vorbedingung verletzt: sindStornierbar(plaetze)");

    plaetze.forEach(platz => {
      this.stornierePlatz(platz);
    });
  }

  /**
   * Prüft, ob die gegebenen Plätze alle stornierbar sind. Dafür wird
   * geschaut, ob jeder gegebene Platz verkauft ist.
   *
   * Liefert true, wenn alle Plätze stornierbar sind, sonst false.
   *
   * @require truthy plaetze
   * @require hatPlaetze(plaetze)
   */
  public sindStornierbar(plaetze: HashSet<Platz>): boolean {
    ok(plaetze, "Vorbedingung verletzt: truthy plaetze");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");

    let result = true;
    plaetze.forEach(p => {
      result = result && this.istPlatzVerkauft(p);
    });
    return result;
  }

  public toString(): string {
    return "Vorstellung: " + this.anfangszeit + ", " + this.kinosaal + ", " + this.film;
  }
}
