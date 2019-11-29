import {Datum} from "./Datum";

describe("Datum", () => {
  it("Teste compareTo", () => {
    const datum1 = new Datum(1, 12, 2018);
    const datum2 = new Datum(1, 1, 2019);
    expect(datum1.compareTo(datum2)).toBeLessThan(0);
    expect(datum2.compareTo(datum1)).toBeGreaterThan(0);
    expect(datum1.compareTo(datum1)).toBe(0);
  });

  it("Teste Konstruktor", () => {
    const datum = new Datum(1, 12, 2019);
    expect(datum.getTag()).toBe(1);
    expect(datum.getMonat()).toBe(12);
    expect(datum.getJahr()).toBe(2019);
  });

  it("Teste tageSeit", () => {
    const datum1 = new Datum(31, 12, 2006);
    const datum2 = new Datum(1, 1, 2007);
    expect(datum2.tageSeit(datum1)).toBe(1);
  });

  it("Teste vorherigerTag", () => {
    const datum1 = new Datum(31, 12, 2006);
    const datum2 = new Datum(1, 1, 2007);
    expect(datum2.vorherigerTag()).toEqual(datum1);
  });

  it("Teste naechsterTag", () => {
    const datum1 = new Datum(31, 12, 2006);
    const datum2 = new Datum(1, 1, 2007);
    expect(datum1.naechsterTag()).toEqual(datum2);
  });

  it("Teste minus", () => {
    const datum1 = new Datum(31, 12, 2006);
    const datum2 = new Datum(1, 1, 2007);
    const datum3 = new Datum(15, 12, 2006);
    expect(datum2.minus(1)).toEqual(datum1);
    expect(datum1.minus(16)).toEqual(datum3);
  });

  it("Teste plus", () => {
    const datum1 = new Datum(31, 12, 2007);
    const datum2 = new Datum(1, 1, 2008);
    const datum3 = new Datum(1, 3, 2008);
    expect(datum1.plus(1)).toEqual(datum2);
    expect(datum2.plus(60)).toEqual(datum3);
  });

  it("Teste equals & hashCode", () => {
    const datum1 = new Datum(1, 12, 2007);
    const datum2 = new Datum(1, 12, 2007);
    const datum3 = new Datum(1, 12, 2008);
    const datum4 = new Datum(1, 11, 2007);
    const datum5 = new Datum(2, 12, 2007);
    expect(datum1.equals(datum2)).toBe(true);
    expect(datum1.hashCode()).toBe(datum2.hashCode());
    expect(datum1.equals(datum3)).toBe(false);
    expect(datum1.equals(datum4)).toBe(false);
    expect(datum1.equals(datum5)).toBe(false);
  });

  it("Teste istGueltig", () => {
    expect(Datum.istGueltig(32, 12, 2006)).toBe(false);
    expect(Datum.istGueltig(-1, 12, 2006)).toBe(false);
    expect(Datum.istGueltig(1, 12, 2006)).toBe(true);
    expect(Datum.istGueltig(31, 12, 2006)).toBe(true);

    expect(Datum.istGueltig(1, -1, 2006)).toBe(false);
    expect(Datum.istGueltig(1, 13, 2006)).toBe(false);
    expect(Datum.istGueltig(1, 1, 2006)).toBe(true);
  });

  it("Teste heute", () => {
    expect(Datum.heute()).toBeDefined();
  });
});
