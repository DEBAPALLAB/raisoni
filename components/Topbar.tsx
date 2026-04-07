'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTokens } from '@/context/TokenContext';
import Avatar from './Avatar';
import StreakPopover from './StreakPopover';

interface TopbarProps {
  onAskDoubt: () => void;
}

export default function Topbar({ onAskDoubt }: TopbarProps) {
  const { balance } = useTokens();
  const [showStreak, setShowStreak] = useState(false);

  return (
    <header style={{
      height: 72,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 32px',
      gap: 40,
      zIndex: 50,
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* ── Brand ─────────────────────────────────────────── */}
      <Link
        href="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{
          width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          fontFamily: 'Outfit', fontWeight: 800, fontSize: 18,
        }}>S</div>
        <div className="font-outfit" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Solvi
        </div>
      </Link>

      {/* ── Search ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', maxWidth: 600 }}>
        <div style={{
          width: '100%', position: 'relative', display: 'flex', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            placeholder="Search keywords, topics, or subtopics..."
            style={{
              width: '100%', height: 44, padding: '0 16px 0 44px',
              background: '#F1F5F9', border: '1px solid transparent', borderRadius: 12,
              fontSize: 14, outline: 'none', transition: 'all 0.2s',
            }}
          />
        </div>
      </div>

      {/* ── Right Actions ──────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: 'auto' }}>
        {/* Streak Flame */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowStreak(!showStreak)}
            className={`pill-btn ${showStreak ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}
          >
            <span style={{ fontSize: 18 }}>🔥</span>
            <span style={{ fontWeight: 700 }}>7</span>
          </button>
          
          {showStreak && (
            <div style={{ position: 'absolute', top: '120%', right: 0, zIndex: 100 }}>
              <StreakPopover onClose={() => setShowStreak(false)} />
            </div>
          )}
        </div>

        {/* Tokens / Rewards */}
        <Link 
          href="/rewards"
          style={{ textDecoration: 'none' }}
        >
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px',
            background: 'rgba(79, 70, 229, 0.08)', borderRadius: 12, border: '1px solid rgba(79, 70, 229, 0.15)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8"/><path d="M12 7v10M8 12h8"/>
            </svg>
            <span style={{ fontWeight: 800, color: 'var(--accent-primary)', fontSize: 15 }}>{balance}</span>
          </div>
        </Link>

        {/* Action Button */}
        <button 
          onClick={onAskDoubt}
          style={{
            background: 'var(--text-primary)', color: '#fff', border: 'none',
            borderRadius: 12, padding: '10px 24px', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
          }}
        >
          Ask Question
        </button>

        <Avatar name="Julian V." />
      </div>
    </header>
  );
}
