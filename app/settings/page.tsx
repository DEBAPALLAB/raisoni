'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import AskDoubtModal from '@/components/AskDoubtModal';
import { useAuth } from '@/context/AuthContext';
import { SUBJECT_COLORS, SUBJECT_LABELS, type Subject } from '@/data/seed';

type SettingsState = {
  emailDigest: boolean;
  answerAlerts: boolean;
  anonymousByDefault: boolean;
  compactMode: boolean;
  graphMotion: boolean;
  privacyMode: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
  emailDigest: true,
  answerAlerts: true,
  anonymousByDefault: false,
  compactMode: false,
  graphMotion: true,
  privacyMode: false,
};

const STORAGE_KEY = 'ethereal_settings';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [settings, setSettings] = useState<SettingsState>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [lastSaved, setLastSaved] = useState('Saved locally');

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setLastSaved('Saved locally');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    setLastSaved('Reset to defaults');
  };

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'solvi-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    setLastSaved('Exported settings');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar
          activeFilters={activeFilters}
          onFilterToggle={(subject) =>
            setActiveFilters((prev) =>
              prev.includes(subject) ? prev.filter((item) => item !== subject) : [...prev, subject]
            )
          }
        />

        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '32px',
            background:
              'radial-gradient(circle at top left, rgba(79,70,229,0.08), transparent 28%), radial-gradient(circle at top right, rgba(245,158,11,0.06), transparent 24%), var(--bg-base)',
          }}
        >
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                marginBottom: 28,
              }}
            >
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>
                  SETTINGS
                </div>
                <h1
                  className="font-outfit"
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Preferences & Controls
                </h1>
                <p style={{ marginTop: 10, color: 'var(--text-secondary)', maxWidth: 720, lineHeight: 1.7 }}>
                  Tune how Solvi behaves for you. These settings are stored locally in this browser
                  so the page remains functional even without a backend.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Badge variant="green">{lastSaved}</Badge>
                <button
                  className="btn-pill btn-pill-ghost"
                  onClick={() => {
                    logout();
                    router.push('/login');
                  }}
                  style={{ height: 44, padding: '0 16px' }}
                >
                  Sign out
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 24, marginBottom: 24 }}>
              <section className="card-premium" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Avatar name={currentUser.name} color={currentUser.color} size={72} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h2 className="font-outfit" style={{ fontSize: 24, fontWeight: 800 }}>
                        {currentUser.name}
                      </h2>
                      <Badge variant="violet">{currentUser.role}</Badge>
                    </div>
                    <div className="section-label" style={{ marginTop: 6 }}>
                      SETTINGS APPLIED TO THIS PROFILE
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
                  {currentUser.expertise.map((subject) => (
                    <span
                      key={subject}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        borderRadius: 999,
                        background: `${SUBJECT_COLORS[subject]}12`,
                        color: SUBJECT_COLORS[subject],
                        border: `1px solid ${SUBJECT_COLORS[subject]}30`,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: SUBJECT_COLORS[subject] }} />
                      {SUBJECT_LABELS[subject]}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 22 }}>
                  <MiniStat label="Reputation" value={currentUser.reputation.toString()} />
                  <MiniStat label="Theme" value={settings.compactMode ? 'Compact' : 'Comfort'} />
                  <MiniStat label="Privacy" value={settings.privacyMode ? 'On' : 'Off'} />
                </div>
              </section>

              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 14 }}>
                  QUICK ACTIONS
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button className="nav-item" onClick={exportSettings} style={{ width: '100%', textAlign: 'left' }}>
                    Export local settings
                  </button>
                  <button className="nav-item" onClick={resetSettings} style={{ width: '100%', textAlign: 'left' }}>
                    Reset to defaults
                  </button>
                  <Link href="/graph" className="nav-item" style={{ textDecoration: 'none' }}>
                    Open graph
                  </Link>
                  <Link href="/library" className="nav-item" style={{ textDecoration: 'none' }}>
                    Browse library
                  </Link>
                </div>
              </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 16 }}>
                  NOTIFICATIONS
                </div>
                <ToggleRow
                  label="Answer alerts"
                  description="Notify me when my questions receive answers."
                  checked={settings.answerAlerts}
                  onChange={(value) => update('answerAlerts', value)}
                />
                <ToggleRow
                  label="Daily digest"
                  description="Send a summary of activity at the end of the day."
                  checked={settings.emailDigest}
                  onChange={(value) => update('emailDigest', value)}
                />
                <ToggleRow
                  label="Anonymous by default"
                  description="Open new doubts anonymously unless I change it."
                  checked={settings.anonymousByDefault}
                  onChange={(value) => update('anonymousByDefault', value)}
                />
              </section>

              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 16 }}>
                  APPEARANCE & PRIVACY
                </div>
                <ToggleRow
                  label="Compact mode"
                  description="Tighten spacing for denser dashboards and lists."
                  checked={settings.compactMode}
                  onChange={(value) => update('compactMode', value)}
                />
                <ToggleRow
                  label="Graph motion"
                  description="Keep animated transitions active in the knowledge graph."
                  checked={settings.graphMotion}
                  onChange={(value) => update('graphMotion', value)}
                />
                <ToggleRow
                  label="Privacy mode"
                  description="Reduce visible profile signals in shared surfaces."
                  checked={settings.privacyMode}
                  onChange={(value) => update('privacyMode', value)}
                />
              </section>
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <AskDoubtModal
          onClose={() => setShowModal(false)}
          onAddNode={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 16,
        padding: 16,
      }}
    >
      <div className="section-label" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div className="font-outfit" style={{ fontSize: 22, fontWeight: 800 }}>
        {value}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 18,
        padding: '14px 0',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div style={{ paddingRight: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: 4 }}>
          {description}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        style={{
          width: 54,
          height: 30,
          borderRadius: 999,
          border: '1px solid var(--border-mid)',
          background: checked ? 'var(--accent-primary)' : 'var(--bg-base)',
          display: 'flex',
          alignItems: 'center',
          padding: 3,
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(24px)' : 'translateX(0)',
            transition: 'transform 0.2s ease',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.12)',
          }}
        />
      </button>
    </div>
  );
}
