import {ok} from "assert";
import {Vorstellung} from "./Vorstellung";
import {Datum} from "../fachwerte/Datum";

/**
 * Ein Tagesplan verzeichnet alle Vorstellungen, die in dem Kino an einem bestimmten Tag laufen.
 */
export class Tagesplan {
  private readonly vorstellungen: Vorstellung[];

  /**
   * Initialisiert einen neuen, leeren Tagesplan.
   *
   * @param tag der Tag.
   *
   * @require truthy tag
   */
  public constructor(private tag: Datum) {
    ok(tag, "Vorbedingung verletzt: truthy tag");

    this.vorstellungen = [];
  }

  /**
   * Gibt das Datum zurück, für das dieser Tagesplan gilt.
   *
   * @ensure truthy result
   */
  public getDatum(): Datum {
    return this.tag;
  }

  /**
   * Fügt diesem Tagesplan eine Vorstellung hinzu.
   *
   * @param v die Vorstellung.
   *
   * @require truthy v
   * @require die Vorstellung laeuft an dem Tag dieses Tagesplans
   */
  public fuegeVorstellungHinzu(v: Vorstellung): void {
    ok(v, "Vorbedingung verletzt: truthy v");
    ok(v.getDatum().equals(this.tag), "Vorbedingung verletzt: die Vorstellung laeuft an dem Tag dieses Tagesplans");

    this.vorstellungen.push(v);
  }

  /**
   * Gibt alle Vorstellungen des Tages zurück. Die Vorstellungen werden
   * sortiert nach ihrer Anfangszeit zurückgegeben.
   *
   * @ensure truthy result
   */
  public getVorstellungen(): Vorstellung[] {
    const res = [...this.vorstellungen];
    res.sort((a, b) => a.getAnfangszeit().compareTo(b.getAnfangszeit()));
    return res;
  }
}
