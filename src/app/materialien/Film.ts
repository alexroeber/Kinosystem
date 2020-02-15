import {ok} from "assert";
import {FSK} from "../fachwerte/FSK";

/**
 * Ein Film. Ein Film besteht aus einem Titel, einer Länge in Minuten, einer
 * Altersfreigabe und einer Angabe darueber, ob der Film Überlänge hat.
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
   * @require typeof titel === "string"
   * @require laenge > 0
   * @require truthy fsk
   *
   * @ensure getTitel() === titel
   * @ensure getLaenge() === laenge
   * @ensure getFSK() === fsk
   * @ensure hatUeberlaenge() === ueberlaenge
   */
  public constructor(private titel: string, private laenge: number, private fsk: FSK, private ueberlaenge: boolean) {
    ok(typeof titel === "string", "Vorbedingung verletzt: typeof titel === \"string\"");
    ok(laenge > 0, "Vorbedingung verletzt: laenge > 0");
    ok(fsk, "Vorbedingung verletzt: truthy fsk");
  }

  /**
   * Gibt den Titel dieses Films zurück.
   */
  public getTitel(): string {
    return this.titel;
  }

  /**
   * Gibt die Länge dieses Films in Minuten zurück.
   */
  public getLaenge(): number {
    return this.laenge;
  }

  /**
   * Gibt die Altersfreigabe fuer diesen Film zurück.
   */
  public getFSK(): FSK {
    return this.fsk;
  }

  /**
   * Gibt zurück, ob dieser Film Überlaenge hat.
   */
  public hatUeberlaenge(): boolean {
    return this.ueberlaenge;
  }

  public toString(): string {
    return this.titel + ", " + this.fsk;
  }
}
