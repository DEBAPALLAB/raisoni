'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DEMO_ACCOUNTS, useAuth } from '@/context/AuthContext';
import { USERS, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';

const DEMO_USER = USERS.find((user) => user.id === 'u1') ?? USERS[0];
const SECOND_DEMO_USER = USERS.find((user) => user.id === 'u8') ?? USERS[0];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, login } = useAuth();
  const [loginId, setLoginId] = useState(DEMO_ACCOUNTS[0]?.loginId ?? '');
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0]?.password ?? '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nextPath = searchParams.get('next') || '/';

  useEffect(() => {
    if (isAuthenticated) router.replace(nextPath);
  }, [isAuthenticated, nextPath, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(loginId, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? 'Unable to sign in.');
      return;
    }

    router.replace(nextPath);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        background:
          'radial-gradient(circle at top left, rgba(79,70,229,0.18), transparent 30%), radial-gradient(circle at bottom right, rgba(16,185,129,0.14), transparent 26%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      }}
    >
      <section
        style={{
          padding: '56px 56px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 40,
        }}
      >
        <div>
          <div className="font-outfit" style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.2em' }}>
            SOLVI
          </div>
          <div className="section-label" style={{ marginTop: 8 }}>
            LEXICON EXPLORER
          </div>

          <h1
            className="font-outfit"
            style={{
              fontSize: 64,
              lineHeight: 0.95,
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginTop: 40,
              maxWidth: 640,
              letterSpacing: '-0.05em',
            }}
          >
            Sign in to your knowledge network
          </h1>

          <p style={{ marginTop: 20, fontSize: 18, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 560 }}>
            This prototype uses a hardcoded login for now. Once you sign in, the app unlocks
            profile, settings, graph, and discussion flows just like a real product.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
            {DEMO_USER.expertise.map((subject) => (
              <span
                key={subject}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: `${SUBJECT_COLORS[subject]}12`,
                  border: `1px solid ${SUBJECT_COLORS[subject]}30`,
                  color: SUBJECT_COLORS[subject],
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: SUBJECT_COLORS[subject] }} />
                {SUBJECT_LABELS[subject]}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, maxWidth: 560 }}>
          <InfoCard label="Demo accounts" value={`${DEMO_ACCOUNTS.length} available`} />
          <InfoCard label="Roles covered" value="Student + Expert" />
        </div>
      </section>

      <section style={{ padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="card-premium"
          style={{
            width: '100%',
            maxWidth: 460,
            padding: 32,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="section-label">WELCOME BACK</div>
              <h2 className="font-outfit" style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
                Login
              </h2>
            </div>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                background: 'var(--bg-accent-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                fontFamily: 'Outfit, sans-serif',
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              S
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="section-label">LOGIN ID</span>
              <input
                className="input-premium"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="alex.rivera"
                autoComplete="username"
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="section-label">PASSWORD</span>
              <input
                className="input-premium"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="solvi1234"
                autoComplete="current-password"
              />
            </label>

            {error && (
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#b91c1c',
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                {error}
              </div>
            )}

            <button
              className="btn-pill btn-pill-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', height: 48, marginTop: 8 }}
            >
              {loading ? 'Signing in...' : 'Enter Solvi'}
            </button>
          </form>

          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <span className="section-label">Prototype mode</span>
            <Link href={nextPath} style={{ fontSize: 13, color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 700 }}>
              Skip if already signed in
            </Link>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <PersonaCard user={DEMO_USER} />
            <PersonaCard user={SECOND_DEMO_USER} />
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="card-premium"
      style={{
        padding: 18,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(18px)',
      }}
    >
      <div className="section-label" style={{ marginBottom: 8 }}>
        {label}
      </div>
      <div className="font-outfit" style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function PersonaCard({ user }: { user: (typeof USERS)[number] }) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-base)',
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: `${user.color}18`,
            border: `1px solid ${user.color}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: user.color,
            fontWeight: 800,
          }}
        >
          {user.initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</div>
          <div className="section-label" style={{ marginTop: 2 }}>
            {user.role}
          </div>
        </div>
      </div>
    </div>
  );
}
