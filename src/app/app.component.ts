import {Component} from "@angular/core";
import {Kino} from "./materialien/Kino";
import {Kinosaal} from "./materialien/Kinosaal";
import {FSK} from "./fachwerte/FSK";
import {Film} from "./materialien/Film";
import {Uhrzeit} from "./fachwerte/Uhrzeit";
import {Datum} from "./fachwerte/Datum";
import {Vorstellung} from "./materialien/Vorstellung";
import {Geldbetrag} from "./fachwerte/Geldbetrag";

/**
 * Equivalent zur StartupKinoticketverkauf_Blatt07-Klasse
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  readonly kino: Kino;

  constructor() {
    this.kino = AppComponent.erzeugeKinoMitBeispieldaten();
  }

  /**
   * Erzeugt ein Kino mit einigen Vorstellungen.
   */
  private static erzeugeKinoMitBeispieldaten() {
    const saele = [
      new Kinosaal("Saal 1", 20, 25),
      new Kinosaal("Saal 2", 16, 20),
      new Kinosaal("Saal 3", 10, 16)
    ];

    // Filme: Top-5 Deutschland laut kino.de in der Kalenderwoche 20, 2011.
    const filme = [
      new Film("Pirates of the Caribbean - Fremde Gezeiten", 136, FSK.FSK12, true),
      new Film("Fast & Furious Five", 130, FSK.FSK12, true),
      new Film("Rio", 96, FSK.FSK0, false),
      new Film("Wasser für die Elefanten", 120, FSK.FSK12, false),
      new Film("Thor", 115, FSK.FSK12, false)
    ];

    const nachmittag = new Uhrzeit(17, 30);
    const abend = new Uhrzeit(20, 0);
    const spaet = new Uhrzeit(22, 30);
    const nacht = new Uhrzeit(1, 0);

    const d1 = Datum.heute();
    const d2 = d1.naechsterTag();
    const d3 = d2.naechsterTag();

    const vorstellungen = [
      // Heute
      new Vorstellung(saele[0], filme[2], nachmittag, abend, d1, Geldbetrag.parseGeldbetrag(5, 0)),
      new Vorstellung(saele[0], filme[0], abend, spaet, d1, Geldbetrag.parseGeldbetrag(7, 0)),
      new Vorstellung(saele[0], filme[0], spaet, nacht, d1, Geldbetrag.parseGeldbetrag(7, 0)),

      new Vorstellung(saele[1], filme[3], nachmittag, abend, d1, Geldbetrag.parseGeldbetrag(9, 0)),
      new Vorstellung(saele[1], filme[1], spaet, nacht, d1, Geldbetrag.parseGeldbetrag(8, 0)),

      new Vorstellung(saele[2], filme[3], abend, spaet, d1, Geldbetrag.parseGeldbetrag(10, 0)),
      new Vorstellung(saele[2], filme[4], spaet, nacht, d1, Geldbetrag.parseGeldbetrag(9, 0)),

      // Morgen
      new Vorstellung(saele[0], filme[0], abend, spaet, d2, Geldbetrag.parseGeldbetrag(5, 0)),
      new Vorstellung(saele[0], filme[0], spaet, nacht, d2, Geldbetrag.parseGeldbetrag(7, 0)),

      new Vorstellung(saele[1], filme[2], nachmittag, abend, d2, Geldbetrag.parseGeldbetrag(9, 0)),
      new Vorstellung(saele[1], filme[4], abend, nacht, d2, Geldbetrag.parseGeldbetrag(8, 0)),

      new Vorstellung(saele[2], filme[3], nachmittag, abend, d2, Geldbetrag.parseGeldbetrag(10, 0)),
      new Vorstellung(saele[2], filme[1], spaet, nacht, d2, Geldbetrag.parseGeldbetrag(9, 0)),

      // Übermorgen
      new Vorstellung(saele[0], filme[1], abend, spaet, d3, Geldbetrag.parseGeldbetrag(5, 0)),
      new Vorstellung(saele[0], filme[1], spaet, nacht, d3, Geldbetrag.parseGeldbetrag(7, 0)),

      new Vorstellung(saele[1], filme[2], nachmittag, abend, d3, Geldbetrag.parseGeldbetrag(9, 0)),
      new Vorstellung(saele[1], filme[0], abend, nacht, d3, Geldbetrag.parseGeldbetrag(8, 0)),

      new Vorstellung(saele[2], filme[3], abend, spaet, d3, Geldbetrag.parseGeldbetrag(10, 0)),
      new Vorstellung(saele[2], filme[4], spaet, nacht, d3, Geldbetrag.parseGeldbetrag(9, 0))
    ];

    return new Kino(saele, vorstellungen);
  }
}
