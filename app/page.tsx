'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import PulseFeed from '@/components/PulseFeed';
import PeersPanel from '@/components/PeersPanel';
import AskDoubtModal from '@/components/AskDoubtModal';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Topbar onAskDoubt={() => setShowModal(true)} />
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar 
          activeFilters={activeFilters as any} 
          onFilterToggle={(s) => setActiveFilters((p) => p.includes(s) ? p.filter(x => x !== s) : [...p, s])} 
        />
        
        <main style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-base)' }}>
          <PulseFeed />
          <PeersPanel />
        </main>
      </div>

      {showModal && (
        <AskDoubtModal 
          onClose={() => setShowModal(false)} 
          onAddNode={(title, subject, bounty) => {
            console.log('Node added:', title, subject, bounty);
            setShowModal(false);
          }} 
        />
      )}
    </div>
  );
}
