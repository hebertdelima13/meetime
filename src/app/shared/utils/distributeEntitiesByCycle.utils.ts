import { ParamsDistribution } from '../../models/cycle.model';

export function distributeEntitiesByCycle({
  cyclesWithEventsToday,
  selected,
  totalEntities,
  priorityOrder,
  currentDay,
  onlyDistribute = false,
}: ParamsDistribution): Map<string, number> {
  const map = new Map<string, number>();
  let remainingEntities = totalEntities;

  for (const { cycle } of cyclesWithEventsToday) {
    map.set(cycle.name, 0);
  }

  if (!onlyDistribute) {
    for (const { cycle } of cyclesWithEventsToday) {
      const structureToday = cycle.structure.find(d => d.day === currentDay);

      if (structureToday) {
        const baseEvents = structureToday.meetings + structureToday.emails + structureToday.calls + structureToday.follows;
        map.set(cycle.name, baseEvents);
      }
    }
  }

  for (const priority of priorityOrder) {
    const priorityCycles = cyclesWithEventsToday
      .filter(entry => !entry.disabled && selected.has(entry.cycle.name) && entry.cycle.priority === priority && entry.cycle.availableEntities > 0)
      .map(e => e.cycle);

    for (const cycle of priorityCycles) {
      if (remainingEntities <= 0) break;

      const use = Math.min(cycle.availableEntities, remainingEntities);
      const structureToday = cycle.structure.find(d => d.day === currentDay);

      if (structureToday) {
        const eventsByEntity = structureToday.meetings + structureToday.emails + structureToday.calls + structureToday.follows;

        const distrutedEvents = onlyDistribute ? eventsByEntity * use : eventsByEntity * (use - 1);

        const actual = map.get(cycle.name) || 0;
        map.set(cycle.name, actual + distrutedEvents);
      }

      remainingEntities -= use;
    }

    if (remainingEntities <= 0) break;
  }

  return map;
}
