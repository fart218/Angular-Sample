import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentComponent } from './document/document.component';
import { webSocket, WebSocketSubject } from 'rxjs/websocket';

export const myWebSocket = webSocket<any>('ws://localhost:6969');

@NgModule({
  declarations: [
    AppComponent,
    DocumentListComponent,
    DocumentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [
    {
      provide: WebSocketSubject,
      useValue: myWebSocket
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
