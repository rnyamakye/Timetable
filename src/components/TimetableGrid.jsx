import React, { useState } from 'react';
import { DAYS, buildDaySlots, COURSE_COLORS, ALL_PERIODS } from '../data/timetableData';
import { Plus, GripVertical, CheckCircle2, Circle } from 'lucide-react';

export default function TimetableGrid({ 
  searchTerm = '', 
  selectedCourseCode = null, 
  onCourseClick,
  onEmptyCellClick,
  onMoveSession,
  selectedDay = 'ALL',
  activePeriods = ALL_PERIODS,
  classes = [],
  completedIds = [],
  onToggleComplete,
  scheduleTime = null,
  activeSession = null
}) {
  const [draggedSessionId, setDraggedSessionId] = useState(null);
  const [dragOverCell, setDragOverCell] = useState(null);

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

        {/* Drag and Drop instructions hint */}
        <div className="drag-hint-banner print-hide">
          <GripVertical size={14} className="hint-icon" />
          <span><strong>Interactive Schedule:</strong> Click the circle on any card to mark it completed. Drag &amp; drop to reschedule.</span>
        </div>

        {/* The Main Timetable HTML Table */}
        <div className="table-responsive-wrapper">
          <table className="asc-timetable-table">
            <thead>
              <tr>
                <th className="day-col-header" style={{ width: '8%', minWidth: '70px' }}></th>
                {activePeriods.map(period => {
                  const isCurrentPeriod = scheduleTime && scheduleTime.currentPeriodId === period.id && !scheduleTime.isWeekend;
                  return (
                    <th 
                      key={period.id} 
                      className={`period-col-header ${isCurrentPeriod ? 'period-col-is-now' : ''}`} 
                      style={{ width: periodColWidth, minWidth: '68px' }}
                    >
                      <div className="period-number">
                        <span>{period.period}</span>
                        {isCurrentPeriod && <span className="now-column-tag print-hide">NOW</span>}
                      </div>
                      <div className="period-time">{period.time}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleDays.map(dayObj => {
                const slots = buildDaySlots(dayObj.key, classes, activePeriods);
                const isTodayRow = scheduleTime && scheduleTime.dayName === dayObj.label;

                return (
                  <tr key={dayObj.key} className={`day-row ${isTodayRow ? 'day-row-is-today' : ''}`}>
                    {/* Day label cell with full name and short abbreviation */}
                    <td className={`day-label-cell ${isTodayRow ? 'day-label-is-today' : ''}`}>
                      <div className="day-full-name">
                        <span>{dayObj.label}</span>
                        {isTodayRow && <span className="today-row-tag print-hide">TODAY</span>}
                      </div>
                      <div className="day-short-name">{dayObj.short}</div>
                    </td>

                    {/* Slots in this day */}
                    {slots.map((slot, index) => {
                      if (slot.isEmpty) {
                        const cellKey = `${dayObj.key}-${slot.periodId}`;
                        const isDropTarget = dragOverCell === cellKey;
                        const isCurrentEmptySlot = isTodayRow && scheduleTime && scheduleTime.currentPeriodId === slot.periodId;

                        return (
                          <td 
                            key={`empty-${dayObj.key}-${slot.periodId || index}`} 
                            colSpan={slot.colSpan || 1} 
                            className={`empty-cell ${isDropTarget ? 'cell-drag-over' : ''} ${isCurrentEmptySlot ? 'empty-cell-is-now' : ''}`}
                            onClick={() => onEmptyCellClick && onEmptyCellClick(dayObj.label, slot.periodId, slot.periodTime)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              if (dragOverCell !== cellKey) setDragOverCell(cellKey);
                            }}
                            onDragLeave={() => {
                              if (dragOverCell === cellKey) setDragOverCell(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              setDragOverCell(null);
                              const sId = e.dataTransfer.getData('text/plain') || draggedSessionId;
                              if (sId && onMoveSession) {
                                onMoveSession(sId, dayObj.label, slot.periodId);
                              }
                            }}
                            title={draggedSessionId 
                              ? `Drop here to move session to ${dayObj.label} Period ${slot.periodId}` 
                              : `Click to add a class or study session on ${dayObj.label} at Period ${slot.periodId} (${slot.periodTime})`}
                          >
                            <div className="empty-cell-inner">
                              {isDropTarget ? (
                                <span className="drop-indicator-badge">Move Here</span>
                              ) : isCurrentEmptySlot ? (
                                <span className="now-free-slot-badge print-hide">Current Slot</span>
                              ) : (
                                <Plus size={14} className="add-slot-icon print-hide" />
                              )}
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
                      const isBeingDragged = draggedSessionId === slot.id;
                      const cellKey = `${dayObj.key}-${slot.startPeriod}`;
                      const isDropTarget = dragOverCell === cellKey && draggedSessionId !== slot.id;
                      const isCompleted = completedIds.includes(slot.id);
                      const isCardActiveNow = activeSession && activeSession.id === slot.id;

                      return (
                        <td 
                          key={`slot-${dayObj.key}-${index}`} 
                          colSpan={slot.colSpan}
                          className={`schedule-slot-cell ${isDropTarget ? 'cell-drag-over' : ''} ${isCardActiveNow ? 'cell-slot-is-now' : ''}`}
                          onDragOver={(e) => {
                            if (draggedSessionId && draggedSessionId !== slot.id) {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              if (dragOverCell !== cellKey) setDragOverCell(cellKey);
                            }
                          }}
                          onDragLeave={() => {
                            if (dragOverCell === cellKey) setDragOverCell(null);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            setDragOverCell(null);
                            const sId = e.dataTransfer.getData('text/plain') || draggedSessionId;
                            if (sId && onMoveSession && sId !== slot.id) {
                              onMoveSession(sId, dayObj.label, slot.startPeriod);
                            }
                          }}
                        >
                          <div 
                            draggable={true}
                            onDragStart={(e) => {
                              setDraggedSessionId(slot.id);
                              e.dataTransfer.setData('text/plain', slot.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnd={() => {
                              setDraggedSessionId(null);
                              setDragOverCell(null);
                            }}
                            className={`course-card ${highlighted ? 'card-highlighted' : ''} ${dimmed ? 'card-dimmed' : ''} ${searchMatched ? 'card-search-hit' : ''} ${isBeingDragged ? 'card-is-dragging' : ''} ${isCompleted ? 'card-is-completed' : ''} ${isCardActiveNow ? 'card-is-active-now' : ''}`}
                            style={{
                              backgroundColor: colors.bg,
                              borderColor: isCompleted ? '#16a34a' : isCardActiveNow ? '#2563eb' : colors.border,
                              color: colors.text
                            }}
                            onClick={() => onCourseClick({ ...slot, day: dayObj.label })}
                            title={isCardActiveNow ? "HAPPENING NOW! Click to view details" : "Drag to reschedule • Click to view details"}
                          >
                            {/* Live Active Now Badge for Current Course */}
                            {isCardActiveNow && (
                              <div className="card-live-now-badge print-hide" title="This session is scheduled right now!">
                                <span className="live-ping-dot-sm" />
                                <span>LIVE NOW</span>
                              </div>
                            )}

                            {/* Card Header: Room on Left, Habit Check + Grip/Group on Right */}
                            <div className="card-top-meta">
                              <span className="card-room">{slot.room || ''}</span>
                              <div className="card-top-right">
                                {slot.group && <span className="card-group">{slot.group}</span>}

                                {/* Habit Completion Check Toggle */}
                                <button
                                  type="button"
                                  className={`card-habit-check-btn print-hide ${isCompleted ? 'checked' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleComplete && onToggleComplete(slot.id);
                                  }}
                                  title={isCompleted ? "Marked Done! Click to unmark" : "Mark as completed / attended"}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={13} className="check-done-icon" />
                                  ) : (
                                    <Circle size={13} className="check-empty-icon" />
                                  )}
                                </button>

                                <GripVertical size={12} className="drag-handle-grip print-hide" />
                              </div>
                            </div>

                            {/* Card Center: Course Code (Bold) */}
                            <div className={`card-code ${slot.code === 'PROJECT' ? 'card-code-large' : ''}`}>
                              {slot.code}
                              {isCompleted && <span className="card-done-badge print-hide">✓ Done</span>}
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
