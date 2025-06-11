type CalendarItem = {
  title: string;
  time: string;
  date: string;
  relatedId: number;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  description?: string;
};
