import {ok} from "assert";
import {Platz} from "../fachwerte/Platz";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Ein Kinosaal. Ein Kinosaal hat einen Namen und kennt die Anzahl seiner Sitzplätze.
 */
export class Kinosaal implements EqualsHashCode {
  /**
   * Initialisiert einen neuen Kinosaal.
   *
   * @param name der Name des Kinosaals.
   * @param anzahlReihen die Anzahl der Reihen.
   * @param anzahlSitzeProReihe die Anzahl der Sitze Pro Reihe.
   *
   * @require anzahlReihen > 0
   * @require anzahlSitzeProReihe > 0
   *
   * @ensure getName() === name
   * @ensure getAnzahlReihen() === anzahlReihen
   * @ensure getAnzahlSitzeProReihe() === anzahlSitzeProReihe
   */
  public constructor(private name: string, private anzahlReihen: number, private anzahlSitzeProReihe: number) {
    ok(anzahlReihen > 0, "Vorbedingung verletzt: anzahlReihen > 0");
    ok(anzahlSitzeProReihe > 0, "Vorbedingung verletzt: anzahlSitzeProReihe > 0");
  }

  /**
   * Gibt den Namen dieses Kinosaals zurück.
   */
  public getName(): string {
    return this.name;
  }

  /**
   * Gibt die Anzahl der Reihen in diesem Kinosaal zurück.
   *
   * @ensure result > 0
   */
  public getAnzahlReihen(): number {
    return this.anzahlReihen;
  }

  /**
   * Gibt die Anzahl der Sitze pro Reihe in diesem Kinosaal zurück.
   *
   * @ensure result > 0
   */
  public getAnzahlSitzeProReihe(): number {
    return this.anzahlSitzeProReihe;
  }

  /**
   * Gibt eine Liste der Plätze in diesem Kinosaal zurück.
   *
   * @ensure truthy result
   */
  public getPlaetze(): Platz[] {
    const kinoPlaetze: Platz[] = [];
    for (let i = 0; i < this.anzahlReihen; i++) {
      for (let j = 0; j < this.anzahlSitzeProReihe; j++) {
        kinoPlaetze.push(new Platz(i, j));
      }
    }
    return kinoPlaetze;
  }

  /**
   * Prüft, ob es den angegebenen Platz in dem Kinosaal gibt.
   *
   * @param platz der Platz.
   * @return <code>true</code>, falls der Platz existiert, <code>false</code> sonst.
   *
   * @require truthy platz
   */
  public hatPlatz(platz: Platz): boolean {
    ok(platz, "Vorbedingung verletzt: truthy platz");

    return (platz.getReihe() >= 0 && platz.getReihe() < this.anzahlReihen)
      && (platz.getSitz() >= 0 && platz.getSitz() < this.anzahlSitzeProReihe);
  }

  public equals(obj: any): boolean {
    if (obj instanceof Kinosaal) {
      return this.name === obj.name
        && this.anzahlReihen === obj.anzahlReihen
        && this.anzahlSitzeProReihe === obj.anzahlSitzeProReihe;
    }
    return false;
  }

  public hashCode(): number {
    const prime = 31;
    let result = 1;
    result = prime * result + this.anzahlReihen;
    result = prime * result + this.anzahlSitzeProReihe;
    result = prime * result + this.name.length;
    return result;
  }

  public toString(): string {
    return "Kinosaal: Name=" + this.name;
  }
}
