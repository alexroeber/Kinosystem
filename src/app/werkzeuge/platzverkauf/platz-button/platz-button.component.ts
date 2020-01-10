import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Platz} from "../../../fachwerte/Platz";

@Component({
  selector: "platz-button",
  templateUrl: "./platz-button.component.html",
  styleUrls: ["./platz-button.component.scss"]
})
export class PlatzButtonComponent implements OnInit {
  @Input() platz: Platz;
  @Input() verkauft: boolean;
  @Input() ausgewaehlt: boolean;
  @Output() active: EventEmitter<MouseEvent>;

  constructor() {
    this.active = new EventEmitter<MouseEvent>();
  }

  ngOnInit() {
  }

}
