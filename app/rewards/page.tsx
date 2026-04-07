'use client';

import Link from 'next/link';
import Topbar from '@/components/Topbar';
import { useTokens } from '@/context/TokenContext';

const REWARDS = [
  {
    id: 'r1',
    name: 'Focus Booster Pack',
    description: 'Boost your attention with a guided flow session and 25 extra points.',
    cost: 140,
    badge: 'Featured',
  },
  {
    id: 'r2',
    name: 'Expert Jam Session',
    description: '1:1 ask time with an expert mentor, plus curated recap notes.',
    cost: 320,
    badge: 'Premium',
  },
  {
    id: 'r3',
    name: 'Node Spotlight',
    description: 'Highlight your latest doubt on the global feed for 24 hours.',
    cost: 210,
    badge: 'Community',
  },
  {
    id: 'r4',
    name: 'Quantum Coffee Voucher',
    description: 'Redeem a $10 coffee treat from our partner lab café.',
    cost: 90,
    badge: 'Perk',
  },
];
const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ACTIVE_DAYS = new Set([0, 1, 2, 4]); // example streak progress

export default function RewardsPage() {
  const { balance, transactions } = useTokens();

  const handleRedeem = (reward: typeof REWARDS[number]) => {
    if (balance < reward.cost) {
      alert('You need more points to redeem this reward.');
      return;
    }
    alert(`Redeemed “${reward.name}”. Enjoy the perk!`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F9FAFF 0%, #EFF2FF 60%, #E5E7FF 100%)', display: 'flex', flexDirection: 'column' }}>
      <Topbar onAskDoubt={() => {}} />

      <main style={{ flex: 1, padding: '24px 48px 48px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 6 }}>Redeem Rewards</p>
            <h1 className="font-outfit" style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>
              Stay streaking. Keep unlocking perks.
            </h1>
          </div>
          <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
            <button className="btn-pill btn-pill-ghost" style={{ height: 44 }}>
              View Leaderboard
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 32 }}>
          <div style={{ borderRadius: 28, background: '#fff', padding: 32, boxShadow: '0 25px 45px rgba(79,70,229,0.15)' }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Streak Progress
              </div>
              <div className="font-outfit" style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>14 Day Streak</div>
              <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>You are in the top 5% of explorers.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              {STREAK_DAYS.map((day, index) => (
                <div key={`${day}-${index}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      background: ACTIVE_DAYS.has(index) ? 'var(--accent-primary)' : 'var(--bg-base)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 18,
                      boxShadow: ACTIVE_DAYS.has(index) ? '0 10px 20px rgba(79,70,229,0.3)' : undefined,
                    }}
                  >
                    {ACTIVE_DAYS.has(index) ? '✓' : day}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{day}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn-pill btn-pill-primary" style={{ height: 48 }}>
                Redeem Rewards
              </button>
              <Link href="/leaderboard" style={{ textDecoration: 'none' }}>
                <button className="btn-pill btn-pill-ghost" style={{ height: 48 }}>
                  View Leaderboard
                </button>
              </Link>
            </div>

            <p style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              +50 points for tomorrow
            </p>
          </div>

          <div style={{ borderRadius: 28, background: 'linear-gradient(150deg, #4F46E5, #7C3AED)', padding: 28, color: '#fff', minHeight: 280, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 25px 50px rgba(79,70,229,0.4)' }}>
            <div>
              <p className="section-label" style={{ color: 'rgba(255,255,255,0.85)' }}>Current balance</p>
              <div className="font-outfit" style={{ fontSize: 42, fontWeight: 800 }}>&#9733; {balance}</div>
              <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.8)' }}>Use points for rewards, bounties, and curated boosts.</p>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <p>Keep the streak alive to maintain the streak multiplier. Every day adds +5 bonus points to your daily limit.</p>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p className="section-label">Available rewards</p>
              <h2 className="font-outfit" style={{ fontSize: 24, fontWeight: 700 }}>Pick a perk to celebrate your streak.</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Balance: &#9733; {balance}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 }}>
            {REWARDS.map((reward) => {
              const canAfford = balance >= reward.cost;
              return (
                <div key={reward.id} style={{ borderRadius: 20, background: '#fff', padding: 20, boxShadow: '0 15px 30px rgba(15,23,42,0.08)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>{reward.badge}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>Cost: &#9733; {reward.cost}</span>
                  </div>
                  <h3 className="font-outfit" style={{ fontSize: 18, fontWeight: 700 }}>{reward.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{reward.description}</p>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford}
                    className="btn-pill"
                    style={{
                      marginTop: 'auto',
                      justifyContent: 'space-between',
                      background: canAfford ? 'var(--accent-primary)' : 'var(--bg-base)',
                      color: canAfford ? '#fff' : 'var(--text-muted)',
                      border: canAfford ? 'none' : '1px solid var(--border-subtle)',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <span>{canAfford ? 'Redeem now' : 'Need more points'}</span>
                    <span>&#x2192;</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <div style={{ borderRadius: 20, padding: 20, background: '#fff', boxShadow: '0 20px 36px rgba(15,23,42,0.08)' }}>
            <p className="section-label">Recent activity</p>
            <h3 className="font-outfit" style={{ fontSize: 18, fontWeight: 700 }}>Token history</h3>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {transactions.slice(0, 4).map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                  <span>{tx.reason}</span>
                  <span style={{ fontWeight: 700, color: tx.type === 'earn' ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                    {tx.type === 'earn' ? '+' : '-'} &#9733;{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 20, padding: 20, background: 'linear-gradient(120deg, #eef2ff, #fdf4ff)', boxShadow: '0 20px 36px rgba(79,70,229,0.1)' }}>
            <p className="section-label">Bonus insights</p>
            <h3 className="font-outfit" style={{ fontSize: 18, fontWeight: 700 }}>Unlock streak multipliers</h3>
            <ul style={{ marginTop: 12, paddingLeft: 20, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>15 consecutive days = +10% bonus on every reward.</li>
              <li>Solve 3 doubts per day to maintain momentum.</li>
              <li>Share insights to earn collaborative boosts.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
