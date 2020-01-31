import {Platz} from "../../../fachwerte/Platz";
import {Game} from "./Game";
import {Werte} from "./Werte";

export class Tetris extends Game {
  public readonly sleep = 666;
  private readonly BLINKEN = 3;
  // Blockt Spielereingaben, wenn true.
  private eingabe: boolean;
  // Blockt zusätzliche Tätigkeit, wenn true, ohne das
  // Spiel auszumachen oder es zu pausieren.
  private halt: boolean;
  // True bedeutet, dass mindestens eine Reihe gerade
  // verschwindet.
  private blink: boolean;
  // Lässt das Spiel beim nächsten run() verlieren.
  private lost: boolean;

  private stein: Stein;
  private blinkReihen: number[];
  private blinkCounter: number;
  private blinkt: boolean;

  constructor(gameLoseHandler: (game: Game) => void, werte: Werte) {
    super(gameLoseHandler, werte);
    this.stein = new Stein();
    this.blinkReihen = [];
  }

  public run(): void {
    if (!this.blink && !this.halt) {
      if (this.lost) {
        this.lost = false;
        this.gameLoseHandler(this);
      } else {
        this.keyPressed("ArrowDown");
      }
    } else if (this.blink) {
      this.blinken();
    }
  }

  public dispatchKeyEvent(e: KeyboardEvent) {
    if (!this.halt && !this.eingabe) {
      this.keyPressed(e.key);
    }
  }

  public init(): void {
    this.blinkReihen = [];
    this.blinkt = false;
    this.stein = new Stein();
    this.halt = false;
    this.blink = false;
  }

  public deactivate(): void {
    this.init();
  }

  public activate(): void {
    this.spawn();
  }

  public getName(): string {
    return "Tetris";
  }

  /**
   * Methode für die Bewegung
   *
   * @param code
   *            die gedrückte Taste
   */
  private keyPressed(code: string): void {
    this.eingabe = true;
    switch (code) {
      case "ArrowDown":
        this.nachUnten();
        break;
      case "ArrowLeft":
        this.zurSeite(-1);
        break;
      case "ArrowRight":
        this.zurSeite(1);
        break;
      case "ArrowUp":
        this.drehen();
    }
    this.eingabe = false;
  }

  /**
   * Kontrolliert die Bewegung nach unten.
   */
  private nachUnten(): void {
    const s = this.kannInRichtungBewegen(0);
    if (s != null) {
      this.bewege(s);
    } else {
      this.halt = true;
      this.ueberpruefeReihen();
    }
  }

  /**
   * Überprüft, ob eine Reihe voll ist
   */
  private ueberpruefeReihen(): void {
    this.blinkReihen = [];
    for (const y of this.stein.reihen()) {
      let b = true;
      for (let x = 0; x < this.werte.anzahlSitzeProReihe; x++) {
        if (!this.werte.verkauft.contains(new Platz(y, x))) {
          b = false;
          break;
        }
      }
      if (b) {
        this.blinkReihen.push(y);
      }
    }
    if (this.blinkReihen.length) {
      this.blinkCounter = this.BLINKEN;
      this.blink = true;
    } else {
      this.spawn();
      this.halt = false;
    }
  }

  /**
   * Kontrolliert das Blinken beim verschwinden von Reihen
   */
  private blinken(): void {
    if (this.blinkCounter <= 0) {
      this.entferneReihen();
      this.blink = false;
      this.spawn();
      this.halt = false;
    } else {
      for (const y of this.blinkReihen) {
        for (let x = 0; x < this.werte.anzahlSitzeProReihe; x++) {
          if (this.blinkt) {
            this.werte.verkauft.add(new Platz(y, x));
            this.werte.ausgewaehlt.remove(new Platz(y, x));
          } else {
            this.werte.verkauft.remove(new Platz(y, x));
            this.werte.ausgewaehlt.add(new Platz(y, x));
          }
        }
      }
      if (this.blinkt) {
        this.blinkCounter--;
        this.blinkt = false;
      } else {
        this.blinkt = true;
      }
    }
  }

  /**
   * Entfernt die Reihen, die geblinkt haben.
   */
  private entferneReihen(): void {
    this.blinkReihen.sort((a, b) => b - a);
    let anzahl = 0;
    for (const i of this.blinkReihen) {
      this.verschiebeNach(i + anzahl);
      anzahl++;
    }
  }

