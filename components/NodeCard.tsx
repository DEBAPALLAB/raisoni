'use client';

import { Node } from '@/data/seed';
import { MatchBadge } from './Badge';
import { SUBJECT_LABELS, SUBJECT_COLORS } from '@/data/seed';

interface NodeCardProps {
  node: Node;
  match?: number;
  description?: string;
  onClick?: () => void;
  compact?: boolean;
}

export default function NodeCard({ node, match, description, onClick, compact }: NodeCardProps) {
  const color = SUBJECT_COLORS[node.subject];

  return (
    <div className="connected-card" onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 1 }} />
          <span className="section-label" style={{ color, fontSize: 9 }}>
            {SUBJECT_LABELS[node.subject]}
          </span>
        </div>
        {match !== undefined && <MatchBadge match={match} />}
      </div>

      <div
        className="font-syne"
        style={{
          fontSize: compact ? 12 : 13,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginTop: 4,
        }}
      >
        {node.title.length > 80 ? node.title.slice(0, 80) + '…' : node.title}
      </div>

      {description && (
        <div
          style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 4 }}
        >
          {description}
        </div>
      )}
    </div>
  );
}
