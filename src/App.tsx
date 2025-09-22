import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameBoard from './components/GameBoard';
import Settings from './components/Settings';
import MainMenu from './components/MainMenu';
import LevelSelect from './components/LevelSelect';
import DeveloperPanel from './components/DeveloperPanel';
import { GameState, GameSettings, GridNote, GameMode, Level, LevelTrainingState, Interval } from './types';
import { AudioEngine } from './utils/audioUtils';
import { GameLogic } from './utils/gameUtils';
import { LevelSystem, DeveloperModeManager } from './utils/levelSystem';

const App: React.FC = () => {
  const [audioEngine] = useState(() => new AudioEngine());
  const [gameLogic] = useState(() => new GameLogic());
  
  const [gameState, setGameState] = useState<GameState>({
    referenceNote: 60,
    targetNote: 60,
    selectedNote: null,
    isPlaying: false,
    hasAnswered: false,
    isCorrect: null,
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentInterval: null,
    isSolfegeMode: true,  // 默认开启首调模式
    isChromatic: false,    // 默认自然音模式
    // 多目标音模式状态
    isMultiTargetMode: false,
    targetNotes: [],
    selectedNotes: [],
    currentTargetIndex: 0,
    multiTargetCompleted: false
  });

  const [gridNotes, setGridNotes] = useState<GridNote[]>([]);
  const [characterPosition, setCharacterPosition] = useState(0);
  const [characterStartPosition, setCharacterStartPosition] = useState(0);
  const [characterTargetPosition, setCharacterTargetPosition] = useState(0);
  const [isCharacterJumping, setIsCharacterJumping] = useState(false);
  const [isCharacterFalling, setIsCharacterFalling] = useState(false);
  const [showTrajectory, setShowTrajectory] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(gameLogic.getSettings());
  const [gameStarted, setGameStarted] = useState(false);
  
  // 公主角色的独立状态管理（与马里奥保持一致）
  const [princessPosition, setPrincessPosition] = useState(0);
  const [princessStartPosition, setPrincessStartPosition] = useState(0);
  const [princessTargetPosition, setPrincessTargetPosition] = useState(0);
  const [isPrincessJumping, setIsPrincessJumping] = useState(false);
  const [showPrincessDemo, setShowPrincessDemo] = useState(false);
  const [showPrincessTrajectory, setShowPrincessTrajectory] = useState(false);
  
  // 新的应用状态
  const [currentView, setCurrentView] = useState<'menu' | 'level-select' | 'free-training' | 'level-training'>('menu');
  const [levelTrainingState, setLevelTrainingState] = useState<LevelTrainingState | null>(null);
  const [developerMode, setDeveloperMode] = useState(() => DeveloperModeManager.getMode());
  const [showDeveloperPanel, setShowDeveloperPanel] = useState(false);

  // 初始化新题目
  const initializeNewQuestion = useCallback(async () => {
    const referenceNote = gameLogic.generateReferenceNote();
    
    // 根据是否启用多目标音模式生成不同的题目
    let targetNote: number;
    let interval: Interval;
    let targetNotes: number[] = [];
    let intervals: Interval[] = [];
    
    if (settings.enableMultiTarget) {
      // 多目标音模式
      const result = gameLogic.generateMultipleTargetNotes(referenceNote);
      targetNotes = result.targetNotes;
      intervals = result.intervals;
      targetNote = targetNotes[0]; // 第一个目标音作为主目标
      interval = intervals[0]; // 第一个音程作为主音程
    } else {
      // 单目标音模式
      const result = gameLogic.generateTargetNote(referenceNote);
      targetNote = result.targetNote;
      interval = result.interval;
    }
    
    const notes = gameLogic.generateGridNotes(referenceNote);
    
    // 查找参考音在网格中的位置
    const referenceGridNote = notes.find(gn => gn.midiNote === referenceNote);
    
    // 调试信息：确保参考音在网格中
    if (!referenceGridNote) {
      console.error('参考音不在网格中！', {
        referenceNote,
        notes,
        settings: gameLogic.getSettings()
      });
      // 强制将参考音添加到网格中间
      const newGridNote: GridNote = {
        midiNote: referenceNote,
        position: 0, // 临时位置，会在下面重新计算
        semitoneOffset: 0
      };
      notes.push(newGridNote);
      notes.sort((a, b) => a.midiNote - b.midiNote);
      // 重新查找参考音的位置
      const updatedReferenceNote = notes.find(gn => gn.midiNote === referenceNote);
      setCharacterPosition(updatedReferenceNote?.position ?? 0);
    } else {
      setCharacterPosition(referenceGridNote.position);
    }
    
    // 重置跳跃状态
    const currentReferencePosition = referenceGridNote?.position ?? 0;
    setCharacterStartPosition(currentReferencePosition);
    setCharacterTargetPosition(currentReferencePosition);
    setShowTrajectory(false); // 新题目开始时隐藏轨迹
    
    setGameState(prev => ({
      ...prev,
      referenceNote,
      targetNote,
      selectedNote: null,
      hasAnswered: false,
      isCorrect: null,
      currentInterval: interval,
      // 多目标音模式状态
      isMultiTargetMode: settings.enableMultiTarget,
      targetNotes: targetNotes,
      selectedNotes: [], // 重置已选择的音符
      currentTargetIndex: 0, // 重置当前选择索引
      multiTargetCompleted: false // 重置完成状态
    }));
    
    setGridNotes(notes);
    setIsCharacterJumping(false);
    setIsCharacterFalling(false);
    setFeedback('');
    
    // 重置公主演示状态（独立状态管理）
    setShowPrincessDemo(false);
    setPrincessPosition(0);
    setPrincessStartPosition(0);
    setPrincessTargetPosition(0);
    setIsPrincessJumping(false);
    setShowPrincessTrajectory(false);
    
    // 调试信息
    console.log('参考音:', referenceNote, '位置:', currentReferencePosition, '网格:', notes);

    // 自动播放参考音和目标音
    setTimeout(async () => {
      try {
        setGameState(prev => ({ ...prev, isPlaying: true }));
        await audioEngine.playNote(referenceNote, 0.8);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (settings.enableMultiTarget && targetNotes.length > 0) {
          // 多目标音模式：依次播放所有目标音
          for (let i = 0; i < targetNotes.length; i++) {
            await audioEngine.playNote(targetNotes[i], 0.8);
            if (i < targetNotes.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 300)); // 音符间隔
            }
          }
        } else {
          // 单目标音模式
          await audioEngine.playNote(targetNote, 0.8);
        }
        
        setGameState(prev => ({ ...prev, isPlaying: false }));
      } catch (error) {
        console.error('Error playing notes:', error);
        setGameState(prev => ({ ...prev, isPlaying: false }));
      }
    }, 500); // 延迟500ms播放，让界面先更新
  }, [gameLogic, audioEngine, settings]);

  // 组件初始化
  useEffect(() => {
    if (gameStarted && (currentView === 'free-training' || currentView === 'level-training')) {
      initializeNewQuestion();
    }
  }, [initializeNewQuestion, gameStarted, currentView]);

  // 开发者模式快捷键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        if (!developerMode.enabled) {
          DeveloperModeManager.toggleDeveloperMode();
          setDeveloperMode(DeveloperModeManager.getMode());
        }
        setShowDeveloperPanel(!showDeveloperPanel);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeveloperPanel, developerMode.enabled]);



  // 播放音程
  const playInterval = async () => {
    if (gameState.isPlaying) return;
    
    setGameState(prev => ({ ...prev, isPlaying: true }));
    try {
      if (gameState.isMultiTargetMode && gameState.targetNotes.length > 0) {
        // 多目标音模式：播放参考音 + 所有目标音
        await audioEngine.playNote(gameState.referenceNote, 0.8);
        await new Promise(resolve => setTimeout(resolve, 300));
        for (let i = 0; i < gameState.targetNotes.length; i++) {
          await audioEngine.playNote(gameState.targetNotes[i], 0.8);
          if (i < gameState.targetNotes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      } else {
        // 单目标音模式：播放参考音 + 单个目标音
        await audioEngine.playInterval(gameState.referenceNote, gameState.targetNote);
      }
    } catch (error) {
      console.error('Error playing interval:', error);
    } finally {
      setGameState(prev => ({ ...prev, isPlaying: false }));
    }

    // 如果用户已经答题，同时让公主演示正确答案
    if (gameState.hasAnswered || (gameState.isMultiTargetMode && gameState.multiTargetCompleted)) {
      // 延迟500ms后开始公主演示，让音频播放先完成
      setTimeout(() => {
        showPrincessDemoFunction();
      }, 500);
    }
  };

  // 播放和声音程
  const playHarmony = async () => {
    if (gameState.isPlaying) return;
    
    setGameState(prev => ({ ...prev, isPlaying: true }));
    try {
      if (gameState.isMultiTargetMode && gameState.targetNotes.length > 0) {
        // 多目标音模式：依次播放参考音与每个目标音的和声
        for (let i = 0; i < gameState.targetNotes.length; i++) {
          await audioEngine.playHarmony(gameState.referenceNote, gameState.targetNotes[i]);
          if (i < gameState.targetNotes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 400)); // 和声间隔稍长
          }
        }
      } else {
        // 单目标音模式：播放参考音与单个目标音的和声
        await audioEngine.playHarmony(gameState.referenceNote, gameState.targetNote);
      }
    } catch (error) {
      console.error('Error playing harmony:', error);
    } finally {
      setGameState(prev => ({ ...prev, isPlaying: false }));
    }

    // 如果用户已经答题，同时让公主演示正确答案
    if (gameState.hasAnswered || (gameState.isMultiTargetMode && gameState.multiTargetCompleted)) {
      // 延迟500ms后开始公主演示，让音频播放先完成
      setTimeout(() => {
        showPrincessDemoFunction();
      }, 500);
    }
  };

  // 公主演示正确答案
  const showPrincessDemoFunction = async () => {
    // 在函数开始统一声明，避免重复声明错误
    const referenceGridNote = gridNotes.find(gn => gn.midiNote === gameState.referenceNote);
    const referencePosition = referenceGridNote?.position ?? 0;

    if (gameState.isMultiTargetMode) {
      // 多目标音模式：演示所有正确的目标音

      // 设置初始公主状态（使用独立状态管理）
      setShowPrincessDemo(true);
      setPrincessPosition(referencePosition);
      setPrincessStartPosition(referencePosition);
      setIsPrincessJumping(false);
      setShowPrincessTrajectory(false);

      try {
        // 重新播放参考音和所有目标音
        setGameState(prev => ({ ...prev, isPlaying: true }));
        await audioEngine.playNote(gameState.referenceNote, 0.8);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 依次演示每个目标音
        let currentPosition = referencePosition; // 跟踪公主当前位置
        
        for (let i = 0; i < gameState.targetNotes.length; i++) {
          const targetNote = gameState.targetNotes[i];
          const targetGridNote = gridNotes.find(gn => gn.midiNote === targetNote);
          if (!targetGridNote) continue;

          // 公主准备跳到当前目标音位置（先站立）
          setPrincessStartPosition(currentPosition);
          setPrincessTargetPosition(targetGridNote.position);
          setIsPrincessJumping(false); // 先站立，让用户看到目标位置
          setShowPrincessTrajectory(false);

          // 等待300ms让用户看到公主准备
          await new Promise(resolve => setTimeout(resolve, 0));

          // 计算跳跃动画时长
          const jumpDistance = Math.abs(targetGridNote.position - currentPosition);
          const jumpDuration = 0.4 + (jumpDistance * 0.03);

          // 开始跳跃到目标位置（使用独立状态管理）
          setIsPrincessJumping(true);
          setShowPrincessTrajectory(true);

          // 播放当前目标音
          await audioEngine.playNote(targetNote, 0.8);
          
          // 等待跳跃动画完成
          await new Promise(resolve => setTimeout(resolve, jumpDuration * 1000));
          
          // 停止跳跃，更新位置
          setIsPrincessJumping(false);
          setShowPrincessTrajectory(false);
          setPrincessPosition(targetGridNote.position);

          // 更新当前位置追踪
          currentPosition = targetGridNote.position;

          if (i < gameState.targetNotes.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }
      } catch (error) {
        console.error('Error replaying audio:', error);
      } finally {
        setGameState(prev => ({ ...prev, isPlaying: false }));
      }

      // 2秒后隐藏公主演示
      setTimeout(() => {
        setShowPrincessDemo(false);
        setPrincessPosition(0);
        setPrincessStartPosition(0);
        setPrincessTargetPosition(0);
      }, 2000);
    } else {
      // 单目标音模式：原有逻辑

    // setCharacterStartPosition(characterPosition); // 当前位置作为起始位置
      const targetGridNote = gridNotes.find(gn => gn.midiNote === gameState.targetNote);
      if (!targetGridNote) return;

      // 设置单目标音模式的公主状态（使用独立状态管理）

      setShowPrincessDemo(true);
      setPrincessPosition(referencePosition);
      setPrincessStartPosition(referencePosition);
      setPrincessTargetPosition(referencePosition);
      setIsPrincessJumping(false); // 先让公主站立出现
      setShowPrincessTrajectory(false);

      try {
        setGameState(prev => ({ ...prev, isPlaying: true }));
        await audioEngine.playNote(gameState.referenceNote, 0.8);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 在播放目标音的同时开始跳跃动画
        setShowPrincessDemo(true);
        setPrincessStartPosition(referencePosition);
        setPrincessTargetPosition(targetGridNote.position);
        setIsPrincessJumping(true);
        setShowPrincessTrajectory(true);
        
        await audioEngine.playNote(gameState.targetNote, 0.8);
      } catch (error) {
        console.error('Error replaying audio:', error);
      } finally {
        setGameState(prev => ({ ...prev, isPlaying: false }));
      }

      // 等待跳跃动画完成（动态计算时长）
      const distance = Math.abs(targetGridNote.position - referencePosition);
      const jumpDuration = 0.4 + (distance * 0.03);
      const jumpDelayMs = jumpDuration * 1000;
      
      // 跳跃动画完成后停止跳跃并更新位置
      setTimeout(() => {
        // setIsPrincessJumping(false);
        // setShowPrincessTrajectory(false);
        // setPrincessPosition(targetGridNote.position);
      }, jumpDelayMs);

      // 2.5秒后隐藏公主演示
      // setTimeout(() => {
      //   setShowPrincessDemo(false);
      //   setPrincessPosition(0);
      //   setPrincessStartPosition(0);
      //   setPrincessTargetPosition(0);
      // }, 2500);
    }
  };

  // 处理格子点击
  const handleCellClick = (note: number, position: number) => {
    // 禁用条件：正在播放音频 OR 单目标音模式已回答 OR 多目标音模式已完成
    if (gameState.isPlaying || 
        (gameState.hasAnswered && !gameState.isMultiTargetMode) ||
        (gameState.isMultiTargetMode && gameState.multiTargetCompleted)) {
      return;
    }

    let isCorrect: boolean;
    let newSelectedNotes: number[];
    let isSequenceComplete = false;

    if (gameState.isMultiTargetMode) {
      // 多目标音模式逻辑
      newSelectedNotes = [...gameState.selectedNotes, note];
      isCorrect = gameLogic.checkMultiTargetAnswer(
        gameState.targetNotes,
        newSelectedNotes,
        gameState.currentTargetIndex
      );
      
      if (!isCorrect) {
        // 任何一个选择错误都失败
        isSequenceComplete = true;
      } else if (newSelectedNotes.length === gameState.targetNotes.length) {
        // 所有目标音都选择正确，完成序列
        isSequenceComplete = true;
      }
    } else {
      // 单目标音模式逻辑
      newSelectedNotes = [note];
      isCorrect = gameLogic.checkAnswer(
        gameState.referenceNote, 
        gameState.targetNote, 
        note
      );
      isSequenceComplete = true;
    }

    // 设置角色跳跃动画和轨迹
    setCharacterStartPosition(characterPosition); // 当前位置作为起始位置
    setCharacterTargetPosition(position); // 目标位置
    setIsCharacterJumping(true);
    setShowTrajectory(false); // 显示轨迹
    
    // 立即更新角色位置
    setCharacterPosition(position);

    // 根据音程距离计算动画时长（与Character组件保持一致）
    const distance = Math.abs(position - characterPosition);
    const baseDuration = 0.4; // 基础时长
    const distanceFactor = 0.02; // 每个格子增加0.05秒
    const jumpDuration = baseDuration + (distance * distanceFactor);
    const delayMs = jumpDuration * 1000; // 转换为毫秒

    // 延迟处理结果（使用计算出的动画时长）
    setTimeout(() => {
      setIsCharacterJumping(false);
      setShowTrajectory(false); // 与跳跃动画同时停止轨迹
      
      if (gameState.isMultiTargetMode) {
        // 多目标音模式处理
        setGameState(prev => ({
          ...prev,
          selectedNotes: newSelectedNotes,
          currentTargetIndex: prev.currentTargetIndex + 1
        }));

        if (isCorrect && !isSequenceComplete) {
          // 当前音符正确，但序列未完成
          setFeedback(`✅ 第${gameState.currentTargetIndex + 1}个音符正确！继续选择下一个`);
        } else if (isCorrect && isSequenceComplete) {
          // 所有音符都正确，完成序列
          const newConsecutive = consecutiveCorrect + 1;
          const points = gameLogic.calculateScore(true, newConsecutive);
          
          setGameState(prev => ({
            ...prev,
            hasAnswered: true,
            isCorrect: true,
            multiTargetCompleted: true,
            score: prev.score + points,
            totalQuestions: prev.totalQuestions + 1,
            correctAnswers: prev.correctAnswers + 1
          }));
          
          setConsecutiveCorrect(newConsecutive);
          setFeedback(`🎉 完美！所有${gameState.targetNotes.length}个音符都正确！`);
        } else {
          // 选择错误，失败
          setIsCharacterFalling(true);
          
          setGameState(prev => ({
            ...prev,
            hasAnswered: true,
            isCorrect: false,
            multiTargetCompleted: true, // 错误时也要标记完成，允许进入下一题
            totalQuestions: prev.totalQuestions + 1
          }));
          
          setConsecutiveCorrect(0);
          setFeedback(`❌ 第${gameState.currentTargetIndex + 1}个音符错误！正确答案将由公主演示`);
          
          // 延迟1秒后开始公主演示
          setTimeout(() => {
            showPrincessDemoFunction();
          }, 1000);
        }
      } else {
        // 单目标音模式处理（原有逻辑）
        if (isCorrect) {
          // 正确答案
          const newConsecutive = consecutiveCorrect + 1;
          const points = gameLogic.calculateScore(true, newConsecutive);
          
          setGameState(prev => ({
            ...prev,
            selectedNote: note,
            hasAnswered: true,
            isCorrect: true,
            score: prev.score + points,
            totalQuestions: prev.totalQuestions + 1,
            correctAnswers: prev.correctAnswers + 1
          }));
          
          setConsecutiveCorrect(newConsecutive);
          
          const accuracy = (gameState.correctAnswers + 1) / (gameState.totalQuestions + 1);
          setFeedback(gameLogic.getFeedback(true, accuracy));
        } else {
          // 错误答案
          setIsCharacterFalling(true);
          
          setGameState(prev => ({
            ...prev,
            selectedNote: note,
            hasAnswered: true,
            isCorrect: false,
            totalQuestions: prev.totalQuestions + 1
          }));
          
          setConsecutiveCorrect(0);
          
          const accuracy = gameState.correctAnswers / (gameState.totalQuestions + 1);
          setFeedback(gameLogic.getFeedback(false, accuracy));
          
          // 延迟1秒后开始公主演示
          setTimeout(() => {
            showPrincessDemoFunction();
          }, 0);
        }
      }
      
      // 关卡模式的进度追踪
      if (currentView === 'level-training' && levelTrainingState) {
        const updatedState = {
          ...levelTrainingState,
          questionsAnswered: levelTrainingState.questionsAnswered + 1,
          correctAnswers: levelTrainingState.correctAnswers + (isCorrect ? 1 : 0),
          questions: [
            ...levelTrainingState.questions,
            {
              referenceNote: gameState.referenceNote,
              targetNote: gameState.targetNote,
              userAnswer: note,
              isCorrect
            }
          ]
        };
        setLevelTrainingState(updatedState);
        
        // 检查是否完成关卡
        if (updatedState.questionsAnswered >= updatedState.currentLevel.questionsCount) {
          const finalAccuracy = updatedState.correctAnswers / updatedState.questionsAnswered;
          const requirementsMet = finalAccuracy >= updatedState.currentLevel.passRate;
          const passed = requirementsMet || developerMode.skipLevelRequirements;
          
          if (passed) {
            LevelSystem.completeLevel(updatedState.currentLevel.id, finalAccuracy);
            setTimeout(() => {
              const devModeText = developerMode.skipLevelRequirements ? '\n(开发者模式：跳过了通关要求)' : '';
              alert(`🎉 恭喜通过关卡 ${updatedState.currentLevel.id}！\n准确率: ${(finalAccuracy * 100).toFixed(1)}%\n\n下一关已解锁！${devModeText}`);
              setCurrentView('level-select');
              setGameStarted(false);
              setLevelTrainingState(null);
            }, 1000);
          } else {
            setTimeout(() => {
              alert(`😔 关卡未通过。需要达到 ${(updatedState.currentLevel.passRate * 100).toFixed(0)}% 的准确率。\n你的准确率: ${(finalAccuracy * 100).toFixed(1)}%\n\n请重新挑战！`);
              setCurrentView('level-select');
              setGameStarted(false);
              setLevelTrainingState(null);
            }, 1000);
          }
        }
      }
    }, delayMs); // 使用动态计算的动画时长
  };

  // 下一题
  const nextQuestion = () => {
    initializeNewQuestion();
  };



  // 处理设置变更
  const handleSettingsChange = (newSettings: GameSettings) => {
    setSettings(newSettings);
    gameLogic.updateSettings(newSettings);
    
    // 更新游戏状态
    setGameState(prev => ({
      ...prev,
      isSolfegeMode: newSettings.trainingMode === 'solfege',
      isChromatic: newSettings.isChromatic
    }));
  };

  // 关闭设置界面
  const handleSettingsClose = () => {
    setShowSettings(false);
    // 注意：设置变更会通过settings依赖自动触发initializeNewQuestion，无需手动调用
  };

  // 处理模式选择
  const handleModeSelect = (mode: GameMode) => {
    if (mode === 'free') {
      setCurrentView('free-training');
      setGameStarted(true);
    } else {
      setCurrentView('level-select');
    }
  };

  // 处理关卡选择
  const handleLevelSelect = (level: Level) => {
    // 获取章节信息
    const chapter = LevelSystem.getChapter(level.chapter);
    if (!chapter) return;
    
    // 初始化关卡训练状态
    const initialState: LevelTrainingState = {
      currentLevel: level,
      questionsAnswered: 0,
      correctAnswers: 0,
      questions: [],
      previousTargetNote: undefined
    };
    setLevelTrainingState(initialState);
    
    // 根据关卡和章节配置游戏逻辑
    const levelSettings: GameSettings = {
      trainingMode: 'solfege', // 关卡模式都使用首调
      noteRangeUp: level.noteRangeUp,
      noteRangeDown: level.noteRangeDown,
      isChromatic: level.isChromatic,
      keySignature: settings.keySignature, // 使用用户设置的调性
      chapterReferenceMode: chapter.referenceMode, // 使用章节的参考音模式
      // 多目标音配置
      enableMultiTarget: level.enableMultiTarget || false,
      multiTargetCount: level.multiTargetCount || 3,
      maxSequentialInterval: settings.maxSequentialInterval, // 使用用户设置的最大连续音程
      referenceNoteDegree: undefined // 关卡模式不使用自定义参考音
    };
    setSettings(levelSettings);
    gameLogic.updateSettings(levelSettings);
    
    setCurrentView('level-training');
    setGameStarted(true);
  };

  // 返回主菜单
  const handleBackToMenu = () => {
    setCurrentView('menu');
    setGameStarted(false);
    setLevelTrainingState(null);
  };

  // 返回关卡选择
  const handleBackToLevelSelect = () => {
    setCurrentView('level-select');
    setGameStarted(false);
    setLevelTrainingState(null);
  };

  // 计算准确率
  const accuracy = gameState.totalQuestions > 0 
    ? (gameState.correctAnswers / gameState.totalQuestions * 100).toFixed(1)
    : '0.0';

  return (
    <AnimatePresence mode="wait">
      {currentView === 'menu' && (
        <MainMenu onModeSelect={handleModeSelect} />
      )}
      
      {currentView === 'level-select' && (
        <LevelSelect 
          onLevelSelect={handleLevelSelect} 
          onBack={handleBackToMenu}
        />
      )}
      
      {(currentView === 'free-training' || currentView === 'level-training') && (
        <div className="container">
          {/* 导航栏 */}
          <motion.div 
            className="navigation-bar"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button 
              className="nav-button back-button" 
              onClick={currentView === 'level-training' ? handleBackToLevelSelect : handleBackToMenu}
            >
              ← {currentView === 'level-training' ? '返回关卡选择' : '返回主菜单'}
            </button>
            
            {levelTrainingState && (
              <div className="level-progress">
                <span className="level-name">{levelTrainingState.currentLevel.name}</span>
                <span className="progress-text">
                  {levelTrainingState.questionsAnswered}/{levelTrainingState.currentLevel.questionsCount}
                </span>
              </div>
            )}
            
            <button 
              className="nav-button settings-button" 
              onClick={() => setShowSettings(true)}
            >
              ⚙️ 设置
            </button>
            
            {developerMode.enabled && (
              <button 
                className="nav-button dev-button" 
                onClick={() => setShowDeveloperPanel(true)}
              >
                🛠️ 开发者
              </button>
            )}
          </motion.div>

          <motion.h1 
            className="game-title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            🎵 EarFunker 🎵
          </motion.h1>
      
      {/* 分数和统计信息 */}
      <motion.div 
        className="score-info"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="score-item">
          <div className="score-label">得分</div>
          <div className="score-value">{gameState.score}</div>
        </div>
        <div className="score-item">
          <div className="score-label">准确率</div>
          <div className="score-value">{accuracy}%</div>
        </div>
        <div className="score-item">
          <div className="score-label">连对</div>
          <div className="score-value">{consecutiveCorrect}</div>
        </div>
        <div className="score-item">
          <div className="score-label">题目</div>
          <div className="score-value">{gameState.correctAnswers}/{gameState.totalQuestions}</div>
        </div>
      </motion.div>

      {/* 多目标音进度显示 */}
      <AnimatePresence>
        {gameState.isMultiTargetMode && (
          <motion.div 
            className="multi-target-progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              textAlign: 'center',
              margin: '20px 0',
              padding: '15px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              🎵 连续音程训练：选择第 {gameState.currentTargetIndex + 1} 个音符 ({gameState.selectedNotes.length}/{gameState.targetNotes.length})
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #48bb78, #38a169)',
                  borderRadius: '3px',
                  width: `${(gameState.selectedNotes.length / gameState.targetNotes.length) * 100}%`
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(gameState.selectedNotes.length / gameState.targetNotes.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* 游戏板 */}
      <GameBoard
        gridNotes={gridNotes}
        referenceNote={gameState.referenceNote}
        selectedNote={gameState.selectedNote}
        isCorrect={gameState.isCorrect}
        onCellClick={handleCellClick}
        disabled={gameState.isPlaying || 
          (gameState.hasAnswered && !gameState.isMultiTargetMode) ||
          (gameState.isMultiTargetMode && gameState.multiTargetCompleted)}
        audioEngine={audioEngine}
        characterPosition={characterPosition}
        isCharacterJumping={isCharacterJumping}
        isCharacterFalling={isCharacterFalling}
        isSolfegeMode={settings.trainingMode === 'solfege'}
        isChromatic={settings.isChromatic}
        characterStartPosition={characterStartPosition}
        characterTargetPosition={characterTargetPosition}
        showTrajectory={showTrajectory}
        keySignature={settings.keySignature}
        // 公主角色相关（使用独立状态管理）
        showPrincessDemo={showPrincessDemo}
        princessPosition={princessPosition}
        princessStartPosition={princessStartPosition}
        princessTargetPosition={princessTargetPosition}
        isPrincessJumping={isPrincessJumping}
        showPrincessTrajectory={showPrincessTrajectory}
      />

      {/* 反馈信息 */}
      <AnimatePresence>
        {feedback && (
          <motion.div 
            className="interval-info"
            style={{
              background: gameState.isCorrect 
                ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              color: 'white'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 公主演示提示 */}
      <AnimatePresence>
        {showPrincessDemo && (
          <motion.div 
            className="interval-info"
            style={{
              background: 'linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%)',
              color: 'white',
              fontSize: '0.9rem'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            👸 公主演示正确答案！请仔细观察位置和音程关系
          </motion.div>
        )}
      </AnimatePresence>



      {/* 控制按钮 */}
      <motion.div 
        className="controls"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >

        <button
          className="btn btn-secondary"
          onClick={playInterval}
          disabled={gameState.isPlaying}
        >
          {gameState.hasAnswered || (gameState.isMultiTargetMode && gameState.multiTargetCompleted) 
            ? (gameState.isMultiTargetMode ? '🎼👸 重播序列+演示' : '🎼👸 重播+演示') 
            : (gameState.isMultiTargetMode ? '🎼 重播序列' : '🎼 播放音程')
          }
        </button>
        
        <button
          className="btn btn-secondary"
          onClick={playHarmony}
          disabled={gameState.isPlaying}
        >
          {gameState.hasAnswered || (gameState.isMultiTargetMode && gameState.multiTargetCompleted)
            ? (gameState.isMultiTargetMode ? '🎵👸 和声序列+演示' : '🎵👸 和声+演示') 
            : (gameState.isMultiTargetMode ? '🎵🎵 和声序列' : '🎵🎵 和声音程')
          }
        </button>
        
        {((gameState.hasAnswered && !gameState.isMultiTargetMode) || 
          (gameState.isMultiTargetMode && gameState.multiTargetCompleted)) && (
          <motion.button
            className="btn btn-primary"
            onClick={nextQuestion}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            ▶️ 下一题
          </motion.button>
        )}
      </motion.div>

      {/* 说明文字 */}
      <motion.div 
        style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#718096',
          fontSize: '0.9rem'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {gameState.isMultiTargetMode 
          ? '🎯 听完所有音符后按顺序点击格子 | 🎵 黄色格子是参考音 | 🏃‍♂️ 小人会跳到你选择的位置'
          : '🎯 听音后点击格子选择目标音位置 | 🎵 黄色格子是参考音 | 🏃‍♂️ 小人会跳到你选择的位置'
        }
      </motion.div>

      {/* 设置界面 */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onClose={handleSettingsClose}
          />
        )}
      </AnimatePresence>
        </div>
      )}
      
      {/* 开发者面板 */}
      <DeveloperPanel
        developerMode={developerMode}
        onModeChange={setDeveloperMode}
        isVisible={showDeveloperPanel}
        onClose={() => setShowDeveloperPanel(false)}
      />
    </AnimatePresence>
  );
};

export default App;

