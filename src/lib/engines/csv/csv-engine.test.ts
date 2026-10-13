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

describe('csv-pick', () => {
  it('matches headers trimmed, so "id, name" offers name', () => {
    const r = runCsv('csv-pick', 'id, name\n1, Ada', 'name');
    expect(r.ok).toBe(true);
    expect(r.output).toBe(' name\n Ada');
  });

  it('picks a quoted header that contains a comma, beside an unquoted one', () => {
    const r = runCsv('csv-pick', '"a,b",c,"say ""hi"""\n1,2,3', '"a,b", c ,"say ""hi"""');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('"a,b",c,"say ""hi"""\n1,2,3');
    expect(runCsv('csv-pick', '"a,b",c\n1,2', 'a').ok).toBe(false);
  });

  it('refuses input over 10 MB with a clear error', () => {
    const r = runCsv('csv-pick', 'a\n' + 'x'.repeat(10 * 1024 * 1024), 'a');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/larger than 10 MB/);
  });

  it('names tabs, not a comma split, when it reads a tab file', () => {
    const r = runCsv('csv-pick', 'a,b\tc\td\n1\t2\t3', '2');
    expect(r.output).toBe('c\n2');
    expect(r.notice).toMatch(/more tabs than commas/);
    expect(r.notice).not.toMatch(/one column/);
  });

  it('detects semicolons from the first line only, and only when commas give one column', () => {
    // A semicolon inside a later comma row does not flip the file.
    const later = runCsv('csv-pick', 'a,b\nx;y;z,2', 'b');
    expect(later.output).toBe('b\n2');
    expect(later.notice ?? '').not.toMatch(/semicolon/i);
    // A first line with both, where commas already split it, stays comma.
    const both = runCsv('csv-pick', 'a;x,b;y\n1,2', '2');
    expect(both.output).toBe('b;y\n2');
    expect(both.notice ?? '').not.toMatch(/semicolon/i);
  });

  it('strips a leading byte order mark before matching and detection', () => {
    const byName = runCsv('csv-pick', '\uFEFFid,name\n1,Ada', 'id');
    expect(byName.ok).toBe(true);
    expect(byName.output).toBe('id\n1');
    const byPos = runCsv('csv-pick', '\uFEFFid,name\n1,Ada', '1');
    expect(byPos.output).toBe('id\n1');
    expect(byPos.output.charCodeAt(0)).not.toBe(0xfeff);
    const semi = runCsv('csv-pick', '\uFEFFid;name\n1;Ada', 'name');
    expect(semi.output).toBe('name\nAda');
    expect(semi.notice).toMatch(/semicolon/i);
  });

  it('is a two-input select tool', () => {
    expect(getCsvTool('csv-pick')?.inputs).toBe(2);
    expect(getCsvTool('csv-pick')?.family).toBe('select');
    expect(CSV_TOOLS['csv-pick'].id).toBe('csv-pick');
  });

  it('keeps a named column from a semicolon file and explains the delimiter', () => {
    const r = runCsv('csv-pick', 'name;age\nAda;30\nBob;41', 'name');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name\nAda\nBob');
    expect(r.notice).toMatch(/semicolon/i);
    expect(r.notice).toMatch(/one column/i);
    expect(r.notice).not.toMatch(/position/i);
  });

  it('keeps named columns in the typed order without a position warning', () => {
    const r = runCsv('csv-pick', 'name,age,city\nAda,30,Pune', 'city,name');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('city,name\nPune,Ada');
    expect(r.notice == null || !/position/i.test(r.notice)).toBe(true);
  });

  it('keeps a column by position and warns that an insert changes the field', () => {
    const r = runCsv('csv-pick', 'name,age,city\nAda,30,Pune', '3');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('city\nPune');
    expect(r.notice).toMatch(/position/i);
    expect(r.notice).toMatch(/inserting a column/i);
  });

  it('rejects a header that is not in the file', () => {
    const r = runCsv('csv-pick', 'name,age\nAda,30', 'email');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/email/);
  });

  it('keeps a quoted comma inside the cell', () => {
    const r = runCsv('csv-pick', 'name,note\nAda,"hello, world"', 'note');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('note\n"hello, world"');
    expect(csvToMatrix(r.output)).toEqual([['note'], ['hello, world']]);
  });

  it('names the headers and stays quiet when a comma file lists no columns', () => {
    const r = runCsv('csv-pick', 'name,age,city\nAda,30,Pune', '   ');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name,age,city\nAda,30,Pune');
    expect(r.summary).toContain('name');
    expect(r.summary).toContain('age');
    expect(r.summary).toContain('city');
    expect(r.notice ?? null).toBeNull();
  });

  it('writes a semicolon file back with that delimiter when no columns are listed', () => {
    const src = 'name;age\nAda;30\nBob;41';
    const r = runCsv('csv-pick', src, '');
    expect(r.ok).toBe(true);
    expect(r.output).toBe(src);
    expect(r.summary).toContain('name');
    expect(r.summary).toContain('age');
    expect(r.notice).toMatch(/semicolon/i);
    expect(r.notice).not.toMatch(/position/i);
  });

  it('reads a tab file when tabs outnumber commas', () => {
    const r = runCsv('csv-pick', 'name\tage\nAda\t30', 'age');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('age\n30');
    expect(r.notice).toMatch(/\btab\b/i);
    expect(r.notice).toMatch(/more tabs than commas/);
  });

  it('keeps the first duplicate header and says the later one was left behind', () => {
    const r = runCsv('csv-pick', 'name,age,name\nAda,30,Lovelace', 'name');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('name\nAda');
    expect(r.notice).toMatch(/same name/i);
    expect(r.notice).toMatch(/left behind/i);
    expect(r.notice).not.toMatch(/position/i);
  });

  it('warns about position even on a semicolon file', () => {
    const r = runCsv('csv-pick', 'name;age;city\nAda;30;Pune', '3');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('city\nPune');
    expect(r.notice).toMatch(/semicolon/i);
    expect(r.notice).toMatch(/position/i);
  });

  it('rejects a position past the header and a case mismatch', () => {
    expect(runCsv('csv-pick', 'name,age\nAda,30', '3').ok).toBe(false);
    const mismatched = runCsv('csv-pick', 'name,age\nAda,30', 'Name');
    expect(mismatched.ok).toBe(false);
    expect(mismatched.error).toMatch(/Name/);
  });

  it('does not rewrite cell text such as a leading zero', () => {
    const r = runCsv('csv-pick', 'id,name\n007,Ada', 'id');
    expect(r.ok).toBe(true);
    expect(r.output).toBe('id\n007');
  });

  it('rejects an empty table', () => {
    expect(runCsv('csv-pick', '   ', 'name').ok).toBe(false);
    expect(runCsv('csv-pick', '', '').error).toBe('Nothing to pick');
  });
});
