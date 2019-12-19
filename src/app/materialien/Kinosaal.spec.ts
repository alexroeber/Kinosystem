import {Kinosaal} from "./Kinosaal";
import {Platz} from "../fachwerte/Platz";

function equals(platz: Platz) {
  return (p: Platz) => platz.equals(p);
}

describe("Platz", () => {
  it("teste Konstruktor", () => {
    const k = new Kinosaal("Name", 90, 16);
    expect("Name").toBe(k.getName());
    expect(90).toBe(k.getAnzahlReihen());
    expect(16).toBe(k.getAnzahlSitzeProReihe());
    expect(k.toString).toBeTruthy();
  });

  it("teste hatPlatz", () => {
    const k = new Kinosaal("Name", 90, 16);
    expect(true).toBe(k.hatPlatz(new Platz(80, 8)));
    expect(false).toBe(k.hatPlatz(new Platz(100, 8)));
    expect(true).toBe(k.hatPlatz(new Platz(80, 8)));
    expect(false).toBe(k.hatPlatz(new Platz(80, 20)));
  });

  it("teste getPlaetze", () => {
    const k = new Kinosaal("Name", 3, 4);
    const plaetze = k.getPlaetze();
    expect(true).toBe(plaetze.some(equals(new Platz(0, 0))));
    expect(true).toBe(plaetze.some(equals(new Platz(0, 3))));
    expect(true).toBe(plaetze.some(equals(new Platz(2, 3))));
    expect(true).toBe(plaetze.some(equals(new Platz(2, 3))));
  });

  it("teste equals & hashCode", () => {
    const k1 = new Kinosaal("Name", 3, 4);
    const k2 = new Kinosaal("Name", 3, 4);
    const k3 = new Kinosaal("Name", 4, 4);
    const k4 = new Kinosaal("Name", 3, 3);
    expect(true).toBe(k1.equals(k2));
    expect(k1.hashCode()).toBe(k2.hashCode());
    expect(false).toBe(k1.equals(k3));
    expect(false).toBe(k1.equals(k4));
  });
});
