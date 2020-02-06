import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

@Component({
  selector: "platz-button",
  templateUrl: "./platz-button.component.html",
  styleUrls: ["./platz-button.component.scss"]
})
export class PlatzButtonComponent implements OnInit {
  @Input() verkauft: boolean;
  @Input() ausgewaehlt: boolean;
  @Input() text: string | number;
  @Output() active: EventEmitter<MouseEvent>;

  constructor() {
    this.active = new EventEmitter<MouseEvent>();
  }

  ngOnInit() {
  }

}
