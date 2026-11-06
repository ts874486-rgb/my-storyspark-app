import { Bird, Footprints, Rocket, TreePine, type LucideIcon } from 'lucide-react';
import type { ThemeId } from '@/types';

export interface StoryTheme {
  id: ThemeId;
  title: string;
  description: string;
  storyPrompt: string;
  icon: LucideIcon;
  tileClass: string;
}

export const STORY_THEMES: StoryTheme[] = [
  {
    id: 'space',
    title: 'Space Adventure',
    description: 'Rocket rides, glowing planets, and friendly aliens',
    storyPrompt: 'a space adventure with rockets, glowing planets, and friendly aliens',
    icon: Rocket,
    tileClass: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'dino',
    title: 'Dino World',
    description: 'Gentle giants, hidden valleys, and ancient mysteries',
    storyPrompt: 'a prehistoric dino world with gentle giant dinosaurs, ferns, and hidden valleys',
    icon: Footprints,
    tileClass: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'forest',
    title: 'Magic Forest',
    description: 'Talking trees, sparkling fairies, and secret paths',
    storyPrompt: 'a magic forest with sparkling fairies, glowing mushrooms, and secret paths',
    icon: TreePine,
    tileClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'jungle',
    title: 'Jungle Safari',
    description: 'Friendly lions, playful monkeys, and hidden waterfalls',
    storyPrompt: 'a jungle safari with friendly lions, playful monkeys, and hidden waterfalls',
    icon: Bird,
    tileClass: 'bg-yellow-100 text-yellow-800',
  },
];

export function getStoryTheme(id: ThemeId | null): StoryTheme | undefined {
  return STORY_THEMES.find((theme) => theme.id === id);
}
