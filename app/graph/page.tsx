'use client';

import { Suspense } from 'react';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { NODES, EDGES, Node, Subject } from '@/data/seed';
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

  const [allNodes, setAllNodes] = useState<Node[]>(NODES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(
    preselect ? NODES.find((n) => n.id === preselect) ?? null : null
  );
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);

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
      'Quantum Mechanics': 'quantum',
      Mathematics: 'math',
      Biotechnology: 'bio',
      'Computer Science': 'cs',
      Topology: 'math',
    };

    const nodeId = `n${Date.now()}`;
    
    if (bounty > 0) {
      spendTokens(bounty, `Bounty for: ${title.slice(0, 30)}...`, nodeId);
    }

    const newNode: Node = {
      id: nodeId,
      subject: (subjectMap[subject] ?? 'quantum') as Subject,
      title,
      status: 'active',
      activity: 1,
      asker: 'Alex Rivera',
      time: 'just now',
      isNew: true,
    };

    setAllNodes((prev) => [...prev, newNode]);
  }, [spendTokens]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar activeFilters={activeFilters} onFilterToggle={handleFilterToggle} />

        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <Graph
            nodes={allNodes}
            edges={EDGES}
            selectedNodeId={selectedNode?.id ?? null}
            activeFilters={activeFilters}
            onNodeClick={handleNodeClick}
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
