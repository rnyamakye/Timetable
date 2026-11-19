import React from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  GraduationCap,
  Radio,
  Coffee
} from 'lucide-react';
import { COURSE_COLORS } from '../data/timetableData';
import { formatDurationMinutes } from '../utils/timeTracker';

export default function CurrentActivityBanner({
  scheduleTime,
  activeSession,
  nextSession,
  minutesRemaining,
  minutesUntilNext,
  onCourseClick,
  onToggleComplete,
  completedIds = []
}) {
  if (!scheduleTime) return null;

  const isCompleted = activeSession ? completedIds.includes(activeSession.id) : false;
  const colors = activeSession 
    ? (COURSE_COLORS[activeSession.colorKey] || COURSE_COLORS['STUDY'])
    : null;

  return (
    <div className={`current-activity-banner print-hide ${activeSession ? 'has-active-session' : 'is-break-time'}`}>
      <div className="activity-banner-main">
        {/* Left: Live Indicator & Time Context */}
        <div className="activity-live-indicator-group">
          {activeSession ? (
            <div className="live-pulse-badge">
              <span className="live-ping-dot" />
              <Radio size={14} className="live-icon" />
              <span>HAPPENING NOW</span>
            </div>
          ) : (
            <div className="break-badge">
              <Coffee size={14} className="break-icon" />
              <span>{scheduleTime.isWeekend ? 'WEEKEND' : 'FREE TIME / BREAK'}</span>
            </div>
          )}

          <div className="banner-clock-tag">
            <Clock size={13} />
            <span>{scheduleTime.dayName}, {scheduleTime.timeFormatted}</span>
            {scheduleTime.currentPeriod && (
              <span className="current-period-tag">Period {scheduleTime.currentPeriod.period}</span>
            )}
          </div>
        </div>

        {/* Center: Active Session Details OR Next Up Notice */}
        <div className="activity-content-center">
          {activeSession ? (
            <div className="active-session-info">
              <div className="active-code-row">
                <span 
                  className="active-course-pill"
                  style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
                >
                  {activeSession.code}
                </span>

                <span className="active-title-text" onClick={() => onCourseClick?.(activeSession)}>
                  {activeSession.title}
                </span>

                {isCompleted && (
                  <span className="active-completed-tag">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>

              <div className="active-meta-row">
                <span className="meta-time-chip">
                  <Clock size={12} /> {activeSession.time}
                  {minutesRemaining !== null && (
                    <strong className="minutes-left-highlight">
                      &bull; {formatDurationMinutes(minutesRemaining)} remaining
                    </strong>
                  )}
                </span>

                {activeSession.room && (
                  <span className="meta-room-chip">
                    <MapPin size={12} /> {activeSession.room}
                  </span>
                )}

                {activeSession.sessionType === 'study' ? (
                  <span className="meta-type-chip study">
                    <BookOpen size={12} /> Personal Study
                  </span>
                ) : (
                  activeSession.lecturer && (
                    <span className="meta-lecturer-chip">
                      <User size={12} /> {activeSession.lecturer}
                    </span>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="break-time-info">
              {nextSession ? (
                <div className="next-up-row">
                  <span className="next-up-label">Next Up on Schedule:</span>
                  <span 
                    className="next-code-badge"
                    onClick={() => onCourseClick?.(nextSession)}
                  >
                    {nextSession.code} - {nextSession.title}
                  </span>
                  <span className="next-time-tag">
                    at {nextSession.time.split(' - ')[0]} 
                    {minutesUntilNext !== null && ` (in ${formatDurationMinutes(minutesUntilNext)})`}
                  </span>
                </div>
              ) : (
                <div className="no-more-sessions-note">
                  <span>No more scheduled sessions today. Enjoy your evening and consolidate your study review!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="activity-actions-right">
          {activeSession && (
            <>
              <button
                type="button"
                className={`banner-quick-check-btn ${isCompleted ? 'is-checked' : ''}`}
                onClick={() => onToggleComplete?.(activeSession.id)}
                title={isCompleted ? "Completed! Click to unmark" : "Mark current session as completed / attended"}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={15} />
                    <span>Done ✓</span>
                  </>
                ) : (
                  <>
                    <Circle size={15} />
                    <span>Mark Done</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="banner-details-btn"
                onClick={() => onCourseClick?.(activeSession)}
                title="View full course syllabus and monthly habit dot matrix"
              >
                <span>Details &amp; Dot Matrix</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {!activeSession && nextSession && (
            <button
              type="button"
              className="banner-details-btn"
              onClick={() => onCourseClick?.(nextSession)}
            >
              <span>View Next Session</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

