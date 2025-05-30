"use client";
import { useState, useRef, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MyChatComponent({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Mint, the AI chatbot for Smarter Payouts. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: number]: boolean }>({});

  const suggestedReplies = [
    "How do structured settlements work?",
    "Can I get a lump sum for my payments?",
    "How fast can I get a quote?",
    "What documents do I need?",
    "Is there a fee to sell my structured settlement?",
    "Do you require personal info for a quote?",
    "Where is your company located?",
    "Is SmarterPayouts a trusted and verified company?",
    "What makes SmarterPayouts different?"
  ];

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

  // Helper: Split Mint's response into paragraphs (2-3 max for long answers)
  function splitIntoParagraphs(text: string): string[] {
    // Prefer double newlines, fallback to splitting on sentences
    if (text.includes("\n\n")) {
      return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
    }
    // Otherwise, split into sentences and group into paragraphs
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const paragraphs: string[] = [];
    let current = "";
    for (let i = 0; i < sentences.length; i++) {
      current += sentences[i].trim() + " ";
      if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
        paragraphs.push(current.trim());
        current = "";
      }
    }
    return paragraphs;
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setTyping(true);
    setPendingMessage(null);
    maybeLogAssociateRequest(input);
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
              content: `You are Mint, an AI-driven chatbot for SmarterPayouts, a Florida-based structured settlement company that helps customers sell their future structured settlement payments for a lump sum. You are friendly, accurate, and always helpful.

You assist users by providing clear, up-to-date information about:
- How structured settlements work
- The process of selling structured settlement payments
- How to get a quote (users can call, use the online calculator for an instant quote with no personal info required, or chat with Mint)
- What happens after accepting an offer (application, required documents, court approval, and payout)
- How fast they can receive a quote and their funds (most clients receive funds within 24–72 hours after court approval)
- Required documents (none needed for a quote; only needed if proceeding)
- Fees or costs involved (there are no fees to get a quote or start the process)
- Legal considerations (general info, not legal advice)
- The fact that no personal information is required to get an estimate
- Typical timelines and payout process (the full process usually takes 30–45 days, but expedited options are available)
- That all transactions are court-approved for the customer's protection
- That users can sell all or just part of their structured settlement, depending on their needs
- SmarterPayouts' credentials, experience, and customer trust

You do NOT ask for sensitive personal information (such as SSN, bank details) during the chat.

You always make it clear that a free, no-obligation estimate is available, and personal info is only required later if the customer wishes to proceed.

Always be professional, helpful, and friendly. Do not provide legal or tax advice.

If you don't know the answer, say: 'I recommend speaking with one of our human specialists for that question.'

Always include these disclaimers in relevant conversations:
- "We do not provide legal advice. The information provided is based on current rates and offers, which may change."
- "We never sell or rent your personal information."

For all key topics (such as company information, process, fees, or documents), format your answers as short, clear paragraphs (1–2 sentences each), separated by a blank line (double newline). After providing the main information, always end with this professional closing:

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.

If the user asks any of the following questions, answer as follows (using the same paragraph formatting and closing):
- Where is your company located?\nWe are a Florida-based company, in business for 7 years, and registered with the Better Business Bureau.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- Is SmarterPayouts a trusted and verified company?\nYes! SmarterPayouts is fully registered in Florida, listed on SunBiz, and verified by the Better Business Bureau. We are committed to transparency and client trust.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- What makes SmarterPayouts different?\nWe offer instant online quotes, a 100% digital process, and never use pushy sales tactics. Our focus is on transparency and your comfort.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- How can I contact you?\nYou can reach us by phone at (954) 764-9750, by email at info@smarterpayouts.com, or by visiting our office at 433 Plaza Real, Suite 275, Boca Raton, FL 33432. You can also use this chat or our contact form, and our team will respond within 24 hours on business days.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- What is your phone number?\nOur phone number is (954) 764-9750. You can call us Monday–Friday, 9am–6pm EST, or use this chat for assistance.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- Where is your office?\nOur office is located at 433 Plaza Real, Suite 275, Boca Raton, FL 33432. You can also contact us by phone or chat.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.
- Where are you located?\nWe are based in Boca Raton, Florida. Our office address is 433 Plaza Real, Suite 275, Boca Raton, FL 33432. Feel free to call us at (954) 764-9750 or use this chat for help.

If you'd like to speak with one of our Settlement Client Relations Associates, just let me know! You can also call us anytime at (954) 764-9750.`
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typing, pendingMessage]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 340,
        height: 520,
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
              ? <>{
                  (() => {
                    const paragraphs = splitIntoParagraphs(msg.content);
                    return <>
                      {renderAssistantParagraphs(paragraphs)}
                      {shouldAppendCalculatorCTA(paragraphs) && <span style={{ display: 'block', marginTop: 10 }} dangerouslySetInnerHTML={{ __html: CALCULATOR_CTA }} />}
                    </>;
                  })()
                }</>
              : msg.content}
            </span>
            {/* Feedback buttons for Mint replies except the initial greeting */}
            {msg.role === "assistant" && i !== 0 && !feedbackGiven[i] && (
              <div style={{ marginTop: 6, marginLeft: 32, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                <span style={{ color: '#888', marginRight: 4 }}>Was this helpful?</span>
                <button
                  aria-label="Helpful"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#09b44d', fontSize: 18, padding: 2, transition: 'color 0.15s' }}
                  onClick={() => setFeedbackGiven(f => ({ ...f, [i]: true }))}
                  onMouseOver={e => (e.currentTarget.style.color = '#0d6b3c')}
                  onMouseOut={e => (e.currentTarget.style.color = '#09b44d')}
                >👍</button>
                <button
                  aria-label="Not helpful"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 18, padding: 2, transition: 'color 0.15s' }}
                  onClick={() => setFeedbackGiven(f => ({ ...f, [i]: true }))}
                  onMouseOver={e => (e.currentTarget.style.color = '#b00020')}
                  onMouseOut={e => (e.currentTarget.style.color = '#888')}
                >👎</button>
              </div>
            )}
            {msg.role === "assistant" && i !== 0 && feedbackGiven[i] && (
              <div style={{ marginTop: 6, marginLeft: 32, color: '#198754', fontSize: 13.5, fontWeight: 500 }}>Thank you for your feedback!</div>
            )}
            {/* Show pill buttons only after the initial assistant message and only for the first message */}
            {i === 0 && msg.role === "assistant" && (
              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {suggestedReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInput(reply)}
                    style={{
                      border: 'none',
                      background: '#e9f9f1',
                      color: '#198754',
                      borderRadius: 20,
                      padding: '7px 16px',
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 4,
                      cursor: 'pointer',
                      boxShadow: '0 1px 4px #09b44d11',
                      transition: 'background 0.15s, color 0.15s',
                      outline: 'none',
                    }}
                    tabIndex={0}
                    aria-label={reply}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setInput(reply); } }}
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
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
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
          disabled={loading}
          aria-label="Type your message"
          tabIndex={0}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{ marginLeft: 8, background: "#09b44d", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 600, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}
          aria-label="Send message"
          tabIndex={0}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !loading && input.trim()) { sendMessage(); } }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
      {/* Footer branding */}
      <div style={{ textAlign: 'center', fontSize: 12, color: '#aaa', padding: '6px 0 8px 0', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        Powered by Smarter Payouts
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
      `}</style>
    </div>
  );
} 