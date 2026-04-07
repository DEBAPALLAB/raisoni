export type Subject = 'quantum' | 'math' | 'bio' | 'cs';
export type NodeStatus = 'solved' | 'active' | 'pending';
export type EdgeType = 'similarity' | 'concept';

export interface Topic {
  id: Subject;
  label: string;
  color: string;
  icon: string;
}

export interface SubTopic {
  id: string;
  topicId: Subject;
  label: string;
}

export const TOPICS: Topic[] = [
  { id: 'quantum', label: 'Quantum Physics', color: '#7C6EE6', icon: 'Ψ' },
  { id: 'math', label: 'Mathematics', color: '#EC4899', icon: 'Σ' },
  { id: 'bio', label: 'Biotechnology', color: '#10B981', icon: '⊕' },
  { id: 'cs', label: 'Computer Science', color: '#3B82F6', icon: '⊞' },
  { id: 'chem', label: 'Chemistry', color: '#F59E0B', icon: '⌬' },
  { id: 'eng', label: 'Engineering', color: '#6366F1', icon: '⚙' },
  { id: 'phil', label: 'Philosophy', color: '#8B5CF6', icon: '⧑' },
  { id: 'med', label: 'Medicine', color: '#EF4444', icon: '⚕' },
];

export const SUBTOPICS: SubTopic[] = [
  { id: 'sq1', topicId: 'quantum', label: 'Wavefunction & Superposition' },
  { id: 'sq2', topicId: 'quantum', label: 'Decoherence & Measurement' },
  { id: 'sq3', topicId: 'quantum', label: 'Quantum Computing' },
  { id: 'sm1', topicId: 'math', label: 'Lattice & Topology' },
  { id: 'sm2', topicId: 'math', label: 'Abstract Algebra' },
  { id: 'sb1', topicId: 'bio', label: 'Quantum Biology' },
  { id: 'sb2', topicId: 'bio', label: 'Genomics' },
  { id: 'sc1', topicId: 'cs', label: 'Algorithms' },
  { id: 'sc2', topicId: 'cs', label: 'Systems & Architecture' },
  { id: 'sch1', topicId: 'chem', label: 'Organic Synthesis' },
  { id: 'sch2', topicId: 'chem', label: 'Molecular Dynamics' },
  { id: 'sph1', topicId: 'phil', label: 'Epistemology' },
  { id: 'sph2', topicId: 'phil', label: 'Ethics of AI' },
  { id: 'sen1', topicId: 'eng', label: 'Robotics' },
  { id: 'smd1', topicId: 'med', label: 'Neuroscience' },
];

export const TOPIC_EDGES: Edge[] = [
  { source: 'quantum', target: 'math', type: 'concept' },
  { source: 'cs', target: 'math', type: 'concept' },
  { source: 'bio', target: 'chem', type: 'concept' },
  { source: 'chem', target: 'med', type: 'concept' },
  { source: 'phil', target: 'cs', type: 'concept' },
  { source: 'quantum', target: 'bio', type: 'concept' },
  { source: 'eng', target: 'cs', type: 'concept' },
];

export interface Node {
  id: string;
  subject: Subject;
  subTopicId?: string;
  title: string;
  status: NodeStatus;
  activity: number;
  asker: string;
  time: string;
  x?: number;
  y?: number;
  isNew?: boolean;
}

export interface Edge {
  source: string;
  target: string;
  type: EdgeType;
}

export interface User {
  id: string;
  name: string;
  role: 'Student' | 'Expert' | 'Faculty';
  initials: string;
  color: string;
  expertise: Subject[];
  reputation: number;
  lastActive: string;
}

export interface Answer {
  id: string;
  nodeId: string;
  authorId: string;
  body: string;
  upvotes: number;
  isTopInsight: boolean;
  isExpert: boolean;
  time: string;
}

