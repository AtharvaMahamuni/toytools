import { describe, it, expect } from 'vitest';
import { toolGroups, getToolGroup } from './tool-groups';
import { tools } from './registry';

describe('tool groups', () => {
  it('getToolGroup resolves known groups and rejects unknown ids', () => {
    expect(getToolGroup('case-converters')?.name).toBe('Case Converter');
    expect(getToolGroup('nope')).toBeUndefined();
  });

  it('every member resolves to a registered tool that declares the group back', () => {
    for (const group of toolGroups) {
      for (const member of group.members) {
        const tool = tools.find(t => t.slug === member.slug);
        expect(tool, `member "${member.slug}" of group "${group.id}"`).toBeDefined();
        expect(tool?.toolGroup).toBe(group.id);
      }
    }
  });

  it('a group is one experience — members share engine and pattern', () => {
    for (const group of toolGroups) {
      const members = group.members
        .map(m => tools.find(t => t.slug === m.slug))
        .filter(Boolean);
      const engines = new Set(members.map(t => t!.engine));
      const patterns = new Set(members.map(t => t!.pattern));
      expect(engines.size, `group "${group.id}" engines`).toBe(1);
      expect(patterns.size, `group "${group.id}" patterns`).toBe(1);
    }
  });

  it('every tool declaring a toolGroup is listed in that group', () => {
    for (const tool of tools) {
      if (!tool.toolGroup) continue;
      const group = getToolGroup(tool.toolGroup);
      expect(group, `toolGroup "${tool.toolGroup}" of "${tool.slug}"`).toBeDefined();
      expect(group?.members.some(m => m.slug === tool.slug)).toBe(true);
    }
  });
});
