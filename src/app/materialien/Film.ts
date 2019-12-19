import {ok} from "assert";
import {FSK} from "../fachwerte/FSK";

/**
 * Ein Film. Ein Film besteht aus einem Titel, einer Länge in Minuten, einer
 * Altersfreigabe und einer Angabe darueber, ob der Film Überlänge hat.
 *
 * @author SE2-Team
 * @version SoSe 2014
 */
export class Film {
  /**
   * Initialisiert einen neuen Film.
   *
   * @param titel der Titel.
   * @param laenge die Laenge in Minuten.
   * @param fsk die Altersfreigabe fuer diesen Film.
   * @param ueberlaenge hat der Film Überlaenge?
   *
   * @require titel != null
   * @require laenge > 0
   * @require fsk != null
   *
   * @ensure getTitel() == titel
   * @ensure getLaenge() == laenge
   * @ensure getFSK() == fsk
   * @ensure hatUeberlaenge() == ueberlaenge
   */
  public constructor(private titel: string, private laenge: number, private fsk: FSK, private ueberlaenge: boolean) {
    ok(titel != null, "Vorbedingung verletzt: titel != null");
    ok(laenge > 0, "Vorbedingung verletzt: laenge > 0");
    ok(fsk != null, "Vorbedingung verletzt: fsk != null");
  }

  /**
   * Gibt den Titel dieses Films zurück.
   *
   * @ensure result != null
   */
  public getTitel() {
    return this.titel;
  }

  /**
   * Gibt die Länge dieses Films in Minuten zurück.
   */
  public getLaenge() {
    return this.laenge;
  }

  /**
   * Gibt die Altersfreigabe fuer diesen Film zurück.
   *
   * @ensure result != null
   */
  public getFSK() {
    return this.fsk;
  }

  /**
   * Gibt zurück, ob dieser Film Überlaenge hat.
   */
  public hatUeberlaenge() {
    return this.ueberlaenge;
  }

  public toString() {
    return "Film: Titel=" + this.titel;
  }

  public getFormatiertenString() {
    return this.titel + ", " + this.fsk;
  }
}
