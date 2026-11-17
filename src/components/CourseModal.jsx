import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Layers, 
  Check, 
  Trash2, 
  BookOpen, 
  Award, 
  Pencil,
  CheckCircle2,
  Circle,
  Flame,
  Sparkles
} from 'lucide-react';
import { COURSE_COLORS, CURRICULUM_COURSES } from '../data/timetableData';

export default function CourseModal({ 
  course, 
  onClose, 
  onSelectCourse, 
  onDeleteSession,
  onEditSession,
  isCompleted = false,
  onToggleComplete,
  habitHistory = {},
  onToggleDayHabit
}) {
  if (!course) return null;

  const isStudy = course.sessionType === 'study';
  const isCertification = course.isCertification || course.code === 'CCNA';

  const colors = COURSE_COLORS[course.colorKey] || {
    bg: '#f3f4f6',
    border: '#d1d5db',
    text: '#111827',
    badge: '#4b5563'
  };

  const curriculumMatch = CURRICULUM_COURSES.find(
    c => c.code === course.curriculumCode || c.timetableCode === course.code
  );

  // Helper to determine if a sessionId matches the current modal course
  const isSessionMatchingCourse = (sId, courseObj) => {
    if (!sId || !courseObj) return false;
    if (sId === courseObj.id) return true;

    const lowerId = sId.toLowerCase();
    const cleanCode = (courseObj.code || '').replace(/\s+/g, '').toLowerCase();

    if (cleanCode === 'ccna' && (lowerId.includes('ccna') || courseObj.isCertification)) return true;
    if (cleanCode.startsWith('csm483') && lowerId.includes('csm483')) return true;
    if (cleanCode.startsWith('csm477') && lowerId.includes('csm477')) return true;
    if (cleanCode.startsWith('csm497') && lowerId.includes('csm497')) return true;
    if (cleanCode.startsWith('csm481') && lowerId.includes('csm481')) return true;
    if (cleanCode.startsWith('csm491') && lowerId.includes('csm491')) return true;
    if (cleanCode.startsWith('csm495') && lowerId.includes('csm495')) return true;
    if (cleanCode.startsWith('mas261') && lowerId.includes('mas261')) return true;
    if (cleanCode === 'project' && lowerId.includes('project')) return true;
    if (cleanCode.includes('seminar') && lowerId.includes('seminar')) return true;

    return lowerId.includes(cleanCode);
  };

  // Generate 30 days for November 2026 (Nov 1, 2026 was Sunday -> Monday offset 6)
  const daysInMonth = 30;
  const mondayOffset = 6;
  const days = [];

  for (let i = 0; i < mondayOffset; i++) {
    days.push({ isOffset: true, key: `offset-${i}` });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = String(d).padStart(2, '0');
    const dateKey = `2026-11-${dayStr}`;
    const loggedSessionIds = habitHistory[dateKey] || [];
    
    // Check how many times this course was performed on this day
    let count = loggedSessionIds.filter(sId => isSessionMatchingCourse(sId, course)).length;

    // Sync with isCompleted state for today (Nov 11)
    if (d === 11 && isCompleted && count === 0) {
      count = 1;
    }

    days.push({
      isOffset: false,
      key: dateKey,
      dateKey,
      dayNum: d,
      count,
      isToday: d === 11,
      isPastOrToday: d <= 11
    });
  }

  // Monthly stats for this specific task
  const elapsedDays = days.filter(d => !d.isOffset && d.isPastOrToday);
  const activeDaysCount = elapsedDays.filter(d => d.count > 0).length;
  const totalCompletedSessions = elapsedDays.reduce((acc, d) => acc + d.count, 0);
  const completionRate = elapsedDays.length > 0 ? Math.round((activeDaysCount / elapsedDays.length) * 100) : 0;

  // Consecutive streak up to today
  let currentStreak = 0;
  for (let i = elapsedDays.length - 1; i >= 0; i--) {
    if (elapsedDays[i].count > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `6px solid ${isCompleted ? '#16a34a' : colors.border}` }}
      >
        <button 
          type="button" 
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-badge-group">
            <span className="course-code-badge" style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}>
              {course.code}
            </span>
            {isCertification ? (
              <span className="certification-badge">
                <Award size={12} /> Cisco Certification
              </span>
            ) : isStudy ? (
              <span className="study-type-badge">
                <BookOpen size={12} /> Personal Study
              </span>
            ) : (
              course.group && <span className="group-badge">{course.group}</span>
            )}
            {isCompleted && (
              <span className="modal-completed-pill">
                <CheckCircle2 size={12} /> Completed
              </span>
            )}
            {course.isCustom && <span className="custom-badge">Custom</span>}
          </div>
          <h2 className="modal-title">{course.title}</h2>
          {course.description && (
            <p className="modal-desc-text">{course.description}</p>
          )}

          {/* Quick Habit Completion Toggle Bar */}
          <button
            type="button"
            className={`modal-habit-toggle-btn ${isCompleted ? 'completed-state' : ''}`}
            onClick={() => onToggleComplete && onToggleComplete(course.id)}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 size={18} className="habit-check-icon text-green" />
                <span>Marked as Done &amp; Attended ✓</span>
              </>
            ) : (
              <>
                <Circle size={18} className="habit-check-icon text-muted" />
                <span>Mark as Completed / Attended</span>
              </>
            )}
          </button>
        </div>

        <div className="modal-body-grid">
          <div className="detail-item">
            <Calendar size={18} className="detail-icon text-indigo" />
            <div>
              <span className="detail-label">Day &amp; Schedule</span>
              <span className="detail-value">{course.day || 'Scheduled Day'}</span>
            </div>
          </div>

          <div className="detail-item">
            <Clock size={18} className="detail-icon text-blue" />
            <div>
              <span className="detail-label">Time &amp; Periods</span>
              <span className="detail-value">
                {course.time} (Period {course.startPeriod}{course.endPeriod && course.endPeriod !== course.startPeriod ? ` - ${course.endPeriod}` : ''})
              </span>
            </div>
          </div>

          {isStudy ? (
            <div className="detail-item span-2">
              {isCertification ? (
                <Award size={18} className="detail-icon text-blue" />
              ) : (
                <BookOpen size={18} className="detail-icon text-amber" />
              )}
              <div>
                <span className="detail-label">Session Classification</span>
                <span className="detail-value">
                  {isCertification 
                    ? 'Extracurricular Professional Certification (Not in Semester Curriculum)' 
                    : 'Strategic Course Review & Active Consolidation'}
                </span>
              </div>
            </div>
          ) : (
            <>
              {course.room && (
                <div className="detail-item">
                  <MapPin size={18} className="detail-icon text-red" />
                  <div>
                    <span className="detail-label">Location / Room</span>
                    <span className="detail-value">{course.room}</span>
                  </div>
                </div>
              )}

              {course.lecturer && (
                <div className="detail-item">
                  <User size={18} className="detail-icon text-green" />
                  <div>
                    <span className="detail-label">Lecturer</span>
                    <span className="detail-value">{course.lecturer}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ========================================================
            MONTHLY HABIT DOT MATRIX SECTION FOR THIS SPECIFIC TASK
            ======================================================== */}
        <div className="modal-dot-matrix-section">
          <div className="modal-matrix-header">
            <div className="matrix-title-wrapper">
              <Calendar size={16} className="text-indigo" />
              <h4 className="matrix-heading">
                Monthly Activity Dot Matrix &bull; November 2026
              </h4>
            </div>

            <div className="modal-matrix-stats">
              <span className="matrix-stat-chip" title="Days completed out of elapsed days this month">
                <Flame size={13} className="text-orange" />
                <span>{activeDaysCount} / {elapsedDays.length} Days ({completionRate}%)</span>
              </span>

              <span className="matrix-stat-chip" title="Total completed sessions of this course">
                <Check size={13} className="text-green" />
                <span>{totalCompletedSessions} Done</span>
              </span>

              {currentStreak > 0 && (
                <span className="matrix-stat-chip streak-chip" title="Active consecutive streak">
                  <Sparkles size={13} className="text-purple" />
                  <span>{currentStreak} Day Streak</span>
                </span>
              )}
            </div>
          </div>

          <p className="modal-matrix-subtext">
            Visualizing completion frequency for <strong>{course.code}</strong> across the entire month. Click any day to toggle review status.
          </p>

          {/* 7-column weekday headers */}
          <div className="modal-matrix-weekdays">
            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(w => (
              <span key={w} className="matrix-weekday-label">{w}</span>
            ))}
          </div>

          {/* 30-Day Dot Matrix Grid */}
          <div className="modal-matrix-grid">
            {days.map(day => {
              if (day.isOffset) {
                return <div key={day.key} className="modal-matrix-cell offset-cell" />;
              }

              const isDone = day.count > 0;

              return (
                <button
                  key={day.key}
                  type="button"
                  className={`modal-matrix-cell ${day.isToday ? 'is-today' : ''} ${isDone ? 'is-performed' : ''}`}
                  onClick={() => onToggleDayHabit && onToggleDayHabit(day.dateKey, course.id)}
                  title={`November ${day.dayNum}, 2026${day.isToday ? ' (Today)' : ''}: ${day.count} session(s) of ${course.code} completed. Click to toggle.`}
                >
                  <span className="cell-day-num">{day.dayNum}</span>
                  <div 
                    className={`matrix-cell-dot ${isDone ? 'dot-filled' : 'dot-empty'}`}
                    style={isDone ? { backgroundColor: colors.badge || '#16a34a' } : undefined}
                  >
                    {isDone && (
                      day.count > 1 ? (
                        <span className="multi-count-badge">{day.count}x</span>
                      ) : (
                        <Check size={11} className="dot-check-icon" />
                      )
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend row */}
          <div className="modal-matrix-legend">
            <div className="legend-item">
              <span className="legend-dot-symbol dot-empty-preview" />
              <span>Not Completed</span>
            </div>
            <div className="legend-item">
              <span 
                className="legend-dot-symbol dot-filled-preview" 
                style={{ backgroundColor: colors.badge || '#16a34a' }} 
              />
              <span>Completed ({course.code})</span>
            </div>
            <div className="legend-item">
              <span className="legend-today-ring" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {curriculumMatch && (
          <div className="curriculum-breakdown-card">
            <h4 className="curriculum-card-title">
              <Layers size={16} /> Course Syllabus Weighting ({curriculumMatch.code})
            </h4>
            <div className="curriculum-metric-row">
              <div className="metric-box">
                <span className="metric-label">Theory (T)</span>
                <span className="metric-val">{curriculumMatch.theory} hrs</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Practical (P)</span>
                <span className="metric-val">{curriculumMatch.practical} hrs</span>
              </div>
              <div className="metric-box highlight-box">
                <span className="metric-label">Total Credits (C)</span>
                <span className="metric-val">{curriculumMatch.credits} Units</span>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer-space-between">
          <div className="modal-left-actions">
            <button
              type="button"
              className="action-btn danger-btn"
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove "${course.code} - ${course.title}" from the timetable?`)) {
                  onDeleteSession(course.id);
                  onClose();
                }
              }}
              title="Remove this session from the timetable"
            >
              <Trash2 size={15} /> Remove
            </button>

            <button
              type="button"
              className="action-btn edit-btn"
              onClick={() => {
                onEditSession(course);
                onClose();
              }}
              title="Edit course code, title, periods, room, or color"
            >
              <Pencil size={15} /> Edit
            </button>
          </div>

          <button 
            type="button" 
            className="action-btn highlight-all-btn"
            onClick={() => {
              onSelectCourse(course.curriculumCode || course.code);
              onClose();
            }}
            title="Highlight all matching sessions across the timetable"
          >
            <Check size={15} /> Highlight
          </button>
        </div>
      </div>
    </div>
  );
}
