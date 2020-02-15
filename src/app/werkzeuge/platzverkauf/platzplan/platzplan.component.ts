import {Component, EventEmitter, Output} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";
import {HashSet} from "../../../shared/HashSet";
import {Game} from "../games/Game";
import {Werte} from "../games/Werte";
import {Snake} from "../games/Snake";
import {Tetris} from "../games/Tetris";
import {MinesweeperGame} from "../games/Minesweeper";
import {Conway} from "../games/Conway";
import {ok} from "assert";

/**
 * Equivalent zum JPlatzplan
 * Das Gegenstück zur einzigen Stelle, an der nicht nur über Databinding kommuniziert wird. Mit dem
 * Platzverkaufwerkzeug (PlatzverkaufComponent) wird über das Beobachtermuster kommuniziert.
 * Die Stelle, an der die Spiele eingebaut sind.
 */
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

    this.werte = new OpenWerte();
    this.initGameList();
    window.addEventListener("keydown", event => this.dispatchKeyEvent(event));
  }

  /**
   * Methode zu Kommunikation, die nicht über Databinding läuft.
   * Setzt die Dimension des Platzplans, was ein Initialisieren des Platzplans bewirkt.
   *
   * @param anzahlReihen vertikale Dimension
   * @param anzahlSitzeProReihe horizontale Dimension
   *
   * @require Ganzzahlen
   */
  public setAnzahlPlaetze(anzahlReihen: number, anzahlSitzeProReihe: number): void {
    ok(anzahlReihen % 1 === 0 && anzahlSitzeProReihe % 1 === 0, "Vorbedingung verletzt: Ganzzahlen");

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

  /**
   * Methode zu Kommunikation, die nicht über Databinding läuft.
   * Markiert einen Platz als verkauft.
   *
   * @param platz der Platz, der als verkauft markiert werden soll
   *
   * @require truthy platz
   */
  public markierePlatzAlsVerkauft(platz: Platz): void {
    ok(platz, "Vorbedingung verletzt: truthy platz");

    this.stopGameIfRunning();
    this.verkauftePlaetze.add(platz);
  }

  /**
   * UI-Methode, Reaktion auf das active-Event, ein Klick auf einen PlatzButton
   * Selektiert oder deselektiert den Platz als ausgewählt.
   *
   * @param platz der Platz, dessen Markierung geändert werden soll
   */
  onPlatz(platz: Platz): void {
    if (this.ausgewaehltePlaetze.contains(platz)) {
      this.ausgewaehltePlaetze.remove(platz);
    } else {
      this.ausgewaehltePlaetze.add(platz);
    }
    this.selectionChange.emit();
  }

  /**
   * UI-Methode, gibt die Text auf einem PlatzButton für einen Platz zurück.
   *
   * @param platz der Platz, um dessen Text es geht.
   */
  getText(platz: Platz): string | number {
    return this.texts[platz.getReihe()][platz.getSitz()];
  }

  /**
   * Methode zu Kommunikation, die nicht über Databinding läuft.
   * Gibt die ausgewählten Plätze zurück.
   *
   * @ensure truthy result
   */
  public getAusgewaehltePlaetze() {
    return new HashSet<Platz>(this.ausgewaehltePlaetze);
  }

  /**
   * Interne Methode, die die Spieleliste initialisiert.
   */
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

  /**
   * Interne Methode, die ein verlorenes Spiel verarbeitet.
   * @param game das verlorene Spiel
   */
  private gameWasLost(game: Game): void {
    if (game !== this.games[this.activeGameIndex]) {
      alert("Ein seltsamer Fehler ist aufgetreten");
    } else {
      clearInterval(this.gameInterval);
      alert("You just lost " + game.getName());
      this.deactivateGame(game);
    }
  }

  /**
   * Interne Methode, die das aktive Spiel beendet, falls es existiert.
   */
  private stopGameIfRunning() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.deactivateGame(this.games[this.activeGameIndex]);
    }
  }

  /**
   * Interne Methode, die das angegebene Spiel beendet und den Zustand wiederherstellt.
   * @param game das zu beendende Spiel
   */
  private deactivateGame(game: Game) {
    game.deactivate();
    this.ausgewaehltePlaetze = this.savedAusgewaehlt;
    this.verkauftePlaetze = this.savedVerkauft;
    this.texts = this.savedTexts;
    this.gameInterval = 0;
  }

  /**
   * Interne Methode, die das angegebene Spiel startet und den Zustand speichert.
   * @param game das zu startende Spiel
   */
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

  /**
   * Interne Methode, die Tastatureingaben bearbeitet.
   * @param e das KeyboardEvent
   */
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
}

/**
 * Interne Klasse, damit der Platzplan seine "Werte"-Klasse für die Spiele verändern kann.
 */
class OpenWerte extends Werte {
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
}
