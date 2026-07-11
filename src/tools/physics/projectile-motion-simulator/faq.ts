import type { FAQItem } from '@data/types';

export const items: FAQItem[] = [
  {
    id: 'projectile-motion-simulator-faq-1',
    question: 'What angle gives the maximum range?',
    answer:
      'For a launch from ground level with no air resistance, 45 degrees gives the maximum range. Range depends on sin(2 theta), which is largest when 2 theta is 90 degrees, so theta is 45. For example, launch at 25 m/s and the 45 degree shot lands further than the same speed at 30 or 60 degrees. The simulator marks the landing point so you can sweep the angle slider and watch the range peak right at 45.',
  },
  {
    id: 'projectile-motion-simulator-faq-2',
    question: 'How do I calculate the range of a projectile?',
    answer:
      'Use R = v squared times sin(2 theta) divided by g, where v is the launch speed, theta is the launch angle, and g is gravity. Square the speed, multiply by the sine of twice the angle, then divide by g. For example, 20 m/s at 30 degrees on Earth gives about 35 metres. The simulator shows this range value updating live as you drag any control.',
  },
  {
    id: 'projectile-motion-simulator-faq-3',
    question: 'Why does the horizontal velocity stay constant?',
    answer:
      'Gravity only pulls downward, so it changes the vertical velocity but never the horizontal one. With no air resistance, nothing pushes the projectile forward or backward once it leaves the launcher, so its horizontal speed is fixed for the whole flight. The vertical part slows on the way up, stops at the peak, then speeds up on the way down. The velocity arrow in the simulator shows the horizontal length holding steady while the vertical part changes.',
  },
  {
    id: 'projectile-motion-simulator-faq-4',
    question: 'Do complementary angles give the same range?',
    answer:
      'Yes. Two angles that add up to 90 degrees, such as 30 and 60, produce the same range for the same launch speed, because sin(2 theta) is the same for both. The steeper one flies higher and stays in the air longer, while the shallower one is faster and lower, and they land in the same spot. For example, set 30 degrees, note the range, then set 60 degrees and watch it match.',
  },
  {
    id: 'projectile-motion-simulator-faq-5',
    question: 'How does gravity change the flight?',
    answer:
      'Weaker gravity means the projectile falls back more slowly, so it hangs in the air longer and travels much further from the same launch. For example, load the Moon preset, where gravity is about one sixth of Earth, and the same speed and angle send the projectile several times as far. Range and flight time both scale with 1 divided by g, so halving gravity doubles the range.',
  },
  {
    id: 'projectile-motion-simulator-faq-6',
    question: 'Does the simulator include air resistance?',
    answer:
      'No. This is ideal projectile motion, which ignores air resistance so the path is a clean, symmetric parabola. Real projectiles feel drag, which shortens the range and tilts the path so the descent is steeper than the climb. The ideal model is the standard starting point in physics courses because it isolates the roles of speed, angle, and gravity.',
  },
  {
    id: 'projectile-motion-simulator-faq-7',
    question: 'Does the simulator upload anything?',
    answer:
      'No. It runs entirely in your browser on the HTML canvas, computing the trajectory locally. Nothing is sent anywhere and it works offline once the page has loaded.',
  },
];
