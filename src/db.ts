import {
  Project,
  Story,
  StoryBible,
  Character,
  CharacterRelationship,
  WorldItem,
  TimelineEvent,
  MasterPlot,
  Chapter,
  ChapterMilestone,
  SceneItem,
  StyleProfile,
  AppSettings
} from './types';

const DB_NAME = 'AINovelStudioDB';
const DB_VERSION = 1;

class StudioDatabase {
  private db: IDBDatabase | null = null;
  private memoryStore: Record<string, any[]> = {
    projects: [],
    stories: [],
    storyBibles: [],
    characters: [],
    relationships: [],
    worldItems: [],
    timelineEvents: [],
    masterPlots: [],
    chapters: [],
    milestones: [],
    scenes: [],
    styleProfiles: []
  };
  private isMemoryFallback = false;

  public async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      this.isMemoryFallback = true;
      this.loadMemoryFromLocalStorage();
      return;
    }

    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const stores = [
            'projects',
            'stories',
            'storyBibles',
            'characters',
            'relationships',
            'worldItems',
            'timelineEvents',
            'masterPlots',
            'chapters',
            'milestones',
            'scenes',
            'styleProfiles'
          ];

          stores.forEach((storeName) => {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id' });
            }
          });
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      // Seed initial demo project if database is completely empty
      const projects = await this.getAll<Project>('projects');
      if (projects.length === 0) {
        await this.seedDemoData();
      }
    } catch (err) {
      console.warn('IndexedDB failed to open, using memory/localStorage fallback:', err);
      this.isMemoryFallback = true;
      this.loadMemoryFromLocalStorage();
      if (this.memoryStore.projects.length === 0) {
        await this.seedDemoDataMemory();
      }
    }
  }

  private loadMemoryFromLocalStorage() {
    try {
      const saved = localStorage.getItem('AINovelStudio_MemoryStore');
      if (saved) {
        this.memoryStore = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage memory load failed:', e);
    }
  }

  private saveMemoryToLocalStorage() {
    try {
      localStorage.setItem('AINovelStudio_MemoryStore', JSON.stringify(this.memoryStore));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public async getAll<T>(storeName: string): Promise<T[]> {
    if (this.isMemoryFallback || !this.db) {
      return (this.memoryStore[storeName] || []) as T[];
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        request.onsuccess = () => resolve((request.result || []) as T[]);
        request.onerror = () => reject(request.error);
      } catch (e) {
        resolve((this.memoryStore[storeName] || []) as T[]);
      }
    });
  }

  public async put<T extends { id: string }>(storeName: string, item: T): Promise<void> {
    if (this.isMemoryFallback || !this.db) {
      const items = this.memoryStore[storeName] || [];
      const idx = items.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        items[idx] = item;
      } else {
        items.push(item);
      }
      this.memoryStore[storeName] = items;
      this.saveMemoryToLocalStorage();
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (e) {
        // Fallback write
        const items = this.memoryStore[storeName] || [];
        const idx = items.findIndex((x) => x.id === item.id);
        if (idx >= 0) items[idx] = item;
        else items.push(item);
        this.memoryStore[storeName] = items;
        this.saveMemoryToLocalStorage();
        resolve();
      }
    });
  }

  public async delete(storeName: string, id: string): Promise<void> {
    if (this.isMemoryFallback || !this.db) {
      const items = this.memoryStore[storeName] || [];
      this.memoryStore[storeName] = items.filter((x) => x.id !== id);
      this.saveMemoryToLocalStorage();
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db!.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (e) {
        const items = this.memoryStore[storeName] || [];
        this.memoryStore[storeName] = items.filter((x) => x.id !== id);
        this.saveMemoryToLocalStorage();
        resolve();
      }
    });
  }

  // Seed Demo Data
  private async seedDemoData() {
    const demoProject: Project = {
      id: 'proj-demo-1',
      name: 'Vũ Trụ Huyền Huyễn - Kiếm Đạo',
      description: 'Dự án tiểu thuyết tu tiên huyền huyễn cổ trang kết hợp hài hước châm biếm.',
      createdAt: Date.now() - 86400000 * 3,
      updatedAt: Date.now(),
      genres: ['Tu tiên', 'Huyền huyễn', 'Hài hước', 'Cổ trang'],
      writingStyle: ['Cổ trang', 'Sắc bén', 'Châm biếm']
    };

    const demoStory: Story = {
      id: 'story-demo-1',
      projectId: 'proj-demo-1',
      title: 'Thiên Cung Nghịch Mệnh Ký',
      author: 'Lăng Thiên Bút',
      synopsis: 'Một thiếu niên bình thường nhặt được mảnh vỡ Kiếm Đế Cổ Đại, vô tình bước vào con đường tu tiên đầy cạm bẫy nhưng bằng trí tuệ và sự lém lỉnh, hắn khiến cả Tiên Giới phải dở khóc dở cười.',
      genres: ['Tu tiên', 'Huyền huyễn', 'Hài hước'],
      writingStyle: ['Cổ trang', 'Sắc bén'],
      status: 'writing',
      targetChapters: 50,
      targetWordCountPerChapter: 2500,
      coverColor: 'from-amber-600 to-red-900',
      createdAt: Date.now() - 86400000 * 2,
      updatedAt: Date.now()
    };

    const demoBible: StoryBible = {
      id: 'bible-demo-1',
      storyId: 'story-demo-1',
      logline: 'Thiếu niên nhặt kiếm cổ quậy phá Tiên Giới để tìm lại ký ức đã mất.',
      hook: 'Thanh kiếm cổ truyền trao sức mạnh khủng khiếp nhưng mỗi lần rút kiếm lại phát ra tiếng nhạc hài hước!',
      premise: 'Tu tiên không nhất thiết phải nghiêm túc, kẻ mạnh nhất là kẻ mưu trí và biết giữ bản tâm.',
      synopsis: 'Lâm Tiếu là đệ tử ngoại môn của Ninh Xuyên Tông. Sau một sự cố ở Thần Cấm Cốc, hắn ký kết linh hồn với Kiếm Đế Linh - một lão quỷ tinh ranh nhưng đã mất trí nhớ.',
      theme: 'Sự kiên trì, tình bằng hữu và cái nhìn châm biếm về quy tắc hà khắc.',
      tone: 'Hào hùng nhưng pha lẫn hài hước lém lỉnh, tiết tấu nhanh.',
      worldRules: 'Tu tiên chia làm 9 Cảnh Giới: Luyện Khí, Trúc Cơ, Kim Đan, Nguyên Anh, Hóa Thần, Luyện Hư, Hợp Thể, Đại Thừa, Độ Kiếp.',
      socialRules: 'Kẻ mạnh tôn sùng, tông môn chia làm Chính - Tà nhưng giới hạn mỏng mong.',
      politicalRules: 'Ba đại Tông Môn cai trị Ninh Xuyên Châu.',
      magicTechnologyRules: 'Linh lực vận hành qua kinh mạch, kiếm khí mang theo thuộc tính ngũ hành.',
      importantEvents: 'Đại hội Tông môn 10 năm một lần chuẩn bị diễn ra.',
      forbiddenContradictions: 'Lâm Tiếu chưa đạt Trúc Cơ thì không thể phi hành độc lập mà phải dùng phi kiếm bảo cụ.'
    };

    const demoChar1: Character = {
      id: 'char-1',
      storyId: 'story-demo-1',
      name: 'Lâm Tiếu',
      aliases: 'Tiếu Tử, Kiếm Ma Lém Lỉnh',
      age: '18',
      gender: 'Nam',
      appearance: 'Tuấn tú, mắt sáng lanh lợi, thường mặc áo xám ngoại môn giản dị.',
      personality: 'Thông minh, lạc quan, bề ngoài vô hại nhưng bên trong tính toán sắc bén.',
      backstory: 'Mồ côi từ nhỏ, được Bộc Dịch Viện nuôi dưỡng trước khi thành đệ tử ngoại môn.',
      goals: 'Bảo vệ bạn bè, khám phá bí mật Thanh Kiếm Cổ.',
      motivations: 'Không muốn bị ai đè nếp chi phối số phận.',
      strengths: 'Phản ứng nhanh, hiểu sâu về kiếm ý.',
      weaknesses: 'Thích liều lĩnh, đôi khi quá tự tin vào mưu mẹo.',
      fears: 'Sợ người thân thiết gặp nguy hiểm.',
      secrets: 'Sở hữu Kiếm Đế Cổ Linh trong thức hải.',
      arc: 'Từ đệ tử ngoại môn vô danh trở thành người chấn động Tiên Giới.',
      status: 'active',
      notes: 'Nhân vật chính'
    };

    const demoChar2: Character = {
      id: 'char-2',
      storyId: 'story-demo-1',
      name: 'Mục Tuyết Dao',
      aliases: 'Tuyết Tiên Tử',
      age: '19',
      gender: 'Nữ',
      appearance: 'Xinh đẹp thanh thoát, áo trắng như tuyết, mang Băng Sương Trọng Kiếm.',
      personality: 'Lạnh lùng bề ngoài, bên trong ấm áp và rất công bằng.',
      backstory: 'Con gái Chưởng Môn, thiên tài kiệt xuất nhất 100 năm qua.',
      goals: 'Tìm ra sự thật về cái chết của mẫu thân.',
      motivations: 'Trở thành kiếm sĩ mạnh nhất để tự quyết định vận mệnh.',
      strengths: 'Kiếm pháp Hàn Băng vô song.',
      weaknesses: 'Nói chuyện quá thẳng thắn.',
      fears: 'Sợ thất bại và phản bội.',
      secrets: 'Đang âm thầm điều tra Trưởng Lão Hội.',
      arc: 'Học cách tin tưởng người khác và phá bỏ vỏ bọc lạnh lùng.',
      status: 'active',
      notes: 'Nữ chính'
    };

    const demoRel: CharacterRelationship = {
      id: 'rel-1',
      storyId: 'story-demo-1',
      char1Id: 'char-1',
      char2Id: 'char-2',
      relationType: 'Đồng minh',
      description: 'Ban đầu hiểu lầm đối đầu, sau nhiều lần sinh tử trở thành đồng minh tin cậy.'
    };

    const demoWorld: WorldItem = {
      id: 'world-1',
      storyId: 'story-demo-1',
      category: 'Bang phái',
      name: 'Ninh Xuyên Tông',
      description: 'Danh môn chính đạo cai trị vùng sơn linh thủy tú Ninh Xuyên.',
      rules: 'Đệ tử không được tàn sát lẫn nhau, đại hội luận kiếm quyết định tài nguyên phân bổ.'
    };

    const demoTimeline: TimelineEvent = {
      id: 'time-1',
      storyId: 'story-demo-1',
      dateOrYear: 'Năm Ninh Xuyên thứ 302',
      characterAges: { 'char-1': '18 tuổi', 'char-2': '19 tuổi' },
      location: 'Thần Cấm Cốc',
      title: 'Lâm Tiếu nhặt Kiếm Cổ',
      description: 'Lâm Tiếu bị đẩy xuống vực sâu Thần Cấm Cốc và vô tình thức tỉnh Kiếm Đế Cổ Linh.'
    };

    const demoChapter1: Chapter = {
      id: 'chap-1',
      storyId: 'story-demo-1',
      order: 1,
      title: 'Chương 1: Mảnh Vỡ Kiếm Cổ',
      summary: 'Lâm Tiếu thu dọn phế tích Thần Cấm Cốc, nhặt được thanh kiếm gỉ sét và mở ra con đường tu tiên kỳ lạ.',
      goal: 'Thức tỉnh Kiếm Linh và thoát khỏi vách núi.',
      conflict: 'Yêu thú cấp thấp tấn công trong đêm.',
      charactersInvolved: 'Lâm Tiếu',
      location: 'Thần Cấm Cốc',
      timeOfDay: 'Đêm tối',
      climax: 'Thanh kiếm vỡ phát ra kiếm quang xua đuổi bầy yêu sói.',
      nextChapterHook: 'Kiếm Linh cất tiếng nói đầu tiên trong đầu Lâm Tiếu.',
      content: `Sương mù giăng kín Thần Cấm Cốc. Gió bấc thổi qua những vách đá lởm chởm tạo thành tiếng hú vang rợn người như tiếng ma hờn khóc ngọc.

Lâm Tiếu quệt vết máu khô trên khóe miệng, thở dốc ngửa đầu nhìn lên vách núi cao nghìn trượng. Áo xám ngoại môn của Ninh Xuyên Tông đã rách rưới vài đường, để lộ làn da săn chắc cùng những vết xước rớm máu.

"Mấy tên chó má nội môn... Tốt nhất là nguyện cầu ta không sống sót trở về!" 

Hắn lẩm bẩm, ánh mắt lóe lên sự sắc bén khác hẳn vẻ ngơ ngác thường ngày. Ban chiều, chỉ vì không chịu nhượng lại viên Linh Thảo nhặt được, hắn đã bị tên đệ tử nội môn ghen tức ra tay đả thương rồi rơi xuống đáy vực này.

Đúng lúc đó, dưới lớp rêu phong mùn gỗ mục, một luồng ánh sáng u lam mờ nhạt khẽ nhấp nháy.

Lâm Tiếu tò mò tiến lại gần, dùng đoản đao đào lớp đất ẩm gạt sang hai bên. Hiện ra trước mắt hắn là một thanh phế kiếm gỉ sét, lưỡi kiếm sứt mẻ tưởng chừng gãy làm đôi bất cứ lúc nào. 

Thế nhưng, khi ngón tay Lâm Tiếu vừa chạm vào chuôi kiếm mục nát—

*OANH!*

Một luồng sóng xung kích vô hình bùng nổ ngay trong thức hải của hắn. Một giọng nói trầm đục, cổ xưa vang lên cất lời:

"Mấy nghìn năm rồi... Rốt cuộc cũng có một tiểu tử đầu óc có vấn đề dám chạm vào bản đế!"`,
      wordCount: 268,
      isGenerated: true,
      updatedAt: Date.now()
    };

    const demoMilestone: ChapterMilestone = {
      id: 'ms-1',
      chapterId: 'chap-1',
      order: 1,
      title: 'Mốc 1: Rơi xuống vực & Tìm kiếm lối ra',
      goal: 'Sinh tồn dưới đáy cốc',
      events: 'Lâm Tiếu bị đẩy xuống vực, kiểm tra thương thế',
      charactersInvolved: 'Lâm Tiếu',
      actionDialogueNotes: 'Nhắc lại ân oán với đệ tử nội môn',
      emotionalShift: 'Tức giận -> Bình tĩnh quan sát',
      newInfoOutcome: 'Tìm thấy mảnh phế kiếm gỉ sét'
    };

    const demoScene: SceneItem = {
      id: 'sc-1',
      chapterId: 'chap-1',
      order: 1,
      location: 'Đáy Thần Cấm Cốc',
      timeOfDay: 'Đêm',
      characters: 'Lâm Tiếu, Kiếm Linh',
      goal: 'Nhặt kiếm cổ',
      conflict: 'Gió lạnh và yêu sói vây quanh',
      action: 'Lâm Tiếu gạt rêu đào phế kiếm',
      dialogueSummary: 'Lâm Tiếu tự thoại, Kiếm Linh cất tiếng',
      result: 'Ký kết giao ước linh hồn ban đầu'
    };

    await this.put('projects', demoProject);
    await this.put('stories', demoStory);
    await this.put('storyBibles', demoBible);
    await this.put('characters', demoChar1);
    await this.put('characters', demoChar2);
    await this.put('relationships', demoRel);
    await this.put('worldItems', demoWorld);
    await this.put('timelineEvents', demoTimeline);
    await this.put('chapters', demoChapter1);
    await this.put('milestones', demoMilestone);
    await this.put('scenes', demoScene);
  }

  private async seedDemoDataMemory() {
    await this.seedDemoData();
  }
}

