import {Platz} from "./Platz";

describe("Platz", () => {
  it("teste 0 0 gültig", () => {
    const platz = new Platz(0, 0);
    expect(platz.getReihe()).toBe(0);
    expect(platz.getSitz()).toBe(0);
  });

  it("teste getter", () => {
    const platz = new Platz(123, 456);
    expect(platz.getReihe()).toBe(123);
    expect(platz.getSitz()).toBe(456);
  });

  it("teste equals & hashCode", () => {
    const platz1 = new Platz(1, 2);
    const platz2 = new Platz(1, 2);
    const platz3 = new Platz(1, 3);
    const platz4 = new Platz(2, 2);
    expect(platz1.equals(platz2)).toBe(true);
    expect(platz1.hashCode()).toBe(platz2.hashCode());
    expect(platz1.equals(platz3)).toBe(false);
    expect(platz1.equals(platz4)).toBe(false);
  });
});
