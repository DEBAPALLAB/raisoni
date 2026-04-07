'use client';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export default function Avatar({ name, color = '#7C6EE6', size = 28 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
