import { KNOWLEDGE_SCHEMA_VERSION, type Knowledge } from '@lib/knowledge/types';

export const knowledge: Knowledge = {
  schemaVersion: KNOWLEDGE_SCHEMA_VERSION,
  slug: 'no-sleep-website',
  title: 'No Sleep Website',
  category: 'productivity',
  summary: 'Keep your screen awake online while this tab stays open, using the browser Screen Wake Lock API.',
  primaryConcepts: ['no sleep website', 'keep screen awake'],
  secondaryConcepts: [
    'no sleep page',
    'wake lock',
    'prevent screen sleep',
    'screen timeout',
    'screen on online',
    'keep phone screen awake',
    'keep laptop screen awake',
  ],
  intentGroups: {
    informational: [
      'What is a no sleep website?',
      'What is the Wake Lock API?',
      'Why does my screen dim during reading or presenting?',
    ],
    howTo: [
      'How to keep a phone or laptop screen awake online',
      'How to stop the screen from sleeping while presenting',
      'How to keep a dashboard or recipe display on without touching the screen',
    ],
    comparison: [
      'No sleep website vs changing system display timeout settings',
      'Browser tab wake lock vs whole-device caffeinate utilities',
    ],
    misconception: [
      'A wake lock works only while the tab remains open and visible',
      'It cannot override hardware power buttons or device battery shutdown policies',
    ],
    troubleshooting: [
      'The lock released when I switched tabs or locked the phone',
      'Browser displays an unsupported wake lock message',
    ],
  },
  realWorldUseCases: [
    'Keeping the screen on while reading a long recipe or tutorial in the kitchen',
    'Preventing display sleep during a slide presentation, demo, or online meeting',
    'Holding a wall-mounted dashboard, kiosk, or telemetry display awake',
    'Following code reviews or long-form documentation without tapping the screen',
  ],
  commonMistakes: [
    'Expecting the wake lock to stay active after switching tabs or backgrounding the browser',
    'Assuming browser wake locks override operating system low-battery shutdown policies',
  ],
  commonQuestions: [
    'What is a no sleep website?',
    'How do I keep my screen awake online?',
    'Does this no sleep website work on Android?',
    'Does it work on iPhone and iPad?',
    'Can I keep my laptop or desktop screen awake?',
    'Does the page work when I switch tabs or minimize the browser?',
    'Does keeping my screen awake drain battery?',
    'Is this no sleep website free to use?',
    'Do I need to install an app or extension?',
    'Why does my screen still turn off?',
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
  keywords: [
    'no sleep website',
    'no sleep page',
    'keep screen awake',
    'prevent screen sleep',
    'wake lock',
    'stop screen dimming',
    'keep display on',
    'screen on online',
  ],
  entityAliases: ['no sleep website', 'no sleep page', 'keep awake', 'wake lock', 'prevent sleep'],
  inputs: ['toggle'],
  outputs: ['active wake lock'],
  difficulty: 'beginner',
  audience: ['presenters', 'readers', 'students', 'cooks', 'developers', 'kiosk operators'],
};
