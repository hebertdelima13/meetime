export interface UsefulDay {
  number: number;
  name: string;
}

export function getNextBusinessDays(): UsefulDay[] {
  const names = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const currentDay = new Date();
  const currentWeekDay = currentDay.getDay(); // 0 (Dom) a 6 (Sáb)

  const currentUseDay = currentWeekDay >= 1 && currentWeekDay <= 5 ? currentWeekDay : 1;

  const businessDays: UsefulDay[] = [];
  let dayCursor = currentUseDay;

  while (businessDays.length < 5) {
    if (dayCursor > 5) dayCursor = 1;

    const name = businessDays.length === 0 ? 'Hoje' : names[dayCursor];

    businessDays.push({
      number: dayCursor,
      name,
    });

    dayCursor++;
  }

  return businessDays;
}
