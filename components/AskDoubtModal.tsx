'use client';

import { useState, useEffect, useMemo } from 'react';
import { MatchBadge } from './Badge';
import { useTokens } from '@/context/TokenContext';
import { USERS, NODES, CONNECTED_NODES_MAP, SUBJECT_COLORS } from '@/data/seed';
import type { Node } from '@/data/seed';

interface AskDoubtModalProps {
  onClose: () => void;
  onAddNode: (title: string, subject: string, bounty: number) => void;
}

const SUBJECTS = [
  { id: 'quantum', label: 'Quantum Mechanics' },
  { id: 'math', label: 'Mathematics' },
  { id: 'bio', label: 'Biotechnology' },
  { id: 'cs', label: 'Computer Science' },
];

const ENTITY_SUGGESTIONS: Record<string, string[]> = {
  quantum: ['#Wavefunction', '#Schrodinger', '#UncertaintyPrinciple', '#PotentialWell'],
  math: ['#LatticeTheory', '#EigenSpaces', '#TensorCalculus', '#Topology'],
  bio: ['#EnzymaticTunneling', '#CRISPR', '#Thermodynamics', '#QuantumBiology'],
  cs: ['#ShorsAlgorithm', '#NISQ', '#AlgorithmicComplexity', '#Superposition'],
};

type Status = 'idle' | 'searching' | 'loading' | 'done';

type SimilarEntry = {
  node: Node;
  match: number;
  description?: string;
};

