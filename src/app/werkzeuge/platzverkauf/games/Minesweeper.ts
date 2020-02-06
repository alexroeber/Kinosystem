import {Game} from "./Game";
import {HashSet} from "../../../shared/HashSet";
import {Werte} from "./Werte";
import {Platz} from "../../../fachwerte/Platz";

export class MinesweeperGame extends Game {
  public readonly sleep = 1000000;

  private bombs: HashSet<Platz>;
  private correctBombs: HashSet<Platz>;
  private x: number;
  private y: number;

  public constructor(gameLoseHandler: (game: Game) => void, werte: Werte) {
    super(gameLoseHandler, werte);
  }

  public run(): void {
  }

  public dispatchKeyEvent(e: KeyboardEvent): void {
    const code = e.key;
    if (code === "ArrowUp" || code === "ArrowDown" || code === "ArrowLeft" || code === "ArrowRight") {
      this.werte.ausgewaehlt.remove(new Platz(this.y, this.x));
      switch (code) {
        case "ArrowLeft":
          this.x += -1;
          break;
        case "ArrowRight":
          this.x += 1;
          break;
        case "ArrowUp":
          this.y += -1;
          break;
        case "ArrowDown":
          this.y += 1;
          break;
      }
      if (this.x >= this.werte.anzahlSitzeProReihe) {
        this.x = 0;
      }
      if (this.x < 0) {
        this.x += this.werte.anzahlSitzeProReihe;
      }
      if (this.y >= this.werte.anzahlReihen) {
        this.y = 0;
      }
      if (this.y < 0) {
        this.y += this.werte.anzahlReihen;
      }
      this.werte.ausgewaehlt.add(new Platz(this.y, this.x));
    } else if (code === "Enter") {
      this.guess(this.x, this.y);
      e.preventDefault();
    } else if (code === "b") {
      this.guessBomb(this.x, this.y);
    }
  }

  public init(): void {
  }

  public deactivate() {
  }

  public activate(): void {
    this.initState();
  }

  public getName() {
    return "Minesweeper";
  }

  private checkWin() {
    const maxSize = this.werte.anzahlReihen * this.werte.anzahlSitzeProReihe - this.bombs.size();
    if (this.bombs.size() === this.correctBombs.size() || this.werte.verkauft.size() === maxSize) {
      if (confirm("You just won Minesweeper\nRestart?")) {
        this.initState();
      } else {
        window.dispatchEvent(new KeyboardEvent("keydown", {
          key: "g",
          ctrlKey: true
        }));
      }
    }
  }

  private guessBomb(x: number, y: number): void {
    const p = new Platz(y, x);
    if (this.bombs.contains(p)) {
      this.correctBombs.add(p);
      this.checkWin();
    }
    this.werte.texts[y][x] = "B";
  }

  private guess(x: number, y: number): void {
    if (this.bombs.contains(new Platz(y, x))) {
      this.bombs.forEach(p => {
        this.werte.ausgewaehlt.add(p);
      });
      setTimeout(() => this.gameLoseHandler(this), 50);
    } else {
      const count = this.countBombs(x, y);
      if (count === 0) {
        this.findAll(x, y);
      } else {
        this.mark(x, y, count);
        this.checkWin();
      }
    }
  }

  private mark(x: number, y: number, count: number): void {
    this.werte.texts[y][x] = count > 0 ? count : "\xa0";
    this.werte.verkauft.add(new Platz(y, x));
  }

  private countBombs(x: number, y: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (y + i >= 0 && x + j >= 0 && y + i < this.werte.anzahlReihen
          && x + j < this.werte.anzahlSitzeProReihe
          && this.bombs.contains(new Platz(y + i, x + j))) {
          count++;
        }
      }
    }
    return count;
  }

  private findAll(x: number, y: number): void {
    let set = new HashSet<Platz>();
    set.add(new Platz(y, x));
    while (set.size() > 0) {
      const tempSet = new HashSet(set);
      set.forEach(platz => {
        x = platz.getSitz();
        y = platz.getReihe();
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (y + i >= 0 && x + j >= 0 && y + i < this.werte.anzahlReihen && x + j < this.werte.anzahlSitzeProReihe) {
              if (!this.werte.verkauft.contains(new Platz(y + i, x + j))) {
                const count = this.countBombs(x + j, y + i);
                this.mark(x + j, y + i, count);
                if (count === 0) {
                  tempSet.add(new Platz(y + i, x + j));
                }
              }
            }
          }
        }
      });
      set.forEach(platz => tempSet.remove(platz));
      set = tempSet;
    }
  }

  private initState() {
    this.x = this.y = 0;
    if (this.werte.anzahlReihen > 0) {
      this.initBombs();
      this.werte.ausgewaehlt.clear();
      this.werte.verkauft.clear();
      for (let y = 0; y < this.werte.anzahlReihen; y++) {
        for (let x = 0; x < this.werte.anzahlSitzeProReihe; x++) {
          this.werte.texts[y][x] = "\xa0";
        }
      }
      this.werte.ausgewaehlt.add(new Platz(this.y, this.x));
    }
  }

  private initBombs() {
    this.bombs = new HashSet<Platz>();
    this.correctBombs = new HashSet<Platz>();
    const bombs = Math.floor(this.werte.anzahlReihen * this.werte.anzahlSitzeProReihe / 10);
    for (let i = 0; i < bombs; i++) {
      let y = Math.floor(Math.random() * this.werte.anzahlReihen);
      let x = Math.floor(Math.random() * this.werte.anzahlSitzeProReihe);
      while (this.bombs.contains(new Platz(y, x))) {
        y = Math.floor(Math.random() * this.werte.anzahlReihen);
        x = Math.floor(Math.random() * this.werte.anzahlSitzeProReihe);
      }
      this.bombs.add(new Platz(y, x));
    }
  }
}
