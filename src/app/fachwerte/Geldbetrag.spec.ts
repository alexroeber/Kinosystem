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
});
