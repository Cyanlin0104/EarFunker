export interface Interval {
  name: string;
  semitones: number;
  chineseName: string;
}

export interface GameState {
  referenceNote: number;
  targetNote: number;
  selectedNote: number | null;
  isPlaying: boolean;
  hasAnswered: boolean;
  isCorrect: boolean | null;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  currentInterval: Interval | null;
  isSolfegeMode: boolean;
  isChromatic: boolean;
  // 多目标音模式状态
  isMultiTargetMode: boolean;
  targetNotes: number[];
  selectedNotes: number[];
  currentTargetIndex: number;
  multiTargetCompleted: boolean;
}

export interface GameSettings {
  trainingMode: 'solfege' | 'absolute'; // 首调模式 或 绝对音模式
  noteRangeUp: number; // 向上音程范围 (半音数)
  noteRangeDown: number; // 向下音程范围 (半音数)
  isChromatic: boolean; // 是否包含半音
  keySignature: number; // 调性：1(Do)对应的MIDI音高，默认60(C4)
  chapterReferenceMode?: 'fixed-1' | 'fixed-6' | 'sequential'; // 章节参考音模式
  // 多目标音模式配置
  enableMultiTarget: boolean; // 是否启用多目标音模式
  multiTargetCount: number; // 目标音数量 (2-5个)
  maxSequentialInterval?: number; // 连续音程的最大距离（半音数）
  // 自由训练模式参考音设置
  referenceNoteDegree?: number; // 参考音在大调音阶中的度数 (1-7)，undefined 表示使用默认逻辑
}

export type TrainingMode = 'solfege' | 'absolute';

export interface GridNote {
  midiNote: number; // MIDI音符值
  position: number; // 在UI中的位置索引
  semitoneOffset: number; // 相对于参考音的半音偏移
}

export interface AudioSettings {
  waveType: OscillatorType;
  volume: number;
  duration: number;
}

export const INTERVALS: Interval[] = [
  { name: 'Unison', semitones: 0, chineseName: '同度' },
  { name: 'Minor 2nd', semitones: 1, chineseName: '小二度' },
  { name: 'Major 2nd', semitones: 2, chineseName: '大二度' },
  { name: 'Minor 3rd', semitones: 3, chineseName: '小三度' },
  { name: 'Major 3rd', semitones: 4, chineseName: '大三度' },
  { name: 'Perfect 4th', semitones: 5, chineseName: '纯四度' },
  { name: 'Tritone', semitones: 6, chineseName: '三全音' },
  { name: 'Perfect 5th', semitones: 7, chineseName: '纯五度' },
  { name: 'Minor 6th', semitones: 8, chineseName: '小六度' },
  { name: 'Major 6th', semitones: 9, chineseName: '大六度' },
  { name: 'Minor 7th', semitones: 10, chineseName: '小七度' },
  { name: 'Major 7th', semitones: 11, chineseName: '大七度' },
  { name: 'Octave', semitones: 12, chineseName: '八度' }
];

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SOLFEGE_NUMBERS = ['1', '♯1', '2', '♯2', '3', '4', '♯4', '5', '♯5', '6', '♯6', '7'];
export const SOLFEGE_NATURAL = ['1', '2', '3', '4', '5', '6', '7'];

// 固定参考音（C4 = MIDI 60）
export const FIXED_REFERENCE_NOTE = 60;

// 生成从C2到C5的完整音高列表
const generateKeySignatures = () => {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const keySignatures = [];
  
  // 从C2 (MIDI 36) 到C5 (MIDI 72)
  for (let midiNote = 36; midiNote <= 72; midiNote++) {
    const octave = Math.floor(midiNote / 12) - 1; // MIDI音符到八度的转换
    const noteIndex = midiNote % 12;
    const noteName = noteNames[noteIndex];
    const chineseName = `${noteName}${octave}调`;
    
    keySignatures.push({
      name: chineseName,
      note: midiNote,
      suffix: noteName.includes('#') ? '#' : ''
    });
  }
  
  return keySignatures;
};

// 调性定义：从C2到C5的所有半音
export const KEY_SIGNATURES = generateKeySignatures();

// 关卡系统
export interface Level {
  id: string; // 关卡ID，如 "1-1", "1-2"
  chapter: number; // 章节号
  level: number; // 关卡号
  name: string; // 关卡名称
  description: string; // 关卡描述
  noteRangeUp: number; // 向上音程范围
  noteRangeDown: number; // 向下音程范围
  isChromatic: boolean; // 是否包含半音
  questionsCount: number; // 题目数量
  passRate: number; // 通过率要求（0-1）
  unlocked: boolean; // 是否解锁
  completed: boolean; // 是否完成
  bestScore?: number; // 最好成绩
  // 多目标音配置
  enableMultiTarget?: boolean; // 是否启用多目标音模式
  multiTargetCount?: number; // 目标音数量（关卡专用）
}

export interface Chapter {
  id: number;
  name: string;
  description: string;
  referenceMode: 'fixed-1' | 'fixed-6' | 'sequential'; // 参考音模式
  levels: Level[];
}

export interface UserProgress {
  completedLevels: string[]; // 已完成的关卡ID
  unlockedLevels: string[]; // 已解锁的关卡ID
  levelScores: Record<string, number>; // 关卡最高分数
  currentChapter: number; // 当前章节
  currentLevel: number; // 当前关卡
}

// 游戏模式
export type GameMode = 'free' | 'level';

// 关卡训练状态
export interface LevelTrainingState {
  currentLevel: Level;
  questionsAnswered: number;
  correctAnswers: number;
  questions: Array<{
    referenceNote: number;
    targetNote: number;
    userAnswer?: number;
    isCorrect?: boolean;
  }>;
  previousTargetNote?: number; // 用于连续模式
}

export interface DeveloperMode {
  enabled: boolean;
  unlockAllLevels: boolean;
  skipLevelRequirements: boolean;
  showDebugInfo: boolean;
}
