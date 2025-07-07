type CalendarItem = {
  title: string;
  time: string;
  date: string;
  relatedId: number;
  itemType: 'MEDICATION' | 'APPOINTMENT';
  description?: string;
  times?: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
  startDate?: string;
  endDate?: string;
};
