import {ok} from "assert";

export class Datum {
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
   * @ensure getTag() == tag
   * @ensure getMonat() == monat
   * @ensure gibtJahr() == jahr
   */
  constructor(private readonly tag: number, private readonly monat: number, private readonly jahr: number) {
    ok(Datum.istGueltig(tag, monat, jahr), "Vorbedingung verletzt: istGueltig(tag, monat, jahr)");
  }

  /**
   * Liefert das heutige Datum zurück.
   *
   * @ensure result != null
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
   * @return <code>true</code> wenn drei übergebene Zahlen ein gültiges Datum
   *         ergeben, ansonsten <code>false</code>.
   */
  public static istGueltig(tag: number, monat: number, jahr: number) {
    let gueltig = ((monat >= 1) && (monat <= 12));
    if (gueltig) {
      const date = new Date(jahr, monat - 1, tag);
      gueltig = tag === date.getDate() && monat === date.getMonth() + 1 && jahr === date.getFullYear();
    }
    return gueltig;
  }

  /**
   * Vergleicht dieses Datum mit einem anderen Datum.
   *
   * @param datum das andere Datum.
   * @return einen Wert kleiner als 0 falls dieses Datum kleiner als datum
   *         ist, einen Wert größer als 0, falls dieses Datum größer als datum
   *         ist, sonst 0.
   */
  public compareTo(datum: Datum) {
    return this.tageSeit(datum);
  }

  public equals(o: any) {
    if (o instanceof Datum) {
      return this.getTag() === o.getTag()
        && this.getMonat() === o.getMonat()
        && this.getJahr() === o.getJahr();
    }
    return false;
  }

  public hashCode() {
    return this.getJahr() * 365 + this.getMonat() * 31 + this.getTag();
  }

  /**
   * Gibt das Jahr dieses Datums zurück.
   */
  public getJahr() {
    return this.jahr;
  }

  /**
   * Gibt den Monat (im Jahr) dieses Datums zurück (1..12).
   */
  public getMonat() {
    return this.monat;
  }

  /**
   * Gibt den Tag (im Monat) dieses Datums zurück.
   */
  public getTag() {
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
   * @ensure result != null
   */
  public minus(tage: number) {
    ok(tage >= 0, "Vorbedingung verletzt: tage >= 0");
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
   * @ensure result != null
   */
  public plus(tage: number) {
    ok(tage >= 0, "Vorbedingung verletzt: tage >= 0");
    const date = new Date(this.jahr, this.monat - 1, this.tag + tage);
    return new Datum(date.getDate(), date.getMonth() + 1, date.getFullYear());
  }

  /**
   * Gibt den Tag vor diesem Tag zurück.
   *
   * @return den Tag vor diesem Tag.
   */
  public vorherigerTag() {
    return this.minus(1);
  }

  /**
   * Gibt den Tag nach diesem Tag zurück.
   *
   * @return den Tag nach diesem Tag.
   */
  public naechsterTag() {
    return this.plus(1);
  }

  /**
   * Berechnet, wie viele Tage seit dem angegebenen Datum bis zu diesem Datum
   * vergangen sind.
   *
   * @param startDatum das Startdatum des Zeitraums.
   *
   * @require startDatum != null
   */
  public tageSeit(startDatum: Datum) {
    ok(startDatum != null, "Vorbedingung verletzt: startDatum != null");

    const startMillis = startDatum.inMillisekunden();
    const endMillis = this.inMillisekunden();

    return (endMillis - startMillis) / Datum.MILLISECONDS_PER_DAY;
  }

  /**
   * Gibt eine String-Repräsentation dieses Datums zurück.
   *
   * @ensure result != null
   */
  public toString() {
    return this.getFormatiertenString();
  }

  /**
   * Gibt dieses Datum formatiert zurück in der Schreibweise Tag.Monat.Jahr.
   *
   * @ensure result != null
   */
  public getFormatiertenString() {
    return this.tag + "." + this.monat + "." + this.jahr;
  }

  /**
   * Gibt dieses Datum in Millisekunden zurück.
   */
  private inMillisekunden() {
    return new Date(this.jahr, this.monat - 1, this.tag).getTime();
  }
}
