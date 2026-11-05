import { INITIAL_CLASSES } from '../data/timetableData';

export function exportTimetableToICS(classList = INITIAL_CLASSES) {
  const dayOffsetMap = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
  };

  const now = new Date();
  const currentDay = now.getDay();
  const distanceToMonday = (1 + 7 - currentDay) % 7 || 7;
  const baseMonday = new Date(now);
  baseMonday.setDate(now.getDate() + distanceToMonday);

  let events = [];

  classList.forEach((slot, index) => {
    const dayOffset = dayOffsetMap[slot.day];
    if (dayOffset === undefined) return;

    const eventDate = new Date(baseMonday);
    eventDate.setDate(baseMonday.getDate() + dayOffset);

    const [startStr, endStr] = slot.time.split(' - ');
    if (!startStr || !endStr) return;

    const [startHour, startMin] = startStr.split(':').map(Number);
    const [endHour, endMin] = endStr.split(':').map(Number);

    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(endHour, endMin, 0, 0);

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const eventString = [
      'BEGIN:VEVENT',
      `UID:${slot.code}-${slot.day}-${index}-${Date.now()}@timetable.app`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `RRULE:FREQ=WEEKLY;UNTIL=20261231T235959Z`,
      `SUMMARY:${slot.code} - ${slot.title}`,
      `DESCRIPTION:${slot.title}\\n${slot.lecturer || ''}\\n${slot.group || ''}`,
      `LOCATION:${slot.room || 'Campus'}`,
      'END:VEVENT'
    ].join('\r\n');

    events.push(eventString);
  });

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//B.Sc. Computer Science-4//Timetable App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:B.Sc. Computer Science-4 Timetable',
    'X-WR-TIMEZONE:UTC',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'BSc_CS4_Group2_Timetable.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
