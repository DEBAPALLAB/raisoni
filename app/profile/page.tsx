'use client';

import { useState } from 'react';
import Link from 'next/link';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Avatar from '@/components/Avatar';
import Badge from '@/components/Badge';
import { useTokens } from '@/context/TokenContext';
import { useAuth } from '@/context/AuthContext';
import {
  ANSWERS,
  NODES,
  SUBJECT_COLORS,
  SUBJECT_LABELS,
  type Subject,
} from '@/data/seed';

export default function ProfilePage() {
  const { balance, bounties, transactions } = useTokens();
  const { currentUser, currentLoginId } = useAuth();
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);

  const authoredQuestions = NODES.filter((node) => node.asker === currentUser.name);
  const authoredAnswers = ANSWERS.filter((answer) => answer.authorId === currentUser.id);
  const activeBounties = Object.entries(bounties).filter(([, amount]) => amount > 0);
  const totalBountyValue = activeBounties.reduce((sum, [, amount]) => sum + amount, 0);

  const solvedQuestions = authoredQuestions.filter((node) => node.status === 'solved').length;
  const totalActivity = authoredQuestions.reduce((sum, node) => sum + node.activity, 0);

  const recentActivity = [
    ...authoredQuestions.slice(0, 3).map((node) => ({
      key: node.id,
      title: node.title,
      meta: `${SUBJECT_LABELS[node.subject]} · ${node.status}`,
      href: `/node/${node.id}`,
      tone: SUBJECT_COLORS[node.subject],
    })),
    ...authoredAnswers.slice(0, 2).map((answer) => {
      const node = NODES.find((entry) => entry.id === answer.nodeId);
      return {
        key: answer.id,
        title: node?.title ?? 'Answer',
        meta: `Answered ${node ? SUBJECT_LABELS[node.subject] : 'network'} · ${answer.time}`,
        href: `/node/${answer.nodeId}`,
        tone: node ? SUBJECT_COLORS[node.subject] : 'var(--accent-primary)',
      };
    }),
  ].slice(0, 5);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => {}} />

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
              'radial-gradient(circle at top left, rgba(79,70,229,0.08), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.06), transparent 24%), var(--bg-base)',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(transparent 0 0), radial-gradient(circle at 50% 0%, rgba(255,255,255,0.7), transparent 40%)',
              pointerEvents: 'none',
              opacity: 0.45,
            }}
          />

          <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                marginBottom: 28,
              }}
            >
              <div>
                <div className="section-label" style={{ marginBottom: 10 }}>
                  USER PROFILE
                </div>
                <h1
                  className="font-outfit"
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                  }}
                >
                  {currentUser.name}
                </h1>
                <p style={{ marginTop: 10, color: 'var(--text-secondary)', maxWidth: 700 }}>
                  A living summary of the current contributor in Solvi, combining reputation,
                  question activity, and the token ledger that powers the network.
                </p>
              </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 24, marginBottom: 24 }}>
              <section className="card-premium" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
                  <Avatar name={currentUser.name} color={currentUser.color} size={84} />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h2 className="font-outfit" style={{ fontSize: 26, fontWeight: 800 }}>
                        {currentUser.name}
                      </h2>
                      <Badge variant="violet">{currentUser.role}</Badge>
                      <Badge variant="green">{currentUser.lastActive}</Badge>
                      <Badge variant="gray">{currentLoginId}</Badge>
                    </div>

                    <p style={{ marginTop: 10, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                      Primary focus: networked problem solving across computer science, with
                      active participation in quantum-adjacent and interdisciplinary threads.
                    </p>

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
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: '50%',
                              background: SUBJECT_COLORS[subject],
                            }}
                          />
                          {SUBJECT_LABELS[subject]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 18 }}>
                  QUICK STATS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <StatTile label="Reputation" value={currentUser.reputation.toString()} />
                  <StatTile label="Token Balance" value={balance.toString()} />
                  <StatTile label="Questions" value={authoredQuestions.length.toString()} />
                  <StatTile label="Solved" value={solvedQuestions.toString()} />
                </div>
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 16,
                  }}
                >
                  <div>
                    <div className="section-label">Bounties Placed</div>
                    <div className="font-outfit" style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                      {totalBountyValue}
                    </div>
                  </div>
                  <div>
                    <div className="section-label">Activity Score</div>
                    <div className="font-outfit" style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                      {totalActivity}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
                  <StatTile label="Login ID" value={currentLoginId} />
                  <StatTile label="Account Type" value={currentUser.role} />
                </div>
              </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <section className="card-premium" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <div className="section-label">RECENT QUESTIONS</div>
                    <h3 className="font-outfit" style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
                      Active Threads
                    </h3>
                  </div>
                  <Badge variant="gray">{authoredQuestions.length} total</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {authoredQuestions.map((node) => (
                    <Link
                      key={node.id}
                      href={`/node/${node.id}`}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <div
                            className="font-outfit"
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              lineHeight: 1.4,
                            }}
                          >
                            {node.title}
                          </div>
                          <div className="section-label" style={{ marginTop: 6 }}>
                            {node.time} · {node.activity} interactions
                          </div>
                        </div>
                        <Badge
                          variant={node.status === 'solved' ? 'green' : node.status === 'active' ? 'violet' : 'amber'}
                        >
                          {node.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="card-premium" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <div className="section-label">NETWORK LEDGER</div>
                    <h3 className="font-outfit" style={{ fontSize: 20, fontWeight: 800, marginTop: 6 }}>
                      Recent Activity
                    </h3>
                  </div>
                  <Badge variant="violet">{transactions.length} entries</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {recentActivity.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      style={{
                        textDecoration: 'none',
                        display: 'block',
                        padding: 16,
                        borderRadius: 16,
                        border: '1px solid var(--border-subtle)',
                        background: 'linear-gradient(180deg, #fff, #fbfdff)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: item.tone,
                            marginTop: 6,
                            flexShrink: 0,
                            boxShadow: `0 0 0 4px ${item.tone}15`,
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div
                            className="font-outfit"
                            style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}
                          >
                            {item.title}
                          </div>
                          <div className="section-label" style={{ marginTop: 4 }}>
                            {item.meta}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 18 }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>
                    TOKEN HISTORY
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {transactions.slice(0, 3).map((entry) => (
                      <div
                        key={entry.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          padding: '10px 0',
                        }}
                      >
                        <div>
                          <div className="font-outfit" style={{ fontSize: 14, fontWeight: 700 }}>
                            {entry.reason}
                          </div>
                          <div className="section-label" style={{ marginTop: 4 }}>
                            {entry.time}
                          </div>
                        </div>
                        <Badge variant={entry.type === 'earn' ? 'green' : 'amber'}>
                          {entry.type === 'earn' ? '+' : '-'}
                          {entry.amount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.9fr', gap: 24, marginTop: 24 }}>
              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 12 }}>
                  PROFILE METRICS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
                  <MetricBar label="Knowledge Coverage" value={84} />
                  <MetricBar label="Response Velocity" value={68} />
                  <MetricBar label="Network Trust" value={91} />
                </div>
              </section>

              <section className="card-premium" style={{ padding: 28 }}>
                <div className="section-label" style={{ marginBottom: 12 }}>
                  NAVIGATION
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/library" className="nav-item" style={{ textDecoration: 'none' }}>
                    Browse library
                  </Link>
                  <Link href="/graph" className="nav-item" style={{ textDecoration: 'none' }}>
                    Open graph
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
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
      <div className="font-outfit" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span className="section-label">{label}</span>
        <span className="font-outfit" style={{ fontSize: 18, fontWeight: 800 }}>
          {value}%
        </span>
      </div>
      <div className="progress-container" style={{ marginTop: 10 }}>
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
