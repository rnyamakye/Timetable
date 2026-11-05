import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TimetableGrid from './components/TimetableGrid';
import CurriculumTable from './components/CurriculumTable';
import MobileAgendaView from './components/MobileAgendaView';
import CourseModal from './components/CourseModal';
import AddSessionModal from './components/AddSessionModal';
import { INITIAL_CLASSES, ALL_PERIODS } from './data/timetableData';
import { exportTimetableToICS } from './utils/icsExport';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [selectedDay, setSelectedDay] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'agenda' | 'curriculum'
  const [modalCourse, setModalCourse] = useState(null);

  // Period range: 'until-11pm' (15 periods, 8:00 - 23:50) default as requested
  const [periodRange, setPeriodRange] = useState('until-11pm');
  const [classes, setClasses] = useState(INITIAL_CLASSES);

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

  const handleDeleteSession = (sessionId) => {
    setClasses(prev => prev.filter(c => c.id !== sessionId));
  };

  const handleResetSchedule = () => {
    if (window.confirm('Reset schedule to the default official timetable?')) {
      setClasses(INITIAL_CLASSES);
    }
  };

  const hasCustomSessions = classes.some(c => c.isCustom);
  const hasActiveFilters = searchTerm !== '' || selectedCourseCode !== null || selectedDay !== 'ALL';

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

        {hasActiveFilters && (
          <div className="active-filter-banner print-hide">
            <span>
              Showing filtered results
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
              You have added custom evening classes or sessions to this timetable.
            </span>
            <button 
              type="button" 
              className="reset-schedule-btn"
              onClick={handleResetSchedule}
            >
              Reset to Official Timetable
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
              selectedDay={selectedDay}
              activePeriods={activePeriods}
              classes={classes}
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
            selectedCourseCode={selectedCourseCode}
            classes={classes}
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
