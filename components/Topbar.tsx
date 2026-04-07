'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTokens } from '@/context/TokenContext';
import StreakPopover from './StreakPopover';

interface TopbarProps {
  onAskDoubt: () => void;
}

export default function Topbar({ onAskDoubt }: TopbarProps) {
  const pathname = usePathname();
  const { balance } = useTokens();

  const navItems = [
    { label: 'Library', href: '/library' },
    { label: 'Graph', href: '/graph' },
    { label: 'Pathways', href: '/pathways' },
  ];

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
         <div style={{
           width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 10,
           display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
           fontFamily: 'Outfit', fontWeight: 800, fontSize: 18,
         }}>S</div>
         <div className="font-outfit" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
           Solvi
         </div>
      </div>

      {/* ── Search ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', maxWidth: 600 }}>
        <div style={{
          width: '100%', position: 'relative', display: 'flex', alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            placeholder="Search the lexicon..."
            className="input-premium"
            style={{
              width: '100%', paddingLeft: 44, height: 44, fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
        {/* Streak Button */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowStreak(!showStreak)}
            className="btn-pill btn-pill-ghost"
            style={{ 
              height: 44, padding: '0 16px', gap: 6,
              background: showStreak ? 'var(--bg-accent-soft)' : undefined,
              color: showStreak ? 'var(--accent-primary)' : undefined,
            }}
          >
            <span style={{ fontSize: 16 }}>🔥</span>
            <span style={{ fontWeight: 700 }}>14</span>
          </button>
          
          {showStreak && (
            <StreakPopover onClose={() => setShowStreak(false)} />
          )}
        </div>

        {/* Token Balance */}
        <Link href="/rewards" style={{ textDecoration: 'none' }}>
          <div className="hover-glow" style={{ 
            display: 'flex', alignItems: 'center', gap: 8, 
            padding: '8px 16px', background: 'var(--bg-accent-soft)', 
            border: '1px solid #E0E7FF', borderRadius: 99,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <span style={{ color: 'var(--accent-warning)', fontSize: 14 }}>✦</span>
            <span className="font-inter" style={{ fontSize: 14, color: 'var(--accent-primary)', fontWeight: 700 }}>
              {balance}
            </span>
          </div>
        </Link>

        <button
          onClick={onAskDoubt}
          className="btn-pill btn-pill-primary"
          style={{ height: 44, padding: '0 24px' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>
          Ask Doubt
        </button>

        <div style={{ width: 1, height: 32, background: 'var(--border-subtle)' }} />

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            border: '2px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}>
             <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Alex" alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
}