  /**
   * Entfernt die Reihe #ziel und lässt alle anderen Reihen "runterrutschen".
   * @param ziel Die Zielreihe
   */
  private verschiebeNach(ziel: number): void {
    for (let i = ziel; i > 0; i--) {
      for (let j = 0; j < this.werte.anzahlSitzeProReihe; j++) {
        const newP = new Platz(i, j);
        const oldP = new Platz(i - 1, j);
        if (this.werte.verkauft.contains(oldP)) {
          this.werte.verkauft.add(newP);
        } else {
          this.werte.verkauft.remove(newP);
        }
      }
    }
    for (let j = 0; j < this.werte.anzahlSitzeProReihe; j++) {
      this.werte.verkauft.remove(new Platz(0, j));
    }
  }

  /**
   * Kontrolliert die Bewegung zu Seite.
   *
   * @param richtung
   *            > 0 für rechts, < 0 für links
   */
  private zurSeite(richtung: number): void {
    const s = this.kannInRichtungBewegen(richtung);
    if (s) {
      this.bewege(s);
    }
  }

  /**
   * Kontrolliert das Drehen.
   */
  private drehen(): void {
    const s = this.kannDrehen();
    if (s) {
      this.bewege(s);
    }
  }

  /**
   * Prüft, ob sich die Steine in eine bestimmte Richtung bewegen kann
   *
   * @param richtung
   *            = 0 ist nach unten, > 0 ist nach rechts, < 0 ist nach links
   * @return der gedrehte Stein, falls in die Richtung bewegt werden kann,
   *         sonst null
   */
  private kannInRichtungBewegen(richtung: number): Stein {
    return this.kannBewegen(this.steinInRichtung(richtung));
  }

  /**
   * Prüft, ob gedreht werden kann
   *
   * @return der gedrehte Stein, falls gedreht werden kann, sonst null
   */
  private kannDrehen(): Stein {
    return this.kannBewegen(this.gedrehterStein());
  }

  /**
   * Prüft einen veränderten Stein, ob this.stein in diesen übergehen kann
   *
   * @param s
   *            der veränderte Stein
   * @return s, falls this.stein in ihn übergehen kann, sonst null
   */
  private kannBewegen(s: Stein): Stein {
    for (const platz of s.plaetze) {
      if (!platz || (!this.stein.contains(platz) && this.werte.verkauft.contains(platz))) {
        return null;
      }
    }
    return s;
  }

  private steinInRichtung(richtung: number): Stein {
    let x = 0;
    let y = 0;
    if (richtung === 0) {
      y = 1;
    } else if (richtung > 0) {
      x = 1;
    } else {
      x = -1;
    }
    return this.bewegterStein(x, y);
  }

  private getPlatzAt(x: number, y: number): Platz {
    if (x < this.werte.anzahlSitzeProReihe && x >= 0 && y < this.werte.anzahlReihen && y >= 0) {
      return new Platz(y, x);
    } else {
      return null;
    }
  }

  private bewege(s: Stein): void {
    for (const platz of this.stein.plaetze) {
      this.werte.verkauft.remove(platz);
    }
    for (const platz of s.plaetze) {
      this.werte.verkauft.add(platz);
    }
    s.bezeichnung = this.stein.bezeichnung;
    this.stein = s;
  }

  /**
   * Gibt den Stein nach der Bewegung zurück
   *
   * @return den bewegten Stein
   */
  private bewegterStein(dx: number, dy: number): Stein {
    const s = new Stein();
    for (let i = 0; i < 4; i++) {
      s.xPos[i] = this.stein.xPos[i] + dx;
      s.yPos[i] = this.stein.yPos[i] + dy;
      s.plaetze[i] = this.getPlatzAt(s.xPos[i], s.yPos[i]);
    }
    return s;
  }

