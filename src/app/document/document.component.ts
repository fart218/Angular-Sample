import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from 'src/app/document.service';
import { Subscription } from 'rxjs';
import { Document } from 'src/app/document';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  document: Document;
  private _docSub: Subscription;
  constructor(private documentService: DocumentService) { }

  ngOnInit() {
    this._docSub = this.documentService.doc.subscribe( doc => this.document = doc );
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  editDoc() {
    this.documentService.editDocument(this.document);
  }
}