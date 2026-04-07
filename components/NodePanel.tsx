'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Node, CONNECTED_NODES_MAP, NODES, ANSWERS, USERS,
  SUBJECT_COLORS, SUBJECT_LABELS,
} from '@/data/seed';
import { MatchBadge } from './Badge';
import Avatar from './Avatar';

interface NodePanelProps {
  node: Node;
  onClose: () => void;
}

export default function NodePanel({ node, onClose }: NodePanelProps) {
  const router = useRouter();
  const connectedData = CONNECTED_NODES_MAP[node.id] || [];
  const topInsight = ANSWERS.find((a) => a.nodeId === node.id && a.isTopInsight);
  const topInsightAuthor = topInsight ? USERS.find((u) => u.id === topInsight.authorId) : null;
  const author = USERS.find((u) => u.name === node.asker);
  const color = SUBJECT_COLORS[node.subject];

  const statusBadge =
    node.status === 'solved' ? { label: 'SOLVED', bg: 'rgba(74,222,128,0.12)', color: 'var(--accent-green)', border: 'rgba(74,222,128,0.3)' }
    : node.status === 'active' ? { label: 'ACTIVE', bg: 'rgba(124,110,230,0.12)', color: 'var(--accent-soft)', border: 'rgba(124,110,230,0.3)' }
    : { label: 'PENDING', bg: 'rgba(245,158,11,0.12)', color: 'var(--accent-amber)', border: 'rgba(245,158,11,0.3)' };

  return (
    <div className="panel-slide-in" style={{
      width: 340, minWidth: 340, height: '100%',
      background: 'var(--bg-surface)',
      borderLeft: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="section-label">SELECTED NODE</span>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 500,
            padding: '2px 7px', borderRadius: 4, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background: `${color}1A`, color, border: `1px solid ${color}44`,
          }}>
            {SUBJECT_LABELS[node.subject]}
          </span>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', padding: 4, display: 'flex', borderRadius: 4,
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <line x1="1.5" y1="1.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="11.5" y1="1.5" x2="1.5" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── Scrollable body ──────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

        {/* Title */}
        <h2 className="font-syne" style={{
          fontSize: 17, fontWeight: 700, color: 'var(--text-primary)',
          lineHeight: 1.35, marginBottom: 14,
        }}>
          {node.title}
        </h2>

        {/* Author + status */}
        {author && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border-subtle)',
          }}>
            <Avatar name={author.name} color={author.color} size={28} />
            <div style={{ flex: 1 }}>
              <div className="font-dm-mono" style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                {author.name}
              </div>
              <div className="section-label" style={{ fontSize: 9, marginTop: 2 }}>
                {author.role} · {node.time}
              </div>
            </div>
            <span style={{
              fontFamily: 'DM Mono, monospace', fontSize: 9, fontWeight: 500,
              padding: '2px 7px', borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase',
              background: statusBadge.bg, color: statusBadge.color, border: `1px solid ${statusBadge.border}`,
            }}>
              {statusBadge.label}
            </span>
          </div>
        )}

        {/* ── Top Insight card ──────────────────────────────── */}
        {topInsight && topInsightAuthor && (
          <div style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)',
            borderRadius: 8, padding: '12px 14px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1l1.3 2.8 3 .4-2.2 2.1.5 3L5.5 8 3 9.3l.5-3L1.2 4.2l3-.4z" fill="var(--accent-amber)"/>
              </svg>
              <span className="section-label" style={{ color: 'var(--accent-amber)', fontSize: 9 }}>TOP INSIGHT</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar name={topInsightAuthor.name} color={topInsightAuthor.color} size={18} />
                <span className="section-label" style={{ fontSize: 9 }}>{topInsightAuthor.name}</span>
              </div>
            </div>
            <p className="font-cormorant" style={{
              fontStyle: 'italic', fontSize: 14, lineHeight: 1.65,
              color: 'var(--text-primary)',
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {topInsight.body}
            </p>
            <Link href={`/node/${node.id}`} style={{
              display: 'inline-block', marginTop: 8,
              fontFamily: 'DM Mono, monospace', fontSize: 11,
              color: 'var(--accent-violet)', textDecoration: 'none', letterSpacing: '0.04em',
            }}>
              Read full analysis →
            </Link>
          </div>
        )}

        {/* ── Connected Nodes ───────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>CONNECTED NODES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {connectedData.slice(0, 3).map(({ nodeId, match, description }) => {
              const n = NODES.find((nd) => nd.id === nodeId);
              if (!n) return null;
              const nc = SUBJECT_COLORS[n.subject];
              return (
                <div key={nodeId}
                  onClick={() => router.push(`/node/${nodeId}`)}
                  style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                    borderRadius: 6, padding: '9px 11px', cursor: 'pointer',
                    transition: 'border-color 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: nc }} />
                      <span className="section-label" style={{ fontSize: 8, color: nc }}>{SUBJECT_LABELS[n.subject]}</span>
                    </div>
                    <MatchBadge match={match} />
                  </div>
                  <div className="font-syne" style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {n.title.length > 72 ? n.title.slice(0, 72) + '…' : n.title}
                  </div>
                  {description && (
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                      {description.slice(0, 60)}…
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Vitality ─────────────────────────────────────── */}
        <div style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
          borderRadius: 8, padding: '12px 14px',
        }}>
          <div className="section-label" style={{ marginBottom: 10 }}>QUESTION VITALITY</div>
          <div style={{ display: 'flex', gap: 28, marginBottom: 10 }}>
            <div>
              <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {node.activity >= 40 ? '1.2k' : node.activity * 51}
              </div>
              <div className="section-label" style={{ fontSize: 9 }}>Views</div>
            </div>
            <div>
              <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {Math.max(1, Math.floor(node.activity * 0.3))}
              </div>
              <div className="section-label" style={{ fontSize: 9 }}>Bookmarks</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((node.activity / 50) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* ── Footer CTA ──────────────────────────────────────── */}
      <div style={{
        padding: '16px', borderTop: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 10,
        background: 'var(--bg-elevated)',
        borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
      }}>
        <button 
          className="btn-filled" 
          style={{ 
            width: '100%', height: 44, fontSize: 13, fontWeight: 700, 
            borderRadius: 12, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}
          onClick={() => router.push(`/node/${node.id}`)}
        >
          <span>View Full Discussion</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" style={{ flex: 1, fontSize: 12, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ marginRight: 6 }}>🔖</span> Bookmark
          </button>
          <button className="btn-ghost" style={{ flex: 1, fontSize: 12, borderRadius: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ marginRight: 6 }}>🔗</span> Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
