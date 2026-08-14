export type ViewMode = 
  | 'dashboard' 
  | 'projects' 
  | 'stories' 
  | 'wizard' 
  | 'editor' 
  | 'bible' 
  | 'characters' 
  | 'world' 
  | 'timeline' 
  | 'plot' 
  | 'style_learning' 
  | 'logic_scanner';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  genres: string[];
  writingStyle: string[];
  archived?: boolean;
}

export interface Story {
  id: string;
  projectId: string;
  title: string;
  author: string;
  synopsis: string;
  genres: string[];
  writingStyle: string[];
  styleProfileId?: string;
  status: 'draft' | 'writing' | 'completed' | 'paused';
  targetChapters: number;
  targetWordCountPerChapter: number;
  coverColor?: string;
  createdAt: number;
  updatedAt: number;
  archived?: boolean;
}

export interface StoryBible {
  id: string;
  storyId: string;
  logline: string;
  hook: string;
  premise: string;
  synopsis: string;
  theme: string;
  tone: string;
  worldRules: string;
  socialRules: string;
  politicalRules: string;
  magicTechnologyRules: string;
  importantEvents: string;
  forbiddenContradictions: string;
}

export interface Character {
  id: string;
  storyId: string;
  name: string;
  aliases: string;
  age: string;
  gender: string;
  appearance: string;
  personality: string;
  backstory: string;
  goals: string;
  motivations: string;
  strengths: string;
  weaknesses: string;
  fears: string;
  secrets: string;
  arc: string;
  status: 'active' | 'deceased' | 'missing' | 'background';
  notes: string;
}

export interface CharacterRelationship {
  id: string;
  storyId: string;
  char1Id: string;
  char2Id: string;
  relationType: 'Cha/Mẹ' | 'Con' | 'Anh/Em' | 'Bạn' | 'Đồng minh' | 'Kẻ thù' | 'Tình yêu' | 'Sư phụ' | 'Đệ tử' | 'Chủ nhân' | 'Thuộc hạ' | 'Đối thủ' | 'Khác';
  description: string;
}

export interface WorldItem {
  id: string;
  storyId: string;
  category: 'Địa điểm' | 'Quốc gia' | 'Bang phái' | 'Tổ chức' | 'Gia tộc' | 'Tôn giáo' | 'Quân đội' | 'Chính trị' | 'Tiền tệ' | 'Văn hóa' | 'Luật lệ' | 'Ma pháp/Công nghệ' | 'Vũ khí/Bảo vật';
  name: string;
  description: string;
  rules: string;
  location?: string;
}

export interface TimelineEvent {
  id: string;
  storyId: string;
  dateOrYear: string;
  characterAges: Record<string, string>; // charId -> age text
  location: string;
  title: string;
  description: string;
  relatedChapterId?: string;
}

export interface MasterPlot {
  id: string;
  storyId: string;
  logline: string;
  hook: string;
  act1: string;
  act2: string;
  act3: string;
  midpoint: string;
  climax: string;
  ending: string;
  mainConflict: string;
  subConflicts: string;
  characterArcSummary: string;
}

export interface ChapterMilestone {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  goal: string;
  events: string;
  charactersInvolved: string;
  actionDialogueNotes: string;
  emotionalShift: string;
  newInfoOutcome: string;
}

export interface SceneItem {
  id: string;
  chapterId: string;
  order: number;
  location: string;
  timeOfDay: string;
  characters: string;
  goal: string;
  conflict: string;
  action: string;
  dialogueSummary: string;
  result: string;
}

export interface Chapter {
  id: string;
  storyId: string;
  order: number;
  title: string;
  summary: string;
  goal?: string;
  conflict?: string;
  charactersInvolved?: string;
  location?: string;
  timeOfDay?: string;
  climax?: string;
  nextChapterHook?: string;
  content: string;
  wordCount: number;
  status?: 'draft' | 'outline' | 'writing' | 'completed';
  isGenerated?: boolean;
  createdAt?: number;
  updatedAt: number;
}

export interface StyleProfile {
  id: string;
  name: string;
  sourceFileName: string;
  sentenceStructure: string;
  vocabularyAndTone: string;
  pacingAndRhythm: string;
  dialogueStyle: string;
  descriptionStyle: string;
  sampleExcerpts: string;
  createdAt: number;
}

export interface LogicError {
  id: string;
  storyId: string;
  chapterId?: string;
  chapterTitle?: string;
  sceneId?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'Character' | 'Timeline' | 'Location' | 'WorldRules' | 'Causality';
  excerpt: string;
  description: string;
  cause: string;
  suggestedFix: string;
  proposedAfterText?: string;
}

export interface AppSettings {
  geminiApiKey: string;
  modelName: string;
  theme: 'dark' | 'light';
  autoSaveIntervalMs: number;
}
