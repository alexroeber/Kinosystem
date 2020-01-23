import {Component, EventEmitter, Output} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";
import {Game} from "../games/Game";
import {Werte} from "../games/Werte";
import {SnakeGame} from "../games/Snake";

type OpenWerte = Werte & {
  openAnzahlReihen: number
  openAnzahlSitzeProReihe: number
  openAusgewaehlt: HashSet<Platz>
  openVerkauft: HashSet<Platz>
};

@Component({
  selector: "platzplan",
  templateUrl: "./platzplan.component.html",
  styleUrls: ["./platzplan.component.scss"]
})
export class PlatzplanComponent {
  @Output() selectionChange: EventEmitter<void>;

  platzplan: Platz[][];
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
    this.verkauftePlaetze.clear();
    this.ausgewaehltePlaetze.clear();
    this.werte.openAnzahlReihen = anzahlReihen;
    this.werte.openAnzahlSitzeProReihe = anzahlSitzeProReihe;
    for (let reihe = 0; reihe < anzahlReihen; reihe++) {
      this.platzplan[reihe] = new Array(anzahlSitzeProReihe);
      for (let sitz = 0; sitz < anzahlSitzeProReihe; sitz++) {
        this.platzplan[reihe][sitz] = new Platz(reihe, sitz);
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

  private initWerte() {
    this.werte = new class extends Werte {
      public openAnzahlReihen: number;
      public openAnzahlSitzeProReihe: number;
      public openAusgewaehlt: HashSet<Platz>;
      public openVerkauft: HashSet<Platz>;

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
    }();
  }

  private initGameList() {
    this.games = [new SnakeGame(game => this.gameWasLost(game), this.werte)];
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
    this.gameInterval = 0;
  }

  private activateGame(game: Game) {
    this.savedAusgewaehlt = new HashSet<Platz>(this.ausgewaehltePlaetze);
    this.savedVerkauft = new HashSet<Platz>(this.verkauftePlaetze);
    this.werte.openAusgewaehlt = this.ausgewaehltePlaetze;
    this.werte.openVerkauft = this.verkauftePlaetze;
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
    if (code === "Enter" && e.ctrlKey) {
      // Spiel starten/stoppen
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
        this.deactivateGame(game);
      } else {
        this.activateGame(game);
      }
    } else if (code === " ") {
      // Spiel pausieren/weiterlaufen lassen
      this.gameActive = !this.gameActive;
    } else if (code === "Tab") {
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
    } else {
      return game.dispatchKeyEvent(e);
    }
  }

  public getAusgewaehltePlaetze() {
    return new HashSet<Platz>(this.ausgewaehltePlaetze);
  }
}
