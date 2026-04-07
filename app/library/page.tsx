'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NODES, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import Badge from '@/components/Badge';
import { Subject } from '@/data/seed';

export default function LibraryPage() {
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);

  const filteredNodes = activeFilters.length > 0 
    ? NODES.filter(n => activeFilters.includes(n.subject))
    : NODES;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar 
          activeFilters={activeFilters} 
          onFilterToggle={(s) => setActiveFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} 
        />

        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 32px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                <h1 className="font-syne" style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                  Knowledge Library
                </h1>
                <p className="font-dm-mono" style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                  EXPLORE {NODES.length} NODES ACROSS THE NETWORK
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="pill-btn">Recent</div>
                <div className="pill-btn">Most Active</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '80px 1fr 140px 100px 100px',
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderBottom: '1px solid var(--border-mid)',
                borderRadius: '8px 8px 0 0'
              }}>
                <span className="section-label">ID</span>
                <span className="section-label">TITLE / QUESTION</span>
                <span className="section-label">SUBJECT</span>
                <span className="section-label">STATUS</span>
                <span className="section-label">ACTIVITY</span>
              </div>

              {filteredNodes.map((node) => (
                <Link 
                  key={node.id} 
                  href={`/node/${node.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="nav-item" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '80px 1fr 140px 100px 100px',
                    padding: '16px',
                    background: 'var(--bg-surface)',
                    borderBottom: '1px solid var(--border-subtle)',
                    borderRadius: 0,
                    alignItems: 'center'
                  }}>
                    <span className="font-dm-mono" style={{ fontSize: 12, color: 'var(--text-muted)' }}>{node.id.toUpperCase()}</span>
                    <span className="font-syne" style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 20 }}>
                      {node.title}
                    </span>
                    <span style={{ color: SUBJECT_COLORS[node.subject], fontFamily: 'DM Mono', fontSize: 11, textTransform: 'uppercase' }}>
                      {SUBJECT_LABELS[node.subject]}
                    </span>
                    <div>
                      <Badge variant={node.status === 'solved' ? 'green' : node.status === 'active' ? 'violet' : 'amber'}>
                        {node.status}
                      </Badge>
                    </div>
                    <span className="font-dm-mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {node.activity} links
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredNodes.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="font-dm-mono" style={{ fontSize: 14 }}>NO NODES MATCH THE SELECTED FILTERS</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
