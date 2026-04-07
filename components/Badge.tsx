'use client';

interface BadgeProps {
  variant?: 'violet' | 'green' | 'amber' | 'gray' | 'pink';
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export default function Badge({ variant = 'gray', children, style }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {children}
    </span>
  );
}

interface MatchBadgeProps {
  match: number;
}

export function MatchBadge({ match }: MatchBadgeProps) {
  const variant = match >= 80 ? 'green' : match >= 60 ? 'amber' : 'gray';
  return <Badge variant={variant}>{match}% MATCH</Badge>;
}
