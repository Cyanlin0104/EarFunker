import { AudioSettings, NOTE_NAMES, SOLFEGE_NUMBERS, SOLFEGE_NATURAL, FIXED_REFERENCE_NOTE } from '../types';

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private settings: AudioSettings = {
    waveType: 'sine',
    volume: 0.3,
    duration: 1.0
  };

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudioContext();
    }
    
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // 根据MIDI音符号生成频率
  private midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // 获取音符名称
  public getNoteName(midiNote: number): string {
    const noteIndex = midiNote % 12;
    const octave = Math.floor(midiNote / 12) - 1;
    return `${NOTE_NAMES[noteIndex]}${octave}`;
  }

  // 获取首调模式音符名称（基于用户调性）
  public getSolfegeNoteName(midiNote: number, isChromatic: boolean = false, keySignature: number = FIXED_REFERENCE_NOTE): { note: string; highDots: string; lowDots: string } {
    const interval = midiNote - keySignature; // 基于用户设置的调性(1的位置)
    const semitones = ((interval % 12) + 12) % 12; // 确保为正数
    const octaves = Math.floor(interval / 12);
    
    let noteName: string;
    
    if (isChromatic) {
      // 半音模式：使用所有12个音
      noteName = SOLFEGE_NUMBERS[semitones];
    } else {
      // 自然模式：只使用7个自然音
      const naturalSemitones = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
      const naturalIndex = naturalSemitones.indexOf(semitones);
      if (naturalIndex !== -1) {
        noteName = SOLFEGE_NATURAL[naturalIndex];
      } else {
        // 如果不是自然音，找最近的自然音
        const closest = naturalSemitones.reduce((prev, curr) => 
          Math.abs(curr - semitones) < Math.abs(prev - semitones) ? curr : prev
        );
        const closestIndex = naturalSemitones.indexOf(closest);
        noteName = SOLFEGE_NATURAL[closestIndex];
      }
    }
    
    let highDots = '';
    let lowDots = '';
    
    // 添加高低音标记
    if (octaves > 0) {
      // 高音用点在上方
      highDots = '●'.repeat(octaves);
    } else if (octaves < 0) {
      // 低音用点在下方
      lowDots = '●'.repeat(Math.abs(octaves));
    }
    
    return { note: noteName, highDots, lowDots };
  }

  // 播放单个音符
  async playNote(midiNote: number, duration?: number): Promise<void> {
    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      throw new Error('Audio context not available');
    }

    const frequency = this.midiToFrequency(midiNote);
    const playDuration = duration || this.settings.duration;
    
    // 创建振荡器
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // 连接节点
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // 设置参数
    oscillator.type = this.settings.waveType;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    // 设置音量包络
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.settings.volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + playDuration - 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + playDuration);
    
    // 播放
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + playDuration);
    
    return new Promise(resolve => {
      oscillator.onended = () => resolve();
    });
  }

  // 播放音程（参考音 + 目标音）
  async playInterval(referenceNote: number, targetNote: number): Promise<void> {
    await this.playNote(referenceNote, 0.8);
    await new Promise(resolve => setTimeout(resolve, 200)); // 短暂停顿
    await this.playNote(targetNote, 0.8);
  }

  // 同时播放两个音符（和声音程）
  async playHarmony(referenceNote: number, targetNote: number): Promise<void> {
    await this.ensureAudioContext();
    
    if (!this.audioContext) {
      throw new Error('Audio context not available');
    }

    const freq1 = this.midiToFrequency(referenceNote);
    const freq2 = this.midiToFrequency(targetNote);
    const duration = this.settings.duration;
    
    // 创建两个振荡器
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // 连接节点
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // 设置参数
    osc1.type = this.settings.waveType;
    osc2.type = this.settings.waveType;
    osc1.frequency.setValueAtTime(freq1, this.audioContext.currentTime);
    osc2.frequency.setValueAtTime(freq2, this.audioContext.currentTime);
    
    // 设置音量
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.settings.volume * 0.5, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration - 0.01);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    
    // 播放
    const startTime = this.audioContext.currentTime;
    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
    
    return new Promise(resolve => {
      osc1.onended = () => resolve();
    });
  }

  // 更新音频设置
  updateSettings(newSettings: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  // 获取当前设置
  getSettings(): AudioSettings {
    return { ...this.settings };
  }
}
