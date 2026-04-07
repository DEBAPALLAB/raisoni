'use client';

import { NODES, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';
import Link from 'next/link';

export default function PulseFeed() {
  // Sort by newest/activity for the "Live" feel
  const liveNodes = [...NODES].sort((a, b) => b.activity - a.activity);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 className="font-outfit" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>Pulse Dashboard</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-pill btn-pill-ghost" style={{ fontSize: 11 }}>Newest</button>
          <button className="btn-pill btn-pill-primary" style={{ fontSize: 11 }}>Active Now</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {liveNodes.map((node) => (
          <Link key={node.id} href={`/node/${node.id}`} style={{ textDecoration: 'none' }}>
            <div className="card-premium fade-up" style={{ 
              padding: '20px 24px', position: 'relative', overflow: 'hidden'
            }}>
              {node.isNew && (
                <div style={{ 
                  position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, 
                  background: 'var(--accent-primary)' 
                }} />
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ 
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                  background: `${SUBJECT_COLORS[node.subject]}15`, color: SUBJECT_COLORS[node.subject],
                  textTransform: 'uppercase'
                }}>
                  {SUBJECT_LABELS[node.subject]}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>· {node.time}</span>
              </div>

              <h3 className="font-outfit" style={{ 
                fontSize: 18, fontWeight: 700, color: 'var(--text-primary)',
                lineHeight: 1.3, marginBottom: 14
              }}>
                {node.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12c0-1.2-4.03-6-10-6S2 10.8 2 12s4.03 6 10 6 10-4.8 10-6z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{node.activity * 12} views</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{Math.floor(node.activity / 4)} answers</span>
                </div>
                
                {node.status === 'pending' && (
                  <div style={{ 
                    marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: 'var(--accent-warning)',
                    display: 'flex', alignItems: 'center', gap: 5 
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-warning)' }} />
                    UNANSWERED
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
