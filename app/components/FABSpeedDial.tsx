'use client';

import { useState, useEffect, useRef } from 'react';
import MyChatComponent from './MyChatComponent';

export default function FABSpeedDial() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [pulse, setPulse] = useState(false);
  const fabRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  // --- Chat Prompt Toast State ---
  const [showChatToast, setShowChatToast] = useState(true); // Show toast on mount
  const [showChatButton, setShowChatButton] = useState(false); // Show button after toast
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pulse animation every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1200);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Tooltip on first load
  useEffect(() => {
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show toast for 4 seconds, then hide and show chat button
    if (showChatToast) {
      toastTimeoutRef.current = setTimeout(() => {
        setShowChatToast(false);
        setShowChatButton(true);
      }, 4000);
    }
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [showChatToast]);

  const toggleFAB = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => {
      if (prev) setShowChat(false); // Close chat when closing FAB
      return !prev;
    });
  };

  const closeFAB = () => {
    setIsOpen(false);
    setShowChat(false); // Always close chat when closing FAB
  };

  const openChatFunction = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowChat((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        fabRef.current &&
        !fabRef.current.contains(e.target as Node) &&
        (!chatRef.current || !chatRef.current.contains(e.target as Node))
      ) {
        closeFAB();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showChat) {
      document.body.classList.add("chat-open");
    } else {
      document.body.classList.remove("chat-open");
    }
  }, [showChat]);

  // Handler for manual dismiss
  const handleToastDismiss = () => {
    setShowChatToast(false);
    setShowChatButton(true);
  };

  return (
    <>
      {/* --- Modern Toast for Chat Prompt --- */}
      {showChatToast && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 90,
            transform: 'translateX(-50%)',
            zIndex: 1200,
            // --- Polished, Compact Toast Styling ---
            background: '#fff', // clean, soft white
            color: '#222',
            borderRadius: 12, // slightly rounded
            boxShadow: '0 2px 8px rgba(25,135,84,0.10), 0 1.5px 8px rgba(0,0,0,0.08)', // subtle shadow
            padding: '0.55rem 1.1rem', // compact vertical, balanced horizontal
            fontSize: 15.5, // match site UI
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 220,
            maxWidth: '96vw',
            border: '1px solid #e6f2ec', // very subtle border
            transition: 'opacity 0.4s, bottom 0.4s',
            opacity: showChatToast ? 1 : 0,
            pointerEvents: 'auto',
            cursor: 'pointer',
            animation: 'fadeInUp 0.5s',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontStyle: 'normal',
            fontStretch: 'normal',
            letterSpacing: 0.01,
          }}
          onClick={handleToastDismiss}
          aria-label="Need help? Click here to chat!"
        >
          <span role="img" aria-label="wave" style={{fontSize: 18, marginRight: 4, flexShrink: 0}}>👋</span>
          <span style={{lineHeight: 1.35, fontWeight: 500}}>Need help? <span style={{fontWeight: 400}}>Click here to chat!</span></span>
        </div>
      )}
      {/* --- End Toast --- */}

      {/* --- Chat Button (shows only after toast disappears) --- */}
      {showChatButton && (
      <div
        ref={fabRef}
        className={`fab-speed-dial ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'flex-end',
          gap: '16px',
          maxWidth: 'calc(100vw - 16px)'
        }}
      >
        {/* Tooltip on first load */}
        {showTooltip && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: 0,
            background: '#fff',
            color: '#222',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
            padding: '0.7rem 1.1rem',
            fontSize: 15,
            fontWeight: 500,
            zIndex: 1001,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeInOut 3s linear'
          }}>
            <span role="img" aria-label="wave">👋</span> Need help? Click here to chat!
          </div>
        )}
        {/* Main White Questions Button (chat trigger) */}
        <button
          className={`fab-main fab-questions${pulse ? ' fab-pulse-enhanced' : ''}`}
          aria-label="Open contact options"
          aria-expanded={isOpen}
          onClick={toggleFAB}
          style={{
            background: '#fff',
            color: '#198754',
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            padding: '0.5rem 1.1rem',
            marginBottom: 4,
            marginRight: 2,
            display: 'inline-block',
            pointerEvents: 'auto',
            userSelect: 'none',
            letterSpacing: 0.1,
            zIndex: 1000,
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            position: 'relative',
            minWidth: 120,
            minHeight: 48
          }}
        >
          <span style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }}>💬</span>
          Live Chat
        </button>
        {/* FAB Items Container */}
        <div 
          className="fab-items"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            pointerEvents: isOpen ? 'auto' : 'none',
            marginBottom: '8px'
          }}
        >
          {/* Call Option */}
          <a 
            href="tel:+19547649750" 
            className="fab-item fab-call" 
            aria-label="Call Us"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'white',
              padding: '12px 16px',
              borderRadius: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: '#333',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>📞</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Call Us</span>
          </a>

          {/* Email Option */}
          <a 
            href="/contact" 
            className="fab-item fab-contact" 
            aria-label="Email Us"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'white',
              padding: '12px 16px',
              borderRadius: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              textDecoration: 'none',
              color: '#333',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>✉️</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Email Us</span>
          </a>

          {/* Chat Option */}
          <button 
            onClick={openChatFunction} 
            className="fab-item fab-chat" 
            aria-label="Chat Now"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'white',
              padding: '12px 16px',
              borderRadius: '28px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer',
              color: '#333',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              width: 'fit-content'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateX(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <span style={{ fontSize: '20px' }}>💬</span>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Let's Chat</span>
          </button>
        </div>
      </div>
      )}
      {/* --- End Chat Button --- */}
      {/* Enhanced Pulse/Bounce animation keyframes */}
      <style jsx>{`
        .fab-pulse-enhanced {
          animation: fabPulseEnhanced 1.3s;
        }
        @keyframes fabPulseEnhanced {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(25,135,84,0.32); }
          25% { transform: scale(1.18); box-shadow: 0 0 0 16px rgba(25,135,84,0.13); }
          60% { transform: scale(0.95); box-shadow: 0 0 0 8px rgba(25,135,84,0.09); }
          100% { transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.10); }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; bottom: 60px; }
          100% { opacity: 1; bottom: 90px; }
        }
      `}</style>
      {/* Chat Modal */}
      {showChat && (
        <div ref={chatRef} style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 1001 }}>
          <MyChatComponent onClose={() => setShowChat(false)} />
        </div>
      )}
    </>
  );
}
