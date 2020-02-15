import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import {Geldbetrag} from "../../../fachwerte/Geldbetrag";

/**
 * Equivalent zum Bezahlwerkzeug
 */
@Component({
  selector: "bezahlung",
  templateUrl: "./bezahlung.component.html",
  styleUrls: ["./bezahlung.component.scss"]
})
export class BezahlungComponent implements OnChanges {
  @Input() betrag: Geldbetrag;
  @Output() abgeschlossen: EventEmitter<boolean>;
  @ViewChild("eingabe", {static: true}) eingabe: ElementRef<HTMLInputElement>;

  ueberschrift: string;
  eingabeInvalid: boolean;
  ergebnis: string;
  ergebnisInvalid: boolean;

  constructor() {
    this.abgeschlossen = new EventEmitter<boolean>();
    this.ergebnis = "Keine Bezahlung erfolgt";
    this.ergebnisInvalid = true;
    this.eingabeInvalid = true;
  }

  /**
   * UI-Methode, Reaktion mit <code>false</code> auf Beenden-Button und den Rest des Bildschirms, sowie mit
   * <code>true</code> auf Abschließen-Button
   */
  abschliessen(abgeschlossen: boolean): void {
    this.abgeschlossen.emit(abgeschlossen);
  }

  /**
   * UI-Methode, Reaktion auf drücken von "Enter" im Textfeld oder des Ok-Buttons
   * Verarbeitet die Eingabe.
   */
  formSubmit(): boolean {
    this.verarbeiteEingabe();
    return false;
  }

  ngOnChanges(): void {
    this.ueberschrift = "Zu bezahlen: " + this.betrag;
  }

  /**
   * Interne Methode, um das Ergebnis der Eingabe zu bearbeiten. Gültigkeit der Eingabe wird überprüft, sowie eventuell
   * das Rückgeld oder der fehlende Betrag berechnet.
   */
  private verarbeiteEingabe(): void {
    const value = this.eingabe.nativeElement.value;
    const valid = value && Geldbetrag.istGueltig(value);
    if (valid) {
      const eingabeBetrag = Geldbetrag.parseGeldbetrag(value);
      if (Geldbetrag.groesserGleich(eingabeBetrag, this.betrag)) {
        this.ergebnis = "Rückgeld: " + Geldbetrag.subtrahiere(eingabeBetrag, this.betrag);
        this.ergebnisInvalid = false;
      } else {
        this.ergebnis = "Es fehlt: " + Geldbetrag.subtrahiere(this.betrag, eingabeBetrag);
        this.ergebnisInvalid = true;
      }
    } else {
      this.ergebnis = "Keine Bezahlung erfolgt";
      this.ergebnisInvalid = true;
    }
    this.eingabeInvalid = !valid;
  }
}