export const db = new StudioDatabase();

// Exported Helper Functions
export async function initDatabase(): Promise<void> {
  return db.init();
}

export async function getAllProjects(): Promise<Project[]> {
  return db.getAll<Project>('projects');
}

export async function saveProject(p: Project): Promise<void> {
  return db.put('projects', p);
}

export async function deleteProjectDB(id: string): Promise<void> {
  return db.delete('projects', id);
}

export async function getAllStories(projectId: string): Promise<Story[]> {
  const all = await db.getAll<Story>('stories');
  return all.filter((s) => s.projectId === projectId);
}

export async function saveStory(s: Story): Promise<void> {
  return db.put('stories', s);
}

export async function deleteStoryDB(id: string): Promise<void> {
  return db.delete('stories', id);
}

export async function getStoryBible(storyId: string): Promise<StoryBible | null> {
  const all = await db.getAll<StoryBible>('storyBibles');
  return all.find((b) => b.storyId === storyId) || null;
}

export async function saveStoryBibleDB(b: StoryBible): Promise<void> {
  return db.put('storyBibles', b);
}

export async function getCharactersByStory(storyId: string): Promise<Character[]> {
  const all = await db.getAll<Character>('characters');
  return all.filter((c) => c.storyId === storyId);
}

export async function saveCharacterDB(c: Character): Promise<void> {
  return db.put('characters', c);
}

