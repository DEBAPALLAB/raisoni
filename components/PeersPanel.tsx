'use client';

import { USERS, USER_COLORS, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';
import Avatar from './Avatar';

export default function PeersPanel() {
  // Sort by reputation/activity for "Pulse" feel
  const activePeers = [...USERS].sort((a, b) => b.reputation - a.reputation);

  return (
    <aside style={{
      width: 300, minWidth: 300, height: '100%',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, overflow: 'hidden',
      padding: '24px 16px'
    }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="section-label">Active Peers</span>
          <span style={{ fontSize: 10, color: 'var(--accent-success)', fontWeight: 600 }}>● {USERS.filter(u => u.lastActive === 'Online Now').length} Online</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {activePeers.map((user) => (
          <div key={user.id} className="card-premium" style={{ 
            padding: '12px', borderRadius: 16, cursor: 'pointer',
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
            border: user.lastActive === 'Online Now' ? '1px solid var(--accent-soft)' : '1px solid var(--border-subtle)'
          }}>
            <Avatar name={user.name} color={user.color} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</span>
                {user.lastActive === 'Online Now' && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-success)' }} />
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>
                {user.role} · ✦{user.reputation}
              </div>
            </div>
            
            <div style={{ width: '100%', display: 'flex', gap: 4, marginTop: 4 }}>
              {user.expertise.map(exp => (
                <span key={exp} style={{ 
                  fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                  background: `${SUBJECT_COLORS[exp]}15`, color: SUBJECT_COLORS[exp],
                  textTransform: 'uppercase'
                }}>
                  {SUBJECT_LABELS[exp]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <button className="btn-pill btn-pill-ghost" style={{ width: '100%', fontSize: 12 }}>
          View Leaderboard
        </button>
      </div>
    </aside>
  );
}
