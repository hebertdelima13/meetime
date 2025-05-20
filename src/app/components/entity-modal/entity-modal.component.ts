import { Component, inject, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { CycleTableComponent } from '../cycle-table/cycle-table.component';
import { EntityInputComponent } from '../entity-input/entity-input.component';
import { EventsChartComponent } from '../events-chart/events-chart.component';
import { EventsStoreService } from '../../shared/services/events-store.service';

@Component({
  selector: 'entity-modal',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDividerModule,
    MatButtonModule,
    CycleTableComponent,
    EntityInputComponent,
    EventsChartComponent,
    MatExpansionModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './entity-modal.component.html',
  styleUrl: './entity-modal.component.scss',
})
export class EntityModalComponent implements OnInit {
  isPanelOpen = false;
  private store = inject(EventsStoreService);

  ngOnInit(): void {
    this.isPanelOpen = false;
    this.store.loadData();
  }

  onToggle(expanded: boolean) {
    this.isPanelOpen = expanded;
  }
}
