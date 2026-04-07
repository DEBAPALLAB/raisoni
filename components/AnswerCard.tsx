'use client';

import { useState } from 'react';
import { Answer, USERS, NODES, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';
import Badge from './Badge';
import Avatar from './Avatar';
import { useTokens } from '@/context/TokenContext';

interface AnswerCardProps {
  answer: Answer;
  isAsker?: boolean;
}

export default function AnswerCard({ answer, isAsker }: AnswerCardProps) {
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [voted, setVoted] = useState(false);
  const { getBountyForNode, claimBounty } = useTokens();
  const bounty = getBountyForNode(answer.nodeId);
  const author = USERS.find((u) => u.id === answer.authorId);

  if (!author) return null;

  return (
    <div
      style={{
        background: answer.isTopInsight ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${answer.isTopInsight ? 'var(--border-mid)' : 'var(--border-subtle)'}`,
        borderRadius: 8,
        padding: '16px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Avatar name={author.name} color={author.color} size={36} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="font-dm-mono"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}
            >
              {author.name}
            </span>
            <Badge variant={answer.isExpert ? 'green' : 'gray'}>
              {answer.isExpert ? 'EXPERT' : 'STUDENT'}
            </Badge>
            {answer.isTopInsight && (
              <Badge variant="amber">TOP INSIGHT</Badge>
            )}
          </div>
          <div className="section-label" style={{ fontSize: 10, marginTop: 2 }}>
            {answer.time}
          </div>
        </div>

        {/* Upvote — top right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="upvote-btn"
            onClick={() => {
              if (!voted) {
                setUpvotes(upvotes + 1);
                setVoted(true);
              }
            }}
            style={{ color: voted ? 'var(--accent-violet)' : undefined }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill={voted ? 'var(--accent-violet)' : 'none'}>
              <path d="M6 1L10 6H7V11H5V6H2L6 1Z" stroke="currentColor" strokeWidth="1" />
            </svg>
            {upvotes}
          </button>
        </div>
      </div>

      <p
        className="font-cormorant"
        style={{
          fontStyle: 'italic',
          fontSize: 16,
          lineHeight: 1.7,
          color: 'var(--text-primary)',
        }}
      >
        {answer.body}
      </p>

      <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
        {answer.isTopInsight ? (
          <HelpfulButton 
            initialCount={answer.upvotes} 
            isAsker={isAsker}
            hasBounty={bounty > 0}
            onMark={() => claimBounty(answer.nodeId, answer.id, answer.authorId)}
          />
        ) : (
          <>
            {isAsker && bounty > 0 ? (
              <button
                className="font-dm-mono"
                onClick={() => claimBounty(answer.nodeId, answer.id, answer.authorId)}
                style={{
                  fontSize: 11,
                  color: 'var(--accent-amber)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  letterSpacing: '0.05em',
                  fontWeight: 700
                }}
              >
                ✦ Claim Bounty
              </button>
            ) : (
              <button
                className="font-dm-mono"
                style={{
                  fontSize: 11,
                  color: 'var(--accent-violet)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  letterSpacing: '0.05em',
                }}
              >
                Helpful
              </button>
            )}
            <button
              className="font-dm-mono"
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                letterSpacing: '0.05em',
              }}
            >
              Reply
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HelpfulButton({ 
  initialCount, 
  isAsker, 
  hasBounty, 
  onMark 
}: { 
  initialCount: number; 
  isAsker?: boolean; 
  hasBounty?: boolean;
  onMark?: () => void;
}) {
  const [count, setCount] = useState(initialCount);
  const [marked, setMarked] = useState(false);

  const handleMark = () => {
    if (!marked) {
      setCount(count + 1);
      setMarked(true);
      if (onMark) onMark();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button
        onClick={handleMark}
        style={{
          background: marked ? 'var(--accent-green)' : (isAsker && hasBounty ? 'var(--accent-amber)' : 'var(--accent-violet)'),
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          fontFamily: 'DM Mono, monospace',
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: '0.06em',
          cursor: marked ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'background 200ms ease',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7h2v5H2V7zm2-1.5A1 1 0 015 4.6c.5-1.2 1.5-2.1 2.5-2.6H9.5a1 1 0 011 1v5a1 1 0 01-1 1H6L4 10.5V5.5z"
            fill="currentColor"
          />
        </svg>
        {marked ? '✓ Marked Helpful' : (isAsker && hasBounty ? '✦ Claim & Solve' : 'Mark as Helpful')}
      </button>
      <span
        className="font-dm-mono"
        style={{ fontSize: 12, color: 'var(--text-secondary)' }}
      >
        {count} people found this helpful
      </span>
    </div>
  );
}