  /**
   * Gibt die gedrehte Version des Steins zurück
   *
   * @return die gedrehte Version des Steins
   */
  private gedrehterStein(): Stein {
    const s = new Stein();
    switch (this.stein.bezeichnung) {
      case "Quadrat":
        return this.stein;
      case "Stange":
        if (this.stein.xPos[0] === this.stein.xPos[1]) {
          for (let i = 0; i < 4; i++) {
            s.xPos[i] = (this.stein.xPos[0] - 1) + i;
            s.yPos[i] = this.stein.yPos[1];
          }
        } else {
          for (let i = 0; i < 4; i++) {
            s.yPos[i] = (this.stein.yPos[0] - 1) + i;
            s.xPos[i] = this.stein.xPos[1];
          }
        }
        break;
      case "Zacke 1":
        s.xPos[0] = this.stein.xPos[0] === this.stein.xPos[3] ? this.stein.xPos[0] - 2 : this.stein.xPos[0] + 2;
        s.xPos[1] = this.stein.xPos[1];
        s.xPos[2] = this.stein.xPos[2];
        s.xPos[3] = this.stein.xPos[3];
        s.yPos[0] = this.stein.yPos[0] === this.stein.yPos[1] ? this.stein.yPos[0] - 1 : this.stein.yPos[0] + 1;
        s.yPos[1] = this.stein.yPos[1];
        s.yPos[2] = this.stein.yPos[2];
        s.yPos[3] = this.stein.yPos[3] === this.stein.yPos[2] ? this.stein.yPos[3] - 1 : this.stein.yPos[3] + 1;
        break;
      case "Zacke 2":
        s.xPos[0] = this.stein.xPos[0];
        s.xPos[1] = this.stein.xPos[1] === this.stein.xPos[2] ? this.stein.xPos[1] + 2 : this.stein.xPos[1] - 2;
        s.xPos[2] = this.stein.xPos[2];
        s.xPos[3] = this.stein.xPos[3];
        s.yPos[0] = this.stein.yPos[0];
        s.yPos[1] = this.stein.yPos[1] === this.stein.yPos[0] ? this.stein.yPos[1] - 1 : this.stein.yPos[1] + 1;
        s.yPos[2] = this.stein.yPos[2] === this.stein.yPos[3] ? this.stein.yPos[2] - 1 : this.stein.yPos[2] + 1;
        s.yPos[3] = this.stein.yPos[3];
        break;
      case "L":
        this.dreheSteinMitte(s);
        if (this.stein.xPos[3] === this.stein.xPos[0] || this.stein.xPos[3] === this.stein.xPos[2]) {
          s.xPos[3] = this.stein.xPos[3];
          s.yPos[3] = this.stein.yPos[3] - 2 * (this.stein.yPos[3] - this.stein.yPos[1]);
        } else if (this.stein.yPos[3] === this.stein.yPos[0]
          || this.stein.yPos[3] === this.stein.yPos[2]) {
          s.xPos[3] = this.stein.xPos[3] - 2 * (this.stein.xPos[3] - this.stein.xPos[1]);
          s.yPos[3] = this.stein.yPos[3];
        }
        break;
      case "L falsch herum":
        this.dreheSteinMitte(s);
        if (this.stein.xPos[3] === this.stein.xPos[0] || this.stein.xPos[3] === this.stein.xPos[2]) {
          s.xPos[3] = this.stein.xPos[3] - 2 * (this.stein.xPos[3] - this.stein.xPos[1]);
          s.yPos[3] = this.stein.yPos[3];
        } else if (this.stein.yPos[3] === this.stein.yPos[0]
          || this.stein.yPos[3] === this.stein.yPos[2]) {
          s.xPos[3] = this.stein.xPos[3];
          s.yPos[3] = this.stein.yPos[3]
            - 2 * (this.stein.yPos[3] - this.stein.yPos[1]);
        }
        break;
      case "kurzes T":
        this.dreheSteinMitte(s);
        if (this.stein.xPos[3] === this.stein.xPos[1]) {
          const t = this.stein.yPos[3] - this.stein.yPos[1];
          s.xPos[3] = this.stein.xPos[3] - t;
          s.yPos[3] = this.stein.yPos[3] - t;
        } else if (this.stein.yPos[3] === this.stein.yPos[1]) {
          const t = this.stein.xPos[3] - this.stein.xPos[1];
          s.xPos[3] = this.stein.xPos[3] - t;
          s.yPos[3] = this.stein.yPos[3] + t;
        }
    }
    for (let i = 0; i < 4; i++) {
      s.plaetze[i] = this.getPlatzAt(s.xPos[i], s.yPos[i]);
    }
    return s;
  }

