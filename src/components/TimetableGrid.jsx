import React from 'react';
import { DAYS, buildDaySlots, COURSE_COLORS, ALL_PERIODS } from '../data/timetableData';
import { Plus } from 'lucide-react';

export default function TimetableGrid({ 
  searchTerm = '', 
  selectedCourseCode = null, 
  onCourseClick,
  onEmptyCellClick,
  selectedDay = 'ALL',
  activePeriods = ALL_PERIODS,
  classes = []
}) {
  const matchesSearch = (slot) => {
    if (!slot || slot.isEmpty) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      (slot.code && slot.code.toLowerCase().includes(term)) ||
      (slot.title && slot.title.toLowerCase().includes(term)) ||
      (slot.lecturer && slot.lecturer.toLowerCase().includes(term)) ||
      (slot.room && slot.room.toLowerCase().includes(term)) ||
      (slot.curriculumCode && slot.curriculumCode.toLowerCase().includes(term))
    );
  };

  const isHighlighted = (slot) => {
    if (!slot || slot.isEmpty) return false;
    if (selectedCourseCode) {
      return slot.code === selectedCourseCode || slot.curriculumCode === selectedCourseCode;
    }
    return false;
  };

  const isDimmed = (slot) => {
    if (!slot || slot.isEmpty) return false;
    if (searchTerm.trim() && !matchesSearch(slot)) {
      return true;
    }
    if (selectedCourseCode && !isHighlighted(slot)) {
      return true;
    }
    return false;
  };

  const visibleDays = selectedDay === 'ALL' 
    ? DAYS 
    : DAYS.filter(d => d.key === selectedDay);

  const numPeriods = activePeriods.length;
  const periodColWidth = `${(92 / numPeriods).toFixed(2)}%`;

  return (
    <div className="timetable-container">
      <div className="timetable-paper-card">
        {/* Document Header matching the exact format */}
        <div className="paper-header">
          <h2 className="paper-main-title">B.Sc. Computer Science-4 (Group 2)</h2>
          <h3 className="paper-sub-title">Schedule &amp; Curriculum</h3>
        </div>

        {/* The Main Timetable HTML Table */}
        <div className="table-responsive-wrapper">
          <table className="asc-timetable-table">
            <thead>
              <tr>
                <th className="day-col-header" style={{ width: '8%', minWidth: '70px' }}></th>
                {activePeriods.map(period => (
                  <th 
                    key={period.id} 
                    className="period-col-header" 
                    style={{ width: periodColWidth, minWidth: '68px' }}
                  >
                    <div className="period-number">{period.period}</div>
                    <div className="period-time">{period.time}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleDays.map(dayObj => {
                const slots = buildDaySlots(dayObj.key, classes, activePeriods);

                return (
                  <tr key={dayObj.key} className="day-row">
                    {/* Day label cell with full name and short abbreviation */}
                    <td className="day-label-cell">
                      <div className="day-full-name">{dayObj.label}</div>
                      <div className="day-short-name">{dayObj.short}</div>
                    </td>

                    {/* Slots in this day */}
                    {slots.map((slot, index) => {
                      if (slot.isEmpty) {
                        return (
                          <td 
                            key={`empty-${dayObj.key}-${slot.periodId || index}`} 
                            colSpan={slot.colSpan || 1} 
                            className="empty-cell"
                            onClick={() => onEmptyCellClick && onEmptyCellClick(dayObj.label, slot.periodId, slot.periodTime)}
                            title={`Click to add a class or study session on ${dayObj.label} at Period ${slot.periodId} (${slot.periodTime})`}
                          >
                            <div className="empty-cell-inner">
                              <Plus size={14} className="add-slot-icon print-hide" />
                            </div>
                          </td>
                        );
                      }

                      const colors = COURSE_COLORS[slot.colorKey] || {
                        bg: '#f3f4f6',
                        border: '#d1d5db',
                        text: '#111827'
                      };

                      const highlighted = isHighlighted(slot);
                      const dimmed = isDimmed(slot);
                      const searchMatched = searchTerm.trim() && matchesSearch(slot);

                      return (
                        <td 
                          key={`slot-${dayObj.key}-${index}`} 
                          colSpan={slot.colSpan}
                          className="schedule-slot-cell"
                        >
                          <div 
                            className={`course-card ${highlighted ? 'card-highlighted' : ''} ${dimmed ? 'card-dimmed' : ''} ${searchMatched ? 'card-search-hit' : ''}`}
                            style={{
                              backgroundColor: colors.bg,
                              borderColor: colors.border,
                              color: colors.text
                            }}
                            onClick={() => onCourseClick({ ...slot, day: dayObj.label })}
                            title="Click to view full course details"
                          >
                            {/* Card Header: Room on Left, Group on Right */}
                            {(slot.room || slot.group) && (
                              <div className="card-top-meta">
                                <span className="card-room">{slot.room || ''}</span>
                                <span className="card-group">{slot.group || ''}</span>
                              </div>
                            )}

                            {/* Card Center: Course Code (Bold) */}
                            <div className={`card-code ${slot.code === 'PROJECT' ? 'card-code-large' : ''}`}>
                              {slot.code}
                            </div>

                            {/* Card Title */}
                            <div className="card-title">
                              {slot.title}
                            </div>

                            {/* Card Lecturer / Instructor */}
                            {slot.lecturer && (
                              <div className="card-lecturer">
                                {slot.lecturer}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Timetable Footer matching aSc Timetables */}
        <div className="timetable-footer">
          <span className="footer-left">Timetable generated: 14/10/2026</span>
          <span className="footer-right">
            {activePeriods.length > 10 ? `Extended Schedule (Periods 1 - ${activePeriods.length}) • ` : ''}aSc Timetables
          </span>
        </div>
      </div>
    </div>
  );
}
