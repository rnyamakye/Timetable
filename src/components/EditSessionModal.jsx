import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, MapPin, User, BookOpen, GraduationCap } from 'lucide-react';
import { DAYS, ALL_PERIODS } from '../data/timetableData';

export default function EditSessionModal({ 
  isOpen, 
  onClose, 
  session, 
  onUpdateSession, 
  onDeleteSession,
  activePeriods = ALL_PERIODS 
}) {
  if (!isOpen || !session) return null;

  const [sessionType, setSessionType] = useState(session.sessionType || 'class');
  const [day, setDay] = useState(session.day || 'Monday');
  const [startPeriod, setStartPeriod] = useState(session.startPeriod || 1);
  const [endPeriod, setEndPeriod] = useState(session.endPeriod || 1);
  const [code, setCode] = useState(session.code || '');
  const [title, setTitle] = useState(session.title || '');
  const [room, setRoom] = useState(session.room || '');
  const [lecturer, setLecturer] = useState(session.lecturer || '');
  const [group, setGroup] = useState(session.group || '');
  const [colorKey, setColorKey] = useState(session.colorKey || 'CSM 483');

  // Sync state whenever the selected session changes
  useEffect(() => {
    if (session) {
      setSessionType(session.sessionType || 'class');
      setDay(session.day || 'Monday');
      setStartPeriod(session.startPeriod || 1);
      setEndPeriod(session.endPeriod || 1);
      setCode(session.code || '');
      setTitle(session.title || '');
      setRoom(session.room || '');
      setLecturer(session.lecturer || '');
      setGroup(session.group || '');
      setColorKey(session.colorKey || 'CSM 483');
    }
  }, [session]);

  const handleTypeChange = (newType) => {
    setSessionType(newType);
    if (newType === 'study') {
      if (colorKey === 'CSM 483' || !colorKey) setColorKey('STUDY');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const startP = Number(startPeriod);
    const endP = Math.max(startP, Number(endPeriod));
    const startObj = activePeriods.find(p => p.id === startP);
    const endObj = activePeriods.find(p => p.id === endP);

    const timeString = `${startObj ? startObj.start : '08:00'} - ${endObj ? endObj.end : '08:50'}`;

    const isClass = sessionType === 'class';

    const updatedSession = {
      ...session,
      sessionType,
      day,
      startPeriod: startP,
      endPeriod: endP,
      time: timeString,
      // For personal studies: omit venue, lecturer, and group tag
      room: isClass ? room.trim() : '',
      group: isClass ? group.trim() : '',
      lecturer: isClass ? lecturer.trim() : '',
      code: code.trim().toUpperCase(),
      title: title.trim(),
      colorKey: colorKey || (isClass ? 'CSM 483' : 'STUDY')
    };

    onUpdateSession(updatedSession);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove "${code} - ${title}" from the timetable?`)) {
      onDeleteSession(session.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content add-session-modal-card" onClick={e => e.stopPropagation()}>
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
            <span className="badge-pill">Edit Entry</span>
            <span className="course-code-badge" style={{ backgroundColor: '#f1f5f9' }}>
              {session.code}
            </span>
          </div>
          <h2 className="modal-title">Edit Timetable Session</h2>
          <p className="modal-subtitle">Modify course details, timing, type, or remove this entry</p>
        </div>

        {/* Session Type Selector Toggle */}
        <div className="session-type-selector-bar">
          <span className="type-selector-label">Session Type:</span>
          <div className="type-toggle-buttons">
            <button
              type="button"
              className={`type-toggle-btn ${sessionType === 'class' ? 'active' : ''}`}
              onClick={() => handleTypeChange('class')}
            >
              <GraduationCap size={16} />
              <span>Class</span>
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${sessionType === 'study' ? 'active' : ''}`}
              onClick={() => handleTypeChange('study')}
            >
              <BookOpen size={16} />
              <span>Personal Studies</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-session-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Day of the Week</label>
              <select value={day} onChange={e => setDay(e.target.value)} className="form-select">
                {DAYS.map(d => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> Start Period</label>
              <select 
                value={startPeriod} 
                onChange={e => {
                  const val = Number(e.target.value);
                  setStartPeriod(val);
                  if (endPeriod < val) setEndPeriod(val);
                }} 
                className="form-select"
              >
                {activePeriods.map(p => (
                  <option key={p.id} value={p.id}>Period {p.period} ({p.time})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label"><Clock size={14} /> End Period</label>
              <select 
                value={endPeriod} 
                onChange={e => setEndPeriod(Number(e.target.value))} 
                className="form-select"
              >
                {activePeriods.filter(p => p.id >= Number(startPeriod)).map(p => (
                  <option key={p.id} value={p.id}>Period {p.period} ({p.time})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={14} /> 
                {sessionType === 'class' ? 'Course Code' : 'Subject / Tag'}
              </label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group span-2">
              <label className="form-label">
                {sessionType === 'class' ? 'Course / Session Title' : 'Study Focus / Topic'}
              </label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {/* CLASS ONLY FIELDS: Excluded entirely when Personal Studies is selected */}
            {sessionType === 'class' && (
              <>
                <div className="form-group">
                  <label className="form-label"><User size={14} /> Lecturer / Facilitator</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lecturer: B.T. Parley" 
                    value={lecturer} 
                    onChange={e => setLecturer(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><MapPin size={14} /> Room / Venue</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Room SCBSF20" 
                    value={room} 
                    onChange={e => setRoom(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Group Tag</label>
                  <input 
                    type="text" 
                    placeholder="Group 2" 
                    value={group} 
                    onChange={e => setGroup(e.target.value)}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Color Theme</label>
              <select 
                value={colorKey} 
                onChange={e => setColorKey(e.target.value)} 
                className="form-select"
              >
                <option value="CSM 483">Peach / Salmon (CSM 483)</option>
                <option value="CSM 477">Baby Blue (CSM 477)</option>
                <option value="CSM 497">Lavender Purple (CSM 497)</option>
                <option value="CSM 481">Mint Green (CSM 481)</option>
                <option value="CSM 491">Butter Yellow (CSM 491)</option>
                <option value="CSM 495">Apricot Orange (CSM 495)</option>
                <option value="MAS 261">Rose Red (MAS 261)</option>
                <option value="PROJECT">Teal / Cyan (Project)</option>
                <option value="CCNA">Cisco Blue (CCNA)</option>
                <option value="STUDY">Golden Yellow (Personal Study)</option>
                <option value="LAB">Indigo Tint (Lab)</option>
                <option value="CS-SEMINAR">Silver Gray (Seminar)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer-space-between">
            <button 
              type="button" 
              className="action-btn danger-btn"
              onClick={handleDelete}
              title="Remove this session from timetable"
            >
              <Trash2 size={16} /> Remove Session
            </button>

            <div className="right-action-group">
              <button type="button" className="action-btn secondary-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-btn primary-btn">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

