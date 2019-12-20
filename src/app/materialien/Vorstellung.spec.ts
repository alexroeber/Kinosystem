import {Kinosaal} from "./Kinosaal";
import {Film} from "./Film";
import {Uhrzeit} from "../fachwerte/Uhrzeit";
import {FSK} from "../fachwerte/FSK";
import {Vorstellung} from "./Vorstellung";
import {Datum} from "../fachwerte/Datum";
import {Geldbetrag} from "../fachwerte/Geldbetrag";
import {Platz} from "../fachwerte/Platz";

describe("Vorstellung", () => {
  let v: Vorstellung;
  let saal: Kinosaal;
  let film: Film;
  const u1 = new Uhrzeit(16, 45);
  const u2 = new Uhrzeit(20, 15);
  const datum = new Datum(11, 7, 2008);

  beforeEach(() => {
    saal = new Kinosaal("A", 20, 50);
    film = new Film("Filmname", 178, FSK.FSK12, true);
    v = new Vorstellung(saal, film, u1, u2, datum, Geldbetrag.parseGeldbetrag(12, 30));
  });

  it("teste Konstruktor", () => {
    expect(saal).toBe(v.getKinosaal());
    expect(film).toBe(v.getFilm());
    expect(u1).toBe(v.getAnfangszeit());
    expect(u2).toBe(v.getEndzeit());
    expect(datum).toBe(v.getDatum());
    expect(Geldbetrag.parseGeldbetrag(12, 30)).toEqual(v.getPreis());
    expect(v.toString()).toBeTruthy();
  });

  it("teste hatPlatz, hatPlaetze", () => {
    expect(true).toBe(v.hatPlatz(new Platz(0, 0)));
    expect(true).toBe(v.hatPlatz(new Platz(19, 49)));
    expect(false).toBe(v.hatPlatz(new Platz(20, 49)));
    expect(false).toBe(v.hatPlatz(new Platz(19, 50)));
    expect(false).toBe(v.hatPlatz(new Platz(20, 50)));

    const set = new Set<Platz>();
    expect(true).toBe(v.hatPlaetze(set));
    set.add(new Platz(0, 0));
    set.add(new Platz(19, 49));
    expect(true).toBe(v.hatPlaetze(set));
    set.add(new Platz(20, 50));
    expect(false).toBe(v.hatPlaetze(set));
  });

  it("teste getPreisFuerPlaetze", () => {
    const set = new Set<Platz>();
    expect(true).toBe(v.getPreisFuerPlaetze(set).equals(Geldbetrag.parseGeldbetrag("0,00")));
    set.add(new Platz(5, 5));
    set.add(new Platz(5, 6));
    set.add(new Platz(5, 7));
    expect(true).toBe(v.getPreisFuerPlaetze(set).equals(Geldbetrag.parseGeldbetrag(36, 90)));
  });

  it("teste verkaufen", () => {
    const platz = new Platz(5, 5);

    expect(false).toBe(v.istPlatzVerkauft(platz));
    v.verkaufePlatz(platz);
    expect(true).toBe(v.istPlatzVerkauft(platz));
    v.stornierePlatz(platz);
    expect(false).toBe(v.istPlatzVerkauft(platz));
  });

  it("teste verkaufen mehrere", () => {
    const set = new Set<Platz>();
    set.add(new Platz(5, 5));
    set.add(new Platz(5, 6));
    set.add(new Platz(5, 7));

    expect(false).toBe(v.sindStornierbar(set));
    v.verkaufePlaetze(set);
    expect(true).toBe(v.sindStornierbar(set));
    v.stornierePlaetze(set);
    expect(false).toBe(v.sindStornierbar(set));
  });

  it("teste sindStonierbar", () => {
    const p1 = new Platz(5, 5);
    const p2 = new Platz(5, 6);
    const p3 = new Platz(5, 7);
    const s1 = new Set<Platz>();
    s1.add(p1);
    s1.add(p2);
    s1.add(p3);
    const s2 = new Set<Platz>();
    s2.add(p1);
    s2.add(p2);

    expect(false).toBe(v.sindStornierbar(s1));
    expect(false).toBe(v.sindStornierbar(s2));
    v.verkaufePlaetze(s2);
    expect(false).toBe(v.sindStornierbar(s1));
    expect(true).toBe(v.sindStornierbar(s2));
  });

  it("teste sindVerkaufbar", () => {
    const p1 = new Platz(5, 5);
    const p2 = new Platz(5, 6);
    const p3 = new Platz(5, 7);
    const p4 = new Platz(5, 8);
    const s1 = new Set<Platz>();
    s1.add(p1);
    s1.add(p2);
    s1.add(p3);
    s1.add(p4);
    const s2 = new Set<Platz>();
    s2.add(p1);
    s2.add(p2);
    const s3 = new Set<Platz>();
    s3.add(p3);
    s3.add(p4);

    expect(true).toBe(v.sindVerkaufbar(s1));
    expect(true).toBe(v.sindVerkaufbar(s2));
    expect(true).toBe(v.sindVerkaufbar(s3));
    v.verkaufePlaetze(s2);
    expect(false).toBe(v.sindVerkaufbar(s1));
    expect(false).toBe(v.sindVerkaufbar(s2));
    expect(true).toBe(v.sindVerkaufbar(s3));
  });

  it("teste getAnzahlVerkauftePlaetze", () => {
    const set = new Set<Platz>();
    set.add(new Platz(5, 5));
    set.add(new Platz(5, 6));
    set.add(new Platz(5, 7));

    expect(0).toBe(v.getAnzahlVerkauftePlaetze());
    for (let i = 1; i <= 5; i++) {
      for (let j = 1; j <= 6; j++) {
        v.verkaufePlatz(new Platz(i, j));
      }
    }
    expect(30).toBe(v.getAnzahlVerkauftePlaetze());
  });
});
