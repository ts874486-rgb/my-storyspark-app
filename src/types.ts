export type Screen = 'welcome' | 'details' | 'loading' | 'preview' | 'bookshelf';

export type Gender = 'boy' | 'girl';

export type ThemeId = 'space' | 'dino' | 'forest' | 'jungle';

export interface StoryProfile {
  name: string;
  age: number | null;
  gender: Gender | null;
  themeId: ThemeId | null;
}

export interface StoryRequest {
  name: string;
  age: number;
  gender: Gender;
  themeId: ThemeId;
}

export interface StoryPage {
  text: string;
  imageUrl: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  currentSubscription: string;
  trialUsed: boolean;
}

export interface StoryBook {
  id: string;
  title: string;
  childName: string;
  age: number;
  themeId: ThemeId;
  pages: StoryPage[];
  isUnlocked: boolean;
  createdAt: string;
}

export type PreviewSource = { kind: 'new'; request: StoryRequest } | { kind: 'saved'; book: StoryBook };

export interface BookshelfState {
  profile: UserProfile;
  books: StoryBook[];
}
