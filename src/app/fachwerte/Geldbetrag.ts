import {ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Diese Klasse stellt den Geldbetrag dar.
 *
 * @author Ochsenkopfantenne
 *
 */
// TODO: Fehler mit Tests finden und beheben
export class Geldbetrag implements EqualsHashCode {
  private betrag: number;

  private constructor() {
  }

  public static groesserGleich(x: Geldbetrag, y: Geldbetrag) {
    return x.betrag >= y.betrag;
  }

  /**
   * Diese Methode addiert zwei Geldbeträge. Man beachte: Mit negativen
   * Geldbeträgen ist auch subtrahieren möglich.
   *
   * @param x
   *            der eine Geldbetrag
   * @param y
   *            der andere Geldbetrag
   * @return die Summe der beiden Geldbeträge
   *
   * @require x != null && y != null
   */
  public static addiere(x: Geldbetrag, y: Geldbetrag) {
    ok(x, "Vorbedingung verletzt: x sollte truthy sein");
    ok(y, "Vorbedingung verletzt: y sollte truthy sein");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag + y.betrag;
    return gB;
  }

  public static subtrahiere(x: Geldbetrag, y: Geldbetrag) {
    ok(x, "Vorbedingung verletzt: x sollte truthy sein");
    ok(y, "Vorbedingung verletzt: y sollte truthy sein");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag - y.betrag;
    return gB;
  }

  /**
   * Diese Methode vervielfacht einen Geldbetrag.
   *
   * @param x
   *            der zu vervielfachende Geldbetrag
   * @param y
   *            der Faktor
   * @return der vervielfachte Geldbetrag
   *
   * @require x != null
   */
  public static multipliziere(x: Geldbetrag, y: number) {
    ok(x, "Vorbedingung verletzt: x sollte truthy sein");

    const gB = new Geldbetrag();
    gB.betrag = x.betrag * y;
    return gB;
  }

  public static istGueltig(s: string) {
    const match = s.match(/-?\d{1,9}(,\d{2})?( €)?/);
    return match !== null && match[0].length === s.length;
  }

  public static parseGeldbetrag(s: string): Geldbetrag;
  public static parseGeldbetrag(euro: number, cent: number): Geldbetrag;
  public static parseGeldbetrag(v1: string | number, v2?: number) {
    if (typeof v1 === "string" && !v2) {
      return this.parseGeldbetragString(v1 as string);
    } else if (typeof v1 === "number" && typeof v2 === "number") {
      return this.parseGeldbetragSplit(v1, v2);
    }
  }

  /**
   * Wandelt einen String in einen Geldbetrag um, falls dies möglich ist.
   *
   * @param s
   *            der String, der einen Geldbetrag repräsentiert. ("E+,cc( €)?")
   * @return der entehende Geldbetrag
   *
   * @require istGueltig(s)
   */
  private static parseGeldbetragString(s: string) {
    ok(Geldbetrag.istGueltig(s), "Vorbedingung verletzt: s sollte gueltig sein");

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
   * Wandelt einen "int" und einen "byte" in einen Geldbetrag um, falls dies
   * möglich ist.
   *
   * @param euro
   *            der Euroteil als beliebige Ganzzahl
   * @param cent
   *            der Centteil als Ganzzahl von 0 bis 99
   * @return der enstehende Geldbetrag.
   */
  private static parseGeldbetragSplit(euro: number, cent: number) {
    ok(cent >= 0 && cent <= 99, "Vorbedingung verletzt: cent sollte valider Centbetrag sein");

    const gB = new Geldbetrag();
    if (euro < 0) {
      gB.betrag = euro * 100 - cent;
    } else {
      gB.betrag = euro * 100 + cent;
    }
    return gB;
  }

  public toString() {
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

  public equals(o: any) {
    if (o instanceof Geldbetrag) {
      return this.betrag === o.betrag;
    }
    return false;
  }

  public hashCode() {
    return this.betrag;
  }
}
