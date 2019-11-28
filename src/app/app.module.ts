import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {WerkzeugeModule} from "./werkzeuge/werkzeuge.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WerkzeugeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
