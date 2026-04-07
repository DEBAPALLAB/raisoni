'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { Node, Edge, Subject, SUBJECT_COLORS, SUBJECT_LABELS } from '@/data/seed';
import { useTokens } from '@/context/TokenContext';

interface GraphProps {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  activeFilters: Subject[];
  onNodeClick: (node: Node) => void;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  subject: string;
  activity: number;
  status: string;
  title: string;
  asker: string;
  time: string;
  isNew?: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  type: 'similarity' | 'concept';
}

const SUBJECT_ICONS: Record<string, string> = {
  quantum: 'Ψ',
  math: 'Σ',
  bio: '⊕',
  cs: '⊞',
};

export default function Graph({ nodes, edges, selectedNodeId, activeFilters, onNodeClick }: GraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { bounties } = useTokens();

  /* radius scales with activity */
  const getR = (activity: number) => Math.max(44, Math.min(70, 40 + activity * 0.75));

  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    const W = containerRef.current.clientWidth;
    const H = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', W).attr('height', H);

    /* ── background canvas ─────────────────────────────────── */
    const defs = svg.append('defs');

    const gradient = defs.append('linearGradient')
      .attr('id', 'graph-backdrop')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#F7F8FC');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#E3E7FF');

    const shadowFilter = defs.append('filter').attr('id', 'node-shadow')
      .attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    shadowFilter.append('feDropShadow')
      .attr('dx', 0).attr('dy', 8).attr('stdDeviation', 14)
      .attr('flood-color', '#CBD5E2').attr('flood-opacity', 0.45);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#graph-backdrop)');

    /* ── zoom layer ──────────────────────────────────────────── */
    const g = svg.append('g');
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 3])
      .on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);

    /* ── sim data ────────────────────────────────────────────── */
    const simNodes: SimNode[] = nodes.map((n) => ({
      ...n,
      x: W / 2 + (Math.random() - 0.5) * 320,
      y: H / 2 + (Math.random() - 0.5) * 280,
    }));
    const nodeMap = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks: SimLink[] = edges
      .map((e) => ({ source: nodeMap.get(e.source)!, target: nodeMap.get(e.target)!, type: e.type }))
      .filter((l) => l.source && l.target);

    /* ── force sim ───────────────────────────────────────────── */
    const sim = d3.forceSimulation<SimNode>(simNodes)
      .force('link', d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(200).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-600))
      .force('center', d3.forceCenter(W / 2, H / 2))
      .force('collision', d3.forceCollide<SimNode>().radius((d) => getR(d.activity) + 30));

    /* ── edges ───────────────────────────────────────────────── */
    const link = g.append('g').selectAll('line').data(simLinks).enter().append('line')
      .attr('stroke', '#BCC9E2')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', (d) => d.type === 'concept' ? '5,4' : 'none')
      .attr('opacity', 0.7);

    /* ── nodes ───────────────────────────────────────────────── */
    const nodeG = g.append('g').selectAll('g').data(simNodes).enter().append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }) as any);

    /* helper: wrap text inside SVG */
    function wrapText(el: SVGTextElement, text: string, maxWidth: number, lineHeight: number) {
      const words = text.split(' ');
      const tEl = d3.select(el);
      tEl.text('');
      let line: string[] = [];
      let lineCount = 0;
      const maxLines = 3;

      words.forEach((word) => {
        if (lineCount >= maxLines) return;
        line.push(word);
        tEl.text(line.join(' '));
        const node = tEl.node()!;
        if (node.getComputedTextLength() > maxWidth && line.length > 1) {
          line.pop();
          if (lineCount < maxLines - 1) {
            tEl.append('tspan').attr('x', 0).attr('dy', lineCount === 0 ? 0 : lineHeight).text(line.join(' '));
          } else {
            const partial = line.join(' ');
            tEl.append('tspan').attr('x', 0).attr('dy', lineCount === 0 ? 0 : lineHeight).text(partial + '…');
          }
          line = [word];
          lineCount++;
        }
      });

      if (lineCount < maxLines && line.length > 0) {
        tEl.text('');
        // re-render all spans properly
      }
    }

    /* ── BOUNTY PULSE ────────────────────────────────────────── */
    nodeG.filter((d) => !!bounties[d.id]).append('circle')
      .attr('r', (d) => getR(d.activity) + 8)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-amber)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3')
      .attr('opacity', 0.8)
      .each(function(d) {
        const el = d3.select(this);
        const r = getR(d.activity) + 8;
        function pulse() {
          el.attr('opacity', 0.8).attr('r', r)
            .transition().duration(1200).ease(d3.easeQuadInOut)
            .attr('opacity', 0.2).attr('r', r + 12)
            .transition().duration(1200).ease(d3.easeQuadInOut)
            .attr('opacity', 0.8).attr('r', r)
            .on('end', pulse);
        }
        pulse();
      });

    /* ── PENDING dashed outer ring ───────────────────────────── */
    nodeG.filter((d) => d.status === 'pending' && !bounties[d.id])
      .append('circle')
      .attr('r', (d) => getR(d.activity) + 9)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-amber)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,4')
      .attr('opacity', 0.55);

    /* ── selected outer glow ring ────────────────────────────── */
    nodeG.append('circle')
      .attr('class', 'sel-ring')
      .attr('r', (d) => getR(d.activity) + 6)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke', (d) => d.id === selectedNodeId ? '#ffffff' : 'transparent')
      .attr('opacity', (d) => d.id === selectedNodeId ? 0.7 : 0);

    /* ── main filled circle ─────────────────────────────────── */
    nodeG.append('circle')
      .attr('class', 'main-circle')
      .attr('r', (d) => getR(d.activity))
      .attr('fill', '#FFFFFF')
      .attr('stroke', (d) => SUBJECT_COLORS[d.subject])
      .attr('stroke-width', (d) => (d.id === selectedNodeId ? 3 : 2))
      .attr('filter', 'url(#node-shadow)')
      .attr('opacity', (d) => {
        if (activeFilters.length === 0) return 1;
        return activeFilters.includes(d.subject as Subject) ? 1 : 0.35;
      });

    /* ── new-node pulse ring ──────────────────────────────────── */
    nodeG.filter((d) => !!d.isNew).append('circle')
      .attr('r', (d) => getR(d.activity))
      .attr('fill', 'none')
      .attr('stroke', (d) => SUBJECT_COLORS[d.subject])
      .attr('stroke-width', 2)
      .attr('opacity', 1)
      .each(function (d) {
        const el = d3.select(this);
        const r = getR(d.activity);
        function pulse() {
          el.attr('r', r).attr('opacity', 0.9)
            .transition().duration(900).ease(d3.easeLinear)
            .attr('r', r + 22).attr('opacity', 0)
            .on('end', pulse);
        }
        pulse();
      });

    /* ── ICON (Ψ, Σ …) ─────────────── top of circle ─────────── */
    nodeG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => -getR(d.activity) * 0.28)
      .attr('font-family', 'Syne, sans-serif')
      .attr('font-weight', '800')
      .attr('font-size', (d) => Math.min(getR(d.activity) * 0.48, 24))
      .attr('fill', (d) => SUBJECT_COLORS[d.subject])
      .attr('opacity', (d) => {
        if (activeFilters.length === 0) return 1;
        return activeFilters.includes(d.subject as Subject) ? 1 : 0.12;
      })
      .text((d) => SUBJECT_ICONS[d.subject] || '?');

    /* ── SUBJECT LABEL (e.g., "QUANTUM PHYSICS") ─────────────── */
    nodeG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => getR(d.activity) * 0.1)
      .attr('font-family', 'DM Mono, monospace')
      .attr('font-size', (d) => Math.max(8, Math.min(11, getR(d.activity) * 0.16)))
      .attr('font-weight', '500')
      .attr('letter-spacing', '0.08em')
      .attr('fill', (d) => SUBJECT_COLORS[d.subject])
      .attr('opacity', (d) => {
        if (activeFilters.length === 0) return 0.9;
        return activeFilters.includes(d.subject as Subject) ? 0.9 : 0.3;
      })
      .text((d) => SUBJECT_LABELS[d.subject].toUpperCase());

    /* ── TITLE TEXT (2 lines) below subject label ─────────────── */
    nodeG.each(function (d) {
      const r = getR(d.activity);
      const words = d.title.split(' ');
      const maxW = r * 1.55;
      const lineH = Math.max(11, r * 0.22);
      const startY = r * 0.35;
      const fontSize = Math.max(9, Math.min(11, r * 0.17));
      const opacity = activeFilters.length === 0 ? 0.7
        : activeFilters.includes(d.subject as Subject) ? 0.7 : 0.08;

      const textEl = d3.select(this).append('text')
        .attr('text-anchor', 'middle')
        .attr('font-family', 'DM Mono, monospace')
        .attr('font-size', fontSize)
        .attr('fill', 'var(--text-primary)')
        .attr('opacity', opacity);

      let line: string[] = [];
      let lineNum = 0;
      const maxLines = 2;
      const spans: Array<{ text: string; lineNum: number }> = [];

      for (let i = 0; i < words.length; i++) {
        line.push(words[i]);
        // temporary measure — approximate 6px per char at font-size 10
        const approxWidth = line.join(' ').length * (fontSize * 0.58);
        if (approxWidth > maxW) {
          line.pop();
          if (line.length > 0) {
            if (lineNum < maxLines) {
              const isLast = lineNum === maxLines - 1;
              spans.push({ text: line.join(' ') + (isLast && i < words.length - 1 ? '…' : ''), lineNum });
              lineNum++;
            }
            line = [words[i]];
          }
        }
        if (lineNum >= maxLines) break;
      }
      if (lineNum < maxLines && line.length > 0) {
        spans.push({ text: line.join(' '), lineNum });
      }

      spans.forEach(({ text, lineNum: ln }) => {
        textEl.append('tspan')
          .attr('x', 0)
          .attr('dy', ln === 0 ? startY : lineH)
          .text(text);
      });
    });

    /* ── hover interactions ───────────────────────────────────── */
    nodeG
      .on('mouseenter', function (_, d) {
        if (activeFilters.length > 0 && !activeFilters.includes(d.subject as Subject)) return;
        d3.select(this).raise();
        d3.select(this).select('.main-circle')
          .transition().duration(200).ease(d3.easeQuadInOut)
          .attr('r', getR(d.activity) * 1.08)
          .attr('stroke-width', 3)
          .transition().duration(200).ease(d3.easeQuadInOut)
          .attr('r', getR(d.activity));
      })
      .on('mouseleave', function (_, d) {
        d3.select(this).select('.main-circle')
          .transition().duration(150)
          .attr('stroke-width', d.id === selectedNodeId ? 2.5 : 1.8);
      })
      .on('click', function (event, d) {
        event.stopPropagation();
        const found = nodes.find((n) => n.id === d.id);
        if (found) onNodeClick(found);
        // update rings
        svg.selectAll('.sel-ring')
          .attr('stroke', (rd: any) => rd.id === d.id ? '#ffffff' : 'transparent')
          .attr('opacity', (rd: any) => rd.id === d.id ? 0.7 : 0);
        svg.selectAll('.main-circle')
          .attr('fill', (rd: any) => {
            const c = SUBJECT_COLORS[rd.subject];
            return rd.id === d.id ? c + '55' : (rd.isNew ? c + 'CC' : c + '25');
          })
          .attr('stroke-width', (rd: any) => rd.id === d.id ? 2.5 : 1.8);
      });

    /* ── tick ─────────────────────────────────────────────────── */
    sim.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as SimNode).x!)
        .attr('y1', (d) => (d.source as SimNode).y!)
        .attr('x2', (d) => (d.target as SimNode).x!)
        .attr('y2', (d) => (d.target as SimNode).y!);
      nodeG.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [nodes, edges, selectedNodeId, activeFilters, onNodeClick]);

  useEffect(() => { 
    const cleanup = draw(); 
    return () => { if (cleanup) cleanup(); }; 
  }, [draw]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <div ref={containerRef} style={{ flex: 1, minWidth: 0, position: 'relative', overflow: 'hidden' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* ── Bottom toolbar ─────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6, background: 'rgba(255,255,255,0.92)',
        border: '1px solid rgba(148,163,184,0.4)', borderRadius: 12, padding: 6, zIndex: 10,
        boxShadow: '0 18px 30px rgba(15,23,42,0.16)',
      }}>
        {([
          { label: 'Zoom In', active: false, icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="6" y1="4" x2="6" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="4" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
          { label: 'Focused', active: true, icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="1" y1="4" x2="1" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="1" y1="1" x2="4" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="10" y1="1" x2="13" y2="1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="13" y1="1" x2="13" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="1" y1="10" x2="1" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="1" y1="13" x2="4" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="13" y1="10" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="10" y1="13" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
          { label: 'Layers', active: false, icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L13 5.5L7 9L1 5.5L7 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M1 8.5L7 12L13 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
        ] as const).map((btn) => (
          <button key={btn.label} className={`pill-btn ${btn.active ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {btn.icon}{btn.label}
          </button>
        ))}
      </div>

      {/* ── Legend ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 16, left: 16,
        background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.35)',
        borderRadius: 12, padding: '10px 14px', zIndex: 5,
        boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
      }}>
        <div className="section-label" style={{ marginBottom: 6 }}>EDGE TYPES</div>
        {[
          { label: 'Similarity', dash: 'none' },
          { label: 'Concept', dash: '5,4' },
        ].map((e) => (
          <div key={e.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <svg width="28" height="8"><line x1="0" y1="4" x2="28" y2="4" stroke="var(--border-mid)" strokeWidth="1.5" strokeDasharray={e.dash} /></svg>
            <span className="section-label" style={{ fontSize: 9 }}>{e.label}</span>
          </div>
        ))}
      </div>

      {/* ── Subject legend ──────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 72, right: 16,
        background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(148,163,184,0.35)',
        borderRadius: 12, padding: '10px 14px', zIndex: 5,
        boxShadow: '0 12px 30px rgba(15,23,42,0.12)',
      }}>
        <div className="section-label" style={{ marginBottom: 6 }}>SUBJECTS</div>
        {Object.entries(SUBJECT_COLORS).map(([key, color]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span className="section-label" style={{ fontSize: 9, color }}>{SUBJECT_LABELS[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
