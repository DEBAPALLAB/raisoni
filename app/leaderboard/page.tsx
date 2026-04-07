'use client';

import Topbar from '@/components/Topbar';
import Link from 'next/link';
import { USERS, SUBJECT_LABELS, SUBJECT_COLORS } from '@/data/seed';

export default function LeaderboardPage() {
  const leaderboard = [...USERS].sort((a, b) => b.reputation - a.reputation);
  const topUser = leaderboard[0];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFF, #F1F5FF 55%, #E5E7FF 100%)', display: 'flex', flexDirection: 'column' }}>
      <Topbar onAskDoubt={() => {}} />

      <main style={{ flex: 1, padding: '24px 48px 48px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>Leaderboard</p>
            <h1 className="font-outfit" style={{ fontSize: 32, fontWeight: 800 }}>Top explorers of the week.</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Climb ranks by sharing insights, answering doubts, and keeping streaks.</p>
          </div>
          <Link href="/rewards" style={{ textDecoration: 'none' }}>
            <button className="btn-pill btn-pill-primary" style={{ height: 44 }}>
              Redeem Rewards
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div style={{ borderRadius: 28, padding: 28, background: '#fff', boxShadow: '0 30px 60px rgba(15,23,42,0.12)' }}>
            <p className="section-label">Current leader</p>
            {topUser && (
              <>
                <h2 className="font-outfit" style={{ fontSize: 28, fontWeight: 800, margin: '8px 0' }}>
                  #{1} {topUser.name}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{topUser.role} in {topUser.expertise.map((s) => SUBJECT_LABELS[s]).join(', ')}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {topUser.expertise.map((subj) => (
                    <span key={subj} style={{ borderRadius: 999, padding: '6px 12px', background: SUBJECT_COLORS[subj] + '20', color: SUBJECT_COLORS[subj], fontWeight: 600, fontSize: 12 }}>
                      {SUBJECT_LABELS[subj]}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reputation</div>
                    <div className="font-outfit" style={{ fontSize: 28, fontWeight: 800 }}>{topUser.reputation}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role</div>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{topUser.role}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div style={{ borderRadius: 28, padding: 28, background: 'linear-gradient(160deg, #eef2ff, #fdf4ff)', boxShadow: '0 30px 60px rgba(79,70,229,0.12)' }}>
            <p className="section-label">Insights this week</p>
            <h3 className="font-outfit" style={{ fontSize: 24, fontWeight: 700, margin: '8px 0' }}>Peak engagement</h3>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>Top answers received 3.5x more likes than similar nodes.</li>
              <li>Community solved 42 doubts together.</li>
              <li>Leaderboard bonuses distributed across 12 subjects.</li>
            </ul>
          </div>
        </div>

        <section style={{ background: '#fff', borderRadius: 28, padding: '32px', boxShadow: '0 25px 45px rgba(15,23,42,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <div>
              <p className="section-label">Ranking</p>
              <h2 className="font-outfit" style={{ fontSize: 24, fontWeight: 700 }}>Explorer leaderboard</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Updated just now</p>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            {leaderboard.map((user, index) => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 16, padding: '16px 20px', background: index === 0 ? '#0f172a' : '#f8fafc', color: index === 0 ? '#fff' : 'var(--text-primary)', border: index === 0 ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: index === 0 ? '#fff' : '#e0e7ff', color: index === 0 ? '#0f172a' : SUBJECT_COLORS[user.expertise[0]], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {user.initials}
                  </div>
                  <div>
                    <p className="font-outfit" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{user.name}</p>
                    <span style={{ fontSize: 12, color: index === 0 ? 'rgba(15,23,42,0.7)' : 'var(--text-secondary)' }}>{user.role}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>#{index + 1}</span>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>{user.reputation}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
