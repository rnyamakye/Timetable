import React from 'react';
import { 
  Printer, 
  Calendar, 
  Search, 
  BookOpen, 
  Clock, 
  SlidersHorizontal,
  PlusCircle,
  Moon
} from 'lucide-react';
import { exportTimetableToICS } from '../utils/icsExport';

export default function Header({ 
  searchTerm, 
  setSearchTerm, 
  selectedDay,
  setSelectedDay,
  viewMode,
  setViewMode,
  periodRange,
  setPeriodRange,
  onOpenAddModal
}) {
  return (
    <header className="timetable-header">
      <div className="header-top-row">
        <div className="brand-title-group">
          <div className="badge-pill">
            <span className="live-dot"></span>
            Academic Year 2026/2027 • Extended Schedule
          </div>
          <h1 className="main-title">B.Sc. Computer Science-4 (Group 2)</h1>
          <p className="sub-title">Schedule &amp; Curriculum • Year 4 Semester One</p>
        </div>

        <div className="header-actions">
          <button 
            type="button"
            className="action-btn success-btn print-hide"
            onClick={onOpenAddModal}
            title="Add a custom lecture, lab or evening study session"
          >
            <PlusCircle size={16} />
            <span>Add Session</span>
          </button>

          <button 
            type="button"
            className="action-btn secondary-btn"
            onClick={() => exportTimetableToICS()}
            title="Download iCal file to import into Google Calendar or Apple Calendar"
          >
            <Calendar size={16} />
            <span>Add to Calendar (.ics)</span>
          </button>

          <button 
            type="button"
            className="action-btn primary-btn print-hide"
            onClick={() => window.print()}
            title="Print or save as PDF"
          >
            <Printer size={16} />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      <div className="toolbar-row print-hide">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search course, lecturer, code or room (e.g. CSM 481, Parley, SCBSF20)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filters-group">
          <div className="view-mode-tabs">
            <button 
              type="button"
              className={`mode-tab ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <Clock size={15} />
              <span>Full Grid</span>
            </button>
            <button 
              type="button"
              className={`mode-tab ${viewMode === 'agenda' ? 'active' : ''}`}
              onClick={() => setViewMode('agenda')}
            >
              <SlidersHorizontal size={15} />
              <span>Day Agenda</span>
            </button>
            <button 
              type="button"
              className={`mode-tab ${viewMode === 'curriculum' ? 'active' : ''}`}
              onClick={() => setViewMode('curriculum')}
            >
              <BookOpen size={15} />
              <span>Curriculum (18 Credits)</span>
            </button>
          </div>

          <div className="period-span-select-wrapper">
            <span className="span-label"><Moon size={14} /> Schedule Hours:</span>
            <select 
              value={periodRange} 
              onChange={(e) => setPeriodRange(e.target.value)}
              className="period-select"
              title="Change schedule period span"
            >
              <option value="until-11pm">Until 11:00 PM (15 Periods: 8am - 11:50pm)</option>
              <option value="until-10:50pm">Until 10:50 PM (14 Periods: 8am - 10:50pm)</option>
              <option value="standard">Original (10 Periods: 8am - 6:50pm)</option>
            </select>
          </div>

          <div className="day-filter-select-wrapper">
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="day-select"
            >
              <option value="ALL">All Days (Mon - Fri)</option>
              <option value="Monday">Monday Only</option>
              <option value="Tuesday">Tuesday Only</option>
              <option value="Wednesday">Wednesday Only</option>
              <option value="Thursday">Thursday Only</option>
              <option value="Friday">Friday Only</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