export async function deleteCharacterDB(id: string): Promise<void> {
  return db.delete('characters', id);
}

export async function getRelationshipsByStory(storyId: string): Promise<CharacterRelationship[]> {
  const all = await db.getAll<CharacterRelationship>('relationships');
  return all.filter((r) => r.storyId === storyId);
}

export async function saveRelationshipDB(r: CharacterRelationship): Promise<void> {
  return db.put('relationships', r);
}

export async function deleteRelationshipDB(id: string): Promise<void> {
  return db.delete('relationships', id);
}

export async function getWorldItemsByStory(storyId: string): Promise<WorldItem[]> {
  const all = await db.getAll<WorldItem>('worldItems');
  return all.filter((w) => w.storyId === storyId);
}

export async function saveWorldItemDB(w: WorldItem): Promise<void> {
  return db.put('worldItems', w);
}

export async function deleteWorldItemDB(id: string): Promise<void> {
  return db.delete('worldItems', id);
}

export async function getChaptersByStory(storyId: string): Promise<Chapter[]> {
  const all = await db.getAll<Chapter>('chapters');
  return all.filter((c) => c.storyId === storyId).sort((a, b) => a.order - b.order);
}

export async function saveChapterDB(c: Chapter): Promise<void> {
  return db.put('chapters', c);
}

