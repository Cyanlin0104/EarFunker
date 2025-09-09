import { Level, Chapter, UserProgress, FIXED_REFERENCE_NOTE, DeveloperMode } from '../types';

// 关卡数据定义
export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    name: "第一章：固定主音(1)",
    description: "以固定的'1'为参考音，逐步扩大音程范围",
    referenceMode: 'fixed-1',
    levels: [
      {
        id: "1-1",
        chapter: 1,
        level: 1,
        name: "相邻音程",
        description: "识别相邻的音程：1-2, 1-7",
        noteRangeUp: 2,
        noteRangeDown: 1,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: true,
        completed: false
      },
      {
        id: "1-2",
        chapter: 1,
        level: 2,
        name: "三度音程",
        description: "扩展到三度：1-3, 1-6",
        noteRangeUp: 4,
        noteRangeDown: 3,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "1-3",
        chapter: 1,
        level: 3,
        name: "四五度音程",
        description: "加入四五度：1-4, 1-5",
        noteRangeUp: 7,
        noteRangeDown: 5,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "1-4",
        chapter: 1,
        level: 4,
        name: "完整音阶",
        description: "以1为中心的完整音阶",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "1-5",
        chapter: 1,
        level: 5,
        name: "半音挑战",
        description: "以1为中心的半音练习",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: true,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 2,
    name: "第二章：固定属音(6)",
    description: "以固定的'6'为参考音，训练不同调性感觉",
    referenceMode: 'fixed-6',
    levels: [
      {
        id: "2-1",
        chapter: 2,
        level: 1,
        name: "6的相邻音程",
        description: "以6为中心的相邻音程：6-7, 6-5",
        noteRangeUp: 2,
        noteRangeDown: 1,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "2-2",
        chapter: 2,
        level: 2,
        name: "6的三度音程",
        description: "扩展到三度：6-1, 6-4",
        noteRangeUp: 4,
        noteRangeDown: 3,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "2-3",
        chapter: 2,
        level: 3,
        name: "6的四五度音程",
        description: "加入四五度：6-2, 6-3",
        noteRangeUp: 7,
        noteRangeDown: 5,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "2-4",
        chapter: 2,
        level: 4,
        name: "6的完整音阶",
        description: "以6为中心的完整音阶",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "2-5",
        chapter: 2,
        level: 5,
        name: "6的半音挑战",
        description: "以6为中心的半音练习",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: true,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      }
    ]
  },
  {
    id: 3,
    name: "第三章：连续音程",
    description: "参考音是上一个目标音，训练连续听音",
    referenceMode: 'sequential',
    levels: [
      {
        id: "3-1",
        chapter: 3,
        level: 1,
        name: "连续二度",
        description: "连续的二度音程练习",
        noteRangeUp: 2,
        noteRangeDown: 2,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "3-2",
        chapter: 3,
        level: 2,
        name: "连续三度",
        description: "连续的三度音程练习",
        noteRangeUp: 4,
        noteRangeDown: 4,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "3-3",
        chapter: 3,
        level: 3,
        name: "连续音阶",
        description: "连续的音阶练习",
        noteRangeUp: 7,
        noteRangeDown: 7,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "3-4",
        chapter: 3,
        level: 4,
        name: "连续跳进",
        description: "连续的大跳音程练习",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: false,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      },
      {
        id: "3-5",
        chapter: 3,
        level: 5,
        name: "连续半音",
        description: "连续的半音练习",
        noteRangeUp: 12,
        noteRangeDown: 12,
        isChromatic: true,
        questionsCount: 20,
        passRate: 0.8,
        unlocked: false,
        completed: false
      }
    ]
  }
];

// 用户进度管理
let userProgress: UserProgress = {
  completedLevels: [],
  unlockedLevels: ['1-1'], // 默认解锁第一关
  levelScores: {},
  bestScores: {}
};

