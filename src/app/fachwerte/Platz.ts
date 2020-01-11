import {ok} from "assert";
import {EqualsHashCode} from "../shared/EqualsHashCode";

/**
 * Eine Sitzplatzangabe in einem Kinosaal. Der Platz setzt sich zusammen aus der
 * Reihe und dem Sitz in dieser Reihe.
 *
 * @author SE2-Team
 * @version SoSe 2014
 */
export class Platz implements EqualsHashCode {
  /**
   * Wählt einen Platz aus.
   *
   * @param reihe die Sitzreihe.
   * @param sitz die Nummer des Sitzes in seiner Sitzreihe.
   *
   * @require reihe >=0
   * @require sitz >= 0
   */
  constructor(private readonly reihe: number, private readonly sitz: number) {
    ok(reihe >= 0, "Vorbedingung verletzt: reihe <=0");
    ok(sitz >= 0, "Vorbedingung verletzt: sitz <=0");
  }

  /**
   * Gibt die Sitzreihe zurueck, in der sich dieser Platz befindet.
   */
  public getReihe() {
    return this.reihe;
  }

  /**
   * Gibt die Nummer dieses Sitzes in seiner Sitzreihe zurueck.
   */
  public getSitz() {
    return this.sitz;
  }

  public equals(o: any) {
    if (o instanceof Platz) {
      return o.getReihe() === this.getReihe() && o.getSitz() === this.getSitz();
    }
    return false;
  }

  public hashCode() {
    return 1000 * this.getReihe() + this.getSitz();
  }

  public toString() {
    return this.reihe + "-" + this.sitz;
  }
}
