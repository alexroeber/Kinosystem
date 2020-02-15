import {ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Ein Kalenderdatum, bestehend aus Tag, Monat und Jahr.
 *
 * Das Klassenobjekt stellt zwei Hilfsmethoden zur Verfügung, um das heutige
 * Datum zu ermitteln und zu überprüfen, ob drei Ganzzahlen ein gültiges Datum
 * bilden.
 */
export class Datum implements EqualsHashCode {
  private static readonly MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  /**
   * Wählt ein Datum aus (tag, monat, jahr).
   *
   * @param tag Der Tag im Monat (1..31)
   * @param monat Der Monat im Jahr (1..12)
   * @param jahr Das Jahr
   *
   * @require istGueltig(tag, monat, jahr)
   *
   * @ensure getTag() === tag
   * @ensure getMonat() === monat
   * @ensure gibtJahr() === jahr
   */
  constructor(private readonly tag: number, private readonly monat: number, private readonly jahr: number) {
    ok(Datum.istGueltig(tag, monat, jahr), "Vorbedingung verletzt: istGueltig(tag, monat, jahr)");
  }

  /**
   * Liefert das heutige Datum.
   *
   * @ensure truthy result
   */
  public static heute(): Datum {
    const date = new Date();
    return new Datum(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  /**
   * Prüft, ob das durch Tag, Monat und Jahr angegebene Datum gültig ist.
   *
   * @param tag Der Tag im Monat (1..31).
   * @param monat Der Monat im Jahr (1..12).
   * @param jahr Das Jahr.
   * @return <code>true</code> wenn drei übergebene Zahlen ein gültiges Datum ergeben, ansonsten <code>false</code>.
   *
   * @require Ganzzahlen
   */
  public static istGueltig(tag: number, monat: number, jahr: number): boolean {
    ok(tag % 1 === 0 && monat % 1 === 0 && jahr % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");

    if (monat >= 1 && monat <= 12) {
      const date = new Date(jahr, monat - 1, tag);
      return tag === date.getDate() && monat === date.getMonth() + 1 && jahr === date.getFullYear();
    }
    return false;
  }

  public equals(o: any): boolean {
    if (o instanceof Datum) {
      return this.getTag() === o.getTag()
        && this.getMonat() === o.getMonat()
        && this.getJahr() === o.getJahr();
    }
    return false;
  }

  public hashCode(): number {
    return this.getJahr() * 365 + this.getMonat() * 31 + this.getTag();
  }

  /**
   * Gibt das Jahr dieses Datums zurück.
   */
  public getJahr(): number {
    return this.jahr;
  }

  /**
   * Gibt den Monat (im Jahr) dieses Datums zurück (1..12).
   */
  public getMonat(): number {
    return this.monat;
  }

  /**
   * Gibt den Tag (im Monat) dieses Datums zurück.
   */
  public getTag(): number {
    return this.tag;
  }

  /**
   * Subtrahiert von diesem Datum eine übergebene Anzahl an Tagen und gibt das
   * Ergebnis als neues Datum zurück.
   *
   * @param tage Die abzuziehenden Tage
   * @return den Tag, der um die angegebene Anzahl Tage vor diesem Tag liegt.
   *
   * @require tage >= 0
   * @require Ganzzahlen
   * @ensure truthy result
   */
  public minus(tage: number): Datum {
    ok(tage >= 0, "Vorbedingung verletzt: tage >= 0");
    ok(tage % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");

    const date = new Date(this.jahr, this.monat - 1, this.tag - tage);
    return new Datum(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  /**
   * Addiert auf dieses Datum eine übergebene Anzahl von Tage und gibt das
   * Ergebnis als neues Datum zurück.
   *
   * @param tage Die zu addierenden Tage
   * @return den Tag, der um die angegebene Anzahl Tage nach diesem Tag liegt.
   *
   * @require tage >= 0
   * @require Ganzzahlen
   * @ensure truthy result
   */
  public plus(tage: number): Datum {
    ok(tage >= 0, "Vorbedingung verletzt: tage >= 0");
    ok(tage % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");
    const date = new Date(this.jahr, this.monat - 1, this.tag + tage);
    return new Datum(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  /**
   * Gibt den Tag vor diesem Tag zurück.
   *
   * @return den Tag vor diesem Tag.
   */
  public vorherigerTag(): Datum {
    return this.minus(1);
  }

  /**
   * Gibt den Tag nach diesem Tag zurück.
   *
   * @return den Tag nach diesem Tag.
   */
  public naechsterTag(): Datum {
    return this.plus(1);
  }

  /**
   * Berechnet, wie viele Tage seit dem angegebenen Datum bis zu diesem Datum
   * vergangen sind.
   *
   * @param startDatum das Startdatum des Zeitraums.
   *
   * @require truthy startDatum
   */
  public tageSeit(startDatum: Datum): number {
    ok(startDatum, "Vorbedingung verletzt: truthy startDatum");

    const startMillis = startDatum.inMillisekunden();
    const endMillis = this.inMillisekunden();

    return (endMillis - startMillis) / Datum.MILLISECONDS_PER_DAY;
  }

  public toString(): string {
    return this.tag + "." + this.monat + "." + this.jahr;
  }

  /**
   * Gibt dieses Datum in Millisekunden zurück.
   */
  private inMillisekunden(): number {
    return new Date(this.jahr, this.monat - 1, this.tag).getTime();
  }
}
