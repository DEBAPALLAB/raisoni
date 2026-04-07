'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTokens } from '@/context/TokenContext';
import {
  NODES,
  ANSWERS,
  USERS,
  CONNECTED_NODES_MAP,
  SUBJECT_COLORS,
  SUBJECT_LABELS,
  getNodeById,
  getAnswersForNode,
  getUserForNode,
} from '@/data/seed';
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
  const { getBountyForNode, claimBounty } = useTokens();

  const node = getNodeById(id);
  const answers = getAnswersForNode(id);
  const author = getUserForNode(id);
  const connectedData = CONNECTED_NODES_MAP[id] || [];
  const nodeBounty = getBountyForNode(id);

  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [replyText, setReplyText] = useState('');
  const [extraAnswers, setExtraAnswers] = useState<Array<{ text: string; time: string }>>([]);

  const topInsight = answers.find((a) => a.isTopInsight);
  const communityAnswers = answers.filter((a) => !a.isTopInsight);

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
    if (!replyText.trim()) return;
    setExtraAnswers((prev) => [...prev, { text: replyText, time: 'just now' }]);
    setReplyText('');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left sidebar */}
        <Sidebar activeFilters={activeFilters} onFilterToggle={(s) => setActiveFilters((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} />

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: 80 }}>
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
                  <div
                    className="font-syne"
                    style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}
                  >
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
                </div>
              </div>
            )}

            {/* Top Insight */}
            {topInsight && (
              <div style={{ marginBottom: 28 }}>
                <AnswerCard 
                  answer={topInsight} 
                  isAsker={author?.name === 'Alex Rivera'} 
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
                COMMUNITY CONTRIBUTIONS ({communityAnswers.length + extraAnswers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {communityAnswers.map((a) => (
                  <AnswerCard 
                    key={a.id} 
                    answer={a} 
                    isAsker={author?.name === 'Alex Rivera'} 
                  />
                ))}

                {/* Extra posted answers */}
                {extraAnswers.map((ea, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Avatar name="Alex Rivera" color="#7C6EE6" size={32} />
                      <div>
                        <div className="font-dm-mono" style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>Alex Rivera</div>
                        <div className="section-label" style={{ fontSize: 9 }}>{ea.time}</div>
                      </div>
                      <Badge variant="gray">STUDENT</Badge>
                    </div>
                    <p className="font-cormorant" style={{ fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, color: 'var(--text-primary)' }}>
                      {ea.text}
                    </p>
                  </div>
                ))}
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
              const connNode = NODES.find((n) => n.id === nodeId);
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
                {Math.max(1, Math.floor(node.activity * 0.3))}
              </div>
              <div className="section-label" style={{ fontSize: 9 }}>Bookmarks</div>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min((node.activity / 50) * 100, 100)}%` }} />
          </div>
        </aside>
      </div>

      {/* Sticky write answer bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 220,
          right: 0,
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '10px 150px 10px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 20,
        }}
      >
        <Avatar name="Alex Rivera" color="#7C6EE6" size={32} />
        <input
          className="input-ghost"
          placeholder="Write your answer..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handlePostReply(); }}
          style={{ flex: 1, fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontStyle: 'italic', height: 36 }}
        />
        <button
          className="btn-filled"
          onClick={handlePostReply}
          style={{ padding: '7px 20px' }}
        >
          Post
        </button>
      </div>

      {showModal && (
        <AskDoubtModal
          onClose={() => setShowModal(false)}
          onAddNode={(title) => {
            // In a real app, this would save to DB.
            // For now, we redirect to graph to see the node appear (the graph page adds it)
            router.push('/graph');
          }}
        />
      )}
    </div>
  );
}
