'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  NODES as SEED_NODES,
  ANSWERS as SEED_ANSWERS,
  SUBTOPICS,
  type Node,
  type Answer,
  type Subject,
} from '@/data/seed';

// ─── Reward config ─────────────────────────────────────────────────────────
export const REWARD_CONFIG = {
  askDoubt: 0,           // Tokens spent when asking a doubt (0 = free)
  answerPosted: 5,       // Tokens earned for posting any answer
  answerAccepted: 40,    // Tokens earned when answer is marked as top insight
  helpfulMark: 15,       // Tokens earned per "helpful" mark
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────
type UserTokenMap = Record<string, number>; // userId -> token balance

interface KnowledgeState {
  nodes: Node[];
  answers: Answer[];
  userTokens: UserTokenMap;
}

interface KnowledgeContextType {
  nodes: Node[];
  answers: Answer[];
  getUserBalance: (userId: string) => number;
  addNode: (node: Node) => void;
  addAnswer: (answer: Omit<Answer, 'id'>) => Answer;
  markTopInsight: (answerId: string, nodeId: string, currentUserId: string) => void;
  getAnswersForNode: (nodeId: string) => Answer[];
  getNodesForUser: (userId: string | undefined, userName: string | undefined) => Node[];
  getAnswersByUser: (userId: string) => Answer[];
  earnTokensForUser: (userId: string, amount: number) => void;
}

// ─── Storage ────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'solvi_knowledge_v2';

function loadState(): KnowledgeState {
  if (typeof window === 'undefined') {
    return { nodes: SEED_NODES, answers: SEED_ANSWERS, userTokens: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { nodes: SEED_NODES, answers: SEED_ANSWERS, userTokens: {} };
    const saved: KnowledgeState = JSON.parse(raw);

    // Merge: seed nodes that don't exist yet in saved state
    const savedIds = new Set(saved.nodes.map((n) => n.id));
    const mergedNodes = [
      ...saved.nodes,
      ...SEED_NODES.filter((n) => !savedIds.has(n.id)),
    ];

    const savedAnswerIds = new Set(saved.answers.map((a) => a.id));
    const mergedAnswers = [
      ...saved.answers,
      ...SEED_ANSWERS.filter((a) => !savedAnswerIds.has(a.id)),
    ];

    return {
      nodes: mergedNodes,
      answers: mergedAnswers,
      userTokens: saved.userTokens ?? {},
    };
  } catch {
    return { nodes: SEED_NODES, answers: SEED_ANSWERS, userTokens: {} };
  }
}

function saveState(state: KnowledgeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

// ─── Context ─────────────────────────────────────────────────────────────────
const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined);

let idCounter = Date.now();
const genId = (prefix: string) => `${prefix}_${(++idCounter).toString(36)}`;

export function KnowledgeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<KnowledgeState>(() => ({
    nodes: SEED_NODES,
    answers: SEED_ANSWERS,
    userTokens: {},
  }));

  // Hydrate from localStorage once on mount (client only)
  useEffect(() => {
    setState(loadState());
  }, []);

  // Persist on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const addNode = useCallback((node: Node) => {
    setState((prev) => {
      if (prev.nodes.some((n) => n.id === node.id)) return prev;
      return { ...prev, nodes: [node, ...prev.nodes] };
    });
  }, []);

  const addAnswer = useCallback((answerData: Omit<Answer, 'id'>): Answer => {
    const answer: Answer = { ...answerData, id: genId('ans') };
    setState((prev) => {
      // Reward author for posting an answer
      const currentBalance = prev.userTokens[answer.authorId] ?? 500;
      return {
        ...prev,
        answers: [...prev.answers, answer],
        userTokens: {
          ...prev.userTokens,
          [answer.authorId]: currentBalance + REWARD_CONFIG.answerPosted,
        },
      };
    });
    return answer;
  }, []);

  const markTopInsight = useCallback(
    (answerId: string, nodeId: string, currentUserId: string) => {
      setState((prev) => {
        const answer = prev.answers.find((a) => a.id === answerId);
        if (!answer || answer.isTopInsight) return prev;

        const authorId = answer.authorId;
        const currentBalance = prev.userTokens[authorId] ?? 500;

        const updatedAnswers = prev.answers.map((a) => {
          if (a.nodeId === nodeId) {
            return { ...a, isTopInsight: a.id === answerId };
          }
          return a;
        });

        const updatedNodes = prev.nodes.map((n) =>
          n.id === nodeId ? { ...n, status: 'solved' as const } : n
        );

        return {
          ...prev,
          answers: updatedAnswers,
          nodes: updatedNodes,
          userTokens: {
            ...prev.userTokens,
            [authorId]: currentBalance + REWARD_CONFIG.answerAccepted,
          },
        };
      });
    },
    []
  );

  const earnTokensForUser = useCallback((userId: string, amount: number) => {
    setState((prev) => {
      const currentBalance = prev.userTokens[userId] ?? 500;
      return {
        ...prev,
        userTokens: {
          ...prev.userTokens,
          [userId]: currentBalance + amount,
        },
      };
    });
  }, []);

  const getUserBalance = useCallback(
    (userId: string) => state.userTokens[userId] ?? 500,
    [state.userTokens]
  );

  const getAnswersForNode = useCallback(
    (nodeId: string) => state.answers.filter((a) => a.nodeId === nodeId),
    [state.answers]
  );

  const getNodesForUser = useCallback(
    (userId: string | undefined, userName: string | undefined) => {
      if (!userId && !userName) return [];
      return state.nodes.filter(
        (n) => n.asker === userName
      );
    },
    [state.nodes]
  );

  const getAnswersByUser = useCallback(
    (userId: string) => state.answers.filter((a) => a.authorId === userId),
    [state.answers]
  );

  const value = useMemo<KnowledgeContextType>(
    () => ({
      nodes: state.nodes,
      answers: state.answers,
      getUserBalance,
      addNode,
      addAnswer,
      markTopInsight,
      getAnswersForNode,
      getNodesForUser,
      getAnswersByUser,
      earnTokensForUser,
    }),
    [
      state.nodes,
      state.answers,
      getUserBalance,
      addNode,
      addAnswer,
      markTopInsight,
      getAnswersForNode,
      getNodesForUser,
      getAnswersByUser,
      earnTokensForUser,
    ]
  );

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  );
}

export function useKnowledge() {
  const ctx = useContext(KnowledgeContext);
  if (!ctx) throw new Error('useKnowledge must be used within KnowledgeProvider');
  return ctx;
}

// ─── Helper: map subject → first matching subtopic id ─────────────────────
export function getSubTopicForSubject(subjectId: Subject): string | undefined {
  return SUBTOPICS.find((st) => st.topicId === subjectId)?.id;
}
