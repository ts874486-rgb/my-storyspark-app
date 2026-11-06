import { SAMPLE_STORY_PAGES, SAMPLE_STORY_TITLES } from '@/data/sampleStory';
import { getThemeImage } from '@/data/themeImages';
import { supabase } from '@/lib/supabase';
import type { StoryPage, StoryRequest } from '@/types';

export const PAGE_COUNT = 10;
const GENERATE_FUNCTION = 'generate-story';

interface GeneratedPage {
  text: string;
  imageUrl: string | null;
}

interface GeneratedStory {
  title?: string;
  pages: GeneratedPage[];
}

function isGeneratedPage(value: unknown): value is GeneratedPage {
  if (typeof value !== 'object' || value === null) return false;
  const page = value as GeneratedPage;
  return typeof page.text === 'string' && (page.imageUrl === null || typeof page.imageUrl === 'string');
}

function isGeneratedStoryResponse(value: unknown): value is GeneratedStory {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  const pages = v.pages;
  return Array.isArray(pages) && pages.length === PAGE_COUNT && pages.every(isGeneratedPage);
}

export interface StoryResult {
  title: string;
  pages: StoryPage[];
}

export async function generateStory(request: StoryRequest): Promise<StoryResult> {
  if (!supabase) return buildSampleStory(request);

  try {
    const { data, error } = await supabase.functions.invoke<unknown>(GENERATE_FUNCTION, {
      body: {
        name: request.name,
        age: request.age,
        gender: request.gender,
        themeId: request.themeId,
      },
    });
    if (error || !isGeneratedStoryResponse(data)) return buildSampleStory(request);

    const pages: StoryPage[] = data.pages.map((page, index) => ({
      text: page.text,
      imageUrl: page.imageUrl ?? getThemeImage(request.themeId, index),
    }));
    const title = data.title?.trim() || SAMPLE_STORY_TITLES[request.themeId];
    return { title, pages };
  } catch {
    return buildSampleStory(request);
  }
}

function buildSampleStory(request: StoryRequest): StoryResult {
  return {
    title: SAMPLE_STORY_TITLES[request.themeId],
    pages: SAMPLE_STORY_PAGES[request.themeId].map((page, index) => ({
      text: page.text(request.name, request.age),
      imageUrl: getThemeImage(request.themeId, index),
    })),
  };
}
