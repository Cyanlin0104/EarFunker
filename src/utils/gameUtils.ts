import { Interval, INTERVALS, FIXED_REFERENCE_NOTE, GameSettings, GridNote, KEY_SIGNATURES } from '../types';

export class GameLogic {
  private settings: GameSettings = {
    trainingMode: 'solfege',
    noteRangeUp: 12,
    noteRangeDown: 12,
    isChromatic: false,
    keySignature: FIXED_REFERENCE_NOTE, // 默认C调
    chapterReferenceMode: 'fixed-1',
    // 多目标音模式默认配置
    enableMultiTarget: false,
    multiTargetCount: 3
  };

  // 更新设置
  updateSettings(newSettings: GameSettings) {
    this.settings = { ...newSettings };
  }

  // 获取当前设置
  getSettings(): GameSettings {
    return { ...this.settings };
  }

  // 获取参考音
  generateReferenceNote(): number {
    if (this.settings.trainingMode === 'solfege') {
      // 首调模式：根据章节参考音模式计算
      const keySignature = this.settings.keySignature; // 用户设置的1(Do)
      
      switch (this.settings.chapterReferenceMode) {
        case 'fixed-1':
          // 第一章：参考音是1(Do)
          return keySignature;
        case 'fixed-6':
          // 第二章：参考音是6(La)，即1的大六度(+9个半音)
          return keySignature + 9;
        case 'sequential':
          // 第三章：参考音是上一个目标音（暂时返回1，具体逻辑后面实现）
          return keySignature;
        default:
          return keySignature;
      }
    } else {
      // 绝对音模式：可以使用不同的参考音
      return 60 + Math.floor(Math.random() * 24); // C4-C6
    }
  }

  // 生成多个连续目标音
  generateMultipleTargetNotes(referenceNote: number): { targetNotes: number[]; intervals: Interval[] } {
    const count = this.settings.multiTargetCount;
    const targetNotes: number[] = [];
    const intervals: Interval[] = [];
    
    // 确保生成不重复的目标音
    const usedNotes = new Set<number>([referenceNote]);
    
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let targetNote: number;
      let interval: Interval;
      
      // 尝试生成不重复的目标音，最多尝试50次
      do {
        const result = this.generateTargetNote(referenceNote);
        targetNote = result.targetNote;
        interval = result.interval;
        attempts++;
      } while (usedNotes.has(targetNote) && attempts < 50);
      
      // 如果50次尝试后仍然重复，允许重复以避免死循环
      targetNotes.push(targetNote);
      intervals.push(interval);
      usedNotes.add(targetNote);
    }
    
