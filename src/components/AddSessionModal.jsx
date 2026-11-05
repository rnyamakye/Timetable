import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, MapPin, User, BookOpen, GraduationCap } from 'lucide-react';
import { DAYS, ALL_PERIODS } from '../data/timetableData';

export default function AddSessionModal({ 
  isOpen, 
  onClose, 
  onAddSession,
  initialDay = 'Monday',
  initialPeriod = 11,
  activePeriods = ALL_PERIODS
}) {
  if (!isOpen) return null;

  // Option to choose whether it is a 'class' or 'study' (Personal Studies)
  const [sessionType, setSessionType] = useState('class');

  const [day, setDay] = useState(initialDay);
  const [startPeriod, setStartPeriod] = useState(Number(initialPeriod) || 11);
  const [endPeriod, setEndPeriod] = useState(Number(initialPeriod) || 11);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [room, setRoom] = useState('Room SCBSF20');
  const [lecturer, setLecturer] = useState('');
  const [group, setGroup] = useState('Group 2');
  const [colorKey, setColorKey] = useState('CSM 483');

  const handleTypeChange = (newType) => {
    setSessionType(newType);
    if (newType === 'study') {
      if (colorKey === 'CSM 483') setColorKey('STUDY');
      if (!code) setCode('STUDY');
    } else {
      if (colorKey === 'STUDY') setColorKey('CSM 483');
      if (code === 'STUDY') setCode('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const startP = Number(startPeriod);
    const endP = Math.max(startP, Number(endPeriod));
    const startObj = activePeriods.find(p => p.id === startP);
    const endObj = activePeriods.find(p => p.id === endP);

    const timeString = `${startObj ? startObj.start : '19:00'} - ${endObj ? endObj.end : '19:50'}`;

    const isClass = sessionType === 'class';

    const newClass = {
      id: `custom-${Date.now()}`,
      sessionType, // 'class' | 'study'
      day,
      startPeriod: startP,
      endPeriod: endP,
      time: timeString,
      // For personal studies: do not include room venue, lecturer, and group tag
      room: isClass ? (room.trim() || 'Campus Venue') : '',
      group: isClass ? (group.trim() || 'Group 2') : '',
      lecturer: isClass ? (lecturer.trim() ? (lecturer.startsWith('Lecturer:') ? lecturer : `Lecturer: ${lecturer}`) : 'Department Faculty') : '',
      code: code.trim().toUpperCase(),
      title: title.trim(),
      colorKey: colorKey || (isClass ? 'CSM 483' : 'STUDY'),
      isCustom: true
    };

    onAddSession(newClass);
    onClose();
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
            <span className="badge-pill">
              {sessionType === 'class' ? 'Academic Class' : 'Personal Studies'}
            </span>
          </div>
          <h2 className="modal-title">
            {sessionType === 'class' ? 'Add Class Session' : 'Add Personal Study Session'}
          </h2>
          <p className="modal-subtitle">
            {sessionType === 'class' 
              ? 'Schedule a lecture, lab, tutorial or seminar into the timetable'
              : 'Schedule private study, revision, assignment work or reading'}
          </p>
        </div>

        {/* Session Type Selector Toggle */}
        <div className="session-type-selector-bar">
          <span className="type-selector-label">Choose Type:</span>
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
                placeholder={sessionType === 'class' ? "e.g. CSM 499, NIGHT LAB" : "e.g. STUDY, REVISION, READING"} 
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
                placeholder={sessionType === 'class' 
                  ? "e.g. Advanced Operating Systems Lab" 
                  : "e.g. Algorithms Practice & Exam Revision"} 
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
                    placeholder="e.g. Dr. Mensah" 
                    value={lecturer} 
                    onChange={e => setLecturer(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label"><MapPin size={14} /> Room / Venue</label>
                  <input 
                    type="text" 
                    placeholder="e.g. SCBSF20 or Lab 2" 
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
                <option value="STUDY">Golden Yellow (Personal Study)</option>
                <option value="CSM 483">Peach / Salmon (CSM 483 style)</option>
                <option value="CSM 477">Baby Blue (CSM 477 style)</option>
                <option value="CSM 497">Lavender Purple (CSM 497 style)</option>
                <option value="CSM 481">Mint Green (CSM 481 style)</option>
                <option value="CSM 491">Butter Yellow (CSM 491 style)</option>
                <option value="CSM 495">Apricot Orange (CSM 495 style)</option>
                <option value="PROJECT">Teal / Cyan (Project style)</option>
                <option value="LAB">Indigo Tint (Lab style)</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="action-btn secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn primary-btn">
              <Plus size={16} /> 
              {sessionType === 'class' ? 'Add Class to Timetable' : 'Add Study Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