export default function AskDoubtModal({ onClose, onAddNode }: AskDoubtModalProps) {
  const [text, setText] = useState('');
  const [subjectId, setSubjectId] = useState('quantum');
  const [bounty, setBounty] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [isSearching, setIsSearching] = useState(false);
  const [contexts, setContexts] = useState<string[]>([]);
  const [contextInput, setContextInput] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [previewNode, setPreviewNode] = useState<Node | null>(null);
  const { balance } = useTokens();

  const subjectNodes = useMemo(() => NODES.filter((node) => node.subject === subjectId), [subjectId]);
  const anchorNodeId = subjectNodes[0]?.id ?? NODES[0]?.id ?? null;

  const similarNodes = useMemo<SimilarEntry[]>(() => {
    if (!anchorNodeId) return [];
    const entries = CONNECTED_NODES_MAP[anchorNodeId] ?? [];
    const branch = entries
      .map((entry) => {
        const node = NODES.find((n) => n.id === entry.nodeId);
        if (!node) return null;
        return { node, match: entry.match, description: entry.description };
      })
      .filter(Boolean) as SimilarEntry[];
    if (branch.length) return branch.slice(0, 3);
    return subjectNodes.slice(0, 3).map((node) => ({
      node,
      match: Math.min(95, Math.max(58, 65 + (node.activity % 35))),
      description: node.title,
    }));
  }, [anchorNodeId, subjectNodes]);

  useEffect(() => {
    if (text.length > 5) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 800);
      return () => clearTimeout(timer);
    }
  }, [text]);

  useEffect(() => {
    if (similarNodes.length) {
      setPreviewNode((prev) =>
        similarNodes.some((entry) => prev?.id === entry.node.id) ? prev : similarNodes[0].node
      );
    } else {
      setPreviewNode(null);
    }
  }, [similarNodes]);

  const handleAdd = async () => {
    if (!text.trim() || status !== 'idle') return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('done');
    await new Promise((r) => setTimeout(r, 600));
    onAddNode(text, subjectId, bounty);
    setContexts([]);
    setSelectedEntities([]);
    setPostAnonymously(false);
    setShowContextInput(false);
    setContextInput('');
    setPreviewNode(null);
    onClose();
  };

  const expertsOnline = USERS.filter(
    (u) => u.expertise.includes(subjectId as any) && u.lastActive === 'Online Now'
  ).length;

  const recommendedEntities = ENTITY_SUGGESTIONS[subjectId] ?? [];
  const subjectLabel = SUBJECTS.find((s) => s.id === subjectId)?.label ?? 'Unknown subject';

  const handleAddContext = () => {
    const trimmed = contextInput.trim();
    if (!trimmed) return;
    setContexts((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setContextInput('');
    setShowContextInput(true);
  };

  const toggleEntity = (entity: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entity) ? prev.filter((value) => value !== entity) : [...prev, entity]
    );
  };

  const handleRefine = () => {
    setText('');
    setContexts([]);
    setSelectedEntities([]);
    setPreviewNode(null);
  };

  const handlePreviewAction = (node?: Node) => {
    if (node) {
      setPreviewNode(node);
    } else if (similarNodes.length) {
      setPreviewNode(similarNodes[0].node);
    }
  };

  const handleToggleAnonymous = () => {
    setPostAnonymously((prev) => !prev);
  };

  return (
    <div
      className="overlay-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        padding: '24px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-fade-in card-premium"
        style={{
          width: '100%',
          maxWidth: 780,
          maxHeight: 'calc(100vh - 48px)',
          padding: '40px',
          position: 'relative',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-mid)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'var(--bg-base)',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            width: 32,
            height: 32,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ color: 'var(--accent-primary)', marginBottom: 8 }}>
            Contextual Inquiry
          </div>
          <h2 className="font-outfit" style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)' }}>
            Ask a Doubt
          </h2>
        </div>

        <div style={{ position: 'relative', marginBottom: 28 }}>
          <textarea
            className="input-premium"
            style={{ width: '100%', height: 160, resize: 'none', fontSize: 16, lineHeight: 1.6 }}
            placeholder="What is your question? Be as specific as possible..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {isSearching && (
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div
                className="spinner"
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: '2px solid var(--accent-primary)',
                  borderTopColor: 'transparent',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>
                Searching Network...
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginBottom: 32 }}>
          <div>
            <div className="section-label" style={{ marginBottom: 12 }}>
              Categorization
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUBJECTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 99,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    background: subjectId === s.id ? 'var(--accent-primary)' : 'var(--bg-base)',
                    color: subjectId === s.id ? '#FFF' : 'var(--text-secondary)',
                    border: '1px solid',
                    borderColor: subjectId === s.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label" style={{ marginBottom: 12 }}>
              Real-time Routing
            </div>
            <div
              className="card-premium"
              style={{
                background: 'var(--bg-accent-soft)',
                border: '1px solid #E0E7FF',
                padding: '16px',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  background: '#FFF',
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent-primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)' }}>
                  {expertsOnline || '12'} Experts Online
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Average response time: &lt; 8 mins
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 999,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-base)',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: SUBJECT_COLORS[subjectId as keyof typeof SUBJECT_COLORS] || '#DDD',
                }}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                {subjectLabel}
              </span>
            </div>
            <button
              onClick={() => setShowContextInput((prev) => !prev)}
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                border: '1px solid var(--border-muted)',
                background: showContextInput ? 'var(--bg-base)' : '#f4f4ff',
                color: showContextInput ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Add Context
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
              Post Anonymously
            </span>
            <button
              onClick={handleToggleAnonymous}
              style={{
                width: 50,
                height: 26,
                borderRadius: 999,
                border: '1px solid var(--border-subtle)',
                background: postAnonymously ? 'linear-gradient(135deg, #7c6ee6, #4338ca)' : 'var(--bg-base)',
                display: 'flex',
                alignItems: 'center',
                padding: 3,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  transform: postAnonymously ? 'translateX(22px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>
        </div>

        {showContextInput && (
          <div
            style={{
              marginBottom: 16,
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <input
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              className="input-premium"
              style={{ flex: 1, minWidth: 220 }}
              placeholder="Link resource, dataset, or assumption"
            />
            <button
              onClick={handleAddContext}
              style={{
                padding: '8px 20px',
                borderRadius: 999,
                border: 'none',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        )}

        {contexts.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 16,
            }}
          >
            {contexts.map((ctx) => (
              <span
                key={ctx}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-muted)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                }}
              >
                {ctx}
              </span>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div className="section-label" style={{ marginBottom: 0 }}>
            Suggested Entities
          </div>
          <button
            onClick={handleRefine}
            style={{
              border: 'none',
              background: 'none',
              color: 'var(--accent-primary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Refine question
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 32,
          }}
        >
          {recommendedEntities.map((entity) => {
            const isActive = selectedEntities.includes(entity);
            return (
              <button
                key={entity}
                onClick={() => toggleEntity(entity)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: '1px solid',
                  borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-muted)',
                  background: isActive ? 'var(--bg-accent-soft)' : 'var(--bg-base)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {entity}
                {isActive && (
                  <span style={{ fontSize: 11, color: 'var(--accent-primary)' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <div className="section-label">Similar Nodes in Network</div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {similarNodes.length} matches
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {similarNodes.map(({ node, match, description }) => (
              <div
                key={node.id}
                className="card-premium"
                style={{
                  padding: 16,
                  borderRadius: 18,
                  border: '1px solid var(--border-subtle)',
                  minHeight: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <MatchBadge match={match} />
                  <button
                    onClick={() => handlePreviewAction(node)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {node.title}
                </p>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {description}
                </div>
                <div
                  style={{
                    marginTop: 'auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>Asked by {node.asker}</span>
                  <span>{node.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {previewNode && (
          <div
            className="card-premium"
            style={{
              marginBottom: 24,
              borderRadius: 20,
              padding: '18px 22px',
              background: 'var(--bg-accent-soft)',
              border: '1px solid #E0E7FF',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>
                  Preview Node
                </div>
                <p
                  style={{
                    margin: '6px 0',
                    fontSize: 16,
                    fontWeight: 700,
                    lineHeight: 1.4,
                  }}
                >
                  {previewNode.title}
                </p>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Asked by {previewNode.asker} • {previewNode.time}
                </div>
              </div>
              <button
                onClick={() => setPreviewNode(null)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 18,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flex: 1,
              minWidth: 280,
            }}
          >
            <div className="section-label">Bounty (★)</div>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={bounty}
              onChange={(e) => setBounty(parseInt(e.target.value, 10))}
              style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
            />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent-warning)', width: 40 }}>
              {bounty}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Balance: {balance ?? 0}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => handlePreviewAction()}
              style={{
                padding: '12px 22px',
                borderRadius: 12,
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-base)',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: 140,
              }}
            >
              Preview Node
            </button>
            <button
              onClick={handleAdd}
              disabled={!text.trim() || status !== 'idle'}
              className="btn-pill btn-pill-primary"
              style={{
                height: 52,
                padding: '0 40px',
                fontSize: 15,
                boxShadow: text.length > 20 ? '0 8px 24px rgba(79, 70, 229, 0.3)' : 'none',
                transform: text.length > 20 ? 'scale(1.02)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
            >
              {status === 'loading' ? 'Encrypting...' : status === 'done' ? '✓ Networked' : 'ADD TO NETWORK →'}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .spinner { border-top-color: transparent !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
