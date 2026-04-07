export type Subject = 'quantum' | 'math' | 'bio' | 'cs' | 'chem' | 'eng' | 'phil' | 'med';
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

export const SUBJECT_COLORS: Record<Subject, string> = {
  quantum: '#7C6EE6',
  math: '#EC4899',
  bio: '#10B981',
  cs: '#3B82F6',
  chem: '#F59E0B',
  eng: '#6366F1',
  phil: '#A855F7',
  med: '#EF4444',
};

export const SUBJECT_LABELS: Record<Subject, string> = {
  quantum: 'Quantum Physics',
  math: 'Mathematics',
  bio: 'Biotechnology',
  cs: 'Computer Science',
  chem: 'Chemistry',
  eng: 'Engineering',
  phil: 'Philosophy',
  med: 'Medicine',
};

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
  // QUANTUM (sq1, sq2, sq3)
  { id: 'n1', subject: 'quantum', subTopicId: 'sq1', title: 'Wave-particle duality in silicon nanostructures?', status: 'solved', activity: 44, asker: 'Alex Rivera', time: '2h ago' },
  { id: 'n4', subject: 'quantum', subTopicId: 'sq1', title: 'Schrödinger\'s Cat in macroscopic bio-systems?', status: 'pending', activity: 12, asker: 'Julian V.', time: '5h ago' },
  { id: 'n6', subject: 'quantum', subTopicId: 'sq2', title: 'Observer effect on wave function collapse?', status: 'solved', activity: 67, asker: 'Dr. Aris V.', time: '40m ago' },
  { id: 'n8', subject: 'quantum', subTopicId: 'sq3', title: 'Probability density in NISQ gate operations?', status: 'pending', activity: 82, asker: 'Sarah K.', time: '2m ago', isNew: true },
  { id: 'nq1', subject: 'quantum', subTopicId: 'sq2', title: 'Decoherence rates in superconducting qubits', status: 'active', activity: 38, asker: 'Leo T.', time: '1h ago' },
  { id: 'nq2', subject: 'quantum', subTopicId: 'sq3', title: 'Error correction codes for surface code architectures', status: 'active', activity: 55, asker: 'Alex Rivera', time: '12m ago', isNew: true },

  // MATH (sm1, sm2)
  { id: 'n2', subject: 'math', subTopicId: 'sm1', title: 'Deriving time-independent Schrödinger form', status: 'active', activity: 22, asker: 'Julian V.', time: '5h ago' },
  { id: 'n5', subject: 'math', subTopicId: 'sm1', title: 'Lattice Theory and crystal symmetry groups', status: 'solved', activity: 18, asker: 'Elena R.', time: '3d ago' },
  { id: 'nm1', subject: 'math', subTopicId: 'sm2', title: 'Galois Theory applications in cryptography', status: 'active', activity: 41, asker: 'Sarah Jenkins', time: 'Online Now', isNew: true },
  { id: 'nm2', subject: 'math', subTopicId: 'sm2', title: 'Homological Algebra and TDA in genomics', status: 'pending', activity: 15, asker: 'Dr. Aris V.', time: '6h ago' },

  // CS (sc1, sc2)
  { id: 'n7', subject: 'cs', subTopicId: 'sc1', title: 'Quantum computing gate operations vs classical', status: 'active', activity: 29, asker: 'Leo T.', time: '6h ago' },
  { id: 'n9', subject: 'cs', subTopicId: 'sc1', title: 'Shor\'s algorithm complexity on NISQ era HW', status: 'pending', activity: 21, asker: 'Alex Rivera', time: '15m ago', isNew: true },
  { id: 'nc1', subject: 'cs', subTopicId: 'sc2', title: 'Distributed consensus in high-latency layers', status: 'solved', activity: 50, asker: 'Leo T.', time: '1d ago' },
  { id: 'nc2', subject: 'cs', subTopicId: 'sc2', title: 'Micro-kernel design for real-time telemetry', status: 'active', activity: 33, asker: 'Elena R.', time: '3h ago' },

  // BIO (sb1, sb2)
  { id: 'n3', subject: 'bio', subTopicId: 'sb1', title: 'Enzymatic Quantum Tunneling in ATP synthesis', status: 'active', activity: 58, asker: 'Priya S.', time: '12m ago', isNew: true },
  { id: 'n10', subject: 'bio', subTopicId: 'sb2', title: 'CRISPR-Cas9 target specificity in thermophiles', status: 'active', activity: 41, asker: 'Elena R.', time: '1h ago' },
  { id: 'nb1', subject: 'bio', subTopicId: 'sb1', title: 'Magnetic sensing in birds — radical pair mechanism', status: 'pending', activity: 12, asker: 'Priya S.', time: '3h ago' },
  { id: 'nb2', subject: 'bio', subTopicId: 'sb2', title: 'Single-cell ATAC-seq noise modeling', status: 'solved', activity: 90, asker: 'Dr. Aris V.', time: '12h ago' },

  // CHEM (sch1, sch2)
  { id: 'nch1', subject: 'chem', subTopicId: 'sch1', title: 'Chiral catalysts for asymmetrical synthesis', status: 'active', activity: 25, asker: 'Sarah Jenkins', time: '2h ago' },
  { id: 'nch2', subject: 'chem', subTopicId: 'sch2', title: 'QM/MM simulations of retinal isomerisation', status: 'pending', activity: 70, asker: 'Priya S.', time: '40m ago', isNew: true },

  // PHIL (sph1, sph2)
  { id: 'nph1', subject: 'phil', subTopicId: 'sph1', title: 'Bayesian epistemology vs Frequentist intuition', status: 'solved', activity: 48, asker: 'Alex Rivera', time: '2d ago' },
  { id: 'nph2', subject: 'phil', subTopicId: 'sph2', title: 'Ethical alignment of multi-agent LLM systems', status: 'active', activity: 65, asker: 'Dr. Aris V.', time: '10m ago', isNew: true },

  // ENG (sen1)
  { id: 'ne1', subject: 'eng', subTopicId: 'sen1', title: 'PID control stability in soft robotic actuators', status: 'active', activity: 42, asker: 'Leo T.', time: '5h ago' },

  // MED (smd1)
  { id: 'nm3', subject: 'med', subTopicId: 'smd1', title: 'Synaptic plasticity in Hippocampal CA1 nodes', status: 'active', activity: 88, asker: 'Elena R.', time: 'Online Now', isNew: true },
];

