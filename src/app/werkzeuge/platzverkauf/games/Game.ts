import {Werte} from "./Werte";

/**
 * Dieses Interface bietet die Schnittstelle für Spiele, bisher benutzt in Platzplan.
 */
export abstract class Game {
  protected constructor(protected gameLoseHandler: (game: Game) => void, protected werte: Werte) {
  }

  /**
   * Die Anzahl an Millisekunden vor erneutem run()
   */
  abstract get sleep(): number;

  /**
   * Diese Methode ist zur Implementation von sich wiederholenden Ereignissen
   * gedacht, sie wird daher immer wieder von außerhalb aufgerufen.
   */
  abstract run(): void;

  /**
   * Zum Verarbeiten von Eingaben für das Spiel.
   *
   * @param e das gegebene KeyboardEvent, keydown.
   */
  abstract dispatchKeyEvent(e: KeyboardEvent): void;

  /**
   * Für die eventuelle Logik, wenn das Spiel beendet wird.
   */
  abstract deactivate(): void;

  /**
   * Für die eventuelle Logik, wenn das Spiel gestartet wird.
   */
  abstract activate(): void;

  /**
   * Zur Namensabfrage.
   *
   * @return der Name des Spiels.
   */
  abstract getName(): string;
}
