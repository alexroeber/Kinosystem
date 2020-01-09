import {Vorstellung} from "./Vorstellung";
import {Kinosaal} from "./Kinosaal";
import {Film} from "./Film";
import {Datum} from "../fachwerte/Datum";
import {FSK} from "../fachwerte/FSK";
import {Geldbetrag} from "../fachwerte/Geldbetrag";
import {Uhrzeit} from "../fachwerte/Uhrzeit";
import {Tagesplan} from "./Tagesplan";

describe("Tagesplan", () => {
  const datum = new Datum(1, 1, 2010);
  const film = new Film("", 1, FSK.FSK0, false);
  const kinosaal = new Kinosaal("Saal 1", 1, 1);
  const kinosaal2 = new Kinosaal("Saal 2", 1, 1);
  const startzeit = new Uhrzeit(0, 0);
  const startzeit2 = new Uhrzeit(0, 1);
  const endzeit = new Uhrzeit(1, 1);
  const vorstellung = new Vorstellung(kinosaal, film, startzeit, endzeit, datum, Geldbetrag.parseGeldbetrag(0, 0));
  const vorstellung2 = new Vorstellung(kinosaal, film, startzeit2, endzeit, datum, Geldbetrag.parseGeldbetrag(0, 0));
  const vorstellung3 = new Vorstellung(kinosaal2, film, startzeit2, endzeit, datum, Geldbetrag.parseGeldbetrag(0, 0));
  let t: Tagesplan;

  beforeEach(() => {
    t = new Tagesplan(datum);
  });

  it("teste getDatum", () => {
    expect(datum).toBe(t.getDatum());
  });

  it("teste neuer Tagesplan ist leer", () => {
    expect(0).toBe(t.getVorstellungen().length);
  });

  it("teste fuegeVorstellungHinzu", () => {
    t.fuegeVorstellungHinzu(vorstellung);
    expect(1).toBe(t.getVorstellungen().length);
    expect(t.getVorstellungen()).toContain(vorstellung);
  });

  it("teste Sortierung", () => {
    t.fuegeVorstellungHinzu(vorstellung2);
    t.fuegeVorstellungHinzu(vorstellung);
    expect(vorstellung).toBe(t.getVorstellungen()[0]);
    expect(vorstellung2).toBe(t.getVorstellungen()[1]);
  });

  it("teste Gleichzeitige Vorstellung in verschiedenen Sälen", () => {
    t.fuegeVorstellungHinzu(vorstellung2);
    t.fuegeVorstellungHinzu(vorstellung3);
    expect(2).toBe(t.getVorstellungen().length);
  });
});