export const EDGES: Edge[] = [
  // Inter-topic connections
  { source: 'n1', target: 'n2', type: 'similarity' },
  { source: 'n1', target: 'n7', type: 'concept' },
  { source: 'n3', target: 'n4', type: 'concept' },
  { source: 'n6', target: 'n8', type: 'similarity' },
  { source: 'nq1', target: 'nq2', type: 'concept' },
  { source: 'nm1', target: 'nc1', type: 'concept' },
  { source: 'nph2', target: 'nc2', type: 'concept' },
  { source: 'nch2', target: 'n3', type: 'similarity' },
  { source: 'nm3', target: 'nb2', type: 'concept' },
  { source: 'ne1', target: 'nc1', type: 'similarity' },
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
  { id: 'a1', nodeId: 'n6', authorId: 'u8', body: "Environmental decoherence is the primary mechanism. Interaction with air molecules or even blackbody radiation carries away path information, effectively performing a 'measurement' that collapses the wavefunction on timescales much faster than macroscopic perception.", upvotes: 124, isTopInsight: true, isExpert: true, time: '35m ago' },
  { id: 'a2', nodeId: 'nq1', authorId: 'u7', body: "Flux noise from surface defects is often the bottleneck. We're seeing T1 times improve significantly with specialized niobium-nitride resonators.", upvotes: 56, isTopInsight: true, isExpert: true, time: '1h ago' },
  { id: 'a3', nodeId: 'nc1', authorId: 'u6', body: "Paxos is overkill here. For high-latency layers, we found a variant of HotStuff with optimistic response phases performs 3x better in throughput tests.", upvotes: 92, isTopInsight: true, isExpert: false, time: '5h ago' },
  { id: 'a4', nodeId: 'nph2', authorId: 'u5', body: "Constitutional AI frameworks like RLAIF provide a scalable way to enforce moral constraints without manual labeling, but the 'constitution' itself remains a philosophical single point of failure.", upvotes: 110, isTopInsight: true, isExpert: true, time: '10m ago' },
  { id: 'a5', nodeId: 'nm3', authorId: 'u4', body: "LTP at the CA1 synapse is mediated by NMDA receptor activation leading to AMPA receptor insertion. The calcium influx is the critical trigger for the signaling cascade.", upvotes: 75, isTopInsight: true, isExpert: true, time: 'Online Now' },
  { id: 'a6', nodeId: 'n3', authorId: 'u3', body: "Hydrogen tunneling in enzymes allows reaction rates way beyond classical Arrhenius predictions. It's essentially the wave-nature of the proton finding a path through the barrier.", upvotes: 48, isTopInsight: false, isExpert: false, time: '12m ago' },
  { id: 'a7', nodeId: 'ne1', authorId: 'u1', body: "Hysteresis in soft actuators makes standard PID loop design difficult. You usually need an inverse model or a machine learning based compensator for high-precision tasks.", upvotes: 22, isTopInsight: false, isExpert: false, time: '3h ago' },
  { id: 'a8', nodeId: 'nph1', authorId: 'u1', body: "Bayesianism is fundamentally about updating priors based on evidence, whereas Frequentism focuses on long-run frequencies in repeatable experiments.", upvotes: 34, isTopInsight: false, isExpert: false, time: '1d ago' },
  { id: 'a9', nodeId: 'n1', authorId: 'u5', body: "Silicon nanostructures at these scales are essentially quantum wires. Signal loss happens due to quantum interference patterns forming back-scatter nodes.", upvotes: 68, isTopInsight: true, isExpert: true, time: '2h ago' },
  { id: 'a10', nodeId: 'n4', authorId: 'u8', body: "While controversial, Penrose and Hameroff argue that microtubules might temporarily support macroscopic quantum coherence before objective reduction occurs.", upvotes: 41, isTopInsight: true, isExpert: true, time: '1h ago' },
  { id: 'a11', nodeId: 'n8', authorId: 'u7', body: "The probability density function is represented by the square modulus of the wave function corresponding to the gate's output state vector.", upvotes: 89, isTopInsight: true, isExpert: true, time: '15m ago' },
  { id: 'a12', nodeId: 'nq2', authorId: 'u6', body: "Surface codes are highly effective because they only require nearest-neighbor interactions and have a relatively high error threshold (~1%).", upvotes: 62, isTopInsight: true, isExpert: false, time: '30m ago' },
  { id: 'a13', nodeId: 'n2', authorId: 'u4', body: "By using the separation of variables method on the full time-dependent equation, factoring the wavefunction into spatial and temporal parts.", upvotes: 55, isTopInsight: true, isExpert: true, time: '2h ago' },
  { id: 'a14', nodeId: 'n5', authorId: 'u2', body: "Group theory perfectly models crystal symmetries. There are exactly 230 distinct space groups describing all possible 3D crystal structures.", upvotes: 30, isTopInsight: false, isExpert: false, time: '4h ago' },
  { id: 'a15', nodeId: 'nm1', authorId: 'u4', body: "Galois fields (finite fields) are the foundation of AES and elliptic curve cryptography because they allow arithmetic operations without rounding errors.", upvotes: 120, isTopInsight: true, isExpert: true, time: '20m ago' },
  { id: 'a16', nodeId: 'nm2', authorId: 'u2', body: "Persistent homology helps identify fundamental structures (like loops or voids) in high-dimensional genomic datasets that might correlate with specific phenotypes.", upvotes: 45, isTopInsight: false, isExpert: false, time: '5h ago' },
  { id: 'a17', nodeId: 'n7', authorId: 'u6', body: "Unlike classical bits (0 or 1), a qubit can be in a superposition of both, meaning a quantum gate intrinsically performs parallel operations on all superimposed states.", upvotes: 77, isTopInsight: true, isExpert: false, time: '4h ago' },
  { id: 'a18', nodeId: 'n9', authorId: 'u5', body: "Currently, NISQ hardware limits Shor's algorithm due to inadequate error correction, confining it to factoring very small integers like 15 or 21.", upvotes: 95, isTopInsight: true, isExpert: true, time: '1h ago' },
  { id: 'a19', nodeId: 'nc2', authorId: 'u1', body: "Using an L4-style micro-kernel minimizes context switching overhead, critical for precise hardware telemetry loops.", upvotes: 60, isTopInsight: false, isExpert: false, time: '2d ago' },
  { id: 'a20', nodeId: 'n10', authorId: 'u3', body: "Thermophiles require more stable gRNA structures and robust Cas variant proteins to prevent denaturation at extreme temperatures.", upvotes: 70, isTopInsight: true, isExpert: false, time: '12h ago' },
  { id: 'a21', nodeId: 'nb1', authorId: 'u8', body: "The radical pair mechanism in cryptochrome proteins creates a quantum entangled pair whose recombination kinetics are sensitive to the Earth's weak magnetic field.", upvotes: 150, isTopInsight: true, isExpert: true, time: '6h ago' },
  { id: 'a22', nodeId: 'nb2', authorId: 'u4', body: "Sparsity is the biggest issue. Using deep generative models like scVI has proven very effective in imputing missing peaks and modeling the noise.", upvotes: 85, isTopInsight: true, isExpert: true, time: '2h ago' },
  { id: 'a23', nodeId: 'nch1', authorId: 'u8', body: "BINAP is a classic example. Its rigid, chiral framework forces incoming substrates into specific steric orientations, drastically favoring one enantiomer over another.", upvotes: 90, isTopInsight: true, isExpert: true, time: '4h ago' },
  { id: 'a24', nodeId: 'nch2', authorId: 'u5', body: "QM/MM partitions the system: the chromophore uses high-level QM methods while the surrounding opsin protein is treated with classically parameterized MM force fields.", upvotes: 110, isTopInsight: true, isExpert: true, time: '1d ago' },
];

