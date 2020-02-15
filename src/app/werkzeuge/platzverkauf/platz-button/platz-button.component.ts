import {Component, EventEmitter, Input, Output} from "@angular/core";

/**
 * Equivalent zum JPlatzButton
 */
@Component({
  selector: "platz-button",
  templateUrl: "./platz-button.component.html",
  styleUrls: ["./platz-button.component.scss"]
})
export class PlatzButtonComponent {
  @Input() verkauft: boolean;
  @Input() ausgewaehlt: boolean;
  @Input() text: string | number;
  @Output() active: EventEmitter<void>;

  constructor() {
    this.active = new EventEmitter<void>();
  }
}
