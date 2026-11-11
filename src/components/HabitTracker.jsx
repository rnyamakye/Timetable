import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Flame, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import MonthlyDotMatrix from './MonthlyDotMatrix';

export default function HabitTracker({ 
  classes = [], 
  completedIds = [], 
  onResetProgress,
  streakDays = 3,
  habitHistory = {},
  onToggleDayHabit
}) {
  const [showMonthlyMatrix, setShowMonthlyMatrix] = useState(true);

  const totalSessions = classes.length;
  const completedSessions = classes.filter(c => completedIds.includes(c.id));
  const completedCount = completedSessions.length;
  
  const percent = totalSessions > 0 ? Math.round((completedCount / totalSessions) * 100) : 0;

  // Breakdown by class vs personal study
  const totalClasses = classes.filter(c => c.sessionType !== 'study').length;
  const completedClasses = completedSessions.filter(c => c.sessionType !== 'study').length;

  const totalReviews = classes.filter(c => c.sessionType === 'study').length;
  const completedReviews = completedSessions.filter(c => c.sessionType === 'study').length;

  // Motivational messages based on completion milestone
  const getMotivationalMessage = () => {
    if (completedCount === 0) {
      return "Ready to kick off this week? Check off your first class or review session!";
    }
    if (percent < 25) {
      return "Awesome start! Every review session builds long-term mastery. 🌱";
    }
    if (percent < 50) {
      return "Great momentum! You're making steady daily progress. 🚀";
    }
    if (percent < 75) {
      return "Over halfway through! Your consistency is truly paying off. ⚡";
    }
    if (percent < 100) {
      return "Almost at the finish line! Just a few more sessions to complete. 🎯";
    }
    return "Outstanding! You completed 100% of your weekly schedule! Champion mindset! 🏆";
  };

  return (
    <div className="habit-tracker-card print-hide">
      <div className="habit-header-row">
        <div className="habit-title-group">
          <div className="habit-icon-pill">
            <CheckCircle2 size={18} className="habit-icon" />
            <span>Habit &amp; Progress Tracker</span>
          </div>
          <span className="habit-subtext">Mark classes and study sessions as completed as you attend or review them</span>
        </div>

        <div className="habit-stats-pills">
          <div className="streak-badge" title="Consecutive active study days">
            <Flame size={17} className="flame-icon" />
            <span className="streak-count">{streakDays} Day Streak!</span>
          </div>

          <div className="completion-score-badge">
            <Trophy size={16} className="trophy-icon" />
            <span>{completedCount} / {totalSessions} Done ({percent}%)</span>
          </div>

          <button
            type="button"
            className="matrix-toggle-pill-btn"
            onClick={() => setShowMonthlyMatrix(prev => !prev)}
            title="Toggle monthly dot matrix activity view"
          >
            <Calendar size={14} />
            <span>{showMonthlyMatrix ? 'Hide Dot Matrix' : 'Monthly Dot Matrix'}</span>
            {showMonthlyMatrix ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {completedCount > 0 && (
            <button 
              type="button" 
              className="habit-reset-btn"
              onClick={onResetProgress}
              title="Reset completion status for a new week"
            >
              <RotateCcw size={13} /> Reset Week
            </button>
          )}
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percent}%` }}
        >
          {percent >= 15 && <span className="progress-bar-label">{percent}%</span>}
        </div>
      </div>

      {/* Progress Breakdown & Motivational Encouragement */}
      <div className="habit-footer-row">
        <div className="habit-breakdown-tags">
          <span className="breakdown-tag">
            <GraduationCap size={14} className="tag-icon text-blue" />
            <span>Classes Attended: <strong>{completedClasses} / {totalClasses}</strong></span>
          </span>

          <span className="breakdown-tag">
            <BookOpen size={14} className="tag-icon text-amber" />
            <span>Reviews &amp; CCNA Done: <strong>{completedReviews} / {totalReviews}</strong></span>
          </span>
        </div>

        <div className="motivation-message">
          <Sparkles size={15} className="sparkle-icon" />
          <span>{getMotivationalMessage()}</span>
        </div>
      </div>

      {/* Monthly Dot Matrix Section */}
      {showMonthlyMatrix && (
        <div className="monthly-matrix-wrapper">
          <MonthlyDotMatrix
            classes={classes}
            habitHistory={habitHistory}
            onToggleDayHabit={onToggleDayHabit}
            completedIds={completedIds}
          />
        </div>
      )}
    </div>
  );
}

