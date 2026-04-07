'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Subject } from '@/data/seed';

interface SidebarProps {
  activeFilters: Subject[];
  onFilterToggle: (subject: Subject) => void;
}

const SUBJECT_PILLS: Array<{ key: Subject; label: string; color: string }> = [
  { key: 'quantum', label: 'Quantum Mechanics', color: 'var(--node-quantum)' },
  { key: 'math',    label: 'Topology (Math)',     color: 'var(--node-math)'    },
  { key: 'bio',     label: 'Biotechnology',      color: 'var(--node-bio)'     },
  { key: 'cs',      label: 'Computer Science',   color: 'var(--node-cs)'      },
];

const NavIcon = ({ children }: { children: React.ReactNode }) => (
  <span style={{ opacity: 0.8, display: 'flex', alignItems: 'center' }}>{children}</span>
);

export default function Sidebar({ activeFilters, onFilterToggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Pulse', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', href: '/' },
    { label: 'Knowledge Graph', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', href: '/graph' },
    { label: 'Library', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20', href: '/library' },
    { label: 'Leaderboard', icon: 'M12 20V10M18 20V4M6 20v-4', href: '/leaderboard' },
  ];

  return (
    <aside style={{
      width: 260, minWidth: 260, height: '100%',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* ── Branding ── */}
      <div style={{ padding: '32px 24px' }}>
        <div className="font-outfit" style={{
          fontSize: 14, fontWeight: 900, letterSpacing: '0.25em',
          color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 10
        }}>
          <div style={{ 
            width: 24, height: 24, background: 'var(--accent-primary)', 
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14
          }}>S</div>
          SOLVI
        </div>
        <div style={{ 
          fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', 
          marginTop: 4, letterSpacing: '0.1em' 
        }}>LEXICON EXPLORER</div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
              <div 
                className="nav-item"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 12, marginBottom: 4,
                  background: isActive ? 'var(--bg-accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" 
                  stroke="currentColor" strokeWidth={isActive ? "2.5" : "2"} 
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d={item.icon} />
                </svg>
                <span style={{ 
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  letterSpacing: '-0.01em'
                }}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* ── Filter ──────────────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <div className="section-label" style={{
            paddingLeft: 12, marginBottom: 16,
          }}>
            Subjects
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SUBJECT_PILLS.map(({ key, label, color }) => {
              const active = activeFilters.includes(key);
              return (
                <button key={key} onClick={() => onFilterToggle(key)}
                  style={{
                    fontFamily: 'Inter, sans-serif', fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    padding: '10px 16px', borderRadius: 12, textAlign: 'left',
                    cursor: 'pointer', transition: 'all 200ms',
                    background: active ? `${color}15` : 'transparent',
                    border: '1px solid',
                    borderColor: active ? `${color}40` : 'transparent',
                    color: active ? color : 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Bottom ──────────────────────────────────────────── */}
      <div style={{ paddingTop: 24 }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div
            className="nav-item"
            style={{
              background: pathname === '/settings' ? 'var(--bg-accent-soft)' : 'transparent',
              color: pathname === '/settings' ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: pathname === '/settings' ? 700 : 500,
            }}
          >
            <NavIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </NavIcon>
            Settings
          </div>
        </Link>
      </div>
    </aside>
  );
}
