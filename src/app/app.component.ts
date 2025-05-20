import { MatDialog } from '@angular/material/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { EntityModalComponent } from './components/entity-modal/entity-modal.component';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.dialog.open(EntityModalComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'modal-backdrop',
      panelClass: 'modal-panel',
      maxWidth: '835px',
      maxHeight: 'fit-content',
    });
  }
}
