import {ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Eine Uhrzeit, angegeben in Stunden und Minuten.
 *
 * @author SE2-Team
 * @version SoSe 2014
 */
export class Uhrzeit implements EqualsHashCode {
  /**
   * Wählt eine Uhrzeit aus.
   *
   * @param stunden der Stundenanteil der Uhrzeit.
   * @param minuten der Minutenanteil der Uhrzeit.
   *
   * @require stunden >= 0 && stunden < 24
   * @require minuten >= 0 && minuten < 60
   * @ensure getStunden() == stunden
   * @ensure getMinuten() == minuten
   */
  public constructor(private readonly stunden: number, private readonly minuten: number) {
    ok(stunden >= 0 && stunden < 24, "Vorbedingung verletzt: stunden >= 0 && stunden < 24");
    ok(minuten >= 0 && minuten < 60, "Vorbedingung verletzt: minuten >= 0 && minuten < 60");
  }

  /**
   * Gibt den Stunden-Anteil dieser Uhrzeit zurück.
   *
   * @ensure (result >= 0) && (result < 24)
   */
  public getStunden() {
    return this.stunden;
  }

  /**
   * Gibt den Minuten-Anteil dieser Uhrzeit zurück.
   *
   * @ensure (result >= 0) && (result < 60)
   */
  public getMinuten() {
    return this.minuten;
  }

  /**
   * Berechnet die Zeitdauer zwischen der angegebenen Startzeit und dieser
   * Uhrzeit in Minuten. Wenn die Startzeit später als diese Uhrzeit ist, wird
   * angenommen, dass der Zeitraum über Mitternacht geht. Wenn die Startzeit
   * gleich dieser Uhrzeit ist, wird Null zurückgegeben.
   *
   * @param startzeit die Startzeit.
   *
   * @require startzeit != null
   * @ensure result >= 0
   */
  public minutenSeit(startzeit: Uhrzeit) {
    ok(startzeit != null, "Vorbedingung verletzt: startzeit != null");

    const amSelbenTag = this.stunden > startzeit.stunden
      || (this.stunden === startzeit.stunden && this.minuten >= startzeit.minuten);

    const u2 = amSelbenTag ? this : startzeit;
    const u1 = amSelbenTag ? startzeit : this;

    let result = (u2.stunden - u1.stunden) * 60 + u2.minuten
      - u1.minuten;

    if (!amSelbenTag) {
      result = 24 * 60 - result;
    }
    return result;
  }

  public compareTo(u: Uhrzeit) {
    return (this.stunden - u.stunden) * 60 + this.minuten - u.minuten;
  }

  public equals(o: any) {
    if (o instanceof Uhrzeit) {
      return this.stunden === o.stunden && this.minuten === o.minuten;
    }
    return false;
  }

  public hashCode() {
    return this.stunden * 60 + this.minuten;
  }

  public toString() {
    return this.getFormatiertenString();
  }

  /**
   * Gibt diese Uhrzeit formatiert zurück in der Schreibweise Stunden:Minuten.
   *
   * @ensure result != null
   */
  public getFormatiertenString() {
    let result = this.stunden + ":";
    if (this.minuten < 10) {
      result += "0";
    }
    return result + this.minuten;
  }
}
