import { describe, it, expect } from 'vitest';
import { runCsv, CSV_TOOLS, getCsvTool } from './registry';
import { csvToMatrix } from '@lib/csv/csv';

describe('runCsv resolver', () => {
  it('returns an error result for an unknown id', () => {
    const r = runCsv('nope', 'a,b\n1,2');
    expect(r.ok).toBe(false);
    expect(r.error).toBe('Unknown tool');
  });

  it('every registered tool declares its input count', () => {
    for (const [id, tool] of Object.entries(CSV_TOOLS)) {
      expect(tool.id).toBe(id);
      expect([1, 2]).toContain(tool.inputs);
    }
    expect(getCsvTool('csv-diff')?.inputs).toBe(2);
    expect(getCsvTool('csv-to-tsv')?.inputs).toBe(1);
  });
});

describe('csvToMatrix (raw matrix core)', () => {
  it('preserves ragged rows and extra cells', () => {
    expect(csvToMatrix('a,b\n1,2,3\n4')).toEqual([['a', 'b'], ['1', '2', '3'], ['4']]);
  });
  it('drops blank rows by default, keeps them on request', () => {
    expect(csvToMatrix('a,b\n\n1,2\n')).toEqual([['a', 'b'], ['1', '2']]);
    expect(csvToMatrix('a,b\n\n1,2', { keepEmptyRows: true })).toEqual([['a', 'b'], [''], ['1', '2']]);
  });
  it('empty input yields an empty matrix', () => {
    expect(csvToMatrix('')).toEqual([]);
    expect(csvToMatrix('   \n  ')).toEqual([]);
  });
});

describe('csv-to-tsv', () => {
  it('converts a simple file', () => {
    const r = runCsv('csv-to-tsv', 'a,b\n1,2');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('a\tb\n1\t2');
    expect(r.summary).toBe('1 data row · 2 columns');
  });

  it('unwraps quoted commas and re-quotes only where the TSV needs it', () => {
    const r = runCsv('csv-to-tsv', 'id,notes\n1,"loves CSV, and TSV"\n2,"said ""hi"""');
    expect(r.ok).toBe(true);
    // The comma no longer needs quoting under a tab delimiter; the embedded quote still does.
    expect(r.output).toBe('id\tnotes\n1\tloves CSV, and TSV\n2\t"said ""hi"""');
  });

  it('a cell containing a tab gets quoted', () => {
    const r = runCsv('csv-to-tsv', 'a,b\n"x\ty",2');
    expect(r.output).toBe('a\tb\n"x\ty"\t2');
  });

  it('empty input is an error result, never a throw', () => {
    const r = runCsv('csv-to-tsv', '   ');
    expect(r.ok).toBe(false);
    expect(r.error).toBe('Nothing to convert');
  });
});

describe('csv-clean', () => {
  it('removes blank rows, trims cells, and drops trailing-comma phantom cells', () => {
    const messy = 'name , email ,\nAda , ada@example.com,\n\nBob,bob@example.com';
    const r = runCsv('csv-clean', messy);
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name,email\nAda,ada@example.com\nBob,bob@example.com');
    expect(r.summary).toContain('1 empty row removed');
    expect(r.summary).toContain('cells trimmed');
  });

  it('pads short rows to the header width but never deletes overflow data', () => {
    const r = runCsv('csv-clean', 'a,b,c\n1\n2,3,4,5');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('a,b,c\n1,,\n2,3,4,5');
  });

  it('keeps quoting where cells need it', () => {
    const r = runCsv('csv-clean', 'a,b\n" x, y ",2');
    expect(r.output).toBe('a,b\n"x, y",2');
  });

  it('all-blank input is an error result', () => {
    expect(runCsv('csv-clean', '\n\n').ok).toBe(false);
    expect(runCsv('csv-clean', ',,\n,,').ok).toBe(false);
  });
});

describe('csv-diff (key mode)', () => {
  const A = 'id,name,email\n1,Ada,ada@x.com\n2,Bob,bob@x.com\n3,Carol,carol@x.com';
  const B = 'id,name,email\n1,Ada,ada@x.com\n3,Carol,carol@new.com\n4,Dave,dave@x.com';

  it('reports added, removed, and changed rows by key', () => {
    const r = runCsv('csv-diff', A, B);
    expect(r.ok).toBe(true);
    expect(r.summary).toBe('1 row added · 1 removed · 1 changed');
    expect(r.output).toContain('+ 4,Dave,dave@x.com');
    expect(r.output).toContain('- 2,Bob,bob@x.com');
    expect(r.output).toContain('~ id 3: email "carol@x.com" → "carol@new.com"');
    expect(r.output).toContain('Compared by "id"');
  });

  it('reordered but identical files show no differences', () => {
    const r = runCsv('csv-diff', A, 'id,name,email\n3,Carol,carol@x.com\n1,Ada,ada@x.com\n2,Bob,bob@x.com');
    expect(r.ok).toBe(true);
    expect(r.summary).toBe('identical');
    expect(r.output).toContain('No differences found');
  });

  it('reports column additions and removals by name', () => {
    const r = runCsv('csv-diff', 'id,name,fax\n1,Ada,555', 'id,name,email\n1,Ada,ada@x.com');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('Columns added: email');
    expect(r.output).toContain('Columns removed: fax');
  });

  it('missing sides produce error results', () => {
    expect(runCsv('csv-diff', '', 'a\n1').error).toBe('Paste the original CSV');
    expect(runCsv('csv-diff', 'a\n1', '').error).toBe('Paste the changed CSV to compare');
    expect(runCsv('csv-diff', 'a\n1', undefined).ok).toBe(false);
  });
});

describe('csv-diff (whole-row fallback)', () => {
  it('duplicate first-column values fall back to whole-row comparison', () => {
    const r = runCsv('csv-diff', 'tag,v\nx,1\nx,2', 'tag,v\nx,1\nx,3');
    expect(r.ok).toBe(true);
    expect(r.output).toContain('Compared by whole row');
    expect(r.output).toContain('+ x,3');
    expect(r.output).toContain('- x,2');
  });

  it('duplicate rows are matched as a multiset', () => {
    const r = runCsv('csv-diff', 'tag\nx\nx', 'tag\nx');
    expect(r.ok).toBe(true);
    expect(r.summary).toBe('0 rows added · 1 removed');
  });
});