export const CONNECTED_NODES_MAP: Record<string, Array<{ nodeId: string; match: number; description: string }>> = {
  n1: [
    { nodeId: 'n7', match: 85, description: 'Gate logic scaling and quantum noise floor' },
    { nodeId: 'nq2', match: 72, description: 'Error correction in nano-architectures' },
    { nodeId: 'n6', match: 45, description: 'Decoherence interference in silicon' },
  ],
  n6: [
    { nodeId: 'nq1', match: 91, description: 'Measurement induced decoherence in qubits' },
    { nodeId: 'nph2', match: 64, description: 'Epistemology of quantum observation' },
  ],
  nm3: [
    { nodeId: 'nb2', match: 88, description: 'Genomic expression of plasticity markers' },
    { nodeId: 'nb1', match: 52, description: 'Biological sensing across networks' },
    { nodeId: 'n3', match: 40, description: 'ATP mechanisms connecting' }
  ],
  nc1: [
    { nodeId: 'ne1', match: 77, description: 'Control systems for distributed agents' },
    { nodeId: 'nc2', match: 85, description: 'Kernel support for high-latency protocols' },
  ],
  n4: [
    { nodeId: 'n6', match: 88, description: 'Observer effect in macroscale exactly mirrors Cat paradox' },
    { nodeId: 'n3', match: 71, description: 'Enzymatic quantum tunneling as a biological macroscale quantum system' },
  ],
  n8: [
    { nodeId: 'nq2', match: 81, description: 'Surface code implementation bounds' },
    { nodeId: 'n9', match: 78, description: 'Shor algorithm probability mapping' },
  ],
  nq1: [
    { nodeId: 'nq2', match: 95, description: 'Superconducting qubit optimizations' },
    { nodeId: 'n6', match: 74, description: 'Decoherence limits in qubits' },
  ],
  nq2: [
    { nodeId: 'nq1', match: 95, description: 'Qubit architecture alignment' },
    { nodeId: 'n9', match: 82, description: 'NISQ era boundary restrictions' },
  ],
  n2: [
    { nodeId: 'n5', match: 60, description: 'Mathematical framing in crystalline lattices' },
    { nodeId: 'nm1', match: 55, description: 'Galois representations of equations' },
  ],
  n5: [
    { nodeId: 'nch1', match: 65, description: 'Symmetry groups heavily relied on in chirality' },
    { nodeId: 'n2', match: 60, description: 'Structural math symmetries' },
  ],
  nm1: [
    { nodeId: 'nc1', match: 70, description: 'Cryptography limits inside consensus protocols' },
    { nodeId: 'n9', match: 85, description: 'Shor algorithm breaking Galois based encryptions' }
  ],
  nm2: [
    { nodeId: 'nb2', match: 92, description: 'TDA applied to scATAC-seq manifolds' },
    { nodeId: 'n10', match: 45, description: 'Understanding large thermophile sequences' }
  ],
  n7: [
    { nodeId: 'n1', match: 80, description: 'Gate operation equivalents in silicon' },
    { nodeId: 'n8', match: 88, description: 'Parallel probability density across logic layers' }
  ],
  n9: [
    { nodeId: 'nq2', match: 83, description: 'NISQ bounds governed by error thresholding' },
    { nodeId: 'nm1', match: 85, description: 'Classical encryption breaking algorithms' }
  ],
  nc2: [
    { nodeId: 'nc1', match: 85, description: 'Distributed consensus inside micro-kernels' },
    { nodeId: 'ne1', match: 68, description: 'Hardware telemetry maps to robotic feedback loops' }
  ],
  n3: [
    { nodeId: 'n4', match: 71, description: 'Quantum tunneling connects to macro-biological phenomena' },
    { nodeId: 'nch2', match: 82, description: 'Isomerisation requires quantum biological models' },
  ],
  n10: [
    { nodeId: 'nb2', match: 65, description: 'Gene editing analysis maps to ATAC-seq validation' },
    { nodeId: 'nch1', match: 50, description: 'Synthesis required for synthetic targets' }
  ],
  nb1: [
    { nodeId: 'nph1', match: 42, description: 'Epistemology behind perceiving magnetic anomalies' },
    { nodeId: 'n3', match: 88, description: 'Radical pairs relate strongly to quantum tunnels conceptually' }
  ],
  nb2: [
    { nodeId: 'nm3', match: 88, description: 'Plasticity relies on ATAC-seq mapping at multi-layer levels' },
    { nodeId: 'nm2', match: 92, description: 'TDA applications for ATAC peaks' }
  ],
  nch1: [
    { nodeId: 'n5', match: 65, description: 'Crystal symmetry relates to chiral frameworks' },
    { nodeId: 'nch2', match: 72, description: 'Synthesis optimization for complex isomers' }
  ],
  nch2: [
    { nodeId: 'n3', match: 82, description: 'QM/MM relates to biological modeling of energy barriers' },
    { nodeId: 'nch1', match: 72, description: 'Simulation of physical constraints' }
  ],
  nph1: [
    { nodeId: 'nph2', match: 76, description: 'Alignment of AI using bayesian inference mechanisms' },
    { nodeId: 'nb1', match: 42, description: 'Interpretations of unseen phenomena' }
  ],
  nph2: [
    { nodeId: 'nph1', match: 76, description: 'Philosophy maps deeply back to bayesian systems' },
    { nodeId: 'nc1', match: 60, description: 'AI agents mapped in distributed setups' }
  ],
  ne1: [
    { nodeId: 'nc1', match: 77, description: 'Distributed systems govern many robotic endpoints' },
    { nodeId: 'nc2', match: 68, description: 'Telemetry control relies on PID implementations' }
  ]
};


export const getUserById = (id: string): User | undefined => USERS.find(u => u.id === id);
export const getNodeById = (id: string): Node | undefined => NODES.find(n => n.id === id);
export const getAnswersForNode = (nodeId: string): Answer[] => ANSWERS.filter(a => a.nodeId === nodeId);
export const getUserForNode = (nodeId: string): User | undefined => {
  const node = getNodeById(nodeId);
  if (!node) return undefined;
  return USERS.find(u => u.name === node.asker);
};
