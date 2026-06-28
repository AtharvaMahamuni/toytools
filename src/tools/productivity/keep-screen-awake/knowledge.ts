import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'keep-screen-awake',
  title: 'Keep Screen Awake',
  category: 'productivity',
  summary: 'Stop your screen from dimming or sleeping using the browser Wake Lock API, with one toggle.',
  primaryConcepts: ['keep screen awake'],
  secondaryConcepts: ['wake lock', 'prevent screen sleep', 'screen timeout', 'screensaver'],
  intentGroups: {
    informational: ['What is the Wake Lock API?', 'Why does my screen dim during reading?'],
    howTo: ['How to stop the screen from sleeping while presenting', 'How to keep a dashboard display on'],
    comparison: ['Wake lock vs changing system power settings', 'Browser tab awake vs whole-device awake'],
    misconception: ['Wake lock works only while the tab is visible', 'It does not override every system power policy'],
    troubleshooting: ['The lock released when I switched tabs', 'It is unsupported in my browser'],
  },
  realWorldUseCases: [
    'Keeping the screen on while reading a long recipe or article',
    'Preventing sleep during a presentation or demo',
    'Holding a wall-mounted dashboard display awake',
    'Following on-screen instructions without tapping to wake',
  ],
  commonMistakes: [
    'Expecting it to keep working after the tab is hidden',
    'Assuming it overrides device-level power management entirely',
  ],
  commonQuestions: [
    'Does it work when I switch to another tab or app?',
    'Which browsers support the Wake Lock API?',
    'Does it drain more battery?',
  ],
  usedWith: [
    { slug: 'pomodoro-timer', reason: 'Keep the timer visible without the screen sleeping', strength: 0.6 },
    { slug: 'notepad', reason: 'Keep notes on screen during a long session', strength: 0.4 },
  ],
  alternatives: [],
  nextSteps: [
    { slug: 'pomodoro-timer', reason: 'Run a focus session with the screen kept on', priority: 1 },
  ],
  workflowStage: ['input'],
  keywords: ['keep screen awake', 'prevent screen sleep', 'wake lock', 'stop screen dimming', 'keep display on'],
  entityAliases: ['keep awake', 'wake lock', 'prevent sleep'],
  inputs: ['toggle'],
  outputs: ['active wake lock'],
  difficulty: 'beginner',
  audience: ['presenters', 'readers', 'kiosk operators'],
};