  /**
   * ausgelagerte Methode für das Drehen von "L", "L falsch herum" und
   * "kurzes T"
   *
   * @param s
   *            der Stein, dessen Mitte gedreht werden soll
   */
  private dreheSteinMitte(s: Stein): void {
    s.xPos[0] = this.stein.xPos[0] === this.stein.xPos[1] ? this.stein.xPos[0] - 1 : this.stein.xPos[0] + 1;
    s.xPos[1] = this.stein.xPos[1];
    s.xPos[2] = this.stein.xPos[2] === this.stein.xPos[1] ? this.stein.xPos[2] + 1 : this.stein.xPos[2] - 1;
    s.yPos[0] = this.stein.yPos[0] === this.stein.yPos[1] ? this.stein.yPos[0] + 1 : this.stein.yPos[0] - 1;
    s.yPos[1] = this.stein.yPos[1];
    s.yPos[2] = this.stein.yPos[2] === this.stein.yPos[1] ? this.stein.yPos[2] - 1 : this.stein.yPos[2] + 1;
  }

  /**
   * Diese Methode lässt einen neuen Stein erscheinen und übernimmt außerdem
   * das Verlieren
   */
  private spawn(): void {
    const spawn = Math.floor(Math.random() * 7);
    let s = new Stein();
    switch (spawn) {
      case 0:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2);
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[0];
        s.xPos[3] = s.xPos[1];
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 1;
        s.yPos[3] = 1;
        s.bezeichnung = "Quadrat";
        break;
      case 1:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2) - 1;
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[1] + 1;
        s.xPos[3] = s.xPos[2] + 1;
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 0;
        s.yPos[3] = 0;
        s.bezeichnung = "Stange";
        break;
      case 2:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2) - 1;
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[1];
        s.xPos[3] = s.xPos[1] + 1;
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 1;
        s.yPos[3] = 1;
        s.bezeichnung = "Zacke 1";
        break;
      case 3:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2);
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[0] - 1;
        s.xPos[3] = s.xPos[0];
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 1;
        s.yPos[3] = 1;
        s.bezeichnung = "Zacke 2";
        break;
      case 4:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2) - 1;
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[1] + 1;
        s.xPos[3] = s.xPos[0];
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 0;
        s.yPos[3] = 1;
        s.bezeichnung = "L";
        break;
      case 5:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2) - 1;
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[1] + 1;
        s.xPos[3] = s.xPos[2];
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 0;
        s.yPos[3] = 1;
        s.bezeichnung = "L falsch herum";
        break;
      case 6:
        s.xPos[0] = Math.floor(this.werte.anzahlSitzeProReihe / 2) - 1;
        s.xPos[1] = s.xPos[0] + 1;
        s.xPos[2] = s.xPos[1] + 1;
        s.xPos[3] = s.xPos[1];
        s.yPos[0] = 0;
        s.yPos[1] = 0;
        s.yPos[2] = 0;
        s.yPos[3] = 1;
        s.bezeichnung = "kurzes T";
        break;
    }
    for (let i = 0; i < 4; i++) {
      s.plaetze[i] = this.getPlatzAt(s.xPos[i], s.yPos[i]);
    }
    s = this.kannBewegen(s);
    if (s) {
      for (const platz of s.plaetze) {
        this.werte.verkauft.add(platz);
      }
      this.stein = s;
    } else {
      this.lost = true;
    }
  }
}

/**
 * Diese Klasse stellt einen Block in Tetris dar. Er besteht aus vier
 * JPlatzButtons, sowie ihren Positionen.
 *
 * @author Tsuno
 *
 */
class Stein {
  public plaetze: Platz[];
  public xPos: number[];
  public yPos: number[];
  public bezeichnung: string;

  constructor() {
    this.plaetze = new Array(4);
    this.xPos = new Array(4);
    this.yPos = new Array(4);
    this.bezeichnung = "";
  }

  /**
   * Prüft, ob ein Button enthalten ist
   *
   * @param platz
   *            der Platz
   * @return true, wenn der Button enthalten ist, sonst false
   */
  contains(platz: Platz) {
    for (const p of this.plaetze) {
      if (platz.equals(p)) {
        return true;
      }
    }
    return false;
  }

  reihen() {
    const set = new Set<number>();
    for (let i = 0; i < 4; i++) {
      set.add(this.yPos[i]);
    }
    return set;
  }
}
