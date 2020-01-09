import {Kinosaal} from "./Kinosaal";
import {Kino} from "./Kino";
import {Film} from "./Film";
import {Uhrzeit} from "../fachwerte/Uhrzeit";
import {Datum} from "../fachwerte/Datum";
import {Vorstellung} from "./Vorstellung";
import {FSK} from "../fachwerte/FSK";
import {Geldbetrag} from "../fachwerte/Geldbetrag";

describe("Kino", () => {
  const filmTitel0 = "Film1";
  const filmTitel1 = "Film2";
  const filmTitel2 = "Film3";
  const film0: Film = new Film(filmTitel0, 90, FSK.FSK0, false);
  const film1: Film = new Film(filmTitel1, 108, FSK.FSK16, false);
  const film2: Film = new Film(filmTitel2, 135, FSK.FSK12, true);
  const u0: Uhrzeit = new Uhrzeit(17, 30);
  const u1: Uhrzeit = new Uhrzeit(20, 0);
  const u2: Uhrzeit = new Uhrzeit(22, 30);
  const u3: Uhrzeit = new Uhrzeit(1, 30);
  const datum: Datum = new Datum(11, 7, 2008);

  let kino: Kino;

  let saal0: Kinosaal;
  let saal1: Kinosaal;
  let saal2: Kinosaal;
  let saal3: Kinosaal;
  let alleSaele: Kinosaal[];

  let vorstellung0: Vorstellung;
  let vorstellung1: Vorstellung;
  let vorstellung2: Vorstellung;
  let vorstellung3: Vorstellung;
  let alleVorstellungen: Vorstellung[];

  beforeEach(() => {
    saal0 = new Kinosaal("Erster", 25, 40);
    saal1 = new Kinosaal("Zweiter", 20, 32);
    saal2 = new Kinosaal("Dritter", 10, 20);
    saal3 = new Kinosaal("Vierter", 10, 16);
    alleSaele = [saal0, saal1, saal2];
    vorstellung0 = new Vorstellung(saal1, film0, u0, u1, datum, Geldbetrag.parseGeldbetrag(9, 0));
    vorstellung1 = new Vorstellung(saal1, film1, u0, u1, datum, Geldbetrag.parseGeldbetrag(10, 0));
    vorstellung2 = new Vorstellung(saal2, film2, u1, u2, datum, Geldbetrag.parseGeldbetrag(9, 0));
    vorstellung3 = new Vorstellung(saal2, film2, u2, u3, datum, Geldbetrag.parseGeldbetrag(9, 0));
    alleVorstellungen = [vorstellung0, vorstellung1, vorstellung2, vorstellung3];

    kino = new Kino(alleSaele, alleVorstellungen);
  });

  it("teste getTagesPlan", () => {
    const tagesplan = kino.getTagesplan(datum);
    expect(datum).toBe(tagesplan.getDatum());
    expect(4).toBe(tagesplan.getVorstellungen().length);
    expect(tagesplan.getVorstellungen()).toContain(vorstellung0);
    expect(tagesplan.getVorstellungen()).toContain(vorstellung1);
    expect(tagesplan.getVorstellungen()).toContain(vorstellung2);
    expect(tagesplan.getVorstellungen()).toContain(vorstellung3);
  });

  it("teste hatKinosaal", () => {
    expect(true).toBe(kino.hatKinosaal(saal0));
    expect(true).toBe(kino.hatKinosaal(saal1));
    expect(false).toBe(kino.hatKinosaal(saal3));
  });

  it("teste getKinosaele", () => {
    const saele = kino.getKinosaele();
    expect(3).toBe(saele.length);
    expect(saele).toContain(saal0);
    expect(saele).toContain(saal1);
    expect(saele).toContain(saal2);
  });
});