export const NODES: Node[] = [
  {
    id: 'n1',
    subject: 'quantum',
    subTopicId: 'sq1',
    title: 'How does wave-particle duality affect signal transmission in silicon nanostructures?',
    status: 'solved',
    activity: 24,
    asker: 'Alex Rivera',
    time: '2h ago',
  },
  {
    id: 'n2',
    subject: 'math',
    subTopicId: 'sm1',
    title: "Schrödinger's Equation Basis — deriving the time-independent form",
    status: 'active',
    activity: 12,
    asker: 'Julian V.',
    time: '5h ago',
  },
  {
    id: 'n3',
    subject: 'bio',
    subTopicId: 'sb1',
    title: 'Enzymatic Quantum Tunneling in ATP synthesis pathways',
    status: 'active',
    activity: 48,
    asker: 'Priya S.',
    time: '12m ago',
    isNew: true,
  },
  {
    id: 'n4',
    subject: 'quantum',
    subTopicId: 'sq1',
    title: "Can Schrödinger's Cat exist in macro-scale biological systems?",
    status: 'pending',
    activity: 3,
    asker: 'Julian V.',
    time: '2h ago',
  },
  {
    id: 'n5',
    subject: 'math',
    subTopicId: 'sm1',
    title: 'Lattice Theory and crystal symmetry groups — intro resources?',
    status: 'solved',
    activity: 6,
    asker: 'Elena R.',
    time: '3d ago',
  },
  {
    id: 'n6',
    subject: 'quantum',
    subTopicId: 'sq2',
    title: 'How does the observer effect impact wave function collapse in larger molecular structures?',
    status: 'solved',
    activity: 47,
    asker: 'Dr. Aris V.',
    time: '40m ago',
  },
  {
    id: 'n7',
    subject: 'cs',
    subTopicId: 'sc1',
    title: 'Quantum computing gate operations — superposition vs classical bit states',
    status: 'active',
    activity: 19,
    asker: 'Leo T.',
    time: '6h ago',
  },
  {
    id: 'n8',
    subject: 'quantum',
    subTopicId: 'sq3',
    title: 'Probability density functions in logic gate states at quantum scale',
    status: 'pending',
    activity: 82,
    asker: 'Sarah K.',
    time: '2m ago',
    isNew: true,
  },
  {
    id: 'n9',
    subject: 'cs',
    subTopicId: 'sc1',
    title: 'Implementing Shor\'s algorithm on NISQ-era hardware — complexity bounds?',
    status: 'pending',
    activity: 15,
    asker: 'Alex Rivera',
    time: '15m ago',
    isNew: true,
  },
  {
    id: 'n10',
    subject: 'bio',
    subTopicId: 'sb2',
    title: 'CRISPR-Cas9 target specificity in extreme thermophiles',
    status: 'active',
    activity: 31,
    asker: 'Elena R.',
    time: '1h ago',
  },
];

