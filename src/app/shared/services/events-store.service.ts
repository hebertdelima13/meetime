import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Cycle, EventProjection, Priority } from '../../models/cycle.model';
import { distributeEntitiesByCycle } from '../utils/distributeEntitiesByCycle.utils';
import { getNextBusinessDays } from '../utils/getDate.util';

@Injectable({
  providedIn: 'root',
})
export class EventsStoreService {
  private api = inject(ApiService);

  readonly entities = signal<number>(1);
  readonly allCycles = signal<Cycle[]>([]);
  readonly selectedCycles = signal<Set<string>>(new Set());
  readonly eventsProjection = signal<EventProjection[]>([]);
  readonly priorityOrder: Priority[] = ['HIGH', 'MEDIUM', 'LOW'];

  public loadData() {
    this.api.getCycles().subscribe(cycles => {
      this.updateAllCycles(cycles);
    });

    this.api.getEventsProjection().subscribe(events => {
      this.eventsProjection.set(events);
    });
  }

  private updateAllCycles(cycles: Cycle[]) {
    const ordered = [...cycles].sort((a, b) => this.priorityOrder.indexOf(a.priority) - this.priorityOrder.indexOf(b.priority));
    this.allCycles.set(ordered);

    const topPriority = ordered[0]?.priority;
    const selected = new Set(ordered.filter(c => c.priority === topPriority).map(c => c.name));
    this.selectedCycles.set(selected);
  }

  public updateEntities(valor: number) {
    if (valor > 0) {
      this.entities.set(valor);
    }
  }

  public toggleCycleSelection(cycleName: string) {
    const updated = new Set(this.selectedCycles());
    if (updated.has(cycleName)) {
      updated.delete(cycleName);
    } else {
      updated.add(cycleName);
    }
    this.selectedCycles.set(updated);
  }

  readonly cyclesWithEventsToday = computed(() => {
    const currentDay = getNextBusinessDays()[0].number;
    const cycles = this.allCycles();

    return cycles.map(cycle => {
      const structureToday = cycle.structure.find(d => d.day === currentDay);

      const hasEventsToday = !!structureToday && (structureToday.meetings > 0 || structureToday.emails > 0 || structureToday.calls > 0 || structureToday.follows > 0);

      return {
        cycle,
        disabled: !hasEventsToday,
      };
    });
  });

  readonly newEventsToday = computed(() => {
    const mapa = distributeEntitiesByCycle({
      cyclesWithEventsToday: this.cyclesWithEventsToday(),
      selected: this.selectedCycles(),
      totalEntities: this.entities(),
      priorityOrder: this.priorityOrder,
      currentDay: getNextBusinessDays()[0].number,
      onlyDistribute: true,
    });

    return Array.from(mapa.values()).reduce((total, atual) => total + atual, 0);
  });

  readonly eventsTodayByCycle = computed(() => {
    return distributeEntitiesByCycle({
      cyclesWithEventsToday: this.cyclesWithEventsToday(),
      selected: this.selectedCycles(),
      totalEntities: this.entities(),
      priorityOrder: this.priorityOrder,
      currentDay: getNextBusinessDays()[0].number,
      onlyDistribute: false,
    });
  });

  readonly maxAvailableEntities = computed(() => {
    const cycles = this.cyclesWithEventsToday();
    const selectedCycles = this.selectedCycles();

    return cycles.filter(c => !c.disabled && selectedCycles.has(c.cycle.name)).reduce((total, c) => total + c.cycle.availableEntities, 0);
  });
}
