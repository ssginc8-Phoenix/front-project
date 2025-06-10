type CalendarItem = {
  title: string;
  time: string;
  date: string;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  description?: string;
};
