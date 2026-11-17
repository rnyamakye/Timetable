import React, { useState } from 'react';
import { DAYS, buildDaySlots, COURSE_COLORS, ALL_PERIODS } from '../data/timetableData';
import { Clock, MapPin, User, Plus, GripVertical, CheckCircle2, Circle } from 'lucide-react';

export default function MobileAgendaView({ 
  onCourseClick, 
  onEmptyCellClick,
  onMoveSession,
  onToggleComplete,
  completedIds = [],
  selectedCourseCode,
  classes = [],
  activePeriods = ALL_PERIODS,
  scheduleTime = null,
  activeSession = null
}) {
  const [dragOverDay, setDragOverDay] = useState(null);

  return (
    <div className="agenda-container">
      <div className="drag-hint-banner print-hide">
        <GripVertical size={14} className="hint-icon" />
        <span><strong>Interactive Agenda:</strong> Tap the check circle to mark sessions completed. Drag to another day card to reschedule.</span>
      </div>

      <div className="agenda-list">
        {DAYS.map(dayObj => {
          const slots = buildDaySlots(dayObj.key, classes, activePeriods);
          const activeSlots = slots.filter(s => !s.isEmpty);
          const isDropTarget = dragOverDay === dayObj.key;
          const isToday = scheduleTime && scheduleTime.dayName === dayObj.label;

          return (
            <div 
              key={dayObj.key} 
              className={`agenda-day-card ${isDropTarget ? 'agenda-day-drag-over' : ''} ${isToday ? 'agenda-day-is-today' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverDay !== dayObj.key) setDragOverDay(dayObj.key);
              }}
              onDragLeave={() => {
                if (dragOverDay === dayObj.key) setDragOverDay(null);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverDay(null);
                const sessionId = e.dataTransfer.getData('text/plain');
                if (sessionId && onMoveSession) {
                  const draggedItem = classes.find(c => c.id === sessionId);
                  const targetStart = draggedItem ? draggedItem.startPeriod : 1;
                  onMoveSession(sessionId, dayObj.label, targetStart);
                }
              }}
            >
              <div className="agenda-day-header">
                <div className="day-name-badge">
                  <span className="badge-short">{dayObj.short}</span>
                  <span className="badge-full">{dayObj.label}</span>
                  {isToday && <span className="agenda-today-pill print-hide">TODAY</span>}
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
                    const isCompleted = completedIds.includes(slot.id);
                    const isCardActiveNow = activeSession && activeSession.id === slot.id;

                    return (
                      <div 
                        key={idx}
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', slot.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        className={`agenda-session-card ${isSelected ? 'session-selected' : ''} ${isCompleted ? 'agenda-card-completed' : ''} ${isCardActiveNow ? 'session-active-now' : ''}`}
                        style={{ 
                          borderLeft: `5px solid ${isCompleted ? '#16a34a' : isCardActiveNow ? '#2563eb' : colors.border}`,
                          backgroundColor: '#ffffff'
                        }}
                        onClick={() => onCourseClick({ ...slot, day: dayObj.label })}
                      >
                        <div className="session-top">
                          <div className="session-code-group">
                            <button
                              type="button"
                              className={`agenda-check-circle ${isCompleted ? 'checked' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleComplete && onToggleComplete(slot.id);
                              }}
                              title={isCompleted ? "Completed! Click to unmark" : "Mark as completed"}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={16} className="text-green" />
                              ) : (
                                <Circle size={16} className="text-muted" />
                              )}
                            </button>
                            <span 
                              className="session-code-tag" 
                              style={{ backgroundColor: colors.bg, color: colors.text }}
                            >
                              {slot.code}
                            </span>
                            {isCardActiveNow && (
                              <span className="agenda-live-now-badge print-hide">
                                <span className="live-ping-dot-xs" />
                                LIVE NOW
                              </span>
                            )}
                            {isCompleted && <span className="agenda-done-tag">✓ Done</span>}
                          </div>
                          <span className="session-time">
                            <Clock size={14} /> {slot.time}
                            <GripVertical size={13} className="agenda-grip print-hide" />
                          </span>
                        </div>

                        <h4 className={`session-title ${isCompleted ? 'title-done' : ''}`}>
                          {slot.title}
                        </h4>

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
