export const ALL_PERIODS = [
  { id: 1, period: '1', time: '8:00-8:50', start: '08:00', end: '08:50' },
  { id: 2, period: '2', time: '9:00-9:50', start: '09:00', end: '09:50' },
  { id: 3, period: '3', time: '10:00-10:50', start: '10:00', end: '10:50' },
  { id: 4, period: '4', time: '11:00-11:50', start: '11:00', end: '11:50' },
  { id: 5, period: '5', time: '12:00-12:50', start: '12:00', end: '12:50' },
  { id: 6, period: '6', time: '14:00-14:50', start: '14:00', end: '14:50' },
  { id: 7, period: '7', time: '15:00-15:50', start: '15:00', end: '15:50' },
  { id: 8, period: '8', time: '16:00-16:50', start: '16:00', end: '16:50' },
  { id: 9, period: '9', time: '17:00-17:50', start: '17:00', end: '17:50' },
  { id: 10, period: '10', time: '18:00-18:50', start: '18:00', end: '18:50' },
  { id: 11, period: '11', time: '19:00-19:50', start: '19:00', end: '19:50' },
  { id: 12, period: '12', time: '20:00-20:50', start: '20:00', end: '20:50' },
  { id: 13, period: '13', time: '21:00-21:50', start: '21:00', end: '21:50' },
  { id: 14, period: '14', time: '22:00-22:50', start: '22:00', end: '22:50' },
  { id: 15, period: '15', time: '23:00-23:50', start: '23:00', end: '23:50' },
];

// Default to all periods up to 11pm (23:00-23:50)
export const PERIODS = ALL_PERIODS;

export const DAYS = [
  { key: 'Monday', label: 'Monday', short: 'Mo', dayIndex: 1 },
  { key: 'Tuesday', label: 'Tuesday', short: 'Tu', dayIndex: 2 },
  { key: 'Wednesday', label: 'Wednesday', short: 'We', dayIndex: 3 },
  { key: 'Thursday', label: 'Thursday', short: 'Th', dayIndex: 4 },
  { key: 'Friday', label: 'Friday', short: 'Fr', dayIndex: 5 },
];

// Color palette mapping to match the original image
export const COURSE_COLORS = {
  'CSM 483': {
    bg: '#fbc4c4',
    border: '#f87171',
    text: '#1f2937',
    badge: '#ef4444'
  },
  'CSM 477': {
    bg: '#cfe2fe',
    border: '#93c5fd',
    text: '#1f2937',
    badge: '#3b82f6'
  },
  'CSM 497': {
    bg: '#e9d5ff',
    border: '#c084fc',
    text: '#1f2937',
    badge: '#a855f7'
  },
  'CS-SEMINAR': {
    bg: '#e2e8f0',
    border: '#cbd5e1',
    text: '#1f2937',
    badge: '#64748b'
  },
  'CSM 481': {
    bg: '#c7f9cc',
    border: '#86efac',
    text: '#1f2937',
    badge: '#22c55e'
  },
  'CSM 491': {
    bg: '#fef08a',
    border: '#fde047',
    text: '#1f2937',
    badge: '#eab308'
  },
  'CSM 495': {
    bg: '#fed7aa',
    border: '#fdba74',
    text: '#1f2937',
    badge: '#f97316'
  },
  'MAS 261': {
    bg: '#fecdd3',
    border: '#fda4af',
    text: '#1f2937',
    badge: '#f43f5e'
  },
  'PROJECT': {
    bg: '#cffafe',
    border: '#67e8f9',
    text: '#1f2937',
    badge: '#06b6d4'
  },
  'STUDY': {
    bg: '#fef9c3',
    border: '#facc15',
    text: '#1f2937',
    badge: '#ca8a04'
  },
  'LAB': {
    bg: '#e0e7ff',
    border: '#818cf8',
    text: '#1f2937',
    badge: '#4f46e5'
  }
};

