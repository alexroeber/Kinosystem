import {Component, EventEmitter, Output} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";
import {Game} from "../games/Game";
import {Werte} from "../games/Werte";
import {Snake} from "../games/Snake";
import {Tetris} from "../games/Tetris";
import {MinesweeperGame} from "../games/Minesweeper";
import {Conway} from "../games/Conway";

type OpenWerte = Werte & {
  openAnzahlReihen: number
  openAnzahlSitzeProReihe: number
  openAusgewaehlt: HashSet<Platz>
  openVerkauft: HashSet<Platz>
  openTexts: (string | number)[][]
};

@Component({
  selector: "platzplan",
  templateUrl: "./platzplan.component.html",
  styleUrls: ["./platzplan.component.scss"]
})
export class PlatzplanComponent {
  @Output() selectionChange: EventEmitter<void>;

  platzplan: Platz[][];
  texts: (string | number)[][];
  verkauftePlaetze: HashSet<Platz>;
  ausgewaehltePlaetze: HashSet<Platz>;

  // Variablen für die Spiele
  private werte: OpenWerte;
  private games: Game[];
  private activeGameIndex;
  private gameInterval: number;
  private gameActive: boolean;
  private savedVerkauft: HashSet<Platz>;
  private savedAusgewaehlt: HashSet<Platz>;
  private savedTexts: (string | number)[][];

  constructor() {
    this.selectionChange = new EventEmitter<void>();
    this.verkauftePlaetze = new HashSet<Platz>();
    this.ausgewaehltePlaetze = new HashSet<Platz>();

    this.initWerte();
    this.initGameList();
    window.addEventListener("keydown", event => this.dispatchKeyEvent(event));
  }

  public setAnzahlPlaetze(anzahlReihen: number, anzahlSitzeProReihe: number) {
    this.stopGameIfRunning();
    this.platzplan = new Array(anzahlReihen);
    this.texts = new Array(anzahlReihen);
    this.verkauftePlaetze.clear();
    this.ausgewaehltePlaetze.clear();
    this.werte.openAnzahlReihen = anzahlReihen;
    this.werte.openAnzahlSitzeProReihe = anzahlSitzeProReihe;
    for (let reihe = 0; reihe < anzahlReihen; reihe++) {
      this.platzplan[reihe] = new Array(anzahlSitzeProReihe);
      this.texts[reihe] = new Array(anzahlSitzeProReihe);
      for (let sitz = 0; sitz < anzahlSitzeProReihe; sitz++) {
        this.platzplan[reihe][sitz] = new Platz(reihe, sitz);
        this.texts[reihe][sitz] = sitz;
      }
    }
    this.selectionChange.emit();
  }

  public markierePlatzAlsVerkauft(platz: Platz) {
    this.stopGameIfRunning();
    this.verkauftePlaetze.add(platz);
  }

  onPlatz(platz: Platz) {
    if (this.ausgewaehltePlaetze.contains(platz)) {
      this.ausgewaehltePlaetze.remove(platz);
    } else {
      this.ausgewaehltePlaetze.add(platz);
    }
    this.selectionChange.emit();
  }

  getText(platz: Platz) {
    return this.texts[platz.getReihe()][platz.getSitz()];
  }

  private initWerte() {
    this.werte = new class extends Werte {
      public openAnzahlReihen: number;
      public openAnzahlSitzeProReihe: number;
      public openAusgewaehlt: HashSet<Platz>;
      public openVerkauft: HashSet<Platz>;
      public openTexts: (string | number)[][];

      get anzahlReihen(): number {
        return this.openAnzahlReihen;
      }

      get anzahlSitzeProReihe(): number {
        return this.openAnzahlSitzeProReihe;
      }

      get ausgewaehlt(): HashSet<Platz> {
        return this.openAusgewaehlt;
      }

      get verkauft(): HashSet<Platz> {
        return this.openVerkauft;
      }

      get texts(): (string | number)[][] {
        return this.openTexts;
      }
    }();
  }

  private initGameList() {
    const gameLoseHandler = game => this.gameWasLost(game);
    this.games = [
      new MinesweeperGame(gameLoseHandler, this.werte),
      new Snake(gameLoseHandler, this.werte),
      new Tetris(gameLoseHandler, this.werte),
      new Conway(gameLoseHandler, this.werte)
    ];
    this.activeGameIndex = 0;
    this.games.forEach(game => game.init());
  }

  private gameWasLost(game: Game): void {
    if (game !== this.games[this.activeGameIndex]) {
      alert("Ein seltsamer Fehler ist aufgetreten");
    } else {
      clearInterval(this.gameInterval);
      alert("You just lost " + game.getName());
      this.deactivateGame(game);
    }
  }

  private stopGameIfRunning() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.deactivateGame(this.games[this.activeGameIndex]);
    }
  }

  private deactivateGame(game: Game) {
    game.deactivate();
    this.ausgewaehltePlaetze = this.savedAusgewaehlt;
    this.verkauftePlaetze = this.savedVerkauft;
    this.texts = this.savedTexts;
    this.gameInterval = 0;
  }

  private activateGame(game: Game) {
    this.savedAusgewaehlt = new HashSet<Platz>(this.ausgewaehltePlaetze);
    this.savedVerkauft = new HashSet<Platz>(this.verkauftePlaetze);
    this.savedTexts = [];
    this.texts.forEach((val, i) => {
      this.savedTexts[i] = [...val];
    });
    this.werte.openAusgewaehlt = this.ausgewaehltePlaetze;
    this.werte.openVerkauft = this.verkauftePlaetze;
    this.werte.openTexts = this.texts;
    this.gameActive = true;
    game.activate();
    this.gameInterval = setInterval(() => {
      if (this.gameActive) {
        game.run();
      }
    }, game.sleep);
  }

  private dispatchKeyEvent(e: KeyboardEvent) {
    const code = e.key;
    const game = this.games[this.activeGameIndex];
    if (code === "g" && e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      // Spiel starten/stoppen
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.deactivateGame(game);
      } else {
        this.activateGame(game);
      }
    } else if (code === " " && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      // Spiel pausieren/weiterlaufen lassen
      this.gameActive = !this.gameActive;
    } else if (code === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      // Spiel wechseln
      clearInterval(this.gameInterval);
      const wasRunning = this.gameInterval;
      this.stopGameIfRunning();
      this.activeGameIndex = (this.activeGameIndex + 1) % this.games.length;
      const newGame = this.games[this.activeGameIndex];
      alert(newGame.getName() + " wurde ausgewählt");
      if (wasRunning) {
        this.activateGame(newGame);
      }
    } else if (this.gameInterval && this.gameActive) {
      return game.dispatchKeyEvent(e);
    }
  }

  public getAusgewaehltePlaetze() {
    return new HashSet<Platz>(this.ausgewaehltePlaetze);
  }
}
