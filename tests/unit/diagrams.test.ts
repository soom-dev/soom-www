import { describe, it, expect } from 'vitest';
import { heroDiagram, tourDiagrams } from '../../src/lib/diagrams';

const allDiagrams = [heroDiagram, ...tourDiagrams];

describe('diagram data', () => {
  it('all diagrams have unique IDs', () => {
    const ids = allDiagrams.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(allDiagrams.map((d) => [d.id, d]))(
    '%s: all edges reference existing nodes',
    (_id, diagram) => {
      const nodeIds = new Set(diagram.nodes.map((n) => n.id));
      for (const edge of diagram.edges) {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
      }
    },
  );

  it.each(allDiagrams.map((d) => [d.id, d]))(
    '%s: nodes have positive dimensions',
    (_id, diagram) => {
      for (const node of diagram.nodes) {
        expect(node.w).toBeGreaterThan(0);
        expect(node.h).toBeGreaterThan(0);
      }
    },
  );

  it.each(allDiagrams.map((d) => [d.id, d]))(
    '%s: has valid viewBox',
    (_id, diagram) => {
      expect(diagram.viewBox).toMatch(/^\d+ \d+ \d+ \d+$/);
    },
  );

  it('tour diagrams all have titles and subtitles', () => {
    for (const d of tourDiagrams) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.subtitle.length).toBeGreaterThan(0);
    }
  });

  it('exactly 5 tour diagrams', () => {
    expect(tourDiagrams).toHaveLength(5);
  });
});
