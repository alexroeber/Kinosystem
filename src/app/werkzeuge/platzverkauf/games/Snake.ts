/**
 * Das Spiel Snake. Anleitung: Die Pfeiltasten ändern die Richtung der Schlange
 * und geben im pausierten Zustand auch die Startrichtung an.
 *
 * @author Tsuno
 *
 */
import {Platz} from "../../../fachwerte/Platz";
import {Werte} from "./Werte";
import {Game} from "./Game";

export class Snake extends Game {
  public readonly sleep;

  // Die folgenden Variablen spiegeln Teile der Schlange in Snake wieder
  private schlange: Platz[];
  private schlangenKopfX: number;
  private schlangenKopfY: number;

  // Variablen zur Logik von Snake
  private lastKey: string;

  public constructor(gameLoseHandler: (game: Game) => void, werte: Werte) {
    super(gameLoseHandler, werte);
    this.sleep = 360;
    this.schlange = [];
    this.schlangenKopfX = 0;
    this.schlangenKopfY = 0;
    this.lastKey = "";
  }

  /**
   * Eine Methode zum initialisieren und zuruecksetzen von Snake, ausgelagert
   * aus setAnzahlPlaetze
   */
  public init(): void {
    this.schlange = [];
    this.schlangenKopfX = 0;
    this.schlangenKopfY = 0;
    this.lastKey = "";
  }

  /**
   * Die Methode des Threads für Snake, wiederholt die letzte Richtungstaste
   * alle 360ms.
   *
   * @throws InterruptedException
   */
  public run(): void {
    this.keyPressed(this.lastKey);
  }

  public dispatchKeyEvent(e: KeyboardEvent) {
    const code = e.key;

    if (this.lastKey !== code && (
      code === "ArrowUp"
      || code === "ArrowDown"
      || code === "ArrowLeft"
      || code === "ArrowRight"
    )) {
      this.lastKey = code;
    }
  }

  public activate(): void {
    this.go(true);
  }

  public deactivate(): void {
    this.init();
  }

  public getName(): string {
    return "Snake";
  }

  /**
   * Diese Methode setzt die Tasten zur Steuerung des Spiels um.
   *
   * @param code
   *            die gedrückte Taste
   */
  private keyPressed(code: string) {
    switch (code) {
      case "ArrowLeft":
        this.schlangenKopfX += -1;
        break;
      case "ArrowRight":
        this.schlangenKopfX += 1;
        break;
      case "ArrowUp":
        this.schlangenKopfY += -1;
        break;
      case "ArrowDown":
        this.schlangenKopfY += 1;
        break;
      default:
        return;
    }
    if (this.schlangenKopfX >= this.werte.anzahlSitzeProReihe) {
      this.schlangenKopfX = 0;
    }
    if (this.schlangenKopfX < 0) {
      this.schlangenKopfX += this.werte.anzahlSitzeProReihe;
    }
    if (this.schlangenKopfY >= this.werte.anzahlReihen) {
      this.schlangenKopfY = 0;
    }
    if (this.schlangenKopfY < 0) {
      this.schlangenKopfY += this.werte.anzahlReihen;
    }
    this.go(false);
  }

  /**
   * Hauptlogik von Snake, das bewegen.
   */
  private go(first: boolean): void {
    const platz = new Platz(this.schlangenKopfY, this.schlangenKopfX);
    if (this.werte.ausgewaehlt.contains(platz)) {
      this.gameLoseHandler(this);
      return;
    }
    this.werte.ausgewaehlt.add(platz);
    if (first) {
      this.verkaufeNeu();
      this.verkaufeNeu();
    } else {
      if (this.werte.verkauft.contains(platz)) {
        this.werte.verkauft.remove(platz);
        this.verkaufeNeu();
      } else {
        this.werte.ausgewaehlt.remove(this.schlange.shift());
      }
    }
    this.schlange.push(platz);
  }

  /**
   * Diese Methode fügt neues "Futter" für die Schlange hinzu
   */
  private verkaufeNeu(): void {
    const platz = this.newRandomPlatz(0);
    if (platz) {
      this.werte.verkauft.add(platz);
    }
  }

  /**
   * Diese Methode versucht 69 mal einen nicht-markierten, nicht-verkauften
   * JPlatzButton an zufälliger Stelle zurückzugeben.
   *
   * @return der JPlatzButton oder null
   */
  private newRandomPlatz(versuch: number): Platz {
    const y = Math.floor(Math.random() * this.werte.anzahlReihen);
    const x = Math.floor(Math.random() * this.werte.anzahlSitzeProReihe);
    const platz = new Platz(y, x);
    if (platz && !this.werte.ausgewaehlt.contains(platz) && !this.werte.verkauft.contains(platz)) {
      return platz;
    } else if (versuch < 69) {
      return this.newRandomPlatz(versuch + 1);
    }
    return null;
  }
}
