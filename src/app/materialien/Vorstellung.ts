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
 *
 * @author SE2-Team
 * @version SoSe 2014
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
   * @require kinosaal != null
   * @require film != null
   * @require anfangszeit != null
   * @require endzeit != null
   * @require datum != null
   * @require preis >= 0
   *
   * @ensure getKinosaal() == kinosaal
   * @ensure getFilm() == film
   * @ensure getAnfangszeit() == anfangszeit
   * @ensure getEndzeit() == endzeit
   * @ensure getDatum() == datum
   * @ensure getPreis() == preis
   */
  public constructor(private readonly kinosaal: Kinosaal, private readonly film: Film, private readonly anfangszeit: Uhrzeit,
                     private readonly endzeit: Uhrzeit, private readonly datum: Datum, private readonly preis: Geldbetrag) {
    ok(kinosaal != null, "Vorbedingung verletzt: saal != null");
    ok(film != null, "Vorbedingung verletzt: film != null");
    ok(anfangszeit != null, "Vorbedingung verletzt: anfangszeit != null");
    ok(endzeit != null, "Vorbedingung verletzt: endzeit != null");
    ok(datum != null, "Vorbedingung verletzt: datum != null");

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
   * @ensure result != null
   */
  public getKinosaal() {
    return this.kinosaal;
  }

  /**
   * Gibt den Film zurück, der in dieser Vorstellung gezeigt wird.
   *
   * @ensure result != null
   */
  public getFilm() {
    return this.film;
  }

  /**
   * Gibt die Uhrzeit zurück, zu der diese Vorstellung beginnt.
   *
   * @ensure result != null
   */
  public getAnfangszeit() {
    return this.anfangszeit;
  }

  /**
   * Gibt die Uhrzeit zurück, zu der diese Vorstellung endet.
   *
   * @ensure result != null
   */
  public getEndzeit() {
    return this.endzeit;
  }

  /**
   * Gibt das Datum zurück, an dem diese Vorstellung läuft.
   *
   * @ensure result != null
   */
  public getDatum() {
    return this.datum;
  }

  /**
   * Gibt den Verkaufspreis als int für Karten zu dieser Vorstellung zurück.
   *
   * @ensure result > 0
   */
  public getPreis() {
    return this.preis;
  }

  /**
   * Prüft, ob der angegebene Sitzplatz in dieser Vorstellung vorhanden ist.
   *
   * @param platz der Sitzplatz.
   *
   * @return <code>true</code>, falls der Platz existiert, <code>false</code>
   *         sonst.
   *
   * @require platz != null
   */
  public hatPlatz(platz: Platz) {
    ok(platz != null, "Vorbedingung verletzt: platz != null");

    return this.kinosaal.hatPlatz(platz);
  }

  /**
   * Prüft, ob alle angegebenen Sitzplätze in dieser Vorstellung vorhanden
   * sind.
   *
   * @param plaetze die Sitzplätze.
   *
   * @return true, falls alle Plätze existieren, false sonst.
   *
   * @require plaetze != null
   */
  public hatPlaetze(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");

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
   *
   * @return Gesamtpreis als int
   *
   * @require plaetze != null
   * @require hatPlaetze(plaetze)
   */
  public getPreisFuerPlaetze(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");

    return Geldbetrag.multipliziere(this.preis, plaetze.size());
  }

  /**
   * Gibt an, ob ein bestimmter Platz bereits verkauft ist.
   *
   * @param platz der Sitzplatz.
   *
   * @return <code>true</code>, falls der Platz verkauft ist,
   *         <code>false</code> sonst.
   *
   * @require platz != null
   * @require hatPlatz(platz)
   */
  public istPlatzVerkauft(platz: Platz) {
    ok(platz != null, "Vorbedingung verletzt: platz != null");
    ok(this.hatPlatz(platz), "Vorbedingung verletzt: hatPlatz(platz)");

    return this.verkauft[platz.getReihe()][platz.getSitz()];
  }

  /**
   * Verkauft einen Platz.
   *
   * @param platz der Sitzplatz.
   *
   * @require platz != null
   * @require hatPlatz(platz)
   * @require !istPlatzVerkauft(reihe, sitz)
   *
   * @ensure istPlatzVerkauft(reihe, sitz)
   */
  public verkaufePlatz(platz: Platz) {
    ok(platz != null, "Vorbedingung verletzt: platz != null");
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
   * @require platz != null
   * @require hatPlatz(reihe, sitz)
   * @require istPlatzVerkauft(reihe, sitz)
   *
   * @ensure !istPlatzVerkauft(reihe, sitz)
   */
  public stornierePlatz(platz: Platz) {
    ok(platz != null, "Vorbedingung verletzt: platz != null");
    ok(this.hatPlatz(platz), "Vorbedingung verletzt: hatPlatz(platz)");
    ok(this.istPlatzVerkauft(platz), "Vorbedingung verletzt: istPlatzVerkauft(platz)");

    this.verkauft[platz.getReihe()][platz.getSitz()] = false;
    this.anzahlVerkauftePlaetze--;
  }

  /**
   * Gibt die Anzahl verkaufter Plätze zurück.
   */
  public getAnzahlVerkauftePlaetze() {
    return this.anzahlVerkauftePlaetze;
  }

  /**
   * Verkauft die gegebenen Plätze.
   *
   * @require plaetze != null
   * @require hatPlaetze(plaetze)
   * @require sindVerkaufbar(plaetze)
   *
   * @ensure alle angegebenen Plätze sind verkauft
   */
  public verkaufePlaetze(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");
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
   * @require plaetze != null
   * @require hatPlaetze(plaetze)
   */
  public sindVerkaufbar(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");
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
   * @require plaetze != null
   * @require hatPlaetze(plaetze)
   * @require sindStornierbar(plaetze)
   *
   * @ensure alle angegebenen Plätze sind storniert
   */
  public stornierePlaetze(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");
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
   * @require plaetze != null
   * @require hatPlaetze(plaetze)
   */
  public sindStornierbar(plaetze: HashSet<Platz>) {
    ok(plaetze != null, "Vorbedingung verletzt: plaetze != null");
    ok(this.hatPlaetze(plaetze), "Vorbedingung verletzt: hatPlaetze(plaetze)");

    let result = true;
    plaetze.forEach(p => {
      result = result && this.istPlatzVerkauft(p);
    });
    return result;
  }

  public toString() {
    return "Vorstellung: " + this.anfangszeit + ", " + this.kinosaal + ", " + this.film;
  }
}
