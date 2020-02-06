import {HashSet} from "../../../shared/HashSet";
import {Platz} from "../../../fachwerte/Platz";

export abstract class Werte {
  public abstract readonly anzahlReihen: number;
  public abstract readonly anzahlSitzeProReihe: number;
  public abstract readonly verkauft: HashSet<Platz>;
  public abstract readonly ausgewaehlt: HashSet<Platz>;
  public abstract readonly texts: (string | number)[][];
}
