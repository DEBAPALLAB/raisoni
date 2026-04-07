'use client';

import { useState } from 'react';
import { Answer, USERS } from '@/data/seed';
import Badge from './Badge';
import Avatar from './Avatar';
import { useTokens } from '@/context/TokenContext';
import { REWARD_CONFIG } from '@/context/KnowledgeContext';

interface AnswerCardProps {
  answer: Answer;
  isAsker?: boolean;
  onMarkTopInsight?: (answerId: string) => void;
}

export default function AnswerCard({ answer, isAsker, onMarkTopInsight }: AnswerCardProps) {
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [voted, setVoted] = useState(false);
  const [marked, setMarked] = useState(false);
  const { getBountyForNode, claimBounty } = useTokens();
  const bounty = getBountyForNode(answer.nodeId);

  // Look up author — first by id, fallback to display a generic avatar
  const author = USERS.find((u) => u.id === answer.authorId);
  const authorName = author?.name ?? 'Community Member';
  const authorColor = author?.color ?? '#94A3B8';

  const handleMarkTopInsight = () => {
    if (marked || !onMarkTopInsight) return;
    setMarked(true);
    onMarkTopInsight(answer.id);
  };

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
        <Avatar name={authorName} color={authorColor} size={36} />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="font-dm-mono" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
              {authorName}
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

        {/* Upvote */}
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
          marginBottom: 14,
        }}
      >
        {answer.body}
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* If this is already the top insight, show helpful count */}
        {answer.isTopInsight && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: 'var(--accent-green)',
                color: '#fff',
                borderRadius: 6,
                padding: '5px 12px',
                fontFamily: 'DM Mono, monospace',
                fontSize: 11,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              ✓ Top Insight
            </span>
            <span className="font-dm-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {upvotes} people found this helpful
            </span>
          </div>
        )}

        {/* If asker hasn't accepted any insight yet, show accept button */}
        {!answer.isTopInsight && isAsker && !marked && onMarkTopInsight && (
          <button
            onClick={handleMarkTopInsight}
            style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '6px 14px',
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'opacity 150ms ease',
            }}
          >
            ✦ Accept as Insight (+{REWARD_CONFIG.answerAccepted} pts to author)
          </button>
        )}

        {/* Bounty claim */}
        {!answer.isTopInsight && isAsker && bounty > 0 && (
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
            ✦ Claim Bounty ({bounty} pts)
          </button>
        )}

        {/* Generic helpful for non-askers */}
        {!isAsker && !answer.isTopInsight && (
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
      </div>
    </div>
  );
}
