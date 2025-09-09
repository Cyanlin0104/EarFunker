import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '../types';
import { LevelSystem } from '../utils/levelSystem';

interface MainMenuProps {
  onModeSelect: (mode: GameMode) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onModeSelect }) => {
  const stats = LevelSystem.getLevelStats();

  return (
    <motion.div 
      className="main-menu"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="menu-container">
        <motion.h1 
          className="game-title"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          🎵 EarFunker
        </motion.h1>
        <motion.p 
          className="game-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          专业的练耳训练软件
        </motion.p>

        <div className="mode-selection">
          <motion.div
            className="mode-card"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeSelect('free')}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="mode-icon">🎯</div>
            <h3>自由训练模式</h3>
            <p>自由设置训练参数，随意练习</p>
            <div className="mode-features">
              <span>• 自定义音程范围</span>
              <span>• 首调/绝对音模式</span>
              <span>• 半音/自然音选择</span>
            </div>
            <button className="mode-button">开始自由训练</button>
          </motion.div>

          <motion.div
            className="mode-card"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeSelect('level')}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="mode-icon">🏆</div>
            <h3>关卡模式</h3>
            <p>循序渐进的训练体系，挑战你的极限</p>
            <div className="mode-features">
              <span>• 3个训练章节</span>
              <span>• 15个精心设计的关卡</span>
              <span>• 进度保存和成就系统</span>
            </div>
            <div className="progress-info">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(stats.completedLevels / stats.totalLevels) * 100}%` }}
                />
              </div>
              <span>进度: {stats.completedLevels}/{stats.totalLevels}</span>
            </div>
            <button className="mode-button">进入关卡</button>
          </motion.div>
        </div>

        <motion.div 
          className="credits"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <p>让音乐听觉训练变得有趣而高效</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MainMenu;

