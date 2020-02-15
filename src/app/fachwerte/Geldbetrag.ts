import {fail, ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Diese Klasse stellt den Geldbetrag dar.
 *
 */
export class Geldbetrag implements EqualsHashCode {
  private betrag: number;

  private constructor() {
  }

  /**
   * Diese Methode vergleicht zwei Geldbeträge mit dem größer-oder-gleich Operator
   * @param x der erste Geldbetrag
   * @param y der zweite Geldbetrag
   * @return <code>true</code> wenn der erste Geldbetrag größer oder gleich dem zweiten ist, <code>false</code> sonst
   *
   * @require truthy x && truthy y
   */
  public static groesserGleich(x: Geldbetrag, y: Geldbetrag): boolean {
    ok(x && y, "Vorbedingung verletzt: truthy x && truthy y");

    return x.betrag >= y.betrag;
  }

  /**
   * Diese Methode addiert zwei Geldbeträge. Man beachte: Mit negativen Geldbeträgen ist auch subtrahieren möglich.
   *
   * @param x der eine Geldbetrag
   * @param y der andere Geldbetrag
   * @return die Summe der beiden Geldbeträge
   *
   * @require truthy x && truthy y
   */
  public static addiere(x: Geldbetrag, y: Geldbetrag): Geldbetrag {
    ok(x && y, "Vorbedingung verletzt: truthy x && truthy y");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag + y.betrag;
    return gB;
  }

  /**
   * Diese Methode subtrahiert zwei Geldbeträge. Man beachte: Mit negativen Geldbeträgen ist auch addieren möglich.
   *
   * @param x der eine Geldbetrag
   * @param y der andere Geldbetrag
   * @return die Summe der beiden Geldbeträge
   *
   * @require truthy x && truthy y
   */
  public static subtrahiere(x: Geldbetrag, y: Geldbetrag): Geldbetrag {
    ok(x && y, "Vorbedingung verletzt: truthy x && truthy y");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag - y.betrag;
    return gB;
  }

  /**
   * Diese Methode vervielfacht einen Geldbetrag.
   *
   * @param x der zu vervielfachende Geldbetrag
   * @param y der Faktor
   * @return der vervielfachte Geldbetrag
   *
   * @require truthy x
   * @require Ganzzahlen
   */
  public static multipliziere(x: Geldbetrag, y: number): Geldbetrag {
    ok(x, "Vorbedingung verletzt: truthy x");
    ok(y % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag * y;
    return gB;
  }

  /**
   * Diese Methode überprüft, ob der Übergebene String einen gültigen Geldbetrag ergeben würde.
   * @param s der übergebene String
   * @require typeof s === "string"
   */
  public static istGueltig(s: string): boolean {
    ok(typeof s === "string", "Vorbedingung verletzt: typeof s === \"string\"");

    const match = s.match(/-?\d{1,9}(,\d{2})?( €)?/);
    return match !== null && match[0].length === s.length;
  }

  /**
   * Wandelt einen String in einen Geldbetrag um.
   *
   * @param s der String, der einen Geldbetrag repräsentiert. ("-?E{1,9}(,cc)?( €)?")
   * @return der entehende Geldbetrag
   *
   * @require istGueltig(s)
   * @ensure truthy result
   */
  public static parseGeldbetrag(s: string): Geldbetrag;

  /**
   * Wandelt einen "int" und einen "byte" in einen Geldbetrag um.
   *
   * @param euro der Euroteil als beliebige Ganzzahl
   * @param cent der Centteil als Ganzzahl von 0 bis 99
   * @return der enstehende Geldbetrag.
   * @require Ganzzahlen
   * @require 0 <= cent < 100
   * @ensure truthy result
   */
  public static parseGeldbetrag(euro: number, cent: number): Geldbetrag;
  public static parseGeldbetrag(v1: string | number, v2?: number): Geldbetrag {
    if (typeof v1 === "string" && !v2) {
      return this.parseGeldbetragString(v1 as string);
    } else if (typeof v1 === "number" && typeof v2 === "number") {
      return this.parseGeldbetragSplit(v1, v2);
    } else {
      fail("nonexistente Methode");
    }
  }

  /**
   * Diese Methode setzt parseGeldbetrag(s: string) um.
   */
  private static parseGeldbetragString(s: string): Geldbetrag {
    ok(Geldbetrag.istGueltig(s), "Vorbedingung verletzt: istGueltig(s)");

    if (s.endsWith("€")) {
      s = s.slice(0, s.length - 1);
    }
    const splits = s.split(",");
    if (splits.length > 1) {
      return this.parseGeldbetragSplit(+splits[0], +splits[1]);
    } else {
      return this.parseGeldbetragSplit(+s, 0);
    }
  }

  /**
   * Diese Methode setzt parseGeldbetrag(euro: number, cent: number) um.
   */
  private static parseGeldbetragSplit(euro: number, cent: number): Geldbetrag {
    ok(euro % 1 === 0 && cent % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");
    ok(cent >= 0 && cent <= 99, "Vorbedingung verletzt: 0 <= cent < 100");

    const gB = new Geldbetrag();
    if (euro < 0) {
      gB.betrag = euro * 100 - cent;
    } else {
      gB.betrag = euro * 100 + cent;
    }
    return gB;
  }

  public toString(): string {
    let s = "";
    s += Math.floor(this.betrag / 100);
    if (s === "0" && this.betrag < 0) {
      s = "-0";
    }
    const cent = Math.abs(this.betrag) % 100;
    if (cent > 0) {
      s = s + ",";
      if (cent <= 9) {
        s += "0";
      }
      s += cent;
    } else {
      s += ",00";
    }
    return s + " €";
  }

  public equals(o: any): boolean {
    if (o instanceof Geldbetrag) {
      return this.betrag === o.betrag;
    }
    return false;
  }

  public hashCode(): number {
    return this.betrag;
  }
}
