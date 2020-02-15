import {Game} from "./Game";
import {Werte} from "./Werte";
import {HashSet} from "../../../shared/HashSet";
import {Platz} from "../../../fachwerte/Platz";

/**
 * Eine Implementation von Conway's Game of Life, nutzt markierte Plätze.
 */
export class Conway extends Game {
  public readonly sleep;

  public constructor(gameLoseHandler: (game: Game) => void, werte: Werte) {
    super(gameLoseHandler, werte);
    this.sleep = 200;
  }

  public run(): void {
    this.iteration();
  }

  public dispatchKeyEvent(e: KeyboardEvent): void {
  }

  public deactivate(): void {
  }

  public activate(): void {
  }

  public getName(): string {
    return "Conway's game of life";
  }

  /**
   * Führt eine Iteration vom GoL durch
   */
  private iteration(): void {
    const reihen = this.werte.anzahlReihen;
    const sitze = this.werte.anzahlSitzeProReihe;
    const oldSet = this.werte.ausgewaehlt;
    const newSet = new HashSet<Platz>();
    const relevant = new HashSet<Platz>(oldSet);
    oldSet.forEach(platz => {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newY = platz.getReihe() + i;
          const newX = platz.getSitz() + j;
          if ((i !== 0 || j !== 0) && newY < reihen && newY >= 0 && newX < sitze && newX >= 0) {
            relevant.add(new Platz(newY, newX));
          }
        }
      }
    });
    relevant.forEach(platz => {
      if (this.willBeAlive(platz)) {
        newSet.add(platz);
      }
    });
    oldSet.clear();
    newSet.forEach(platz => oldSet.add(platz));
  }

  /**
   * Prüft, ob die Zelle in der nächsten Iteration lebt.
   * @param platz die Zelle
   * @return true, wenn die angegebene Zelle nächste Iteration lebt.
   */
  private willBeAlive(platz: Platz): boolean {
    const c = this.countNeighbours(platz);
    return c === 3 || (c === 2 && this.isAlive(platz));
  }

  /**
   * Zählt benachbarte lebende Zellen der angegebenen Zelle
   * @param platz die Zelle
   * @return Anzahl lebender Nachbarn
   */
  private countNeighbours(platz: Platz): number {
    const reihen = this.werte.anzahlReihen;
    const sitze = this.werte.anzahlSitzeProReihe;
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newY = platz.getReihe() + i;
        const newX = platz.getSitz() + j;
        if ((i !== 0 || j !== 0)
          && newY < reihen && newY >= 0
          && newX < sitze && newX >= 0
          && this.isAlive(new Platz(newY, newX))) {
          count++;
        }
      }
    }
    return count;
  }

  /**
   * Prüft, ob die Zelle an angegebenen Koordinaten in der aktuellen Iteration lebt.
   * @param platz die Zelle
   * @return true, wenn die angegebene Zelle in der aktuellen Iteration lebt.
   */
  private isAlive(platz: Platz): boolean {
    return this.werte.ausgewaehlt.contains(platz);
  }

}
