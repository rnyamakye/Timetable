import React from 'react';
import { 
  Printer, 
  Calendar, 
  Search, 
  BookOpen, 
  Clock, 
  SlidersHorizontal,
  PlusCircle,
  Moon,
  Sparkles,
  Layers
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
  schedulePreset,
  setSchedulePreset,
  onOpenAddModal
}) {
  return (
    <header className="timetable-header">
      <div className="header-top-row">
        <div className="brand-title-group">
          <div className="badge-pill">
            <span className="live-dot"></span>
            Academic Year 2026/2027 • Strategic Study &amp; Review Schedule
          </div>
          <h1 className="main-title">B.Sc. Computer Science-4 (Group 2)</h1>
          <p className="sub-title">Schedule &amp; Curriculum • Strategic Course Reviews &amp; CCNA</p>
        </div>

        <div className="header-actions">
          <button 
            type="button"
            className="action-btn success-btn print-hide"
            onClick={onOpenAddModal}
            title="Add a custom lecture, lab or personal study session"
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
            placeholder="Search course, review, CCNA, lecturer, or room (e.g. CSM 481 Rev, CCNA, Parley)..." 
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
            <span className="span-label"><Layers size={14} /> Plan:</span>
            <select 
              value={schedulePreset} 
              onChange={(e) => setSchedulePreset(e.target.value)}
              className="period-select"
              title="Filter by plan entries"
            >
              <option value="all">Full Plan (Lectures + Reviews + CCNA)</option>
              <option value="classes-only">Official Lectures Only</option>
              <option value="study-only">Personal Reviews &amp; CCNA Only</option>
            </select>
          </div>

          <div className="period-span-select-wrapper">
            <span className="span-label"><Moon size={14} /> Hours:</span>
            <select 
              value={periodRange} 
              onChange={(e) => setPeriodRange(e.target.value)}
              className="period-select"
              title="Change schedule period span"
            >
              <option value="until-11pm">Until 11:00 PM (15 Periods)</option>
              <option value="until-10:50pm">Until 10:50 PM (14 Periods)</option>
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
