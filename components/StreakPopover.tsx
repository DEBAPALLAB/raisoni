'use client';

import Link from 'next/link';

interface StreakPopoverProps {
  onClose: () => void;
}

export default function StreakPopover({ onClose }: StreakPopoverProps) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const activeDays = [0, 1, 2, 4]; // M, T, W, F active

  return (
    <div className="popover-premium fade-up" style={{
      position: 'absolute', top: 56, right: 0, width: 280, zIndex: 100,
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32, marginBottom: 4 }}>🔥</div>
        <div className="font-outfit" style={{ fontSize: 20, fontWeight: 800 }}>14 Day Streak</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
          You're in the top 5% of explorers!
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        {days.map((day, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div className={`streak-bubble ${activeDays.includes(i) ? 'streak-bubble-active' : 'streak-bubble-inactive'}`}>
              {activeDays.includes(i) ? '✓' : ''}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>{day}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/rewards" style={{ textDecoration: 'none' }} onClick={onClose}>
          <button className="btn-pill btn-pill-primary" style={{ width: '100%', height: 40 }}>
            Redeem Rewards
          </button>
        </Link>
        <Link href="/leaderboard" style={{ textDecoration: 'none' }} onClick={onClose}>
          <button className="btn-pill btn-pill-ghost" style={{ width: '100%', height: 40 }}>
            View Leaderboard
          </button>
        </Link>
      </div>
      
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
          +50 Points for tomorrow
        </span>
      </div>
    </div>
  );
}
