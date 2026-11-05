import React from 'react';
import { BookOpen, GraduationCap, Clock, Award, Users } from 'lucide-react';
import { CURRICULUM_TOTALS, CURRICULUM_COURSES } from '../data/timetableData';

export default function StatsBar({ onSelectCourse, selectedCourseCode }) {
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  return (
    <div className="stats-bar print-hide">
      <div className="stat-card">
        <div className="stat-icon-wrapper bg-blue-tint">
          <GraduationCap size={20} className="text-blue" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Total Credits</span>
          <span className="stat-value">{CURRICULUM_TOTALS.credits} Credits</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-green-tint">
          <BookOpen size={20} className="text-green" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Theory Hours (T)</span>
          <span className="stat-value">{CURRICULUM_TOTALS.theory} hrs / week</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-teal-tint">
          <Clock size={20} className="text-teal" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Practical Lab (P)</span>
          <span className="stat-value">{CURRICULUM_TOTALS.practical} hrs / week</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper bg-purple-tint">
          <Award size={20} className="text-purple" />
        </div>
        <div className="stat-info">
          <span className="stat-label">Enrolled Courses</span>
          <span className="stat-value">{CURRICULUM_COURSES.length} Modules</span>
        </div>
      </div>

      <div className="stat-card quick-filter-card">
        <span className="stat-label">Quick Highlight:</span>
        <div className="chip-list">
          {CURRICULUM_COURSES.map(course => (
            <button
              key={course.code}
              type="button"
              className={`course-chip ${selectedCourseCode === course.timetableCode ? 'chip-active' : ''}`}
              onClick={() => onSelectCourse(selectedCourseCode === course.timetableCode ? null : course.timetableCode)}
              title={course.title}
            >
              {course.code}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

