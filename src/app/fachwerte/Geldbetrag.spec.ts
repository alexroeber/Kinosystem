import {Geldbetrag} from "./Geldbetrag";

describe("Geldbetrag", () => {
  let betrag1: Geldbetrag;
  let betrag2: Geldbetrag;
  let betrag3: Geldbetrag;

  beforeEach(() => {
    betrag1 = Geldbetrag.parseGeldbetrag(4, 50);
    betrag2 = Geldbetrag.parseGeldbetrag("4,50");
    betrag3 = Geldbetrag.parseGeldbetrag("9,00 €");
  });

  it("Teste equals", () => {
    expect(betrag1.equals(betrag2)).toBe(true);
    expect(betrag1.equals(betrag3)).toBe(false);
  });

  it("Teste toString", () => {
    expect(betrag1.toString()).toEqual(betrag2.toString());
    expect(betrag3.toString()).toEqual("9,00 €");
  });

  it("Teste hashCode", () => {
    expect(betrag1.hashCode()).toEqual(betrag2.hashCode());
  });

  it("Fehlerbehebung: Teste istGueltig", () => {
    expect(true).toBe(Geldbetrag.istGueltig("0,00"));
    expect(true).toBe(Geldbetrag.istGueltig("-0,01"));
    expect(true).toBe(Geldbetrag.istGueltig("0,99"));
    expect(true).toBe(Geldbetrag.istGueltig("-0,99"));
    expect(true).toBe(Geldbetrag.istGueltig("1,00"));
    expect(true).toBe(Geldbetrag.istGueltig("-1,00"));
    expect(true).toBe(Geldbetrag.istGueltig("1000,00"));
    expect(true).toBe(Geldbetrag.istGueltig("999999999,99"));
    expect(false).toBe(Geldbetrag.istGueltig("1000000000,00"));
    expect(false).toBe(Geldbetrag.istGueltig("0,000"));
    expect(false).toBe(Geldbetrag.istGueltig("0,001"));
    expect(false).toBe(Geldbetrag.istGueltig("-0,000"));
    expect(false).toBe(Geldbetrag.istGueltig("--0,00"));
    expect(false).toBe(Geldbetrag.istGueltig("0,000"));

    expect(true).toBe(Geldbetrag.istGueltig("0"));
    expect(true).toBe(Geldbetrag.istGueltig("-0"));
    expect(true).toBe(Geldbetrag.istGueltig("1"));
    expect(true).toBe(Geldbetrag.istGueltig("-1"));
    expect(true).toBe(Geldbetrag.istGueltig("10"));
    expect(true).toBe(Geldbetrag.istGueltig("-10"));
    expect(true).toBe(Geldbetrag.istGueltig("999999999"));
    expect(false).toBe(Geldbetrag.istGueltig("1000000000"));
  });

  it("Fehlerbehebung: Teste toString", () => {
    expect("0,00 €").toEqual(Geldbetrag.parseGeldbetrag(0, 0).toString());
    expect("1000,00 €").toEqual(Geldbetrag.parseGeldbetrag(1000, 0).toString());
    expect("0,09 €").toEqual(Geldbetrag.parseGeldbetrag(0, 9).toString());
    expect("0,10 €").toEqual(Geldbetrag.parseGeldbetrag(0, 10).toString());
    expect("0,99 €").toEqual(Geldbetrag.parseGeldbetrag(0, 99).toString());
    expect("1,00 €").toEqual(Geldbetrag.parseGeldbetrag(1, 0).toString());
    expect("255,42 €").toEqual(Geldbetrag.parseGeldbetrag(255, 42).toString());
    expect("999999999,99 €").toEqual(Geldbetrag.parseGeldbetrag(999999999, 99).toString());

    expect("0,00 €").toEqual(Geldbetrag.parseGeldbetrag("0").toString());
    expect("10,00 €").toEqual(Geldbetrag.parseGeldbetrag("10").toString());
    expect("10,00 €").toEqual(Geldbetrag.parseGeldbetrag("10 €").toString());
    expect("999999999,00 €").toEqual(Geldbetrag.parseGeldbetrag("999999999").toString());
    expect("999999999,00 €").toEqual(Geldbetrag.parseGeldbetrag("999999999 €").toString());
  });
});
