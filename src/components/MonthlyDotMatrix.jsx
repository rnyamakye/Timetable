import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Info, 
  Check, 
  Clock, 
  Layers, 
  Grid, 
  ListFilter,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { COURSE_COLORS } from '../data/timetableData';

export default function MonthlyDotMatrix({
  classes = [],
  habitHistory = {},
  onToggleDayHabit,
  completedIds = []
}) {
  // Current view year & month (Default: November 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(10); // 10 = November (0-indexed)
  
  // Selected task filter: 'ALL' or a specific task code (e.g. 'CCNA', 'CSM 481', etc.)
  const [selectedTask, setSelectedTask] = useState('ALL');

  // Matrix display mode: 'calendar' (7-day calendar heatmap) or 'task-grid' (Tasks vs 30 Days)
  const [matrixMode, setMatrixMode] = useState('calendar');

  // Selected day for detailed popover inspector (default to today: '2026-11-11')
  const [selectedDateKey, setSelectedDateKey] = useState('2026-11-11');

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonthIndex(10); // November 2026
    setSelectedDateKey('2026-11-11');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthName = monthNames[currentMonthIndex];

  // Distinct tasks list for selector
  const taskOptions = useMemo(() => {
    const list = [
      { code: 'ALL', label: 'All Tasks & Sessions (Combined)', colorKey: 'STUDY' },
      { code: 'CCNA', label: 'CCNA Professional Certification', colorKey: 'CCNA', isCert: true },
      { code: 'CSM 481', label: 'CSM 481 (Info Systems & Rev)', colorKey: 'CSM 481' },
      { code: 'CSM 483', label: 'CSM 483 (Operating Systems & Rev)', colorKey: 'CSM 483' },
      { code: 'CSM 477', label: 'CSM 477 (Data Comms & Rev)', colorKey: 'CSM 477' },
      { code: 'CSM 497', label: 'CSM 497 (Expert Systems & Rev)', colorKey: 'CSM 497' },
      { code: 'CSM 491', label: 'CSM 491 (Graph Theory & Rev)', colorKey: 'CSM 491' },
      { code: 'CSM 495', label: 'CSM 495 (Software Eng & Rev)', colorKey: 'CSM 495' },
      { code: 'MAS 261', label: 'MAS 261 (Management & Rev)', colorKey: 'MAS 261' },
      { code: 'PROJECT', label: 'Final Year Project (CSM 489)', colorKey: 'PROJECT' },
      { code: 'CS-SEMINAR', label: 'Computer Science Seminar', colorKey: 'CS-SEMINAR' }
    ];
    return list;
  }, []);

  // Helper to match session against selectedTask
  const sessionMatchesTask = (session, taskFilter) => {
    if (taskFilter === 'ALL') return true;
    const code = (session.code || '').toUpperCase();
    const filter = taskFilter.toUpperCase();
    if (filter === 'CCNA') {
      return code === 'CCNA' || session.isCertification;
    }
    return code === filter || code.startsWith(filter);
  };

  // Helper to resolve session object by id
  const getSessionById = (sessionId) => {
    const found = classes.find(c => c.id === sessionId);
    if (found) return found;

    // Fallback names for known ids
    if (sessionId === 'study-mon-ccna' || sessionId === 'study-wed-ccna' || sessionId === 'study-fri-ccna' || sessionId === 'study-sat-ccna' || sessionId === 'study-sun-ccna' || sessionId === 'study-tue-ccna') {
      return { id: sessionId, code: 'CCNA', title: 'CCNA Network Certification Study', time: '19:00 - 21:00', colorKey: 'CCNA', sessionType: 'study', isCertification: true };
    }
    if (sessionId.includes('csm483')) {
      return { id: sessionId, code: 'CSM 483', title: 'Operating Systems', time: '15:00 - 16:50', colorKey: 'CSM 483', sessionType: 'class' };
    }
    if (sessionId.includes('csm477')) {
      return { id: sessionId, code: 'CSM 477', title: 'Data Communications', time: '17:00 - 18:50', colorKey: 'CSM 477', sessionType: 'class' };
    }
    if (sessionId.includes('csm481')) {
      return { id: sessionId, code: 'CSM 481', title: 'Information Systems I', time: '12:00 - 12:50', colorKey: 'CSM 481', sessionType: 'class' };
    }
    if (sessionId.includes('csm497')) {
      return { id: sessionId, code: 'CSM 497', title: 'Expert Systems', time: '15:00 - 16:50', colorKey: 'CSM 497', sessionType: 'class' };
    }
    if (sessionId.includes('csm495')) {
      return { id: sessionId, code: 'CSM 495', title: 'Software Engineering', time: '12:00 - 12:50', colorKey: 'CSM 495', sessionType: 'class' };
    }
    if (sessionId.includes('mas261')) {
      return { id: sessionId, code: 'MAS 261', title: 'Principles of Management', time: '17:00 - 18:50', colorKey: 'MAS 261', sessionType: 'class' };
    }
    if (sessionId.includes('seminar')) {
      return { id: sessionId, code: 'CS-SEMINAR', title: 'Computer Science Seminar', time: '10:00 - 11:50', colorKey: 'CS-SEMINAR', sessionType: 'class' };
    }
    if (sessionId.includes('project')) {
      return { id: sessionId, code: 'PROJECT', title: 'Final Year Project', time: '10:00 - 16:50', colorKey: 'PROJECT', sessionType: 'class' };
    }
    return { id: sessionId, code: sessionId, title: 'Study Session', time: 'Scheduled Time', colorKey: 'STUDY', sessionType: 'study' };
  };

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayWeekday = new Date(currentYear, currentMonthIndex, 1).getDay(); // 0 = Sun
    // Monday-based offset: 0 for Mon, 6 for Sun
    const mondayOffset = (firstDayWeekday + 6) % 7;

    const days = [];
    // Leading empty cells for week 1 offset
    for (let i = 0; i < mondayOffset; i++) {
      days.push({ isOffset: true, key: `offset-${i}` });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0');
      const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

      const sessionIds = habitHistory[dateKey] || [];
      const allSessions = sessionIds.map(id => getSessionById(id));
      const matchingSessions = allSessions.filter(s => sessionMatchesTask(s, selectedTask));

      const count = matchingSessions.length;
      let level = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count === 3) level = 3;
      else if (count >= 4) level = 4;

      const isToday = currentYear === 2026 && currentMonthIndex === 10 && d === 11;
      const isPastOrToday = currentYear < 2026 || (currentYear === 2026 && currentMonthIndex < 10) || (currentYear === 2026 && currentMonthIndex === 10 && d <= 11);

      days.push({
        isOffset: false,
        key: dateKey,
        dateKey,
        dayNum: d,
        count,
        level,
        matchingSessions,
        allSessions,
        isToday,
        isPastOrToday
      });
    }

    return { days, daysInMonth };
  }, [currentYear, currentMonthIndex, habitHistory, selectedTask, classes]);

  // Compute Monthly Statistics
  const monthStats = useMemo(() => {
    const { days, daysInMonth } = calendarDays;
    const realDays = days.filter(d => !d.isOffset);
    
    // Elapsed days up to today (for Nov 2026: 11 days)
    const elapsedDays = realDays.filter(d => d.isPastOrToday);
    const activeDaysCount = elapsedDays.filter(d => d.count > 0).length;
    const totalCompletions = elapsedDays.reduce((acc, d) => acc + d.count, 0);

    const completionRate = elapsedDays.length > 0 
      ? Math.round((activeDaysCount / elapsedDays.length) * 100) 
      : 0;

    // Calculate longest consecutive streak in this month
    let maxStreak = 0;
    let currentStreak = 0;
    elapsedDays.forEach(d => {
      if (d.count > 0) {
        currentStreak++;
        if (currentStreak > maxStreak) maxStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    });

    return {
      activeDaysCount,
      elapsedCount: elapsedDays.length,
      daysInMonth,
      totalCompletions,
      completionRate,
      maxStreak
    };
  }, [calendarDays]);

  // Currently inspected day details
  const inspectedDay = useMemo(() => {
    const found = calendarDays.days.find(d => !d.isOffset && d.dateKey === selectedDateKey);
    if (!found) {
      return {
        dateKey: selectedDateKey,
        dayNum: 11,
        count: 0,
        matchingSessions: [],
        allSessions: []
      };
    }
    return found;
  }, [calendarDays, selectedDateKey]);

  // Color palette for selected task
  const activeColorTheme = COURSE_COLORS[selectedTask] || COURSE_COLORS['STUDY'];

  return (
    <div className="monthly-matrix-card print-hide">
      {/* 1. Header Bar: Title, Month Navigation, Mode Selector */}
      <div className="matrix-header-bar">
        <div className="matrix-title-group">
          <div className="matrix-title-pill">
            <CalendarIcon size={18} className="matrix-icon text-indigo" />
            <span>Monthly Habit Dot Matrix</span>
          </div>
          <span className="matrix-subtitle">
            Track daily consistency and completion frequency across the entire month
          </span>
        </div>

        <div className="matrix-header-controls">
          {/* Mode Switcher */}
          <div className="matrix-mode-switcher">
            <button
              type="button"
              className={`mode-btn ${matrixMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setMatrixMode('calendar')}
              title="7-Day Calendar Heatmap Matrix"
            >
              <Grid size={15} />
              <span>Calendar Heatmap</span>
            </button>
            <button
              type="button"
              className={`mode-btn ${matrixMode === 'task-grid' ? 'active' : ''}`}
              onClick={() => setMatrixMode('task-grid')}
              title="Multi-Task Habit Grid (Tasks vs 30 Days)"
            >
              <Layers size={15} />
              <span>Task-by-Day Grid</span>
            </button>
          </div>

          {/* Month Navigator */}
          <div className="month-nav-pill">
            <button
              type="button"
              className="month-nav-btn"
              onClick={handlePrevMonth}
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="month-nav-label">
              {currentMonthName} {currentYear}
            </span>
            <button
              type="button"
              className="month-nav-btn"
              onClick={handleNextMonth}
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className="jump-today-btn"
              onClick={handleJumpToToday}
              title="Jump to Today (Nov 11, 2026)"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Stats Row */}
      <div className="matrix-filter-bar">
        <div className="task-filter-group">
          <label className="filter-label">
            <ListFilter size={14} /> Filter Activity by Task:
          </label>
          <select 
            value={selectedTask} 
            onChange={(e) => setSelectedTask(e.target.value)}
            className="matrix-task-select"
          >
            {taskOptions.map(opt => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Month Metrics */}
        <div className="matrix-metric-chips">
          <div className="metric-chip" title="Days active out of elapsed days this month">
            <Flame size={14} className="text-orange" />
            <span>Active Days: <strong>{monthStats.activeDaysCount} / {monthStats.elapsedCount} ({monthStats.completionRate}%)</strong></span>
          </div>

          <div className="metric-chip" title="Total completed sessions this month">
            <Trophy size={14} className="text-emerald" />
            <span>Total Done: <strong>{monthStats.totalCompletions} Sessions</strong></span>
          </div>

          <div className="metric-chip" title="Longest streak of consecutive active days this month">
            <Sparkles size={14} className="text-purple" />
            <span>Longest Streak: <strong>{monthStats.maxStreak} Days</strong></span>
          </div>
        </div>
      </div>

      {/* 3A. MODE A: CALENDAR HEATMAP MATRIX */}
      {matrixMode === 'calendar' && (
        <div className="calendar-heatmap-container">
          {/* Weekday Column Headers */}
          <div className="heatmap-weekday-row">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
              <div key={w} className="weekday-header-cell">
                {w}
              </div>
            ))}
          </div>

          {/* Calendar 7-Column Dot Matrix Grid */}
          <div className="heatmap-grid-7cols">
            {calendarDays.days.map((day) => {
              if (day.isOffset) {
                return <div key={day.key} className="heatmap-cell offset-cell" />;
              }

              const isSelected = selectedDateKey === day.dateKey;

              return (
                <div
                  key={day.key}
                  onClick={() => setSelectedDateKey(day.dateKey)}
                  className={`heatmap-cell ${day.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`}
                  title={`${day.dateKey}: ${day.count} ${selectedTask === 'ALL' ? 'sessions' : selectedTask} completed. Click to inspect details.`}
                >
                  <div className="cell-top-row">
                    <span className="day-number">{day.dayNum}</span>
                    {day.isToday && <span className="today-badge-text">Today</span>}
                  </div>

                  {/* The Interactive Matrix Dot with Intensity Coloring */}
                  <div className="matrix-dot-wrapper">
                    <div 
                      className={`matrix-dot level-${day.level} ${day.count > 0 ? 'dot-active' : ''}`}
                      style={
                        day.count > 0 && selectedTask !== 'ALL'
                          ? { backgroundColor: activeColorTheme.badge || '#16a34a' }
                          : undefined
                      }
                    >
                      {day.count > 0 ? (
                        <span className="dot-count-label">{day.count}</span>
                      ) : (
                        <span className="dot-empty-circle" />
                      )}
                    </div>
                  </div>

                  <span className="cell-sub-label">
                    {day.count === 0 
                      ? (day.isPastOrToday ? 'No tasks' : 'Upcoming') 
                      : `${day.count} done`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Heatmap Intensity Legend */}
          <div className="matrix-legend-row">
            <span className="legend-caption">Intensity Scale:</span>
            <div className="legend-scale">
              <span className="legend-text">Less</span>
              <div className="legend-dot level-0" title="0 sessions" />
              <div className="legend-dot level-1" title="1 session" />
              <div className="legend-dot level-2" title="2 sessions" />
              <div className="legend-dot level-3" title="3 sessions" />
              <div className="legend-dot level-4" title="4+ sessions" />
              <span className="legend-text">More</span>
            </div>
            <span className="legend-tip">
              • Click any day to view &amp; toggle completed tasks
            </span>
          </div>
        </div>
      )}

      {/* 3B. MODE B: MULTI-TASK HABIT GRID (Tasks as Rows × Days 1..30 as Columns) */}
      {matrixMode === 'task-grid' && (
        <div className="task-grid-scroll-container">
          <table className="task-matrix-table">
            <thead>
              <tr>
                <th className="task-col-header">Task / Course</th>
                {Array.from({ length: calendarDays.daysInMonth }, (_, idx) => idx + 1).map(d => {
                  const dayStr = String(d).padStart(2, '0');
                  const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
                  const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
                  const isToday = currentYear === 2026 && currentMonthIndex === 10 && d === 11;
                  return (
                    <th 
                      key={d} 
                      className={`day-col-header ${isToday ? 'col-today' : ''}`}
                      title={`${currentMonthName} ${d}, ${currentYear}${isToday ? ' (Today)' : ''}`}
                    >
                      {d}
                    </th>
                  );
                })}
                <th className="total-col-header">Month Total</th>
              </tr>
            </thead>
            <tbody>
              {taskOptions.filter(t => t.code !== 'ALL').map(task => {
                const colors = COURSE_COLORS[task.code] || COURSE_COLORS['STUDY'];
                
                // Count how many days this task was completed this month
                let taskMonthlyTotal = 0;

                return (
                  <tr key={task.code} className="task-matrix-row">
                    <td className="task-name-cell">
                      <span 
                        className="task-badge-tag"
                        style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                      >
                        {task.code}
                      </span>
                      <span className="task-full-label">{task.label.split('(')[0]}</span>
                    </td>

                    {Array.from({ length: calendarDays.daysInMonth }, (_, idx) => idx + 1).map(d => {
                      const dayStr = String(d).padStart(2, '0');
                      const monthStr = String(currentMonthIndex + 1).padStart(2, '0');
                      const dateKey = `${currentYear}-${monthStr}-${dayStr}`;
                      const isToday = currentYear === 2026 && currentMonthIndex === 10 && d === 11;

                      const sessionIds = habitHistory[dateKey] || [];
                      const allSessions = sessionIds.map(id => getSessionById(id));
                      const isTaskDone = allSessions.some(s => sessionMatchesTask(s, task.code));

                      if (isTaskDone) taskMonthlyTotal++;

                      return (
                        <td 
                          key={d} 
                          className={`matrix-dot-cell ${isToday ? 'cell-today-col' : ''}`}
                          onClick={() => {
                            if (onToggleDayHabit) {
                              // Find or craft a session ID for this task
                              const sampleSession = classes.find(c => sessionMatchesTask(c, task.code));
                              const sId = sampleSession ? sampleSession.id : `custom-${task.code.toLowerCase()}`;
                              onToggleDayHabit(dateKey, sId);
                            }
                          }}
                          title={`Day ${d}: ${task.code} ${isTaskDone ? 'Completed ✓ (Click to toggle)' : 'Not done (Click to mark)'}`}
                        >
                          <div 
                            className={`habit-matrix-dot ${isTaskDone ? 'done' : 'empty'}`}
                            style={isTaskDone ? { backgroundColor: colors.badge || '#16a34a' } : undefined}
                          >
                            {isTaskDone && <Check size={10} className="dot-check-icon" />}
                          </div>
                        </td>
                      );
                    })}

                    <td className="task-total-cell">
                      <strong>{taskMonthlyTotal}</strong> / {monthStats.elapsedCount} days
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Day Detail Inspector (Interactive Selected Day Popover) */}
      <div className="day-inspector-card">
        <div className="inspector-header">
          <div className="inspector-date-group">
            <span className="badge-pill">Day Breakdown</span>
            <h4 className="inspector-date-title">
              {currentMonthName} {inspectedDay.dayNum}, {currentYear}
              {inspectedDay.isToday && <span className="today-chip">Today</span>}
            </h4>
          </div>

          <div className="inspector-count-badge">
            <Check size={15} />
            <span>
              {inspectedDay.allSessions.length} {inspectedDay.allSessions.length === 1 ? 'Task' : 'Tasks'} Completed
            </span>
          </div>
        </div>

        {inspectedDay.allSessions.length === 0 ? (
          <div className="empty-day-inspector-note">
            <span>No tasks were completed on this date.</span>
            {inspectedDay.isToday && (
              <span className="inspector-encouragement">
                Check off sessions on the timetable grid above to log your progress for today!
              </span>
            )}
          </div>
        ) : (
          <div className="inspector-sessions-list">
            {inspectedDay.allSessions.map((session, idx) => {
              const cColors = COURSE_COLORS[session.colorKey] || COURSE_COLORS['STUDY'];
              return (
                <div key={idx} className="inspector-session-item">
                  <div className="item-left">
                    <span 
                      className="session-code-pill"
                      style={{ backgroundColor: cColors.bg, color: cColors.text, borderColor: cColors.border }}
                    >
                      {session.code}
                    </span>
                    <div className="session-title-time">
                      <span className="item-title">{session.title}</span>
                      <span className="item-time">
                        <Clock size={12} /> {session.time}
                      </span>
                    </div>
                  </div>

                  <span className="done-check-tag">
                    <Check size={12} /> Done
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

