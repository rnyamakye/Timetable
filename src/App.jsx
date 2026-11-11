import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import HabitTracker from './components/HabitTracker';
import TimetableGrid from './components/TimetableGrid';
import CurriculumTable from './components/CurriculumTable';
import MobileAgendaView from './components/MobileAgendaView';
import CourseModal from './components/CourseModal';
import AddSessionModal from './components/AddSessionModal';
import EditSessionModal from './components/EditSessionModal';
import { INITIAL_CLASSES, ALL_PERIODS } from './data/timetableData';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'agenda' | 'curriculum'
  const [modalCourse, setModalCourse] = useState(null);
  const [editingSession, setEditingSession] = useState(null);

  // Period range: 'until-11pm' (15 periods, 8:00 - 23:50) default
  const [periodRange, setPeriodRange] = useState('until-11pm');
  // Schedule preset: 'all' (Lectures + Strategic Reviews + CCNA), 'classes-only', 'study-only'
  const [schedulePreset, setSchedulePreset] = useState('all');
  const [classes, setClasses] = useState(INITIAL_CLASSES);

  // Habit Tracking State (persisted in localStorage)
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('timetable_completed_ids');
      return saved ? JSON.parse(saved) : ['study-mon-ccna', 'mon-csm483'];
    } catch {
      return ['study-mon-ccna', 'mon-csm483'];
    }
  });

  const [streakDays, setStreakDays] = useState(() => {
    try {
      const saved = localStorage.getItem('timetable_streak_days');
      return saved ? Number(saved) : 4;
    } catch {
      return 4;
    }
  });

  // Monthly Habit History Matrix (YYYY-MM-DD -> array of completed session IDs)
  const [habitHistory, setHabitHistory] = useState(() => {
    const INITIAL_HABIT_HISTORY = {
      '2026-11-01': ['study-sun-ccna'],
      '2026-11-02': ['mon-csm483', 'mon-csm477', 'study-mon-ccna'],
      '2026-11-03': ['tue-csm497', 'study-tue-csm483'],
      '2026-11-04': ['wed-seminar', 'wed-csm481', 'study-wed-ccna'],
      '2026-11-05': ['thu-csm495', 'thu-mas261', 'study-thu-csm497'],
      '2026-11-06': ['fri-project', 'fri-csm481', 'study-fri-ccna'],
      '2026-11-07': ['study-sat-ccna', 'study-sat-csm481'],
      '2026-11-08': ['study-sun-ccna'],
      '2026-11-09': ['mon-csm483', 'mon-csm477', 'study-mon-ccna'],
      '2026-11-10': ['tue-csm497', 'study-tue-csm477', 'study-tue-ccna'],
      '2026-11-11': ['study-mon-ccna', 'mon-csm483'] // Today
    };

    try {
      const saved = localStorage.getItem('timetable_habit_history');
      return saved ? JSON.parse(saved) : INITIAL_HABIT_HISTORY;
    } catch {
      return INITIAL_HABIT_HISTORY;
    }
  });

  // Add Session Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialDay, setAddModalInitialDay] = useState('Monday');
  const [addModalInitialPeriod, setAddModalInitialPeriod] = useState(11);

  const activePeriods = useMemo(() => {
    if (periodRange === 'standard') {
      return ALL_PERIODS.slice(0, 10);
    }
    if (periodRange === 'until-10:50pm') {
      return ALL_PERIODS.slice(0, 14);
    }
    // Default: 'until-11pm' (All 15 periods up to 23:50 / 11pm)
    return ALL_PERIODS;
  }, [periodRange]);

  const displayedClasses = useMemo(() => {
    if (schedulePreset === 'classes-only') {
      return classes.filter(c => c.sessionType !== 'study');
    }
    if (schedulePreset === 'study-only') {
      return classes.filter(c => c.sessionType === 'study');
    }
    return classes;
  }, [classes, schedulePreset]);

  const handleSelectCourse = (code) => {
    setSelectedCourseCode(prev => prev === code ? null : code);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCourseCode(null);
    setSelectedDay('ALL');
  };

  const handleEmptyCellClick = (day, periodId, periodTime) => {
    setAddModalInitialDay(day);
    setAddModalInitialPeriod(periodId || 11);
    setIsAddModalOpen(true);
  };

  const handleAddSession = (newSession) => {
    setClasses(prev => [...prev, newSession]);
  };

  const handleUpdateSession = (updatedSession) => {
    setClasses(prev => prev.map(c => c.id === updatedSession.id ? updatedSession : c));
  };

  const handleMoveSession = (sessionId, targetDay, targetStartPeriod) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== sessionId) return c;

      const span = Math.max(1, (c.endPeriod - c.startPeriod + 1) || 1);
      let startP = Number(targetStartPeriod);
      let endP = startP + span - 1;

      // Ensure it does not overflow past the max active periods
      if (endP > activePeriods.length) {
        endP = activePeriods.length;
        startP = Math.max(1, endP - span + 1);
      }

      const startObj = activePeriods.find(p => p.id === startP);
      const endObj = activePeriods.find(p => p.id === endP);
      const timeString = `${startObj ? startObj.start : '08:00'} - ${endObj ? endObj.end : '08:50'}`;

      return {
        ...c,
        day: targetDay,
        startPeriod: startP,
        endPeriod: endP,
        time: timeString
      };
    }));
  };

  const handleDeleteSession = (sessionId) => {
    setClasses(prev => prev.filter(c => c.id !== sessionId));
    setCompletedIds(prev => prev.filter(id => id !== sessionId));
  };

  const handleToggleComplete = (sessionId) => {
    setCompletedIds(prev => {
      const isRemoving = prev.includes(sessionId);
      const next = isRemoving
        ? prev.filter(id => id !== sessionId) 
        : [...prev, sessionId];
      try {
        localStorage.setItem('timetable_completed_ids', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });

    // Also synchronize today's habit history dot in real-time
    const todayKey = '2026-11-11';
    setHabitHistory(prev => {
      const dayList = prev[todayKey] || [];
      const updatedList = dayList.includes(sessionId)
        ? dayList.filter(id => id !== sessionId)
        : [...dayList, sessionId];
      const nextHistory = { ...prev, [todayKey]: updatedList };
      try {
        localStorage.setItem('timetable_habit_history', JSON.stringify(nextHistory));
      } catch (err) {
        console.error(err);
      }
      return nextHistory;
    });
  };

  const handleToggleDayHabit = (dateKey, sessionId) => {
    setHabitHistory(prev => {
      const dayList = prev[dateKey] || [];
      const updatedList = dayList.includes(sessionId)
        ? dayList.filter(id => id !== sessionId)
        : [...dayList, sessionId];
      const nextHistory = { ...prev, [dateKey]: updatedList };
      try {
        localStorage.setItem('timetable_habit_history', JSON.stringify(nextHistory));
      } catch (err) {
        console.error(err);
      }
      return nextHistory;
    });

    // If toggling for today, also keep current weekly completedIds in sync
    if (dateKey === '2026-11-11') {
      setCompletedIds(prev => {
        const next = prev.includes(sessionId)
          ? prev.filter(id => id !== sessionId)
          : [...prev, sessionId];
        try {
          localStorage.setItem('timetable_completed_ids', JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
    }
  };

  const handleResetProgress = () => {
    if (window.confirm('Reset this week\'s completion progress for a fresh start?')) {
      setCompletedIds([]);
      try {
        localStorage.removeItem('timetable_completed_ids');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetSchedule = () => {
    if (window.confirm('Reset timetable to the default strategic schedule?')) {
      setClasses(INITIAL_CLASSES);
    }
  };

  const hasCustomSessions = classes.length !== INITIAL_CLASSES.length || 
    classes.some((c, idx) => INITIAL_CLASSES[idx]?.id !== c.id || INITIAL_CLASSES[idx]?.time !== c.time);
  const hasActiveFilters = searchTerm !== '' || selectedCourseCode !== null || selectedDay !== 'ALL' || schedulePreset !== 'all';

  return (
    <div className="app-shell">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        viewMode={viewMode}
        setViewMode={setViewMode}
        periodRange={periodRange}
        setPeriodRange={setPeriodRange}
        schedulePreset={schedulePreset}
        setSchedulePreset={setSchedulePreset}
        onOpenAddModal={() => {
          setAddModalInitialDay('Monday');
          setAddModalInitialPeriod(11);
          setIsAddModalOpen(true);
        }}
      />

      <main className="main-content-area">
        <StatsBar 
          onSelectCourse={handleSelectCourse}
          selectedCourseCode={selectedCourseCode}
        />

        {/* Habit & Progress Tracker Card with Monthly Dot Matrix */}
        <HabitTracker 
          classes={classes}
          completedIds={completedIds}
          onResetProgress={handleResetProgress}
          streakDays={streakDays}
          habitHistory={habitHistory}
          onToggleDayHabit={handleToggleDayHabit}
        />

        {hasActiveFilters && (
          <div className="active-filter-banner print-hide">
            <span>
              Showing filtered results
              {schedulePreset !== 'all' && (
                <strong> • Plan: {schedulePreset === 'classes-only' ? 'Official Lectures Only' : 'Personal Reviews & CCNA Only'}</strong>
              )}
              {selectedCourseCode && <strong> • Course: {selectedCourseCode}</strong>}
              {searchTerm && <strong> • Search: "{searchTerm}"</strong>}
              {selectedDay !== 'ALL' && <strong> • Day: {selectedDay}</strong>}
            </span>
            <button 
              type="button" 
              className="clear-filter-btn"
              onClick={handleClearFilters}
            >
              Reset Filters
            </button>
          </div>
        )}

        {hasCustomSessions && (
          <div className="custom-sessions-banner print-hide">
            <span>
              Schedule entries have been modified or customized.
            </span>
            <button 
              type="button" 
              className="reset-schedule-btn"
              onClick={handleResetSchedule}
            >
              Reset to Default Plan
            </button>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="exact-document-layout">
            {/* The exact Timetable table with extended periods up until 11pm */}
            <TimetableGrid
              searchTerm={searchTerm}
              selectedCourseCode={selectedCourseCode}
              onCourseClick={(course) => setModalCourse(course)}
              onEmptyCellClick={handleEmptyCellClick}
              onMoveSession={handleMoveSession}
              onToggleComplete={handleToggleComplete}
              completedIds={completedIds}
              selectedDay={selectedDay}
              activePeriods={activePeriods}
              classes={displayedClasses}
            />

            {/* The exact Curriculum table below it */}
            <CurriculumTable
              selectedCourseCode={selectedCourseCode}
              onSelectCourse={handleSelectCourse}
              searchTerm={searchTerm}
            />
          </div>
        )}

        {viewMode === 'agenda' && (
          <MobileAgendaView 
            onCourseClick={(course) => setModalCourse(course)}
            onEmptyCellClick={handleEmptyCellClick}
            onMoveSession={handleMoveSession}
            onToggleComplete={handleToggleComplete}
            completedIds={completedIds}
            selectedCourseCode={selectedCourseCode}
            classes={displayedClasses}
            activePeriods={activePeriods}
          />
        )}

        {viewMode === 'curriculum' && (
          <div className="curriculum-focused-view">
            <CurriculumTable
              selectedCourseCode={selectedCourseCode}
              onSelectCourse={handleSelectCourse}
              searchTerm={searchTerm}
            />
          </div>
        )}
      </main>

      {modalCourse && (
        <CourseModal
          course={modalCourse}
          onClose={() => setModalCourse(null)}
          onSelectCourse={handleSelectCourse}
          onDeleteSession={handleDeleteSession}
          onEditSession={(session) => setEditingSession(session)}
          isCompleted={completedIds.includes(modalCourse.id)}
          onToggleComplete={handleToggleComplete}
        />
      )}

      {editingSession && (
        <EditSessionModal
          isOpen={Boolean(editingSession)}
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
          activePeriods={activePeriods}
        />
      )}

      {isAddModalOpen && (
        <AddSessionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddSession={handleAddSession}
          initialDay={addModalInitialDay}
          initialPeriod={addModalInitialPeriod}
          activePeriods={activePeriods}
        />
      )}
    </div>
  );
}
