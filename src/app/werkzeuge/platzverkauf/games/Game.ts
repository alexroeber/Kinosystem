/**
 * Dieses Interface bietet die Schnittstelle für Spiele, bisher benutzt in
 * JPlatzplan. Dieser erkennt Spiele automatisch, wenn sie sich in diesem Paket befinden. (Siehe
 * JPlatzplan.initGameList()).<br>
 * <b>Der Kontruktor muss wie folgt aufgebaut sein:<br>
 * Game(GameLosehandler glh, JPlatzplan.Werte werte)</b>
 *
 * @author Tsuno
 *
 */
import {Werte} from "./Werte";

export abstract class Game {
  protected constructor(protected gameLoseHandler: (game: Game) => void, protected werte: Werte) {
  }

  /**
   * Die Anzahl an Millisekunden vor erneutem run()
   */
  abstract get sleep(): number;

  /**
   * Diese Methode ist zur implementation von sich wiederholenden Ereignissen
   * gedacht, sie wird daher immer wieder von außerhalb aufgerufen.
   */
  abstract run(): void;

  /**
   * Zum verarbeiten von Eingaben für das Spiel.
   *
   * @param e das gegebene KeyboardEvent, keydown.
   */
  abstract dispatchKeyEvent(e: KeyboardEvent): void;

  /**
   * Zum initialisieren des Spiels.
   */
  abstract init(): void;

  /**
   * Für die eventuelle Logik, wenn das Spiel beendet wird
   */
  abstract deactivate(): void;

  /**
   * Für die eventuelle Logik, wenn das Spiel gestartet wird
   */
  abstract activate(): void;

  /**
   * Zur Namensabfrage.
   *
   * @return der Name des Spiels.
   */
  abstract getName(): string;
}
