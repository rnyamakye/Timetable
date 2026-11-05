import React from 'react';
import { X, Calendar, Clock, MapPin, User, Layers, Check, Trash2, BookOpen } from 'lucide-react';
import { COURSE_COLORS, CURRICULUM_COURSES } from '../data/timetableData';

export default function CourseModal({ course, onClose, onSelectCourse, onDeleteSession }) {
  if (!course) return null;

  const isStudy = course.sessionType === 'study';

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
        style={{ borderTop: `6px solid ${colors.border}` }}
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
            {isStudy ? (
              <span className="study-type-badge">
                <BookOpen size={12} /> Personal Study
              </span>
            ) : (
              course.group && <span className="group-badge">{course.group}</span>
            )}
            {course.isCustom && <span className="custom-badge">Custom</span>}
          </div>
          <h2 className="modal-title">{course.title}</h2>
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
              <BookOpen size={18} className="detail-icon text-amber" />
              <div>
                <span className="detail-label">Activity Type</span>
                <span className="detail-value">Personal Study &amp; Self-Directed Revision</span>
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
              <Layers size={16} /> Curriculum Weighting
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
          {course.isCustom ? (
            <button
              type="button"
              className="danger-btn"
              onClick={() => {
                if (onDeleteSession) onDeleteSession(course.id);
                onClose();
              }}
            >
              <Trash2 size={16} /> Remove Session
            </button>
          ) : <div></div>}

          <button 
            type="button" 
            className="highlight-all-btn"
            onClick={() => {
              onSelectCourse(course.code);
              onClose();
            }}
          >
            <Check size={16} />
            Highlight course sessions
          </button>
        </div>
      </div>
    </div>
  );
}
