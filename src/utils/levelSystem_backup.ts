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
        referenceNote: FIXED_REFERENCE_NOTE,
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
        referenceNote: FIXED_REFERENCE_NOTE,
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
        description: "完整的自然大调音阶范围",
        referenceNote: FIXED_REFERENCE_NOTE,
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
        description: "在第一章基础上加入半音",
        referenceNote: FIXED_REFERENCE_NOTE,
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
    baseReferenceNote: FIXED_REFERENCE_NOTE + 9, // A4
    levels: [
      {
        id: "2-1",
        chapter: 2,
        level: 1,
        name: "6的相邻音程",
        description: "以6为中心的相邻音程：6-7, 6-5",
        referenceNote: FIXED_REFERENCE_NOTE + 9,
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
        referenceNote: FIXED_REFERENCE_NOTE + 9,
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
        referenceNote: FIXED_REFERENCE_NOTE + 9,
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
        referenceNote: FIXED_REFERENCE_NOTE + 9,
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
        referenceNote: FIXED_REFERENCE_NOTE + 9,
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
    name: "第三章：连续模式",
    description: "参考音为上一题的目标音，训练连续听音能力",
    baseReferenceNote: 'previous',
    levels: [
      {
        id: "3-1",
        chapter: 3,
        level: 1,
        name: "连续二度",
        description: "连续的二度音程练习",
        referenceNote: 'previous',
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
        referenceNote: 'previous',
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
        name: "连续五度内",
        description: "五度内的连续音程",
        referenceNote: 'previous',
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
        name: "连续八度内",
        description: "八度内的连续音程",
        referenceNote: 'previous',
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
        name: "连续半音挑战",
        description: "连续模式下的半音练习",
        referenceNote: 'previous',
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

// 关卡系统管理类
export class LevelSystem {
  private static readonly STORAGE_KEY = 'earfunker-progress';

  // 获取用户进度
  static getUserProgress(): UserProgress {
    const savedProgress = localStorage.getItem(this.STORAGE_KEY);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    // 默认进度：只解锁第一关
    return {
      completedLevels: [],
      unlockedLevels: ['1-1'],
      levelScores: {},
      currentChapter: 1,
      currentLevel: 1
    };
  }

  // 保存用户进度
  static saveUserProgress(progress: UserProgress): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  // 获取所有章节（带用户进度）
  static getChaptersWithProgress(): Chapter[] {
    const progress = this.getUserProgress();
    return CHAPTERS.map(chapter => ({
      ...chapter,
      levels: chapter.levels.map(level => ({
        ...level,
        unlocked: progress.unlockedLevels.includes(level.id),
        completed: progress.completedLevels.includes(level.id),
        bestScore: progress.levelScores[level.id]
      }))
    }));
  }

  // 获取特定关卡
  static getLevel(levelId: string): Level | null {
    for (const chapter of CHAPTERS) {
      const level = chapter.levels.find(l => l.id === levelId);
      if (level) {
        const progress = this.getUserProgress();
        return {
          ...level,
          unlocked: progress.unlockedLevels.includes(level.id),
          completed: progress.completedLevels.includes(level.id),
          bestScore: progress.levelScores[level.id]
        };
      }
    }
    return null;
  }

  // 完成关卡
  static completeLevel(levelId: string, score: number): boolean {
    const level = this.getLevel(levelId);
    if (!level) return false;

    const progress = this.getUserProgress();
    
    // 检查是否达到通过率
    const passed = score >= level.passRate;
    
    if (passed) {
      // 标记为完成
      if (!progress.completedLevels.includes(levelId)) {
        progress.completedLevels.push(levelId);
      }
      
      // 更新最高分
      progress.levelScores[levelId] = Math.max(progress.levelScores[levelId] || 0, score);
      
      // 解锁下一关
      this.unlockNextLevel(levelId, progress);
      
      this.saveUserProgress(progress);
    }
    
    return passed;
  }

  // 解锁下一关
  private static unlockNextLevel(currentLevelId: string, progress: UserProgress): void {
    const [chapter, level] = currentLevelId.split('-').map(Number);
    
    // 尝试解锁同章节下一关
    const nextLevelId = `${chapter}-${level + 1}`;
    const nextLevel = this.getLevel(nextLevelId);
    
    if (nextLevel && !progress.unlockedLevels.includes(nextLevelId)) {
      progress.unlockedLevels.push(nextLevelId);
      return;
    }
    
    // 如果同章节没有下一关，尝试解锁下一章节第一关
    const nextChapterFirstLevel = `${chapter + 1}-1`;
    const nextChapterLevel = this.getLevel(nextChapterFirstLevel);
    
    if (nextChapterLevel && !progress.unlockedLevels.includes(nextChapterFirstLevel)) {
      progress.unlockedLevels.push(nextChapterFirstLevel);
    }
  }

  // 重置进度（调试用）
  static resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // 获取关卡统计
  static getLevelStats(): { totalLevels: number; completedLevels: number; unlockedLevels: number } {
    const progress = this.getUserProgress();
    const totalLevels = CHAPTERS.reduce((sum, chapter) => sum + chapter.levels.length, 0);
    
    return {
      totalLevels,
      completedLevels: progress.completedLevels.length,
      unlockedLevels: progress.unlockedLevels.length
    };
  }
}

// 开发者模式
let developerMode: DeveloperMode = {
  enabled: false,
  unlockAllLevels: false,
  skipLevelRequirements: false,
  showDebugInfo: false
};

export const DeveloperModeManager = {
  // 获取开发者模式状态
  getMode: (): DeveloperMode => ({ ...developerMode }),
  
  // 切换开发者模式
  toggleDeveloperMode: () => {
    developerMode.enabled = !developerMode.enabled;
    if (!developerMode.enabled) {
      // 关闭开发者模式时重置所有选项
      developerMode.unlockAllLevels = false;
      developerMode.skipLevelRequirements = false;
      developerMode.showDebugInfo = false;
    }
    return developerMode.enabled;
  },
  
  // 解锁所有关卡
  unlockAllLevels: () => {
    if (!developerMode.enabled) return false;
    developerMode.unlockAllLevels = !developerMode.unlockAllLevels;
    
    if (developerMode.unlockAllLevels) {
      // 解锁所有关卡
      CHAPTERS.forEach(chapter => {
        chapter.levels.forEach(level => {
          const progress = LevelSystem.getUserProgress();
          if (!progress.unlockedLevels.includes(level.id)) {
            progress.unlockedLevels.push(level.id);
          }
        });
      });
    } else {
      // 重置为正常解锁状态
      const progress = LevelSystem.getUserProgress();
      progress.unlockedLevels = ['1-1']; // 只保留第一关
      LevelSystem.saveUserProgress(progress);
    }
    
    return developerMode.unlockAllLevels;
  },
  
  // 跳过关卡要求
  toggleSkipRequirements: () => {
    if (!developerMode.enabled) return false;
    developerMode.skipLevelRequirements = !developerMode.skipLevelRequirements;
    return developerMode.skipLevelRequirements;
  },
  
  // 切换调试信息
  toggleDebugInfo: () => {
    if (!developerMode.enabled) return false;
    developerMode.showDebugInfo = !developerMode.showDebugInfo;
    return developerMode.showDebugInfo;
  },
  
  // 直接完成关卡（用于测试）
  completeLevel: (levelId: string, accuracy: number = 1.0) => {
    if (!developerMode.enabled) return false;
    return LevelSystem.completeLevel(levelId, accuracy);
  },
  
  // 重置进度
  resetProgress: () => {
    if (!developerMode.enabled) return false;
    LevelSystem.resetProgress();
    return true;
  }
};

