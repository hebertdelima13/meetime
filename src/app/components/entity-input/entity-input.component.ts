import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EventsStoreService } from '../../shared/services/events-store.service';

@Component({
  selector: 'entity-input',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './entity-input.component.html',
  styleUrl: './entity-input.component.scss',
})
export class EntityInputComponent {
  private store = inject(EventsStoreService);

  entities = this.store.entities;

  newEventsToday = this.store.newEventsToday;

  maxAvailableEntities = this.store.maxAvailableEntities;

  updateEntities(value: number) {
    const parsed = Number(value);
    const max = this.maxAvailableEntities();

    if (isNaN(parsed) || parsed <= 0) return;

    this.store.updateEntities(Math.min(parsed, max));
  }
}
