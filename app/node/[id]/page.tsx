'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  USERS,
  CONNECTED_NODES_MAP,
  SUBJECT_COLORS,
  SUBJECT_LABELS,
} from '@/data/seed';
import { useKnowledge, REWARD_CONFIG } from '@/context/KnowledgeContext';
import { useAuth } from '@/context/AuthContext';
import { useTokens } from '@/context/TokenContext';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import AnswerCard from '@/components/AnswerCard';
import NodeCard from '@/components/NodeCard';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import AskDoubtModal from '@/components/AskDoubtModal';
import { Subject } from '@/data/seed';

interface NodePageProps {
  params: Promise<{ id: string }>;
}

export default function NodePage({ params }: NodePageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { nodes, answers, getAnswersForNode, addAnswer, markTopInsight } = useKnowledge();
  const { currentUser } = useAuth();
  const { getBountyForNode, spendTokens } = useTokens();

  const node = nodes.find((n) => n.id === id);
  const nodeAnswers = getAnswersForNode(id);
  const author = node ? USERS.find((u) => u.name === node.asker) : undefined;
  const connectedData = CONNECTED_NODES_MAP[id] || [];
  const nodeBounty = getBountyForNode(id);

  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [replyText, setReplyText] = useState('');

  const topInsight = nodeAnswers.find((a) => a.isTopInsight);
  const communityAnswers = nodeAnswers.filter((a) => !a.isTopInsight);

  const isAsker = currentUser?.name === node?.asker;

  if (!node) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="font-syne" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>Node not found</div>
          <Link href="/graph" className="btn-filled" style={{ textDecoration: 'none' }}>Back to Graph</Link>
        </div>
      </div>
    );
  }

  const subjectColor = SUBJECT_COLORS[node.subject];

  const handlePostReply = () => {
    if (!replyText.trim() || !currentUser) return;

    addAnswer({
      nodeId: id,
      authorId: currentUser.id,
      body: replyText.trim(),
      upvotes: 0,
      isTopInsight: false,
      isExpert: currentUser.role === 'Expert' || currentUser.role === 'Faculty',
      time: 'just now',
    });

    setReplyText('');
  };

  const handleMarkTopInsight = (answerId: string) => {
    markTopInsight(answerId, id, currentUser?.id ?? '');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <Sidebar activeFilters={activeFilters} onFilterToggle={(s) => setActiveFilters((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} />

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: 160 }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div
              className="section-label"
              style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Link href="/graph" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                GRAPH
              </Link>
              <span style={{ color: 'var(--border-mid)' }}>·</span>
              <span style={{ color: subjectColor, textTransform: 'uppercase' }}>
                {SUBJECT_LABELS[node.subject]}
              </span>
              <span style={{ color: 'var(--border-mid)' }}>·</span>
              <span>{node.time}</span>
            </div>

            {/* Title */}
            <h1
              className="font-syne"
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.25,
                marginBottom: 20,
              }}
            >
              {node.title}
            </h1>

            {/* Author row */}
            {author && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 28,
                  paddingBottom: 24,
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <Avatar name={author.name} color={author.color} size={40} />
                <div>
                  <div className="font-syne" style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {author.name}
                  </div>
                  <div className="section-label" style={{ marginTop: 2 }}>
                    {author.role === 'Faculty' ? 'Faculty Member · Research Lead' : `${author.role} · ${node.time}`}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <Badge
                    variant={
                      node.status === 'solved' ? 'green' : node.status === 'active' ? 'violet' : 'amber'
                    }
                  >
                    {node.status.toUpperCase()}
                  </Badge>
                  {nodeBounty > 0 && (
                    <Badge variant="amber">🏆 {nodeBounty} pts bounty</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Top Insight */}
            {topInsight && (
              <div style={{ marginBottom: 28 }}>
                <AnswerCard
                  answer={topInsight}
                  isAsker={isAsker}
                  onMarkTopInsight={handleMarkTopInsight}
                />
              </div>
            )}

            {/* Community Contributions */}
            <div style={{ marginBottom: 24 }}>
              <div
                className="font-dm-mono"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: 14,
                  letterSpacing: '0.05em',
                }}
              >
                COMMUNITY CONTRIBUTIONS ({communityAnswers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {communityAnswers.map((a) => (
                  <AnswerCard
                    key={a.id}
                    answer={a}
                    isAsker={isAsker}
                    onMarkTopInsight={handleMarkTopInsight}
                  />
                ))}

                {communityAnswers.length === 0 && !topInsight && (
                  <div style={{
                    padding: '40px 0',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-elevated)',
                    borderRadius: 12,
                    border: '1px dashed var(--border-subtle)',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 12 }}>💬</div>
                    <div className="font-dm-mono" style={{ fontSize: 13 }}>
                      No answers yet. Be the first to share an insight!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside
          style={{
            width: 280,
            minWidth: 280,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-subtle)',
            overflowY: 'auto',
            padding: '24px 16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className="section-label">CONNECTED NODES</span>
            <Link
              href={`/graph?node=${id}`}
              className="font-dm-mono"
              style={{ fontSize: 11, color: 'var(--accent-violet)', textDecoration: 'none', letterSpacing: '0.05em' }}
            >
              View Map →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {connectedData.slice(0, 3).map(({ nodeId, match, description }) => {
              const connNode = nodes.find((n) => n.id === nodeId);
              if (!connNode) return null;
              return (
                <NodeCard
                  key={nodeId}
                  node={connNode}
                  match={match}
                  description={description}
                  compact
                  onClick={() => router.push(`/node/${nodeId}`)}
                />
              );
            })}
          </div>

          <button className="btn-ghost" style={{ width: '100%', marginBottom: 20 }}>
            ✦ Expand Network
          </button>

          <div className="divider" style={{ marginBottom: 20 }} />

          {/* Reward info */}
          {REWARD_CONFIG.answerAccepted > 0 && (
            <div style={{
              background: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.15)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
            }}>
              <div className="section-label" style={{ marginBottom: 8 }}>REWARDS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Answer accepted</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>+{REWARD_CONFIG.answerAccepted} pts</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Any answer posted</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>+{REWARD_CONFIG.answerPosted} pts</span>
                </div>
              </div>
            </div>
          )}

          {/* Vitality */}
          <div className="section-label" style={{ marginBottom: 12 }}>QUESTION VITALITY</div>
          <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
            <div>
              <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {node.activity >= 40 ? '1.2k' : `${node.activity * 51}`}
              </div>
              <div className="section-label" style={{ fontSize: 9 }}>Views</div>
            </div>
            <div>
              <div className="font-syne" style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>
                {nodeAnswers.length}
              </div>
              <div className="section-label" style={{ fontSize: 9 }}>Answers</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((node.activity / 50) * 100, 100)}%` }} />
          </div>
        </aside>
      </div>

      {/* Sticky write answer composer */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: 'calc(260px + 24px)',
          width: 'calc(100% - 260px - 280px - 48px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          zIndex: 50,
          boxShadow: '0 10px 40px -10px rgba(15,23,42,0.15)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.92)',
        }}
      >
        <Avatar name={currentUser?.name ?? 'Anonymous'} color={currentUser?.color ?? '#7C6EE6'} size={36} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea
            placeholder="Share your insight or propose a solution... (Enter to post, Shift+Enter for new line)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePostReply();
              }
            }}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 18,
              minHeight: 44,
              resize: 'none',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              paddingTop: 4,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)' }}>
              <button className="hover-glow" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }} title="Attach File">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <button className="hover-glow" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }} title="Mathematical Equation">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 5-7 14-3-6H5"/></svg>
              </button>
              <button className="hover-glow" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center' }} title="Add Code Snippet">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                +{REWARD_CONFIG.answerPosted} pts for posting
              </span>
              <button
                className="btn-filled"
                onClick={handlePostReply}
                disabled={!replyText.trim()}
                style={{
                  padding: '8px 24px',
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  opacity: replyText.trim() ? 1 : 0.5,
                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                <span style={{ fontWeight: 700 }}>Publish Insight</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AskDoubtModal
          onClose={() => setShowModal(false)}
          onAddNode={(title, subject, bounty) => {
            router.push('/graph');
          }}
        />
      )}
    </div>
  );
}
