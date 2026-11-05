import React from 'react';
import { CURRICULUM_COURSES, CURRICULUM_TOTALS, COURSE_COLORS } from '../data/timetableData';
import { Info } from 'lucide-react';

export default function CurriculumTable({ 
  selectedCourseCode, 
  onSelectCourse, 
  searchTerm = '' 
}) {
  const isMatch = (course) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      course.code.toLowerCase().includes(term) ||
      course.title.toLowerCase().includes(term) ||
      course.lecturer.toLowerCase().includes(term) ||
      (course.timetableCode && course.timetableCode.toLowerCase().includes(term))
    );
  };

  return (
    <div className="curriculum-container">
      <div className="curriculum-paper-card">
        {/* Title matching the image */}
        <div className="curriculum-header-block">
          <h3 className="curriculum-heading">YEAR FOUR: SEMESTER ONE</h3>
        </div>

        <div className="table-responsive-wrapper">
          <table className="curriculum-document-table">
            <thead>
              <tr className="curriculum-head-row">
                <th className="th-code-empty"></th>
                <th className="th-title-empty"></th>
                <th className="th-tpc">T</th>
                <th className="th-tpc">P</th>
                <th className="th-tpc">C</th>
              </tr>
            </thead>
            <tbody>
              {CURRICULUM_COURSES.map((course) => {
                const isSelected = selectedCourseCode === course.timetableCode;
                const matches = isMatch(course);
                const colorInfo = COURSE_COLORS[course.timetableCode] || {};

                return (
                  <tr 
                    key={course.code}
                    className={`curriculum-doc-row ${isSelected ? 'row-selected' : ''} ${!matches ? 'row-dimmed' : ''}`}
                    onClick={() => onSelectCourse(isSelected ? null : course.timetableCode)}
                    title="Click to highlight course sessions on timetable"
                  >
                    <td className="td-curriculum-code">
                      <div className="code-pill-wrap">
                        {colorInfo.border && (
                          <span 
                            className="color-indicator-bar" 
                            style={{ backgroundColor: colorInfo.border }}
                          />
                        )}
                        <span className="code-text">{course.code}</span>
                      </div>
                    </td>
                    <td className="td-curriculum-title">
                      <span className="title-text">{course.title}</span>
                      {course.timetableCode && course.timetableCode !== course.code && (
                        <span className="alias-tag print-hide">
                          Schedule ID: {course.timetableCode}
                        </span>
                      )}
                    </td>
                    <td className="td-curriculum-num">{course.theory}</td>
                    <td className="td-curriculum-num">{course.practical}</td>
                    <td className="td-curriculum-num">{course.credits}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="curriculum-doc-total-row">
                <td className="td-empty-spacer"></td>
                <td className="td-empty-spacer"></td>
                <td className="td-curriculum-total-num">{CURRICULUM_TOTALS.theory}</td>
                <td className="td-curriculum-total-num">{CURRICULUM_TOTALS.practical}</td>
                <td className="td-curriculum-total-num">{CURRICULUM_TOTALS.credits}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="curriculum-interactive-guide print-hide">
          <Info size={15} className="guide-icon" />
          <span>
            <strong>Key:</strong> T = Theory (Lecture Hours/week) • P = Practical (Lab/Project Hours/week) • C = Total Credit Units
          </span>
        </div>
      </div>
    </div>
  );
}
