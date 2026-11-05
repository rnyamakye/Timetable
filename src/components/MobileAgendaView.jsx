import React from 'react';
import { DAYS, buildDaySlots, COURSE_COLORS, ALL_PERIODS } from '../data/timetableData';
import { Clock, MapPin, User, Plus } from 'lucide-react';

export default function MobileAgendaView({ 
  onCourseClick, 
  onEmptyCellClick,
  selectedCourseCode,
  classes = [],
  activePeriods = ALL_PERIODS
}) {
  return (
    <div className="agenda-container">
      <div className="agenda-list">
        {DAYS.map(dayObj => {
          const slots = buildDaySlots(dayObj.key, classes, activePeriods);
          const activeSlots = slots.filter(s => !s.isEmpty);

          return (
            <div key={dayObj.key} className="agenda-day-card">
              <div className="agenda-day-header">
                <div className="day-name-badge">
                  <span className="badge-short">{dayObj.short}</span>
                  <span className="badge-full">{dayObj.label}</span>
                </div>
                <div className="agenda-header-actions">
                  <span className="class-count">
                    {activeSlots.length} {activeSlots.length === 1 ? 'Session' : 'Sessions'}
                  </span>
                  <button 
                    type="button" 
                    className="agenda-add-btn"
                    onClick={() => onEmptyCellClick && onEmptyCellClick(dayObj.label, 11, '19:00-19:50')}
                    title={`Add class to ${dayObj.label}`}
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>

              {activeSlots.length === 0 ? (
                <div className="empty-day-note">
                  No scheduled classes for this day.
                  <button 
                    type="button"
                    className="empty-day-add-link"
                    onClick={() => onEmptyCellClick && onEmptyCellClick(dayObj.label, 11, '19:00-19:50')}
                  >
                    Schedule an evening session
                  </button>
                </div>
              ) : (
                <div className="day-sessions-grid">
                  {activeSlots.map((slot, idx) => {
                    const colors = COURSE_COLORS[slot.colorKey] || {
                      bg: '#f3f4f6',
                      border: '#d1d5db',
                      text: '#111827'
                    };
                    const isSelected = selectedCourseCode === slot.code;

                    return (
                      <div 
                        key={idx}
                        className={`agenda-session-card ${isSelected ? 'session-selected' : ''}`}
                        style={{ 
                          borderLeft: `5px solid ${colors.border}`,
                          backgroundColor: '#ffffff'
                        }}
                        onClick={() => onCourseClick({ ...slot, day: dayObj.label })}
                      >
                        <div className="session-top">
                          <span 
                            className="session-code-tag" 
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {slot.code}
                          </span>
                          <span className="session-time">
                            <Clock size={14} /> {slot.time}
                          </span>
                        </div>

                        <h4 className="session-title">{slot.title}</h4>

                        <div className="session-meta-row">
                          {slot.room && (
                            <span className="session-meta">
                              <MapPin size={14} /> {slot.room}
                            </span>
                          )}
                          {slot.lecturer && (
                            <span className="session-meta">
                              <User size={14} /> {slot.lecturer}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
