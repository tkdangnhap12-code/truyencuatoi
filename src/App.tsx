import React, { useState, useEffect } from 'react';
import { 
  Project, 
  Story, 
  StoryBible, 
  Character, 
  CharacterRelationship, 
  WorldItem, 
  Chapter, 
  ChapterMilestone, 
  SceneItem, 
  StyleProfile, 
  ViewMode 
} from './types';
import { 
  initDatabase, 
  getAllProjects, 
  saveProject, 
  deleteProjectDB,
  getAllStories, 
  saveStory, 
  deleteStoryDB,
  getStoryBible, 
  saveStoryBibleDB,
  getCharactersByStory, 
  saveCharacterDB, 
  deleteCharacterDB,
  getRelationshipsByStory, 
  saveRelationshipDB, 
  deleteRelationshipDB,
  getWorldItemsByStory, 
  saveWorldItemDB, 
  deleteWorldItemDB,
  getChaptersByStory, 
  saveChapterDB, 
  deleteChapterDB,
  getStyleProfiles, 
  saveStyleProfileDB, 
  deleteStyleProfileDB,
  getTimelineEventsByStory,
  saveTimelineEventDB,
  deleteTimelineEventDB
} from './db';

import { ErrorScreen } from './components/ErrorScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { DashboardView } from './components/DashboardView';
import { ProjectManagerView } from './components/ProjectManagerView';
import { StoryManagerView } from './components/StoryManagerView';
import { StoryWizardView } from './components/StoryWizardView';
import { EditorView } from './components/EditorView';
import { StoryBibleView } from './components/StoryBibleView';
import { CharacterManagerView } from './components/CharacterManagerView';
import { WorldBuilderView } from './components/WorldBuilderView';
import { StyleLearningView } from './components/StyleLearningView';
import { LogicScannerView } from './components/LogicScannerView';
import { MasterPlotView } from './components/MasterPlotView';
import { TimelineView } from './components/TimelineView';

