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
  Circle
} from 'lucide-react';
import { COURSE_COLORS, CURRICULUM_COURSES } from '../data/timetableData';

export default function CourseModal({ 
  course, 
  onClose, 
  onSelectCourse, 
  onDeleteSession,
  onEditSession,
  isCompleted = false,
  onToggleComplete
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
