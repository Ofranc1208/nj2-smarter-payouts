"use client";
import { useState, useRef, useEffect } from "react";
import { db, storage } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { format } from 'date-fns';
import { splitIntoParagraphs, renderAssistantParagraphs, shouldAppendCalculatorCTA, followupTopics } from '../utils/chatUtils';
import { mintSystemPrompt } from '../utils/mintSystemPrompt';

export default function MyChatComponent({ onClose }: { onClose?: () => void }) {
  // ===== User Session & Local Storage Logic =====
  function hasChattedBefore() {
    if (typeof window !== 'undefined') {
      return (
        window.sessionStorage.getItem('mintChat_hasChattedBefore') === 'true' ||
        window.localStorage.getItem('mintChat_hasChattedBefore') === 'true'
      );
    }
    return false;
  }
  function setChattedBefore() {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('mintChat_hasChattedBefore', 'true');
      window.localStorage.setItem('mintChat_hasChattedBefore', 'true');
    }
  }

  // ===== Staged Chat Flow State =====
  const [stagedGreetingDone, setStagedGreetingDone] = useState(false);
  const [stagedCTADone, setStagedCTADone] = useState(false);
  const [stagedFollowupDone, setStagedFollowupDone] = useState(false);
  const [stagedStep3Done, setStagedStep3Done] = useState(false);
  const [stagedTyping, setStagedTyping] = useState(false);
  const [stagedPending, setStagedPending] = useState<string | null>(null);
  const [stagedMessages, setStagedMessages] = useState<{ role: string; content: string; cta?: boolean; followup?: boolean; step3?: boolean }[]>([]);
  const [stagedShowTyping, setStagedShowTyping] = useState(false);
  const [stagedShowStep3Typing, setStagedShowStep3Typing] = useState(false);

  // ===== Typing Animation & Notification =====
  const notificationSoundPath = "/assets/sounds/notification.mp3";
  function playNotificationSound() {
    if (typeof window !== 'undefined' && window.Audio) {
      try {
        const audio = new window.Audio(notificationSoundPath);
        audio.volume = 0.18;
        audio.play().catch(() => {});
      } catch {}
    }
  }

  // Initial greeting state
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: number]: boolean }>({});
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionId] = useState(getSessionId() || 'unknown');

  // Utility to generate a random session ID if not available
  function getSessionId() {
    if (typeof window !== 'undefined') {
      let id = window.sessionStorage.getItem('chat_session_id');
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        window.sessionStorage.setItem('chat_session_id', id);
      }
      return id;
    }
    return null;
  }

  // Detect if user wants to speak with an associate
  async function maybeLogAssociateRequest(userMessage: string) {
    const triggers = [
      'speak with an associate',
      'connect me with an associate',
      'talk to an associate',
      'talk to a person',
      'speak to a person',
      'talk to a human',
      'connect me with a human',
      'client relations associate',
      'real person',
      'representative',
      'specialist',
      'customer service',
      'call an associate',
      'connect me with support',
      'can I talk to someone',
      'can I speak to someone',
      'can I talk to an agent',
      'can I speak to an agent',
    ];
    const normalized = userMessage.toLowerCase();
    if (triggers.some(t => normalized.includes(t))) {
      try {
        await addDoc(collection(db, "chat_notifications"), {
          type: "associate_request",
          timestamp: serverTimestamp(),
          user_message: userMessage,
          chat_session_id: getSessionId() || "unknown",
          status: "new"
        });
      } catch (err) {
        // Fail silently, do not block chat
        console.error("Failed to log associate request:", err);
      }
    }
  }

  // Helper: Render Mint's paragraphs with enhancements
  function renderAssistantParagraphs(paragraphs: string[]) {
    return paragraphs.map((p, idx) => {
      // Phone number clickable
      const phoneRegex = /\(954\) 764-9750/g;
      let enhanced = p.replace(phoneRegex, '<a href="tel:+19547649750">(954) 764-9750</a>');
      // Render as HTML for phone link
      return <span key={idx} style={{ display: 'block', marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: enhanced }} />;
    });
  }

  // Helper: Should we append the calculator CTA?
  function shouldAppendCalculatorCTA(paragraphs: string[]) {
    // Only for assistant replies, not for errors or very short/closing messages
    const alreadyHasCTA = paragraphs.some(p => p.toLowerCase().includes('online calculator'));
    return !alreadyHasCTA && paragraphs.length > 0 && !/error|sorry|not found|unknown/i.test(paragraphs.join(' '));
  }

  const CALCULATOR_CTA =
    `<div class="mint-cta-block">
      <div class="mint-cta-header">Want to see your payout estimate?</div>
      <div class="mint-cta-body">Try our industry-first <a href="/pricing-calculator" class="mint-cta-link" target="_blank" rel="noopener noreferrer">online calculator</a> — no personal info required, and it could save you thousands!</div>
    </div>`;

  // Typing effect for Mint's response
  function typeMessage(paragraphs: string[], onDone: (full: string) => void) {
    let full = "";
    let pIdx = 0;
    let cIdx = 0;
    function typeNext() {
      if (pIdx >= paragraphs.length) {
        onDone(full.trim());
        return;
      }
      const para = paragraphs[pIdx];
      if (cIdx < para.length) {
        full += para[cIdx];
        setPendingMessage(full + "|"); // Show a cursor
        cIdx++;
        setTimeout(typeNext, 10 + Math.random() * 30); // Typing speed
      } else {
        full += "\n\n";
        setPendingMessage(full);
        pIdx++;
        cIdx = 0;
        setTimeout(typeNext, 250); // Pause between paragraphs
      }
    }
    typeNext();
  }

  const stagedStep3Message = `I'm built using the latest AI model from ChatGPT — feel free to chat with me just like you would with a person! I can answer most questions about structured settlements and our process.\n\nWould you like to:\n• Chat with me now\n• Connect with one of our team members\n• Or give us a call anytime at (954) 764-9750?`;

  const sendMessage = async () => {
    if (!input.trim()) return;
    if (isAssociateRequest(input)) {
      setMessages([...messages, { role: 'user', content: input }]);
      setInput("");
      setTyping(true);
      setTimeout(() => {
        setMessages(msgs => [...msgs, { role: 'assistant', content: "Sure! Please hold on for a moment while I connect you…" }]);
        setTyping(false);
        setPendingMessage(null);
        playNotificationSound();
      }, 1200 + Math.random() * 600);
      return;
    }
    setChattedBefore();
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTyping(true);
    setPendingMessage(null);
    maybeLogAssociateRequest(input);
    // Detect trigger for upload
    const uploadTriggers = [
      'move forward',
      'speak with associate',
      'talk to an associate',
      'send documents',
      'upload documents',
      'proceed',
      'ready to upload',
      'send paperwork',
      'send my docs',
      'send my documents',
      'submit documents',
      'submit paperwork',
    ];
    if (
      !showUpload &&
      uploadTriggers.some(t => input.toLowerCase().includes(t))
    ) {
      setShowUpload(true);
      setTimeout(() => {
        setMessages(msgs => [
          ...msgs,
          {
            role: 'assistant',
            content:
              "You can securely upload any required documents when you're ready. Just use the button below — supported formats: PDF, JPG, PNG, DOCX."
          }
        ]);
      }, 400);
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: mintSystemPrompt
            },
            ...newMessages.map(({ role, content }) => ({ role, content }))
          ],
        }),
      });
      const data = await res.json();
      const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
      // Simulate 'Mint is typing...' for 1–2 seconds
      setTimeout(() => {
        // Then type out the message
        const paragraphs = splitIntoParagraphs(aiMessage);
        typeMessage(paragraphs, (full) => {
          setMessages([...newMessages, { role: "assistant", content: full.replace(/\|$/, "") }]);
          setTyping(false);
          setPendingMessage(null);
        });
      }, 1000 + Math.random() * 800);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was an error." }]);
      setTyping(false);
      setPendingMessage(null);
    } finally {
      setLoading(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // File upload handler
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files[0]) return;
    const file = files[0];
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      alert('Only PDF, JPG, PNG, and DOCX files are allowed.');
      return;
    }
    setUploading(true);
    try {
      const sessionId = getSessionId() || 'unknown';
      const fileRef = storageRef(storage, `chat_uploads/${sessionId}_${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      await addDoc(collection(db, 'chat_uploads'), {
        sessionId,
        fileName: file.name,
        fileUrl: url,
        timestamp: serverTimestamp(),
      });
      setMessages(msgs => [
        ...msgs,
        { role: 'assistant', content: "Thank you — we've received your document!" }
      ]);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setShowUpload(false);
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typing, pendingMessage]);

  // Helper: Format timestamp for transcript
  function formatTimestamp(date: Date) {
    return format(date, 'hh:mm a');
  }

  // Download transcript handler
  function handleDownloadTranscript() {
    const now = new Date();
    const filename = `mint_chat_transcript_${format(now, 'yyyy-MM-dd_HH-mm')}_${sessionId}.txt`;
    let transcript = '';
    let lastTime = now;
    messages.forEach((msg, idx) => {
      // Try to estimate time for each message (not perfect, but gives context)
      if (idx === 0) lastTime = now;
      else lastTime = new Date(lastTime.getTime() + 60000); // +1 min per message
      const time = formatTimestamp(lastTime);
      const who = msg.role === 'assistant' ? 'Mint' : 'User';
      transcript += `[${time}] ${who}: ${msg.content.replace(/\n+/g, ' ')}\n`;
    });
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Smart connect/agent handler
  const associateTriggers = [
    'connect me', 'talk to a person', 'agent', 'representative', 'team member', 'specialist', 'yes', 'real person', 'human', 'associate', 'call', 'speak to', 'speak with', 'customer service'
  ];
  function isAssociateRequest(text: string) {
    const normalized = text.toLowerCase();
    return associateTriggers.some(t => normalized.includes(t));
  }

  // On mount, clear any old suggestedReplies or related keys from localStorage/sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('suggestedReplies');
      window.sessionStorage.removeItem('suggestedReplies');
    }
  }, []);

  // Restore chat history from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem('mintChat_messages');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setMessages(parsed);
        } catch {}
      }
    }
  }, []);

  // Persist chat history to sessionStorage on every change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('mintChat_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Restore staged flow useEffect(s)
  useEffect(() => {
    // Only run staged flow if no messages yet
    if (messages.length === 0 && stagedMessages.length === 0) {
      // Step 1: Greeting
      setStagedTyping(true);
      const greeting = "Hi there! I'm Mint, SmarterPayouts' AI assistant. Would you like to see how much your settlement payments are worth today?";
      let greetingTimeout = setTimeout(() => {
        setStagedMessages([{ role: 'assistant', content: greeting }]);
        setStagedTyping(false);
        setStagedGreetingDone(true);
      }, 1000);
      // Step 2: Calculator CTA
      let ctaTimeout = setTimeout(() => {
        setStagedShowTyping(true);
        setTimeout(() => {
          setStagedShowTyping(false);
          setStagedMessages(msgs => [...msgs, { role: 'assistant', content: 'Try our industry-first Online Early Payout Calculator.\nNo personal information required — guaranteed.', cta: true }]);
          setStagedCTADone(true);
        }, 1250);
      }, 2250);
      // Step 3: Follow-up topics
      let followupTimeout = setTimeout(() => {
        setStagedShowTyping(true);
        setTimeout(() => {
          setStagedShowTyping(false);
          setStagedMessages(msgs => [...msgs, { role: 'assistant', content: 'If you\'d like, I can help you with these topics:', followup: true }]);
          setStagedFollowupDone(true);
        }, 1500);
      }, 4500);
      // Step 4: Step 3 message (after 2s pause from Step 3, total 15s from open)
      let step3Timeout = setTimeout(() => {
        setStagedShowStep3Typing(true);
        setTimeout(() => {
          setStagedShowStep3Typing(false);
          setStagedMessages(msgs => [...msgs, { role: 'assistant', content: stagedStep3Message, step3: true }]);
          setStagedStep3Done(true);
          playNotificationSound();
        }, 1750);
      }, 13000); // 13s (end of Step 3) + 2s = 15s total
      return () => {
        clearTimeout(greetingTimeout);
        clearTimeout(ctaTimeout);
        clearTimeout(followupTimeout);
        clearTimeout(step3Timeout);
      };
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 340,
        height: 620,
        maxWidth: "95vw",
        zIndex: 1100,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1.5px solid #09b44d",
        // Responsive width for mobile
        ...(typeof window !== 'undefined' && window.innerWidth < 600 ? { width: '90vw' } : {})
      }}
      role="dialog"
      aria-modal="true"
      aria-label="SmarterPayouts Chatbot"
    >
      <div style={{ position: 'relative', background: "#09b44d", color: "#fff", padding: "12px 18px", fontWeight: 600, fontSize: 18 }}>
        <span id="chat-header" tabIndex={0} aria-label="Chat with Us">💬 Chat with Us</span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              position: 'absolute',
              top: 8,
              right: 10,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 700,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { onClose(); } }}
          >
            <span style={{fontSize: 20, marginRight: 4}}>×</span> Close
          </button>
        )}
      </div>
      <div
        style={{ flex: 1, padding: 16, height: 440, overflowY: "auto", background: "#f8f9fa" }}
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions text"
        tabIndex={0}
      >
        {/* --- Staged greeting/CTA flow --- */}
        {!hasChattedBefore() && stagedMessages.length > 0 ? (
          <>
            {stagedMessages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: "left", display: 'flex', alignItems: 'flex-start' }}>
                <span className="mint-avatar" style={{ marginTop: 0, marginRight: 8 }}>M</span>
                {msg.cta ? (
                  <span
                    style={{
                      background: '#e9f9f1',
                      color: '#222',
                      borderRadius: 12,
                      padding: '16px 18px',
                      fontWeight: 400,
                      fontSize: 16,
                      marginTop: 0,
                      marginBottom: 2,
                      boxShadow: '0 1px 4px #09b44d11',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.5,
                      maxWidth: '80%',
                      minWidth: 0,
                      display: 'inline-block',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Try our industry-first{' '}
                    <a
                      href="/pricing-calculator"
                      style={{
                        color: '#09b44d',
                        fontWeight: 600,
                        textDecoration: 'underline',
                        transition: 'color 0.15s',
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={0}
                      aria-label="Online Early Payout Calculator (opens in new tab)"
                      onMouseOver={e => { e.currentTarget.style.color = '#0d6b3c'; }}
                      onMouseOut={e => { e.currentTarget.style.color = '#09b44d'; }}
                    >
                      Online Early Payout Calculator
                    </a>
                    .<br/>
                    No personal information required — guaranteed.
                  </span>
                ) : msg.followup ? (
                  <span style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#222",
                    borderRadius: 12,
                    padding: "8px 14px",
                    maxWidth: "80%",
                    fontSize: 15,
                    boxShadow: "0 1px 4px #0001",
                    whiteSpace: 'pre-line',
                    verticalAlign: 'middle',
                  }}>
                    {msg.content}
                    <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {followupTopics.map((topic: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setInput(topic)}
                          style={{
                            border: 'none',
                            background: '#e9f9f1',
                            color: '#198754',
                            borderRadius: 20,
                            padding: '9px 20px',
                            fontSize: 14,
                            fontWeight: 500,
                            marginBottom: 0,
                            cursor: 'pointer',
                            boxShadow: '0 1px 4px #09b44d11',
                            transition: 'background 0.15s, color 0.15s',
                            outline: 'none',
                          }}
                          tabIndex={0}
                          aria-label={topic}
                          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setInput(topic); } }}
                          onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px #09b44d55'; }}
                          onBlur={e => { e.currentTarget.style.boxShadow = '0 1px 4px #09b44d11'; }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = '#d1f7e6';
                            e.currentTarget.style.color = '#0d6b3c';
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = '#e9f9f1';
                            e.currentTarget.style.color = '#198754';
                          }}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </span>
                ) : msg.step3 ? (
                  <span style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#222",
                    borderRadius: 12,
                    padding: "8px 14px",
                    maxWidth: "80%",
                    fontSize: 15,
                    boxShadow: "0 1px 4px #0001",
                    whiteSpace: 'pre-line',
                    verticalAlign: 'middle',
                  }}>
                    {msg.content.split(/(\(954\) 764-9750)/g).map((part, idx) =>
                      part === "(954) 764-9750" ? (
                        <a key={idx} href="tel:+19547649750" style={{ color: '#09b44d', fontWeight: 600, textDecoration: 'underline' }}>(954) 764-9750</a>
                      ) : part
                    )}
                  </span>
                ) : (
                  <span style={{
                    display: "inline-block",
                    background: "#fff",
                    color: "#222",
                    borderRadius: 12,
                    padding: "8px 14px",
                    maxWidth: "80%",
                    fontSize: 15,
                    boxShadow: "0 1px 4px #0001",
                    whiteSpace: 'pre-line',
                    verticalAlign: 'middle'
                  }}>{msg.content}</span>
                )}
              </div>
            ))}
            {/* Typing indicator for staged flow */}
            {stagedShowTyping && (
              <div style={{ marginBottom: 10, textAlign: 'left', display: 'flex', alignItems: 'flex-start' }}>
                <span className="mint-avatar" style={{ marginTop: 0, marginRight: 8 }}>M</span>
                <span style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#198754',
                  borderRadius: 12,
                  padding: '8px 14px',
                  fontSize: 15,
                  fontStyle: 'italic',
                  boxShadow: '0 1px 4px #09b44d11',
                  maxWidth: '80%',
                  verticalAlign: 'middle',
                  letterSpacing: 1.5,
                }}>
                  <span className="mint-typing-dots" style={{ display: 'inline-block', minWidth: 24 }}>
                    <span className="dot" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="dot" style={{ animationDelay: '150ms' }}>.</span>
                    <span className="dot" style={{ animationDelay: '300ms' }}>.</span>
                  </span>
                </span>
              </div>
            )}
            {stagedTyping && stagedPending && (
              <div style={{ marginBottom: 10, textAlign: 'left', display: 'block' }}>
                <span className="mint-avatar">M</span>
                <span style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#222',
                  borderRadius: 12,
                  padding: '8px 14px',
                  maxWidth: '80%',
                  fontSize: 15,
                  boxShadow: '0 1px 4px #0001',
                  whiteSpace: 'pre-line',
                  verticalAlign: 'middle'
                }}>{stagedPending.replace(/\|$/, '')}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 10, textAlign: msg.role === "user" ? "right" : "left", display: 'block' }}>
                {msg.role === "assistant" && (
                  <span className="mint-avatar">M</span>
                )}
                <span className={i === messages.length - 1 ? "chat-bubble-animate" : ""} style={{
                  display: "inline-block",
                  background: msg.role === "user" ? "#e9f9f1" : "#fff",
                  color: "#222",
                  borderRadius: 12,
                  padding: "8px 14px",
                  maxWidth: "80%",
                  fontSize: 15,
                  boxShadow: msg.role === "user" ? "0 1px 4px #09b44d22" : "0 1px 4px #0001",
                  verticalAlign: 'middle'
                }}>{msg.role === "assistant"
                  ? <>{(() => {
                    const paragraphs = splitIntoParagraphs(msg.content);
                    return <>
                      {renderAssistantParagraphs(paragraphs)}
                      {shouldAppendCalculatorCTA(paragraphs) && <span style={{ display: 'block', marginTop: 10 }} dangerouslySetInnerHTML={{ __html: CALCULATOR_CTA }} />}
                    </>;
                  })()}</>
                  : msg.content}
                </span>
                {showUpload && !uploading && (
                  <div style={{ marginTop: 10, marginLeft: 32 }}>
                    <label htmlFor="chat-upload-input" style={{
                      background: '#e9f9f1',
                      color: '#198754',
                      borderRadius: 8,
                      padding: '7px 18px',
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: 'pointer',
                      border: '1.5px solid #09b44d',
                      boxShadow: '0 1px 4px #09b44d11',
                      display: 'inline-block',
                    }}>
                      Upload Documents
                      <input
                        id="chat-upload-input"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        tabIndex={0}
                        aria-label="Upload documents"
                      />
                    </label>
                  </div>
                )}
                {uploading && (
                  <div style={{ marginTop: 10, marginLeft: 32, color: '#198754', fontWeight: 500 }}>Uploading…</div>
                )}
              </div>
            ))}
          </>
        )}
        {/* Typing indicator and typing effect */}
        {typing && (
          <div style={{ marginBottom: 10, textAlign: 'left', display: 'block' }}>
            <span className="mint-avatar">M</span>
            <span style={{
              display: 'inline-block',
              background: '#fff',
              color: '#198754',
              borderRadius: 12,
              padding: '8px 14px',
              fontSize: 15,
              fontStyle: 'italic',
              boxShadow: '0 1px 4px #09b44d11',
              maxWidth: '80%',
              verticalAlign: 'middle'
            }}>
              Mint is typing...
            </span>
          </div>
        )}
        {pendingMessage && (
          <div style={{ marginBottom: 10, textAlign: 'left', display: 'block' }}>
            <span className="mint-avatar">M</span>
            <span className="chat-bubble-animate" style={{
              display: 'inline-block',
              background: '#fff',
              color: '#222',
              borderRadius: 12,
              padding: '8px 14px',
              maxWidth: '80%',
              fontSize: 15,
              boxShadow: '0 1px 4px #0001',
              whiteSpace: 'pre-line',
              verticalAlign: 'middle'
            }}>
              {(() => {
                const paragraphs = splitIntoParagraphs(pendingMessage.replace(/\|$/, ''));
                return <>
                  {renderAssistantParagraphs(paragraphs)}
                  {shouldAppendCalculatorCTA(paragraphs) && <span style={{ display: 'block', marginTop: 10 }} dangerouslySetInnerHTML={{ __html: CALCULATOR_CTA }} />}
                </>;
              })()}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #eee", padding: 10, background: "#fff" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, border: "none", outline: "none", fontSize: 15, padding: 8, background: "#f8f9fa", borderRadius: 8 }}
          disabled={loading || stagedTyping}
          aria-label="Type your message"
          tabIndex={0}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || stagedTyping}
          style={{ marginLeft: 8, background: "#09b44d", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 15, cursor: loading || stagedTyping ? "not-allowed" : "pointer" }}
          aria-label="Send message"
          tabIndex={0}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !loading && input.trim() && !stagedTyping) { sendMessage(); } }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      {/* Footer branding */}
      <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', padding: '6px 0 8px 0', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        Powered by Smarter Payouts
      </div>
      <div style={{ textAlign: 'center', fontSize: 13, color: '#198754', padding: '4px 0 2px 0' }}>
        <button
          onClick={handleDownloadTranscript}
          style={{
            background: 'none',
            border: 'none',
            color: '#198754',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            padding: 0,
            margin: 0,
          }}
          aria-label="Download chat transcript"
        >
          Download Chat Transcript
        </button>
      </div>
      <style>{`
        .mint-cta-block {
          background: #f6faf7;
          border-radius: 12px;
          padding: 14px 16px 12px 16px;
          margin-top: 12px;
          margin-bottom: 2px;
          display: block;
          font-size: 15px;
          box-shadow: 0 1px 4px #09b44d11;
          max-width: 100%;
        }
        .mint-cta-header {
          font-weight: 700;
          font-size: 15.5px;
          margin-bottom: 6px;
          color: #198754;
        }
        .mint-cta-body {
          font-size: 15px;
          color: #222;
        }
        .mint-cta-link {
          color: #09b44d;
          font-weight: 600;
          text-decoration: underline;
          transition: color 0.15s;
        }
        .mint-cta-link:hover, .mint-cta-link:focus {
          color: #0d6b3c;
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .mint-cta-block {
            padding: 12px 8px 10px 8px;
            font-size: 14.5px;
          }
          .mint-cta-header {
            font-size: 14.5px;
          }
          .mint-cta-body {
            font-size: 14px;
          }
        }
        /* Chat bubble fade-in animation */
        .chat-bubble-animate {
          animation: chatBubbleFadeIn 0.44s cubic-bezier(.33,1.02,.57,1) both;
        }
        @keyframes chatBubbleFadeIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.98); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Mint avatar styles */
        .mint-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #09b44d;
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          margin-right: 8px;
          vertical-align: middle;
          box-shadow: 0 1px 4px #09b44d11;
        }
        @media (max-width: 600px) {
          .mint-avatar { width: 20px; height: 20px; font-size: 12.5px; margin-right: 6px; }
        }
        .mint-typing-dots .dot {
          display: inline-block;
          font-size: 22px;
          font-weight: 700;
          opacity: 0.7;
          animation: mintTypingBlink 1.1s infinite both;
        }
        .mint-typing-dots .dot:nth-child(2) { animation-delay: 0.18s; }
        .mint-typing-dots .dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes mintTypingBlink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  );
} 