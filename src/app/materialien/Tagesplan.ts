import {ok} from "assert";
import {Vorstellung} from "./Vorstellung";
import {Datum} from "../fachwerte/Datum";

/**
 * Ein Tagesplan verzeichnet alle Vorstellungen, die in dem Kino an einem
 * bestimmten Tag laufen.
 *
 * @author SE2-Team
 * @version SoSe 2014
 */
export class Tagesplan {
  private vorstellungen: Vorstellung[];

  /**
   * Initialisiert einen neuen, leeren Tagesplan.
   *
   * @param tag der Tag.
   *
   * @require tag != null
   */
  public constructor(private tag: Datum) {
    ok(tag != null, "Vorbedingung verletzt: tag != null");

    this.vorstellungen = [];
  }

  /**
   * Gibt das Datum zurück, für das dieser Tagesplan gilt.
   *
   * @ensure result != null
   */
  public getDatum() {
    return this.tag;
  }

  /**
   * Fügt diesem Tagesplan eine Vorstellung hinzu.
   *
   * @param v die Vorstellung.
   *
   * @require v != null
   * @require die Vorstellung laeuft an dem Tag dieses Tagesplans
   */
  public fuegeVorstellungHinzu(v: Vorstellung) {
    ok(v != null, "Vorbedingung verletzt: v != null");
    ok(v.getDatum().equals(this.tag), "Vorbedingung verletzt: v.getDatum().equals(_tag)");

    this.vorstellungen.push(v);
  }

  /**
   * Gibt alle Vorstellungen des Tages zurück. Die Vorstellungen werden
   * sortiert nach ihrer Anfangszeit zurückgegeben.
   *
   * @ensure result != null
   */
  public getVorstellungen() {
    const res = [...this.vorstellungen];
    res.sort((a, b) => a.getAnfangszeit().compareTo(b.getAnfangszeit()));
    return res;
  }
}
