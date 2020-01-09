import {ok} from "assert";
import {Datum} from "../fachwerte/Datum";
import {Tagesplan} from "./Tagesplan";
import {Kinosaal} from "./Kinosaal";
import {Vorstellung} from "./Vorstellung";

/**
 * Ein Kino mit mehreren Kinosälen, in denen Vorstellungen laufen koennen.
 *
 * @author SE2-Team
 * @version SoSe 2014
 */
export class Kino {
  private tagesplaene: Map<Datum, Tagesplan>;

  /**
   * Initialisiert ein Kino.
   *
   * @param kinosaele die Kinosäle des Kinos.
   * @param vorstellungen die Vorstellungen, die in dem Kino laufen.
   *
   * @require saele != null
   * @require vorstellungen != null
   * @require saele enthaelt keine Nullpointer
   * @require vorstellungen enthaelt keine Nullpointer
   * @require alle Vorstellungen laufen in uebergebenen Kinosälen
   * @require alle Vorstellungen fangen zu unterschiedlichen Zeiten an
   */
  public constructor(private kinosaele: Kinosaal[], vorstellungen: Vorstellung[]) {
    ok(kinosaele != null, "Vorbedingung verletzt: kinosaele != null");
    ok(vorstellungen != null, "Vorbedingung verletzt: vorstellungen != null");
    ok(!kinosaele.includes(undefined), "Vorbedingung verletzt: kinosaele enthaelt keine Nullpointer");

    this.tagesplaene = new Map<Datum, Tagesplan>();

    for (const vorstellung of vorstellungen) {
      ok(vorstellung != null, "Vorbedingung verletzt: vorstellungen enthaelt keine Nullpointer");

      const saal = vorstellung.getKinosaal();
      ok(this.hatKinosaal(saal), "Vorbedingung verletzt: alle Vorstellungen laufen in uebergebenen Kinosaelen");

      const datum = vorstellung.getDatum();
      let tagesplan = this.tagesplaene.get(datum);
      if (tagesplan == null) {
        tagesplan = new Tagesplan(datum);
        this.tagesplaene.set(datum, tagesplan);
      }
      tagesplan.fuegeVorstellungHinzu(vorstellung);
    }
  }

  /**
   * Prüft, ob der angegebene Kinosaal zu diesem Kino gehört.
   *
   * @param kinosaal der Kinosaal.
   */
  public hatKinosaal(kinosaal: Kinosaal) {
    return this.kinosaele.some(s => s.equals(kinosaal));
  }

  /**
   * Gibt die Kinosäle dieses Kinos zurück.
   *
   * @ensure result != null
   */
  public getKinosaele() {
    return [...this.kinosaele];
  }

  /**
   * Gibt den Tagesplan fuer das angegebene Datum zurück.
   *
   * @param tag das Datum.
   *
   * @require tag != null
   * @ensure result != null
   */
  public getTagesplan(tag: Datum) {
    ok(tag != null, "Vorbedingung verletzt: tag != null");

    let tagesplan = this.tagesplaene.get(tag);
    if (tagesplan == null) {
      tagesplan = new Tagesplan(tag);
    }
    return tagesplan;
  }
}