export function App() {
  const [bootError, setBootError] = useState<Error | null>(null);
  const [dbReady, setDbReady] = useState(false);

  // App State
  const [view, setView] = useState<ViewMode>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  const [activeStoryId, setActiveStoryId] = useState<string>('');

  // Active Domain Entities
  const [currentBible, setCurrentBible] = useState<StoryBible | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relationships, setRelationships] = useState<CharacterRelationship[]>([]);
  const [worldItems, setWorldItems] = useState<WorldItem[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [styleProfiles, setStyleProfiles] = useState<StyleProfile[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);

  // Safe Boot Engine
  useEffect(() => {
    async function boot() {
      try {
        await initDatabase();
        const loadedProjects = await getAllProjects();
        setProjects(loadedProjects);

        if (loadedProjects.length > 0) {
          const firstProjId = loadedProjects[0].id;
          setActiveProjectId(firstProjId);

          const loadedStories = await getAllStories(firstProjId);
          setStories(loadedStories);

          if (loadedStories.length > 0) {
            const firstStory = loadedStories[0];
            setActiveStoryId(firstStory.id);
            await loadStoryData(firstStory.id);
          }
        }

        const profiles = await getStyleProfiles();
        setStyleProfiles(profiles);

        setDbReady(true);
      } catch (err: any) {
        setBootError(err instanceof Error ? err : new Error(String(err)));
      }
    }

    boot();
  }, []);

  const loadStoryData = async (storyId: string) => {
    try {
      const bible = await getStoryBible(storyId);
      setCurrentBible(bible);

      const chars = await getCharactersByStory(storyId);
      setCharacters(chars);

      const rels = await getRelationshipsByStory(storyId);
      setRelationships(rels);

      const wItems = await getWorldItemsByStory(storyId);
      setWorldItems(wItems);

      const chaps = await getChaptersByStory(storyId);
      setChapters(chaps);

      const tEvents = await getTimelineEventsByStory(storyId);
      setTimelineEvents(tEvents);
    } catch (err) {
      console.error('Failed to load story data:', err);
    }
  };

  // Switch Story
  const handleSelectStory = async (storyId: string) => {
    setActiveStoryId(storyId);
    await loadStoryData(storyId);
  };

  // Switch Project
  const handleSelectProject = async (projId: string) => {
    setActiveProjectId(projId);
    const loadedStories = await getAllStories(projId);
    setStories(loadedStories);

    if (loadedStories.length > 0) {
      setActiveStoryId(loadedStories[0].id);
      await loadStoryData(loadedStories[0].id);
    } else {
      setActiveStoryId('');
      setCurrentBible(null);
      setCharacters([]);
      setRelationships([]);
      setWorldItems([]);
      setChapters([]);
      setTimelineEvents([]);
    }
  };

  // Handlers for Projects
  const handleSaveProject = async (p: Project) => {
    await saveProject(p);
    const updated = await getAllProjects();
    setProjects(updated);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProjectDB(id);
    const updated = await getAllProjects();
    setProjects(updated);
    if (activeProjectId === id) {
      if (updated.length > 0) {
        handleSelectProject(updated[0].id);
      } else {
        setActiveProjectId('');
        setStories([]);
      }
    }
  };

  // Handlers for Stories
  const handleSaveStory = async (s: Story) => {
    await saveStory(s);
    const updated = await getAllStories(s.projectId);
    setStories(updated);
  };

  const handleDeleteStory = async (id: string) => {
    await deleteStoryDB(id);
    const updated = await getAllStories(activeProjectId);
    setStories(updated);
    if (activeStoryId === id) {
      if (updated.length > 0) {
        handleSelectStory(updated[0].id);
      } else {
        setActiveStoryId('');
      }
    }
  };

  // Wizard Complete Callback
  const handleCompleteWizard = async (story: Story, bible: StoryBible, outlineChapters: any[]) => {
    await saveStory(story);
    await saveStoryBibleDB(bible);

    // Save generated outline chapters
    if (outlineChapters && outlineChapters.length > 0) {
      for (let i = 0; i < outlineChapters.length; i++) {
        const item = outlineChapters[i];
        const newChap: Chapter = {
          id: `chap-${Date.now()}-${i}`,
          storyId: story.id,
          order: item.order || i + 1,
          title: item.title || `Chương ${i + 1}`,
          summary: item.summary || '',
          content: `Chương ${i + 1}: ${item.title}\n\n[Tóm tắt: ${item.summary}]\n\nBắt đầu nội dung chương...`,
          wordCount: 15,
          status: 'draft',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await saveChapterDB(newChap);
      }
    } else {
      // Default initial chapter 1
      const chap1: Chapter = {
        id: 'chap-' + Date.now(),
        storyId: story.id,
        order: 1,
        title: 'Chương 1: Mở Đầu Hành Trình',
        summary: story.synopsis || '',
        content: 'Nội dung Chương 1 đang được viết...',
        wordCount: 10,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await saveChapterDB(chap1);
    }

    const updatedStories = await getAllStories(story.projectId);
    setStories(updatedStories);
    setActiveStoryId(story.id);
    await loadStoryData(story.id);
    setView('editor');
  };

  // Handlers for Chapter
  const handleSaveChapter = async (c: Chapter) => {
    await saveChapterDB(c);
    const updated = await getChaptersByStory(c.storyId);
    setChapters(updated);
  };

  const handleAddChapter = async () => {
    if (!activeStoryId) return;
    const newChap: Chapter = {
      id: 'chap-' + Date.now(),
      storyId: activeStoryId,
      order: chapters.length + 1,
      title: `Chương ${chapters.length + 1}: Tên Chương Mới`,
      summary: '',
      content: '',
      wordCount: 0,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    await saveChapterDB(newChap);
    const updated = await getChaptersByStory(activeStoryId);
    setChapters(updated);
  };

  const handleDeleteChapter = async (id: string) => {
    await deleteChapterDB(id);
    if (activeStoryId) {
      const updated = await getChaptersByStory(activeStoryId);
      setChapters(updated);
    }
  };

  // Handlers for Story Bible
  const handleSaveBible = async (b: StoryBible) => {
    await saveStoryBibleDB(b);
    setCurrentBible(b);
  };

  // Handlers for Characters
  const handleSaveCharacter = async (c: Character) => {
    await saveCharacterDB(c);
    const updated = await getCharactersByStory(c.storyId);
    setCharacters(updated);
  };

  const handleDeleteCharacter = async (id: string) => {
    await deleteCharacterDB(id);
    if (activeStoryId) {
      const updated = await getCharactersByStory(activeStoryId);
      setCharacters(updated);
    }
  };

  // Handlers for Relationships
  const handleSaveRelationship = async (r: CharacterRelationship) => {
    await saveRelationshipDB(r);
    const updated = await getRelationshipsByStory(r.storyId);
    setRelationships(updated);
  };

  const handleDeleteRelationship = async (id: string) => {
    await deleteRelationshipDB(id);
    if (activeStoryId) {
      const updated = await getRelationshipsByStory(activeStoryId);
      setRelationships(updated);
    }
  };

  // Handlers for World Items
  const handleSaveWorldItem = async (w: WorldItem) => {
    await saveWorldItemDB(w);
    const updated = await getWorldItemsByStory(w.storyId);
    setWorldItems(updated);
  };

  const handleDeleteWorldItem = async (id: string) => {
    await deleteWorldItemDB(id);
    if (activeStoryId) {
      const updated = await getWorldItemsByStory(activeStoryId);
      setWorldItems(updated);
    }
  };

  // Handlers for Style Profiles
  const handleSaveStyleProfile = async (p: StyleProfile) => {
    await saveStyleProfileDB(p);
    const updated = await getStyleProfiles();
    setStyleProfiles(updated);
  };

  const handleDeleteStyleProfile = async (id: string) => {
    await deleteStyleProfileDB(id);
    const updated = await getStyleProfiles();
    setStyleProfiles(updated);
  };

  // Handlers for Timeline Events
  const handleSaveTimelineEvent = async (e: any) => {
    await saveTimelineEventDB(e);
    if (activeStoryId) {
      const updated = await getTimelineEventsByStory(activeStoryId);
      setTimelineEvents(updated);
    }
  };

  const handleDeleteTimelineEvent = async (id: string) => {
    await deleteTimelineEventDB(id);
    if (activeStoryId) {
      const updated = await getTimelineEventsByStory(activeStoryId);
      setTimelineEvents(updated);
    }
  };

  // If Boot Failed, render Global Error Screen
  if (bootError) {
    return <ErrorScreen error={bootError} onReload={() => window.location.reload()} />;
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-wide text-slate-400">ĐANG KHỞI ĐỘNG AI NOVEL STUDIO...</p>
      </div>
    );
  }

  const activeStory = stories.find((s) => s.id === activeStoryId) || stories[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        projects={projects}
        stories={stories}
        activeProjectId={activeProjectId}
        activeStoryId={activeStoryId}
        onSelectProject={handleSelectProject}
        onSelectStory={handleSelectStory}
        onOpenWizard={() => setView('wizard')}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeView={view} onNavigate={setView} />

        {/* Dynamic View Canvas */}
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && (
            <DashboardView
              projects={projects}
              stories={stories}
              activeStory={activeStory}
              chapters={chapters}
              onNavigate={setView}
            />
          )}

          {view === 'projects' && (
            <ProjectManagerView
              projects={projects}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onSelectProject={(id) => {
                handleSelectProject(id);
                setView('stories');
              }}
            />
          )}

          {view === 'stories' && (
            <StoryManagerView
              projectId={activeProjectId}
              stories={stories}
              onSaveStory={handleSaveStory}
              onDeleteStory={handleDeleteStory}
              onSelectStory={(id) => {
                handleSelectStory(id);
                setView('editor');
              }}
              onOpenWizard={() => setView('wizard')}
            />
          )}

          {view === 'wizard' && (
            <StoryWizardView
              projectId={activeProjectId}
              onCompleteWizard={handleCompleteWizard}
              onNavigate={setView}
            />
          )}

          {view === 'editor' && (
            <EditorView
              story={activeStory}
              chapters={chapters}
              bible={currentBible}
              milestones={[]}
              scenes={[]}
              onSaveChapter={handleSaveChapter}
              onAddChapter={handleAddChapter}
              onDeleteChapter={handleDeleteChapter}
              onSaveMilestones={() => {}}
              onSaveScenes={() => {}}
            />
          )}

          {view === 'bible' && (
            <StoryBibleView
              story={activeStory}
              bible={currentBible}
              onSaveBible={handleSaveBible}
            />
          )}

          {view === 'characters' && (
            <CharacterManagerView
              story={activeStory}
              characters={characters}
              relationships={relationships}
              onSaveCharacter={handleSaveCharacter}
              onDeleteCharacter={handleDeleteCharacter}
              onSaveRelationship={handleSaveRelationship}
              onDeleteRelationship={handleDeleteRelationship}
            />
          )}

          {view === 'world' && (
            <WorldBuilderView
              story={activeStory}
              worldItems={worldItems}
              onSaveWorldItem={handleSaveWorldItem}
              onDeleteWorldItem={handleDeleteWorldItem}
            />
          )}

          {view === 'style-learning' && (
            <StyleLearningView
              styleProfiles={styleProfiles}
              onSaveStyleProfile={handleSaveStyleProfile}
              onDeleteStyleProfile={handleDeleteStyleProfile}
            />
          )}

          {view === 'scanner' && (
            <LogicScannerView
              story={activeStory}
              chapters={chapters}
              onApplyFix={(chapterId, newContent) => {
                const chap = chapters.find((c) => c.id === chapterId);
                if (chap) {
                  handleSaveChapter({
                    ...chap,
                    content: newContent,
                    wordCount: newContent.trim() ? newContent.trim().split(/\s+/).length : 0,
                    updatedAt: Date.now()
                  });
                }
              }}
            />
          )}

          {view === 'plot' && (
            <MasterPlotView
              story={activeStory}
              masterPlot={null}
              onSaveMasterPlot={() => {}}
            />
          )}

          {view === 'timeline' && (
            <TimelineView
              story={activeStory}
              timelineEvents={timelineEvents}
              characters={characters}
              onSaveTimelineEvent={handleSaveTimelineEvent}
              onDeleteTimelineEvent={handleDeleteTimelineEvent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
