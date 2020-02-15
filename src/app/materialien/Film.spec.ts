import {Film} from "./Film";
import {FSK} from "../fachwerte/FSK";

describe("Platz", () => {
  it("teste Konstruktor", () => {
    const film = new Film("Titel", 90, FSK.FSK16, true);
    expect("Titel").toBe(film.getTitel());
    expect(90).toBe(film.getLaenge());
    expect(FSK.FSK16).toBe(film.getFSK());
    expect(true).toBe(film.hatUeberlaenge());
    expect(film.toString()).toBeTruthy();
  });
});
