import {ok} from "assert";
import {Datum} from "../fachwerte/Datum";
import {Tagesplan} from "./Tagesplan";
import {Kinosaal} from "./Kinosaal";
import {Vorstellung} from "./Vorstellung";
import {HashMap} from "../shared/HashMap";

/**
 * Ein Kino mit mehreren Kinosälen, in denen Vorstellungen laufen koennen.
 */
export class Kino {
  private tagesplaene: HashMap<Datum, Tagesplan>;

  /**
   * Initialisiert ein Kino.
   *
   * @param kinosaele die Kinosäle des Kinos.
   * @param vorstellungen die Vorstellungen, die in dem Kino laufen.
   *
   * @require truthy saele
   * @require truthy vorstellungen
   * @require saele enthaelt keine falsey Werte
   * @require vorstellungen enthaelt keine falsey Werte
   * @require alle Vorstellungen laufen in uebergebenen Kinosälen
   * @require alle Vorstellungen fangen zu unterschiedlichen Zeiten an
   */
  public constructor(private kinosaele: Kinosaal[], vorstellungen: Vorstellung[]) {
    ok(kinosaele, "Vorbedingung verletzt: truthy kinosaele");
    ok(vorstellungen, "Vorbedingung verletzt: truthy vorstellungen");

    kinosaele.forEach(saal => {
      ok(saal, "Vorbedingung verletzt: kinosaele enthaelt keine falsey Werte");
    });

    this.tagesplaene = new HashMap<Datum, Tagesplan>();

    for (const vorstellung of vorstellungen) {
      ok(vorstellung, "Vorbedingung verletzt: vorstellungen enthaelt keine falsey Werte");

      const saal = vorstellung.getKinosaal();
      ok(this.hatKinosaal(saal), "Vorbedingung verletzt: alle Vorstellungen laufen in uebergebenen Kinosaelen");

      const datum = vorstellung.getDatum();
      let tagesplan = this.tagesplaene.get(datum);
      if (tagesplan === undefined) {
        tagesplan = new Tagesplan(datum);
        this.tagesplaene.put(datum, tagesplan);
      }
      tagesplan.fuegeVorstellungHinzu(vorstellung);
    }
  }

  /**
   * Prüft, ob der angegebene Kinosaal zu diesem Kino gehört.
   *
   * @param kinosaal der Kinosaal.
   *
   * @require truthy kinosaal
   */
  public hatKinosaal(kinosaal: Kinosaal): boolean {
    ok(kinosaal, "Vorbedingung verletzt: truthy kinosaal");

    return this.kinosaele.some(s => s.equals(kinosaal));
  }

  /**
   * Gibt die Kinosäle dieses Kinos zurück.
   *
   * @ensure truthy result
   */
  public getKinosaele(): Kinosaal[] {
    return [...this.kinosaele];
  }

  /**
   * Gibt den Tagesplan fuer das angegebene Datum zurück.
   *
   * @param tag das Datum.
   *
   * @require truthy tag
   * @ensure result != null
   */
  public getTagesplan(tag: Datum): Tagesplan {
    ok(tag, "Vorbedingung verletzt: truthy tag");

    let tagesplan = this.tagesplaene.get(tag);
    if (!tagesplan) {
      tagesplan = new Tagesplan(tag);
    }
    return tagesplan;
  }
}
