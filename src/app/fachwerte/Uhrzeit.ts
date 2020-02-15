import {ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Eine Uhrzeit, angegeben in Stunden und Minuten.
 */
export class Uhrzeit implements EqualsHashCode {
  /**
   * Wählt eine Uhrzeit aus.
   *
   * @param stunden der Stundenanteil der Uhrzeit.
   * @param minuten der Minutenanteil der Uhrzeit.
   *
   * @require 0 <= stunden < 24
   * @require 0 <= minuten < 60
   * @ensure getStunden() === stunden
   * @ensure getMinuten() === minuten
   */
  public constructor(private readonly stunden: number, private readonly minuten: number) {
    ok(stunden >= 0 && stunden < 24, "Vorbedingung verletzt: 0 <= stunden < 24");
    ok(minuten >= 0 && minuten < 60, "Vorbedingung verletzt: 0 <= minuten < 60");
  }

  /**
   * Gibt den Stunden-Anteil dieser Uhrzeit zurück.
   *
   * @ensure 0 <= result < 24
   */
  public getStunden(): number {
    return this.stunden;
  }

  /**
   * Gibt den Minuten-Anteil dieser Uhrzeit zurück.
   *
   * @ensure 0 <= minuten < 60
   */
  public getMinuten(): number {
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
   * @require truthy startzeit
   * @ensure result >= 0
   */
  public minutenSeit(startzeit: Uhrzeit): number {
    ok(startzeit, "Vorbedingung verletzt: truthy startzeit");

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

  /**
   * Vergleicht diese Uhrzeit mit einer anderen Uhrzeit.
   *
   * @param u die andere Uhrzeit.
   * @return einen Wert kleiner als 0 falls dieses Datum kleiner als datum ist, einen Wert größer als 0, falls dieses
   * Datum größer als datum ist, sonst 0.
   */
  public compareTo(u: Uhrzeit): number {
    return (this.stunden - u.stunden) * 60 + this.minuten - u.minuten;
  }

  public equals(o: any): boolean {
    if (o instanceof Uhrzeit) {
      return this.stunden === o.stunden && this.minuten === o.minuten;
    }
    return false;
  }

  public hashCode(): number {
    return this.stunden * 60 + this.minuten;
  }

  public toString(): string {
    let result = this.stunden + ":";
    if (this.minuten < 10) {
      result += "0";
    }
    return result + this.minuten;
  }
}
