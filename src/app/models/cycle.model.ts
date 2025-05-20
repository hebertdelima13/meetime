export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface EventDay {
  day: number;
  meetings: number;
  emails: number;
  calls: number;
  follows: number;
}

export interface Cycle {
  name: string;
  availableEntities: number;
  priority: Priority;
  structure: EventDay[];
}

export interface EventProjection {
  day: number;
  events: {
    meetings: number;
    emails: number;
    calls: number;
    follows: number;
  };
}

export interface CycleWrapper {
  cycle: Cycle;
  disabled: boolean;
}

export interface ParamsDistribution {
  cyclesWithEventsToday: CycleWrapper[];
  selected: Set<string>;
  totalEntities: number;
  priorityOrder: Priority[];
  currentDay: number;
  onlyDistribute?: boolean;
}
