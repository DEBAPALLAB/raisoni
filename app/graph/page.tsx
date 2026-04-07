'use client';

import { Suspense } from 'react';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { NODES, EDGES, Node, Subject, TOPICS, SUBTOPICS, Topic, SubTopic } from '@/data/seed';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import NodePanel from '@/components/NodePanel';
import AskDoubtModal from '@/components/AskDoubtModal';
import dynamic from 'next/dynamic';
import { useTokens } from '@/context/TokenContext';

const Graph = dynamic(() => import('@/components/Graph'), { ssr: false });

function GraphContent() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get('node');

  const [viewLayer, setViewLayer] = useState<'topics' | 'subtopics' | 'questions'>('topics');
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [activeSubTopicId, setActiveSubTopicId] = useState<string | null>(null);

  const [allNodes, setAllNodes] = useState<Node[]>(NODES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(
    preselect ? NODES.find((n) => n.id === preselect) ?? null : null
  );
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Derived data for the graph
  const getGraphNodes = () => {
    if (viewLayer === 'topics') return TOPICS;
    if (viewLayer === 'subtopics') return SUBTOPICS.filter(s => s.topicId === activeTopicId);
    return allNodes.filter(n => n.subTopicId === activeSubTopicId);
  };

  const handleDrillDown = useCallback((id: string) => {
    if (id === 'topics' || id === 'subtopics' || id === 'questions') {
      setViewLayer(id as any);
      return;
    }

    if (viewLayer === 'topics') {
      setActiveTopicId(id);
      setViewLayer('subtopics');
    } else if (viewLayer === 'subtopics') {
      setActiveSubTopicId(id);
      setViewLayer('questions');
    }
  }, [viewLayer]);

  const resetTo = (layer: 'topics' | 'subtopics') => {
    if (layer === 'topics') {
      setActiveTopicId(null);
      setActiveSubTopicId(null);
      setViewLayer('topics');
    } else if (layer === 'subtopics') {
      setActiveSubTopicId(null);
      setViewLayer('subtopics');
    }
  };

  const currentTopic = TOPICS.find(t => t.id === activeTopicId);
  const currentSubTopic = SUBTOPICS.find(s => s.id === activeSubTopicId);

  const handleFilterToggle = useCallback((subject: Subject) => {
    setActiveFilters((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  }, []);

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node);
  }, []);

  const { spendTokens } = useTokens();

  const handleAddNode = useCallback((title: string, subject: string, bounty: number) => {
    const subjectMap: Record<string, Subject> = {
      'Quantum Mechanics': 'quantum', Mathematics: 'math', Biotechnology: 'bio', 'Computer Science': 'cs', Topology: 'math',
    };

    const nodeId = `n${Date.now()}`;
    if (bounty > 0) spendTokens(bounty, `Bounty for: ${title.slice(0, 30)}...`, nodeId);

    const newNode: Node = {
      id: nodeId,
      subject: (subjectMap[subject] ?? 'quantum') as Subject,
      title,
      status: 'active',
      activity: 1,
      asker: 'Alex Rivera',
      time: 'just now',
      isNew: true,
      subTopicId: activeSubTopicId || 'sq1', // Default to current drift or sq1
    };

    setAllNodes((prev) => [...prev, newNode]);
  }, [spendTokens, activeSubTopicId]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F8F9FF' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar activeFilters={activeFilters} onFilterToggle={handleFilterToggle} />

        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          
          {/* Breadcrumb HUD */}
          <div style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 20px', background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(148,163,184,0.3)', borderRadius: 16,
            backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(15,23,42,0.08)',
          }}>
            <button onClick={() => resetTo('topics')} style={{ 
              fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>ROOT</button>
            
            {activeTopicId && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.3 }}><path d="m9 18 6-6-6-6"/></svg>
                <button onClick={() => resetTo('subtopics')} style={{ 
                  fontSize: 11, fontWeight: 700, color: currentTopic?.color || 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer',
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>{currentTopic?.label || activeTopicId}</button>
              </>
            )}

            {activeSubTopicId && (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.3 }}><path d="m9 18 6-6-6-6"/></svg>
                <div style={{ 
                  fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', 
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>{currentSubTopic?.label}</div>
              </>
            )}
          </div>

          <Graph
            nodes={getGraphNodes()}
            edges={EDGES}
            selectedNodeId={selectedNode?.id ?? null}
            activeFilters={activeFilters}
            viewLayer={viewLayer}
            onNodeClick={handleNodeClick}
            onDrillDown={handleDrillDown}
          />

          {selectedNode && (
            <NodePanel node={selectedNode} onClose={() => setSelectedNode(null)} />
          )}
        </main>
      </div>

      {showModal && (
        <AskDoubtModal onClose={() => setShowModal(false)} onAddNode={handleAddNode} />
      )}
    </div>
  );
}

export default function GraphPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-base)',
            color: 'var(--text-muted)',
            fontFamily: 'DM Mono, monospace',
            fontSize: 12,
            letterSpacing: '0.1em',
          }}
        >
          LOADING KNOWLEDGE GRAPH...
        </div>
      }
    >
      <GraphContent />
    </Suspense>
  );
}