export const EDGES: Edge[] = [
  { source: 'n1', target: 'n2', type: 'similarity' },
  { source: 'n1', target: 'n3', type: 'concept' },
  { source: 'n1', target: 'n5', type: 'concept' },
  { source: 'n2', target: 'n4', type: 'similarity' },
  { source: 'n4', target: 'n6', type: 'similarity' },
  { source: 'n6', target: 'n7', type: 'concept' },
  { source: 'n6', target: 'n2', type: 'similarity' },
  { source: 'n3', target: 'n4', type: 'concept' },
  { source: 'n7', target: 'n1', type: 'similarity' },
  { source: 'n5', target: 'n2', type: 'concept' },
  { source: 'n8', target: 'n1', type: 'concept' },
  { source: 'n8', target: 'n4', type: 'similarity' },
  { source: 'n9', target: 'n7', type: 'similarity' },
  { source: 'n10', target: 'n3', type: 'concept' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', role: 'Student', initials: 'AR', color: '#7C6EE6', expertise: ['cs'], reputation: 120, lastActive: 'Online Now' },
  { id: 'u2', name: 'Julian V.', role: 'Student', initials: 'JV', color: '#60A5FA', expertise: ['math'], reputation: 45, lastActive: '5m ago' },
  { id: 'u3', name: 'Priya S.', role: 'Student', initials: 'PS', color: '#4ADE80', expertise: ['bio'], reputation: 88, lastActive: 'Online Now' },
  { id: 'u4', name: 'Elena R.', role: 'Expert', initials: 'ER', color: '#F59E0B', expertise: ['math', 'bio'], reputation: 840, lastActive: '3m ago' },
  { id: 'u5', name: 'Dr. Aris V.', role: 'Faculty', initials: 'AV', color: '#F472B6', expertise: ['quantum'], reputation: 2500, lastActive: '12m ago' },
  { id: 'u6', name: 'Leo T.', role: 'Student', initials: 'LT', color: '#60A5FA', expertise: ['cs', 'math'], reputation: 156, lastActive: 'Online Now' },
  { id: 'u7', name: 'Sarah K.', role: 'Expert', initials: 'SK', color: '#F59E0B', expertise: ['quantum'], reputation: 420, lastActive: 'Online Now' },
  { id: 'u8', name: 'Sarah Jenkins', role: 'Expert', initials: 'SJ', color: '#F59E0B', expertise: ['quantum', 'bio'], reputation: 1120, lastActive: 'Online Now' },
];

export const ANSWERS: Answer[] = [
  {
    id: 'a1',
    nodeId: 'n6',
    authorId: 'u8',
    body: "The transition from quantum to classical behavior in larger molecular structures, like C60 fullerenes, is primarily governed by environmental decoherence. The 'observer' doesn't necessarily need to be human; any interaction that carries away information about the molecule's path acts as a measurement. At room temperature, molecular collisions with air molecules happen on timescales of femtoseconds — far faster than any quantum coherence can be maintained.",
    upvotes: 124,
    isTopInsight: true,
    isExpert: true,
    time: '35m ago',
  },
  {
    id: 'a2',
    nodeId: 'n6',
    authorId: 'u6',
    body: "I read a paper recently about phonon interactions in crystals acting as continuous observers. It seems the scale of the structure directly correlates to the rate of decoherence. Larger structures simply have more degrees of freedom available for thermalization.",
    upvotes: 42,
    isTopInsight: false,
    isExpert: false,
    time: '28m ago',
  },
  {
    id: 'a3',
    nodeId: 'n6',
    authorId: 'u4',
    body: "This is related to the Quantum Darwinism framework proposed by Zurek. The environment doesn't just cause decoherence — it broadcasts information about the system's state, making certain classical outcomes robust and redundantly encoded. That redundancy is why macroscopic objects appear classical.",
    upvotes: 38,
    isTopInsight: false,
    isExpert: true,
    time: '15m ago',
  },
  {
    id: 'a4',
    nodeId: 'n6',
    authorId: 'u2',
    body: "Great question. Have you looked into the Penrose–Hameroff orchestrated objective reduction theory? They argue that quantum effects in microtubules might persist longer than the standard decoherence model predicts, due to ordered water molecules creating a protected quantum environment.",
    upvotes: 19,
    isTopInsight: false,
    isExpert: false,
    time: '10m ago',
  },
  {
    id: 'a5',
    nodeId: 'n1',
    authorId: 'u8',
    body: "The phenomenon introduces quantum noise floor limits. In silicon nanostructures below 7nm, electron wave-packets exhibit interference patterns that can lead to unintentional tunneling between adjacent logic gates. This fundamentally limits transistor density and introduces stochastic switching behavior not present in classical devices.",
    upvotes: 88,
    isTopInsight: true,
    isExpert: true,
    time: '1h ago',
  },
];

export const CONNECTED_NODES_MAP: Record<string, Array<{ nodeId: string; match: number; description: string }>> = {
  n1: [
    { nodeId: 'n7', match: 85, description: 'Quantum gate operations share interference principles with nanostructure signal paths' },
    { nodeId: 'n8', match: 72, description: 'Probability density functions in logic gate states at quantum scale' },
    { nodeId: 'n2', match: 68, description: "Schrödinger's equation basis underlies all wave-particle phenomena" },
  ],
  n6: [
    { nodeId: 'n4', match: 85, description: "Macroscopic superposition and its limitations in biological systems" },
    { nodeId: 'n2', match: 62, description: 'Copenhagen Interpretation — historical context of wave function collapse' },
    { nodeId: 'n7', match: 48, description: "Quantum computing gate operations relate to superposition and collapse" },
  ],
  n2: [
    { nodeId: 'n6', match: 90, description: 'Observer effect and wave function collapse — direct application of the equation' },
    { nodeId: 'n4', match: 75, description: "Schrodinger's Cat connects directly to the time-independent wave equation" },
    { nodeId: 'n5', match: 60, description: 'Lattice symmetry groups use similar mathematical frameworks' },
  ],
  n4: [
    { nodeId: 'n6', match: 88, description: 'Observer effect in macroscale systems exactly mirrors Cat paradox' },
    { nodeId: 'n3', match: 71, description: 'Enzymatic quantum tunneling as a biological macroscale quantum system' },
    { nodeId: 'n8', match: 55, description: 'Probability density relates to superposition state measurements' },
  ],
  n3: [
    { nodeId: 'n4', match: 79, description: 'Biological quantum effects connect to Schrodinger Cat paradox' },
    { nodeId: 'n1', match: 65, description: 'Silicon nanostructures — quantum effects in engineered systems' },
    { nodeId: 'n7', match: 52, description: 'Quantum computing biology-inspired algorithms' },
  ],
  n5: [
    { nodeId: 'n2', match: 82, description: "Mathematical basis connects crystal groups to Schrödinger formalism" },
    { nodeId: 'n1', match: 58, description: 'Silicon crystal lattice structure and quantum effects' },
    { nodeId: 'n3', match: 44, description: 'Biological crystal structures share lattice theory principles' },
  ],
  n7: [
    { nodeId: 'n1', match: 87, description: 'Signal transmission in silicon nanostructures — direct gate application' },
    { nodeId: 'n6', match: 73, description: 'Measurement collapse in quantum computing gate operations' },
    { nodeId: 'n8', match: 66, description: 'Probability density of logic gate quantum states' },
  ],
  n8: [
    { nodeId: 'n1', match: 81, description: 'Wave-particle duality affects probability distributions in transistors' },
    { nodeId: 'n4', match: 69, description: 'Logic gate probability — quantum superposition states' },
    { nodeId: 'n7', match: 78, description: 'Quantum gate operations produce specific probability density profiles' },
  ],
};

export const SUBJECT_LABELS: Record<string, string> = {
  quantum: 'Quantum Physics',
  math: 'Mathematics',
  bio: 'Biotechnology',
  cs: 'Computer Science',
};

export const SUBJECT_COLORS: Record<string, string> = {
  quantum: '#7C6EE6',
  math: '#60A5FA',
  bio: '#4ADE80',
  cs: '#F472B6',
};

export const getUserById = (id: string): User | undefined => USERS.find(u => u.id === id);
export const getNodeById = (id: string): Node | undefined => NODES.find(n => n.id === id);
export const getAnswersForNode = (nodeId: string): Answer[] => ANSWERS.filter(a => a.nodeId === nodeId);
export const getUserForNode = (nodeId: string): User | undefined => {
  const node = getNodeById(nodeId);
  if (!node) return undefined;
  return USERS.find(u => u.name === node.asker);
};
