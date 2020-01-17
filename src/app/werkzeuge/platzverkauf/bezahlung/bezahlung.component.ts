import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild} from "@angular/core";
import {Geldbetrag} from "../../../fachwerte/Geldbetrag";

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

  abschliessen(abgeschlossen: boolean) {
    this.abgeschlossen.emit(abgeschlossen);
  }

  formSubmit() {
    try {
      this.verarbeiteEingabe();
    } catch (e) {
    }
    return false;
  }

  ngOnChanges() {
    this.ueberschrift = "Zu bezahlen: " + this.betrag;
  }

  private verarbeiteEingabe() {
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
