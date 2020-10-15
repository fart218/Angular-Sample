import { Injectable, OnDestroy } from '@angular/core';
import { Document } from './document';
import { WebSocketSubject } from 'rxjs/websocket';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements OnDestroy {
  private _docSub: Subscription;

  doc: Observable<Document> = new Observable( observer => {
    observer.next(this.curDoc);
    observer.complete();
  });

  docs: Observable<string[]> = new Observable( observer => {
    observer.next(this.docList);
    observer.complete();
  });

  curDoc: Document = new Document();
  docList: string[] = [];
  
  constructor(private subject: WebSocketSubject<any>) { 
    this._docSub = subject.subscribe(res => {
      console.log(res.data);
      switch (res.event) {
        case "documents":
          this.docList.length = 0;
          for (let doc of res.data) this.docList.push(doc);
          break;
        case "document":
          this.curDoc.id = res.data.id;
          this.curDoc.doc = res.data.doc;
          break;
      }
    });
    this.subject.next({event: "appStart"});
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  getDocument(id: string) {
    this.subject.next({event: "getDoc", id: id});
  }

  newDocument() {
    this.subject.next({event: "addDoc", id: this.docId()});
  }

  editDocument(document: Document) {
    this.subject.next({event: "editDoc", doc: this.curDoc});
  }

  delDocument(id: string) {
    this.subject.next({event: "delDoc", id: id});
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}