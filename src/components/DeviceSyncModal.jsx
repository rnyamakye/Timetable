import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Globe, 
  Wifi, 
  Check, 
  Copy, 
  RefreshCw, 
  Layers, 
  Sparkles,
  Server
} from 'lucide-react';

export default function DeviceSyncModal({
  isOpen,
  onClose,
  syncStatus,
  connectedDevices = 1,
  localIPs = [],
  onManualSync
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (url, index) => {
    navigator.clipboard?.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await onManualSync?.();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content device-sync-modal-card" onClick={e => e.stopPropagation()}>
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
            <span className={`sync-status-indicator-pill ${syncStatus}`}>
              <span className="live-status-dot" />
              {syncStatus === 'connected' ? 'Live Real-Time Sync Active' : syncStatus === 'connecting' ? 'Connecting to Server...' : 'Offline (Local Cache)'}
            </span>
            <span className="devices-count-pill">
              <Laptop size={12} /> {connectedDevices} {connectedDevices === 1 ? 'Device Connected' : 'Devices Connected'}
            </span>
          </div>

          <h2 className="modal-title">Multi-Device Cloud Sync</h2>
          <p className="modal-subtitle">
            All edits, additions, and habit check-offs synchronize instantly across your phone, tablet, and computer.
          </p>
        </div>

        <div className="device-sync-modal-body">
          {/* Section: Connect on Local Wi-Fi */}
          <div className="sync-connection-card">
            <div className="connection-card-header">
              <Wifi size={18} className="text-blue" />
              <div className="connection-title-group">
                <h4 className="connection-title">Connect Mobile &amp; Other Devices (Same Wi-Fi)</h4>
                <p className="connection-desc">
                  Open any of these addresses in Safari or Chrome on your phone or tablet:
                </p>
              </div>
            </div>

            <div className="network-urls-list">
              {localIPs.length === 0 ? (
                <div className="url-copy-box">
                  <span className="url-text">http://localhost:5173</span>
                  <button 
                    type="button" 
                    className="copy-url-btn"
                    onClick={() => handleCopy('http://localhost:5173', 0)}
                  >
                    {copiedIndex === 0 ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    <span>{copiedIndex === 0 ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              ) : (
                localIPs.map((ip, idx) => {
                  const devUrl = `http://${ip}:5173`;
                  return (
                    <div key={ip} className="url-copy-box">
                      <span className="url-text">{devUrl}</span>
                      <button 
                        type="button" 
                        className="copy-url-btn"
                        onClick={() => handleCopy(devUrl, idx)}
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                        <span>{copiedIndex === idx ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section: How Real-Time Sync Works */}
          <div className="sync-features-grid">
            <div className="sync-feature-item">
              <div className="feature-icon-wrapper bg-green-tint">
                <Sparkles size={16} className="text-green" />
              </div>
              <div className="feature-text">
                <span className="feature-title">Instant Live Updates</span>
                <span className="feature-desc">Edits made on one screen update on others via Server-Sent Events without refreshing.</span>
              </div>
            </div>

            <div className="sync-feature-item">
              <div className="feature-icon-wrapper bg-blue-tint">
                <Server size={16} className="text-blue" />
              </div>
              <div className="feature-text">
                <span className="feature-title">Self-Hosted Express Backend</span>
                <span className="feature-desc">All timetable entries and habit records are saved permanently on your Node.js server.</span>
              </div>
            </div>

            <div className="sync-feature-item">
              <div className="feature-icon-wrapper bg-purple-tint">
                <Globe size={16} className="text-purple" />
              </div>
              <div className="feature-text">
                <span className="feature-title">Deploy Anywhere</span>
                <span className="feature-desc">Easily deploy to Render, Railway, or Fly.io to access your timetable from anywhere in the world.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-space-between">
          <button 
            type="button" 
            className="action-btn secondary-btn"
            onClick={handleSyncClick}
            disabled={isSyncing}
          >
            <RefreshCw size={15} className={isSyncing ? 'spin-animation' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Force Sync Now'}</span>
          </button>

          <button type="button" className="action-btn primary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

