'use client';

import { useState } from 'react';
import { NODES } from '@/data/seed';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import { Subject } from '@/data/seed';

export default function PathwaysPage() {
  const [activeFilters, setActiveFilters] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar 
          activeFilters={activeFilters} 
          onFilterToggle={(s) => setActiveFilters(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} 
        />

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
             {/* Simple grid lines to match the aesthetic */}
             <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--border-mid) 1px, transparent 1px), linear-gradient(180deg, var(--border-mid) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>
          
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 640 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>PATHWAYS / KNOWLEDGE SEQUENCING</div>
            <h1 className="font-syne" style={{ fontSize: 44, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.01em' }}>
              Structured Learning <span style={{ color: 'var(--accent-soft)' }}>Pathways</span>
            </h1>
            <p className="font-cormorant" style={{ fontStyle: 'italic', fontSize: 20, color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
              "Knowledge is not just a collection of nodes, but the paths that connect them over time. Build your sequence."
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: '0 20px' }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '32px', textAlign: 'left' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(124,110,230,0.1)', border: '1px solid rgba(124,110,230,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="1.5"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>
                </div>
                <h3 className="font-syne" style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Quantum Foundations</h3>
                <p className="font-dm-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>SEQUENCE: N1 → N2 → N6 → N7</p>
                <div style={{ marginTop: 20, padding: '6px 12px', border: '1px solid var(--border-mid)', borderRadius: 6, display: 'inline-block', fontSize: 11, fontFamily: 'DM Mono', color: 'var(--text-secondary)' }}>
                  ENABLE PATHWAY ✦
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '32px', textAlign: 'left', opacity: 0.8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="1.5"><path d="M4 4h16v16H4zM12 2v4M12 18v4M2 12h4M18 12h4"/></svg>
                </div>
                <h3 className="font-syne" style={{ fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>Mathematical Bases</h3>
                <p className="font-dm-mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>SEQUENCE: N2 → N5 → N1</p>
                <div style={{ marginTop: 20, padding: '6px 12px', border: '1px solid var(--border-mid)', borderRadius: 6, display: 'inline-block', fontSize: 11, fontFamily: 'DM Mono', color: 'var(--text-secondary)' }}>
                  RESTRICTED ACCESS
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 60, opacity: 0.5 }}>
              <div className="section-label" style={{ fontSize: 10 }}>[ AI GENERATED PATHS LOADING IN FULL RELEASE ]</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