export const INITIAL_CLASSES = [
  // Monday
  {
    id: 'mon-csm483',
    day: 'Monday',
    startPeriod: 7,
    endPeriod: 8,
    time: '15:00 - 16:50',
    room: 'Room SCBSF20',
    group: 'Group 2',
    code: 'CSM 483',
    title: 'Operating Systems',
    lecturer: 'Lecturer: B.T. Parley',
    curriculumCode: 'CSM 483',
    colorKey: 'CSM 483',
  },
  {
    id: 'mon-csm477',
    day: 'Monday',
    startPeriod: 9,
    endPeriod: 10,
    time: '17:00 - 18:50',
    room: 'Room SCBSF20',
    group: 'Group 2',
    code: 'CSM 477',
    title: 'Data Communications (M. ASANTE)',
    lecturer: 'Lecturer: M. ASANTE',
    curriculumCode: 'CSM 477',
    colorKey: 'CSM 477',
  },
  // Tuesday
  {
    id: 'tue-csm497',
    day: 'Tuesday',
    startPeriod: 7,
    endPeriod: 8,
    time: '15:00 - 16:50',
    room: 'SCBFF24',
    group: 'Group 2',
    code: 'CSM 497',
    title: 'Expert Systems',
    lecturer: 'Lecturer: N. Ussiph',
    curriculumCode: 'CSM 497',
    colorKey: 'CSM 497',
  },
  // Wednesday
  {
    id: 'wed-csseminar',
    day: 'Wednesday',
    startPeriod: 3,
    endPeriod: 4,
    time: '10:00 - 11:50',
    room: 'SCBFF5',
    group: 'Group 2',
    code: 'CS-SEMINAR',
    title: 'Computer Science Seminar',
    lecturer: 'All Lecturers',
    curriculumCode: 'CS-SEMINAR',
    colorKey: 'CS-SEMINAR',
  },
  {
    id: 'wed-csm481',
    day: 'Wednesday',
    startPeriod: 5,
    endPeriod: 5,
    time: '12:00 - 12:50',
    room: 'SCBFF1',
    group: 'Group 2',
    code: 'CSM 481',
    title: 'Information Systems I',
    lecturer: 'K.A PABBI',
    curriculumCode: 'CSM 481',
    colorKey: 'CSM 481',
  },
  {
    id: 'wed-csm491',
    day: 'Wednesday',
    startPeriod: 9,
    endPeriod: 10,
    time: '17:00 - 18:50',
    room: 'SCBSF1',
    group: 'Group 2',
    code: 'CSM 491',
    title: 'Graph Theory & Applications',
    lecturer: 'Lecturer: O. Korriyo',
    curriculumCode: 'CSM 491',
    colorKey: 'CSM 491',
  },
  // Thursday
  {
    id: 'thu-csm495',
    day: 'Thursday',
    startPeriod: 5,
    endPeriod: 6,
    time: '12:00 - 14:50',
    room: 'SCBFS20',
    group: 'Group 2',
    code: 'CSM 495',
    title: 'Intro to Software Engineering',
    lecturer: 'Lecturer: F. TWUM',
    curriculumCode: 'CSM 495',
    colorKey: 'CSM 495',
  },
  {
    id: 'thu-mas261',
    day: 'Thursday',
    startPeriod: 9,
    endPeriod: 10,
    time: '17:00 - 18:50',
    room: 'SCBSF1',
    group: 'Group 2',
    code: 'MAS 261',
    title: 'Principles of Management',
    lecturer: 'Lecturer: C. Adjanor-Doku',
    curriculumCode: 'MGT 471',
    colorKey: 'MAS 261',
  },
  // Friday
  {
    id: 'fri-project',
    day: 'Friday',
    startPeriod: 3,
    endPeriod: 8,
    time: '10:00 - 16:50',
    room: 'Department Labs',
    group: 'Group 2',
    code: 'PROJECT',
    title: 'Final Year Project',
    lecturer: 'Project Supervisors',
    curriculumCode: 'CSM 489',
    colorKey: 'PROJECT',
  },
  {
    id: 'fri-csm481',
    day: 'Friday',
    startPeriod: 9,
    endPeriod: 10,
    time: '17:00 - 18:50',
    room: 'Room SCBFF1',
    group: 'Group 2',
    code: 'CSM 481',
    title: 'Information Systems I',
    lecturer: 'Lecturer: K.A PABBI',
    curriculumCode: 'CSM 481',
    colorKey: 'CSM 481',
  }
];

export function buildDaySlots(dayName, classList = INITIAL_CLASSES, periodsList = ALL_PERIODS) {
  const dayClasses = classList.filter(c => c.day === dayName);
  const slots = [];
  let p = 1;

  while (p <= periodsList.length) {
    const classAtP = dayClasses.find(c => c.startPeriod === p);
    if (classAtP) {
      const colSpan = (classAtP.endPeriod - classAtP.startPeriod + 1);
      slots.push({
        ...classAtP,
        colSpan,
        isEmpty: false,
        periods: Array.from({ length: colSpan }, (_, i) => p + i)
      });
      p += colSpan;
    } else {
      slots.push({
        colSpan: 1,
        isEmpty: true,
        periods: [p],
        day: dayName,
        periodId: p,
        periodTime: periodsList[p - 1]?.time || ''
      });
      p += 1;
    }
  }

  return slots;
}

export function getFullTimetableSchedule(classList = INITIAL_CLASSES, periodsList = ALL_PERIODS) {
  const schedule = {};
  DAYS.forEach(day => {
    schedule[day.key] = buildDaySlots(day.key, classList, periodsList);
  });
  return schedule;
}

export const TIMETABLE_SCHEDULE = getFullTimetableSchedule(INITIAL_CLASSES, ALL_PERIODS);

export const CURRICULUM_COURSES = [
  {
    code: 'CSM 477',
    title: 'Data Communications',
    theory: 3,
    practical: 0,
    credits: 3,
    lecturer: 'M. ASANTE',
    timetableCode: 'CSM 477'
  },
  {
    code: 'CSM 481',
    title: 'Information Systems I',
    theory: 3,
    practical: 0,
    credits: 3,
    lecturer: 'K.A PABBI',
    timetableCode: 'CSM 481'
  },
  {
    code: 'CSM 483',
    title: 'Operating Systems',
    theory: 3,
    practical: 0,
    credits: 3,
    lecturer: 'B.T. Parley',
    timetableCode: 'CSM 483'
  },
  {
    code: 'CSM 491',
    title: 'Graph Theory and Its Applications',
    theory: 2,
    practical: 0,
    credits: 2,
    lecturer: 'O. Korriyo',
    timetableCode: 'CSM 491'
  },
  {
    code: 'CSM 489',
    title: 'Project I',
    theory: 0,
    practical: 6,
    credits: 3,
    lecturer: 'Project Supervisors',
    timetableCode: 'PROJECT'
  },
  {
    code: 'CSM 495',
    title: 'Introduction to Software Engineering',
    theory: 2,
    practical: 0,
    credits: 2,
    lecturer: 'F. TWUM',
    timetableCode: 'CSM 495'
  },
  {
    code: 'MGT 471',
    title: 'Principles of Management I',
    theory: 2,
    practical: 0,
    credits: 2,
    lecturer: 'C. Adjanor-Doku',
    timetableCode: 'MAS 261'
  }
];

export const CURRICULUM_TOTALS = {
  theory: 15,
  practical: 6,
  credits: 18,
};
