'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';
import { useTokens } from '@/context/TokenContext';

const REWARDS_DATA = [
  { id: 'r1', title: 'Zomato Voucher worth 250', category: 'Academic', points: 2500, image: '📚', description: 'Zomato Voucher worth 250' },
  { id: 'r2', title: 'Cloud Credit Bundle', category: 'Computing', points: 5000, image: '☁️', description: 'Get $50 worth of compute credits for high-performance quantum simulations.' },
  { id: 'r3', title: 'Spotify Premium 3 months', category: 'Discounts', points: 8000, image: '🤝', description: 'Spotify Premium 3 months' },
  { id: 'r4', title: 'IEEE Membership Sub', category: 'Professional', points: 12000, image: '🎓', description: 'Full annual membership fees covered for the IEEE professional society.' },
  { id: 'r5', title: 'Solvi Merch Pack', category: 'Physical', points: 3500, image: '👕', description: 'Premium hoodie and stickers featuring the Solvi geometric pulse logo.' },
  { id: 'r6', title: 'Conference Travel Grant', category: 'Experience', points: 25000, image: '✈️', description: 'Partial funding for travel and lodging at major tech/science conferences.' },
];

export default function RewardsPage() {
  const { balance } = useTokens();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const handleRedeem = (id: string, cost: number) => {
    if (balance < cost) {
      alert("Insufficient Token Balance!");
      return;
    }
    setRedeeming(id);
    setTimeout(() => {
      alert("Reward Redeemed Successfully! Check your email for details.");
      setRedeeming(null);
    }, 1500);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F8F9FF' }}>
      <Topbar onAskDoubt={() => { }} />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar activeFilters={[]} onFilterToggle={() => { }} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
          {/* Header Section */}
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.02em' }}>Rewards Hub</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Turn your knowledge contributions into tangible academic and professional growth.</p>
          </div>

          {/* Points Overview Card */}
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            borderRadius: 24, padding: 40, marginBottom: 48, position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(79, 70, 229, 0.2)', color: 'white'
          }}>
            <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Available Balance</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 48, fontWeight: 800 }}>{balance}</span>
                  <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.2)', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>TOKENS</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.8, marginBottom: 8 }}>Next Milestone</div>
                <div style={{ width: 240, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                  <div style={{ width: '65%', height: '100%', background: 'white' }} />
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>650 / 1000 to silver rank</div>
              </div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, paddingBottom: 60
          }}>
            {REWARDS_DATA.map((r) => (
              <div key={r.id} className="reward-card" style={{
                background: 'white', borderRadius: 20, border: '1px solid rgba(148,163,184,0.2)',
                padding: 24, display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{
                  width: 56, height: 56, background: '#F1F5F9', borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: 28, marginBottom: 20
                }}>
                  <div style={{ margin: 'auto' }}>{r.image}</div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                  {r.category}
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{r.title}</h3>

                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1, marginBottom: 24 }}>
                  {r.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{r.points}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>pts</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(r.id, r.points)}
                    disabled={redeeming === r.id || balance < r.points}
                    style={{
                      background: balance < r.points ? '#F1F5F9' : 'var(--text-primary)',
                      color: balance < r.points ? 'var(--text-muted)' : 'white',
                      border: 'none', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 600,
                      cursor: balance < r.points ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    {redeeming === r.id ? 'Processing...' : (balance < r.points ? 'Lock' : 'Redeem')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .reward-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: var(--accent-primary);
        }
      `}</style>
    </div>
  );
}