export const LevelSystem = {
  STORAGE_KEY: 'earfunker-user-progress',

  // 获取用户进度
  getUserProgress: (): UserProgress => {
    try {
      const saved = localStorage.getItem(LevelSystem.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        userProgress = { ...userProgress, ...parsed };
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
    return userProgress;
  },

  // 保存用户进度
  saveUserProgress: (progress: UserProgress): void => {
    try {
      localStorage.setItem(LevelSystem.STORAGE_KEY, JSON.stringify(progress));
      userProgress = progress;
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  },

  // 获取所有章节（带进度信息）
  getChaptersWithProgress: (): (Chapter & { 
    levels: (Level & { unlocked: boolean; completed: boolean; bestScore?: number })[] 
  })[] => {
    const progress = LevelSystem.getUserProgress();
    
    return CHAPTERS.map(chapter => ({
      ...chapter,
      levels: chapter.levels.map(level => ({
        ...level,
        unlocked: progress.unlockedLevels.includes(level.id),
        completed: progress.completedLevels.includes(level.id),
        bestScore: progress.bestScores[level.id]
      }))
    }));
  },

  // 获取特定关卡
  getLevel: (levelId: string): Level | null => {
    for (const chapter of CHAPTERS) {
      const level = chapter.levels.find(l => l.id === levelId);
      if (level) return level;
    }
    return null;
  },

  // 获取章节信息
  getChapter: (chapterId: number): Chapter | null => {
    return CHAPTERS.find(c => c.id === chapterId) || null;
  },

  // 完成关卡
  completeLevel: (levelId: string, accuracy: number): boolean => {
    const level = LevelSystem.getLevel(levelId);
    if (!level) return false;

    const progress = LevelSystem.getUserProgress();
    const passed = accuracy >= level.passRate;

    if (passed) {
      // 添加到已完成列表
      if (!progress.completedLevels.includes(levelId)) {
        progress.completedLevels.push(levelId);
      }

      // 更新最佳成绩
      const currentBest = progress.bestScores[levelId] || 0;
      if (accuracy > currentBest) {
        progress.bestScores[levelId] = accuracy;
      }

      // 解锁下一关
      LevelSystem.unlockNextLevel(levelId, progress);
    }

    LevelSystem.saveUserProgress(progress);
    return passed;
  },

  // 解锁下一关
  unlockNextLevel: (currentLevelId: string, progress: UserProgress): void => {
    const [chapter, level] = currentLevelId.split('-').map(Number);
    
    // 尝试解锁同章节下一关
    const nextLevelId = `${chapter}-${level + 1}`;
    const nextLevel = LevelSystem.getLevel(nextLevelId);
    
    if (nextLevel && !progress.unlockedLevels.includes(nextLevelId)) {
      progress.unlockedLevels.push(nextLevelId);
      return;
    }
    
    // 如果同章节没有下一关，尝试解锁下一章节第一关
    const nextChapterFirstLevel = `${chapter + 1}-1`;
    const nextChapterLevel = LevelSystem.getLevel(nextChapterFirstLevel);
    
    if (nextChapterLevel && !progress.unlockedLevels.includes(nextChapterFirstLevel)) {
      progress.unlockedLevels.push(nextChapterFirstLevel);
    }
  },

  // 重置进度（调试用）
  resetProgress: (): void => {
    localStorage.removeItem(LevelSystem.STORAGE_KEY);
  },

  // 获取关卡统计
  getLevelStats: (): { totalLevels: number; completedLevels: number; unlockedLevels: number } => {
    const progress = LevelSystem.getUserProgress();
    const totalLevels = CHAPTERS.reduce((sum, chapter) => sum + chapter.levels.length, 0);
    
    return {
      totalLevels,
      completedLevels: progress.completedLevels.length,
      unlockedLevels: progress.unlockedLevels.length
    };
  }
};

// 开发者模式（保持原有功能）
let developerMode: DeveloperMode = {
  enabled: false,
  unlockAllLevels: false,
  skipLevelRequirements: false,
  showDebugInfo: false
};

export const DeveloperModeManager = {
  getMode: (): DeveloperMode => ({ ...developerMode }),
  
  toggleDeveloperMode: () => {
    developerMode.enabled = !developerMode.enabled;
    if (!developerMode.enabled) {
      developerMode.unlockAllLevels = false;
      developerMode.skipLevelRequirements = false;
      developerMode.showDebugInfo = false;
    }
    return developerMode.enabled;
  },
  
  unlockAllLevels: () => {
    if (!developerMode.enabled) return false;
    developerMode.unlockAllLevels = !developerMode.unlockAllLevels;
    
    if (developerMode.unlockAllLevels) {
      CHAPTERS.forEach(chapter => {
        chapter.levels.forEach(level => {
          const progress = LevelSystem.getUserProgress();
          if (!progress.unlockedLevels.includes(level.id)) {
            progress.unlockedLevels.push(level.id);
          }
        });
      });
    } else {
      const progress = LevelSystem.getUserProgress();
      progress.unlockedLevels = ['1-1'];
      LevelSystem.saveUserProgress(progress);
    }
    
    return developerMode.unlockAllLevels;
  },
  
  toggleSkipRequirements: () => {
    if (!developerMode.enabled) return false;
    developerMode.skipLevelRequirements = !developerMode.skipLevelRequirements;
    return developerMode.skipLevelRequirements;
  },
  
  toggleDebugInfo: () => {
    if (!developerMode.enabled) return false;
    developerMode.showDebugInfo = !developerMode.showDebugInfo;
    return developerMode.showDebugInfo;
  },
  
  completeLevel: (levelId: string, accuracy: number = 1.0) => {
    if (!developerMode.enabled) return false;
    return LevelSystem.completeLevel(levelId, accuracy);
  },
  
  resetProgress: () => {
    if (!developerMode.enabled) return false;
    LevelSystem.resetProgress();
    return true;
  }
};