    return { targetNotes, intervals };
  }

  // 根据参考音生成目标音，确保在设置范围内
  generateTargetNote(referenceNote: number): { targetNote: number; interval: Interval } {
    const upRange = this.settings.noteRangeUp;
    const downRange = this.settings.noteRangeDown;
    const isChromatic = this.settings.isChromatic;
    const keySignature = this.settings.keySignature; // 用户设置的调性(1的音高)
    
    // 定义可用的目标音符
    let availableTargets: { note: number; direction: 'up' | 'down'; semitones: number }[] = [];
    
    if (isChromatic) {
      // 半音模式：基于用户调性的12个半音，在多个八度中选择
      for (let octave = -1; octave <= 1; octave++) {
        for (let i = 0; i < 12; i++) {
          const note = keySignature + i + (octave * 12);
          if (note >= 36 && note <= 96 && note !== referenceNote) {
            const semitoneDistance = Math.abs(note - referenceNote);
            const direction = note > referenceNote ? 'up' : 'down';
            const maxRange = direction === 'up' ? upRange : downRange;
            
            if (semitoneDistance <= maxRange) {
              availableTargets.push({ 
                note, 
                direction, 
                semitones: semitoneDistance 
              });
            }
          }
        }
      }
    } else {
      // 自然音模式：基于用户调性的大调音阶
      // 大调音阶半音偏移：1(0) 2(2) 3(4) 4(5) 5(7) 6(9) 7(11)
      const majorScaleOffsets = [0, 2, 4, 5, 7, 9, 11];
      
      // 生成扩展的音阶音符（多个八度）
      const scaleNotes: number[] = [];
      
      for (let octave = -2; octave <= 2; octave++) {
        for (const offset of majorScaleOffsets) {
          const note = keySignature + offset + (octave * 12);
          if (note >= 36 && note <= 96) {
            scaleNotes.push(note);
          }
        }
      }
      
      // 按音高排序
      scaleNotes.sort((a, b) => a - b);
      
      // 找到在范围内的目标音
      for (const note of scaleNotes) {
        if (note === referenceNote) continue; // 跳过参考音本身
        
        const semitoneDistance = Math.abs(note - referenceNote);
        const direction = note > referenceNote ? 'up' : 'down';
        const maxRange = direction === 'up' ? upRange : downRange;
        
        if (semitoneDistance <= maxRange) {
          availableTargets.push({ 
            note, 
            direction, 
            semitones: semitoneDistance 
          });
        }
      }
    }
    
    if (availableTargets.length === 0) {
      // 如果没有可用目标，返回参考音上方的大二度
      const fallbackNote = referenceNote + 2;
      availableTargets.push({ note: fallbackNote, direction: 'up', semitones: 2 });
    }
    
    // 随机选择一个目标音
    const selectedTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
    
    // 找到对应的音程
    const interval = INTERVALS.find(int => int.semitones === selectedTarget.semitones) || 
                    INTERVALS.find(int => int.semitones === 2)!; // 后备大二度
    
    return { targetNote: selectedTarget.note, interval };
  }

  // 计算两个音符之间的音程
  calculateInterval(note1: number, note2: number): Interval | null {
    const semitones = Math.abs(note2 - note1);
    return INTERVALS.find(interval => interval.semitones === semitones) || null;
  }

  // 检查答案是否正确
  checkAnswer(_referenceNote: number, targetNote: number, selectedNote: number): boolean {
    // 检查音符和方向是否都正确
    return selectedNote === targetNote;
  }

  // 检查多目标音答案是否正确（顺序选择验证）
  checkMultiTargetAnswer(targetNotes: number[], selectedNotes: number[], currentIndex: number): boolean {
    if (currentIndex >= targetNotes.length || currentIndex >= selectedNotes.length) {
      return false;
    }
    
    // 检查当前索引的音符是否正确
    return selectedNotes[currentIndex] === targetNotes[currentIndex];
  }

  // 生成格子网格的音符序列（按半音距离排布）
  generateGridNotes(referenceNote: number): GridNote[] {
    const gridNotes: GridNote[] = [];
    const upRange = this.settings.noteRangeUp;
    const downRange = this.settings.noteRangeDown;
    const isChromatic = this.settings.isChromatic;
    const keySignature = this.settings.keySignature; // 用户设置的调性(1的音高)
    
    if (isChromatic) {
      // 半音模式：基于参考音，在用户调性的半音中选择范围内的音符
      let position = 0;
      for (let offset = -downRange; offset <= upRange; offset++) {
        const note = referenceNote + offset;
        if (note >= 36 && note <= 96) {
          gridNotes.push({
            midiNote: note,
            position: position,
            semitoneOffset: offset
          });
          position++;
        }
      }
    } else {
      // 自然音模式：基于用户调性的大调音阶，在参考音周围的范围内选择
      const majorScaleOffsets = [0, 2, 4, 5, 7, 9, 11]; // 大调音阶半音偏移
      
      // 生成多个八度的自然音阶音符
      const allScaleNotes: { note: number; offsetFromRef: number }[] = [];
      
      for (let octave = -2; octave <= 2; octave++) {
        for (const scaleOffset of majorScaleOffsets) {
          const note = keySignature + scaleOffset + (octave * 12);
          if (note >= 36 && note <= 96) {
            const offsetFromRef = note - referenceNote;
            allScaleNotes.push({ note, offsetFromRef });
          }
        }
      }
      
      // 过滤在范围内的音符
      const filteredNotes = allScaleNotes.filter(item => {
        const absOffset = Math.abs(item.offsetFromRef);
        if (item.offsetFromRef > 0) {
          return absOffset <= upRange;
        } else if (item.offsetFromRef < 0) {
          return absOffset <= downRange;
        }
        return true; // 参考音本身
      });
      
      // 按音高排序
      filteredNotes.sort((a, b) => a.note - b.note);
      
      // 计算视觉位置（按半音距离）
      const minNote = Math.min(...filteredNotes.map(n => n.note));
      
      filteredNotes.forEach((item) => {
        const visualPosition = item.note - minNote;
        gridNotes.push({
          midiNote: item.note,
          position: visualPosition,
          semitoneOffset: item.offsetFromRef
        });
      });
    }
    
    // 确保参考音在网格中
    if (!gridNotes.find(note => note.midiNote === referenceNote)) {
      // 计算参考音的位置
      const minNote = Math.min(...gridNotes.map(n => n.midiNote));
      const referencePosition = referenceNote - minNote;
      const referenceOffsetFromKey = referenceNote - keySignature;
      
      gridNotes.push({
        midiNote: referenceNote,
        position: referencePosition,
        semitoneOffset: referenceOffsetFromKey
      });
      
      // 重新排序
      gridNotes.sort((a, b) => a.midiNote - b.midiNote);
    }
    
    return gridNotes;
  }

  // 获取音程的中文描述
  getIntervalDescription(interval: Interval): string {
    return `${interval.chineseName} (${interval.name})`;
  }

  // 计算得分
  calculateScore(isCorrect: boolean, consecutiveCorrect: number = 0): number {
    if (!isCorrect) return 0;
    
    const baseScore = 10;
    const bonusMultiplier = Math.floor(consecutiveCorrect / 3) * 0.5; // 每连续答对3题增加50%奖励
    
    return Math.round(baseScore * (1 + bonusMultiplier));
  }

  // 获取鼓励性反馈
  getFeedback(isCorrect: boolean, accuracy: number): string {
    if (isCorrect) {
      if (accuracy >= 0.9) return "完美！你的听音能力真棒！🎵";
      if (accuracy >= 0.7) return "很好！继续保持！👏";
      if (accuracy >= 0.5) return "不错！越来越好了！💪";
      return "答对了！加油！🎯";
    } else {
      if (accuracy >= 0.7) return "没关系，继续努力！你做得很好！";
      if (accuracy >= 0.5) return "别气馁，多练习就会进步的！";
      return "没关系，听音需要时间练习，加油！";
    }
  }
}
