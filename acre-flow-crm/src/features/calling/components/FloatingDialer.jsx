import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PhoneCall, PhoneOff, Minus, X, Clock4, FileText } from 'lucide-react';
import { callsApi } from '@/api/calls.api.js';
import '@/styles/calling.css';

const formatSeconds = (sec) => {
  const s = Math.max(0, sec || 0);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

const normalizePhone = (value) => {
  const v = (value || '').toString();
  return v.replace(/[^0-9+]/g, '');
};

const FloatingDialer = ({ userRole = 'employee' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callLog, setCallLog] = useState(null);
  const [notes, setNotes] = useState('');

  const [timerSec, setTimerSec] = useState(0);
  const timerRef = useRef(null);

  const callingEnabled = Boolean(config?.CALLING_ENABLED);

  const canSeeDialer = useMemo(() => {
    const r = (userRole || '').toLowerCase();
    return ['super-admin', 'head-admin', 'team-leader', 'employee', 'admin', 'sales_head', 'sales_executive'].includes(r);
  }, [userRole]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await callsApi.fetchConfig();
        if (!mounted) return;
        setConfig(res?.data || res);
        setConfigError('');
      } catch (e) {
        if (!mounted) return;
        setConfigError(e?.message || 'Failed to load calling config');
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isCalling) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimerSec(0);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerSec((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isCalling]);

  const handleStart = async () => {
    const cleaned = normalizePhone(phoneNumber);
    if (!cleaned) return;

    try {
      setIsCalling(true);
      const res = await callsApi.start({ phoneNumber: cleaned });
      const data = res?.data || res;
      setCallLog(data);
      setNotes(data?.notes?.text || '');
    } catch (e) {
      setIsCalling(false);
      setCallLog(null);
      setNotes('');
      alert(e?.message || 'Failed to start call');
    }
  };

  const handleEnd = async () => {
    try {
      if (callLog?._id) {
        await callsApi.end({ callLogId: callLog._id });
      }
    } catch (_) {}

    try {
      if (callLog?._id && notes.trim()) {
        await callsApi.updateNotes(callLog._id, { text: notes });
      }
    } catch (_) {}

    setIsCalling(false);
    setCallLog(null);
    setNotes('');
    setTimerSec(0);
  };

  const handleClose = () => {
    if (isCalling) return;
    setIsOpen(false);
    setIsMinimized(false);
    setPhoneNumber('');
    setNotes('');
    setCallLog(null);
  };

  if (!canSeeDialer) return null;

  return (
    <div className="calling-root">
      {!isOpen && (
        <button
          className={`calling-fab ${callingEnabled ? '' : 'calling-fab-disabled'}`}
          onClick={() => setIsOpen(true)}
          title={callingEnabled ? 'Open Dialer' : 'Calling Disabled'}
          disabled={!callingEnabled}
        >
          <PhoneCall size={20} />
        </button>
      )}

      {isOpen && (
        <div className={`calling-panel ${isMinimized ? 'calling-min' : ''}`}>
          <div className="calling-header">
            <div className="calling-title">
              <span className="calling-title-icon"><PhoneCall size={16} /></span>
              <div>
                <div className="calling-title-text">Calling</div>
                <div className="calling-subtitle">
                  {isCalling ? (
                    <span className="calling-subtitle-row"><Clock4 size={14} /> {formatSeconds(timerSec)}</span>
                  ) : (
                    <span className="calling-subtitle-row">Dial from CRM</span>
                  )}
                </div>
              </div>
            </div>

            <div className="calling-actions">
              <button
                className="calling-icon-btn"
                onClick={() => setIsMinimized((v) => !v)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <Minus size={16} />
              </button>
              <button
                className="calling-icon-btn"
                onClick={handleClose}
                title={isCalling ? 'End call first' : 'Close'}
                disabled={isCalling}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="calling-body">
              {!!configError && (
                <div className="calling-alert">{configError}</div>
              )}

              <div className="calling-field">
                <label>Phone Number</label>
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  disabled={isCalling}
                />
              </div>

              <div className="calling-buttons">
                {!isCalling ? (
                  <button
                    className="calling-primary"
                    onClick={handleStart}
                    disabled={!callingEnabled || !normalizePhone(phoneNumber)}
                  >
                    <PhoneCall size={16} />
                    Start Call
                  </button>
                ) : (
                  <button className="calling-danger" onClick={handleEnd}>
                    <PhoneOff size={16} />
                    End Call
                  </button>
                )}
              </div>

              <div className="calling-field">
                <label>
                  <span className="calling-label-inline"><FileText size={14} /> Notes</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes (saved on end call)"
                />
              </div>

              {!!callLog?._id && (
                <div className="calling-muted">
                  Call ID: {callLog._id}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingDialer;
