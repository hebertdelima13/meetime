import { CycleTableElementComponent } from './../cycle-table-element/cycle-table-element.component';
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { EventsStoreService } from '../../shared/services/events-store.service';
import { Cycle } from '../../models/cycle.model';

@Component({
  selector: 'cycle-table',
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatCardModule, MatIconModule, MatListModule, CycleTableElementComponent],
  templateUrl: './cycle-table.component.html',
  styleUrl: './cycle-table.component.scss',
})
export class CycleTableComponent {
  private store = inject(EventsStoreService);

  cycles = this.store.cyclesWithEventsToday;
  selectedCycles = this.store.selectedCycles;
  entities = this.store.entities;

  displayedColumns = ['select', 'available', 'todayEvents'];

  readonly availableCycles = computed(() => this.store.allCycles().filter(c => c.availableEntities > 0));

  readonly notAvailableCycles = computed(() => this.store.allCycles().filter(c => c.availableEntities === 0));

  toggleCycle(name: string) {
    this.store.toggleCycleSelection(name);
  }

  isChecked(name: string): boolean {
    return this.selectedCycles().has(name);
  }

  getSelectedEntities(cycle: Cycle): number {
    if (!this.selectedCycles().has(cycle.name)) return 0;

    const allSelected = this.store
      .cyclesWithEventsToday()
      .filter(e => !e.disabled && this.selectedCycles().has(e.cycle.name) && e.cycle.availableEntities > 0)
      .map(e => e.cycle);

    const totalEntities = this.entities();
    const priorityOrder = this.store.priorityOrder;

    let remainingEntities = totalEntities;

    for (const priority of priorityOrder) {
      const cyclesByPriority = allSelected.filter(c => c.priority === priority);

      for (const c of cyclesByPriority) {
        const use = Math.min(remainingEntities, c.availableEntities);

        if (c.name === cycle.name) {
          return use;
        }

        remainingEntities -= use;
        if (remainingEntities <= 0) break;
      }

      if (remainingEntities <= 0) break;
    }

    return 0;
  }

  getEventsForToday(cycle: Cycle): number {
    return this.store.eventsTodayByCycle().get(cycle.name) ?? 0;
  }

  get isDisabledToday() {
    return (name: string) => this.cycles().find(e => e.cycle.name === name)?.disabled ?? true;
  }
}
