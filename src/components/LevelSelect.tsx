import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chapter, Level } from '../types';
import { LevelSystem, DeveloperModeManager } from '../utils/levelSystem';

interface LevelSelectProps {
  onLevelSelect: (level: Level) => void;
  onBack: () => void;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ onLevelSelect, onBack }) => {
  const [selectedChapter, setSelectedChapter] = useState(1);
  const chapters = LevelSystem.getChaptersWithProgress();
  const developerMode = DeveloperModeManager.getMode();

  const currentChapter = chapters.find(c => c.id === selectedChapter);

  const getScoreStars = (score?: number) => {
    if (!score) return '';
    if (score >= 0.95) return '⭐⭐⭐';
    if (score >= 0.9) return '⭐⭐';
    if (score >= 0.8) return '⭐';
    return '';
  };

  const getLevelStatusIcon = (level: Level) => {
    if (level.completed) return '✅';
    if (level.unlocked) return '🔓';
    return '🔒';
  };

  const getLevelStatusColor = (level: Level) => {
    if (level.completed) return '#4ade80'; // green
    if (level.unlocked) return '#3b82f6'; // blue  
    return '#9ca3af'; // gray
  };

  return (
    <motion.div 
      className="level-select"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="level-select-container">
        <motion.div 
          className="level-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <button className="back-button" onClick={onBack}>
            ← 返回主菜单
          </button>
          <h1>选择关卡</h1>
          <div className="progress-summary">
            {LevelSystem.getLevelStats().completedLevels}/{LevelSystem.getLevelStats().totalLevels} 关卡完成
          </div>
        </motion.div>

        <motion.div 
          className="chapter-tabs"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              className={`chapter-tab ${selectedChapter === chapter.id ? 'active' : ''}`}
              onClick={() => setSelectedChapter(chapter.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="chapter-number">第{chapter.id}章</div>
              <div className="chapter-name">{chapter.name.split('：')[1]}</div>
              <div className="chapter-progress">
                {chapter.levels.filter(l => l.completed).length}/{chapter.levels.length}
              </div>
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {currentChapter && (
            <motion.div
              key={selectedChapter}
              className="chapter-content"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="chapter-info">
                <h2>{currentChapter.name}</h2>
                <p>{currentChapter.description}</p>
              </div>

              <div className="levels-grid">
                {currentChapter.levels.map((level, index) => (
                  <motion.div
                    key={level.id}
                    className={`level-card ${(level.unlocked || developerMode.unlockAllLevels) ? 'unlocked' : 'locked'} ${level.completed ? 'completed' : ''} ${developerMode.unlockAllLevels && !level.unlocked ? 'dev-unlocked' : ''}`}
                    style={{ borderColor: getLevelStatusColor(level) }}
                    whileHover={(level.unlocked || developerMode.unlockAllLevels) ? { scale: 1.05, y: -5 } : {}}
                    whileTap={(level.unlocked || developerMode.unlockAllLevels) ? { scale: 0.95 } : {}}
                    onClick={() => (level.unlocked || developerMode.unlockAllLevels) && onLevelSelect(level)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                  >
                    <div className="level-header-card">
                      <div className="level-status">{getLevelStatusIcon(level)}</div>
                      <div className="level-id">{level.id}</div>
                      <div className="level-stars">{getScoreStars(level.bestScore)}</div>
                    </div>
                    
                    <div className="level-info">
                      <h3>{level.name}</h3>
                      <p>{level.description}</p>
                    </div>

                    <div className="level-details">
                      <div className="level-stat">
                        <span className="stat-label">题目数:</span>
                        <span className="stat-value">{level.questionsCount}</span>
                      </div>
                      <div className="level-stat">
                        <span className="stat-label">通过率:</span>
                        <span className="stat-value">{(level.passRate * 100).toFixed(0)}%</span>
                      </div>
                      {level.bestScore && (
                        <div className="level-stat">
                          <span className="stat-label">最佳:</span>
                          <span className="stat-value">{(level.bestScore * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </div>

                    {level.unlocked && (
                      <button 
                        className="level-play-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLevelSelect(level);
                        }}
                      >
                        {level.completed ? '重新挑战' : '开始关卡'}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LevelSelect;