export async function deleteChapterDB(id: string): Promise<void> {
  return db.delete('chapters', id);
}

export async function getStyleProfiles(): Promise<StyleProfile[]> {
  return db.getAll<StyleProfile>('styleProfiles');
}

export async function saveStyleProfileDB(p: StyleProfile): Promise<void> {
  return db.put('styleProfiles', p);
}

export async function deleteStyleProfileDB(id: string): Promise<void> {
  return db.delete('styleProfiles', id);
}

export async function getTimelineEventsByStory(storyId: string): Promise<TimelineEvent[]> {
  const all = await db.getAll<TimelineEvent>('timelineEvents');
  return all.filter((t) => t.storyId === storyId);
}

export async function saveTimelineEventDB(t: TimelineEvent): Promise<void> {
  return db.put('timelineEvents', t);
}

export async function deleteTimelineEventDB(id: string): Promise<void> {
  return db.delete('timelineEvents', id);
}

// Settings Helper in LocalStorage
export function getAppSettings(): AppSettings {
  try {
    const saved = localStorage.getItem('AINovelStudio_Settings');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return {
    geminiApiKey: '',
    modelName: 'gemini-2.5-flash',
    theme: 'dark',
    autoSaveIntervalMs: 5000
  };
}

export function saveAppSettings(settings: AppSettings): void {
  try {
    localStorage.setItem('AINovelStudio_Settings', JSON.stringify(settings));
  } catch (e) {}
}
