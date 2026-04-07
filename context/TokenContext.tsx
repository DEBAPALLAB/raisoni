'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TokenState {
  balance: number;
  bounties: Record<string, number>; // nodeId -> amount
  transactions: Array<{ id: string; amount: number; type: 'earn' | 'spend'; reason: string; time: string }>;
}

interface TokenContextType extends TokenState {
  spendTokens: (amount: number, reason: string, nodeId?: string) => boolean;
  earnTokens: (amount: number, reason: string) => void;
  getBountyForNode: (nodeId: string) => number;
  claimBounty: (nodeId: string, answerId: string, winnerId: string) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<TokenState>({
    balance: 500, // Starting balance for demo
    bounties: {
      'n2': 50,
      'n4': 120,
    },
    transactions: [
      { id: 't1', amount: 500, type: 'earn', reason: 'Initial Grant', time: '1d ago' },
      { id: 't2', amount: 50, type: 'spend', reason: 'Bounty: Schrodinger Basis', time: '5h ago' },
    ],
  });

  // Persist to local storage for demo "realism"
  useEffect(() => {
    const saved = localStorage.getItem('ethereal_tokens');
    if (saved) {
      setState(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ethereal_tokens', JSON.stringify(state));
  }, [state]);

  const spendTokens = (amount: number, reason: string, nodeId?: string) => {
    if (state.balance < amount) return false;

    setState(prev => ({
      ...prev,
      balance: prev.balance - amount,
      bounties: nodeId ? { ...prev.bounties, [nodeId]: amount } : prev.bounties,
      transactions: [
        { id: `txn-${Date.now()}`, amount, type: 'spend', reason, time: 'Just now' },
        ...prev.transactions
      ]
    }));
    return true;
  };

  const earnTokens = (amount: number, reason: string) => {
    setState(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [
        { id: `txn-${Date.now()}`, amount, type: 'earn', reason, time: 'Just now' },
        ...prev.transactions
      ]
    }));
  };

  const getBountyForNode = (nodeId: string) => state.bounties[nodeId] || 0;

  const claimBounty = (nodeId: string, answerId: string, winnerId: string) => {
    const amount = state.bounties[nodeId];
    if (!amount) return;

    // Logic: Winner gets 80%, rest is "taxed" or distributed to network
    const winnerReward = Math.floor(amount * 0.8);
    
    setState(prev => {
      const newBounties = { ...prev.bounties };
      delete newBounties[nodeId];
      return {
        ...prev,
        bounties: newBounties,
        // In a real app, winnerId (another user) would get the tokens. 
        // For demo, if it's "not me", we just clear the bounty.
        // If it was "us" answering, we'd add it to balance.
      };
    });

    console.log(`Bounty of ${amount} claimed for node ${nodeId}. Winner ${winnerId} receives ${winnerReward} tokens.`);
  };

  return (
    <TokenContext.Provider value={{ ...state, spendTokens, earnTokens, getBountyForNode, claimBounty }}>
      {children}
    </TokenContext.Provider>
  );
};

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) throw new Error('useTokens must be used within a TokenProvider');
  return context;
};
