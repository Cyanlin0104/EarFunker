import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DeveloperMode } from '../types';
import { DeveloperModeManager, LevelSystem } from '../utils/levelSystem';

interface DeveloperPanelProps {
  developerMode: DeveloperMode;
  onModeChange: (mode: DeveloperMode) => void;
  isVisible: boolean;
  onClose: () => void;
}

const DeveloperPanel: React.FC<DeveloperPanelProps> = ({
  developerMode,
  onModeChange,
  isVisible,
  onClose
}) => {
  const handleToggleDeveloperMode = () => {
    const enabled = DeveloperModeManager.toggleDeveloperMode();
    const newMode = DeveloperModeManager.getMode();
    onModeChange(newMode);
    
    if (!enabled) {
      onClose();
    }
  };

  const handleUnlockAllLevels = () => {
    DeveloperModeManager.unlockAllLevels();
    const newMode = DeveloperModeManager.getMode();
    onModeChange(newMode);
  };

  const handleToggleSkipRequirements = () => {
    DeveloperModeManager.toggleSkipRequirements();
    const newMode = DeveloperModeManager.getMode();
    onModeChange(newMode);
  };

  const handleToggleDebugInfo = () => {
    DeveloperModeManager.toggleDebugInfo();
    const newMode = DeveloperModeManager.getMode();
    onModeChange(newMode);
  };

  const handleResetProgress = () => {
    if (confirm('确定要重置所有进度吗？此操作无法撤销！')) {
      DeveloperModeManager.resetProgress();
      const newMode = DeveloperModeManager.getMode();
      onModeChange(newMode);
      alert('进度已重置！');
    }
  };

  const handleCompleteCurrentLevel = () => {
    // 这个函数需要从外部传入当前关卡信息
    const levelId = '1-1'; // 示例
    DeveloperModeManager.completeLevel(levelId, 1.0);
    alert(`关卡 ${levelId} 已完成！`);
  };

  const stats = LevelSystem.getLevelStats();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="developer-panel-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="developer-panel"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="developer-header">
              <h2>🛠️ 开发者模式</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="developer-content">
              <div className="stats-section">
                <h3>📊 统计信息</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">总关卡数:</span>
                    <span className="stat-value">{stats.totalLevels}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">已解锁:</span>
                    <span className="stat-value">{stats.unlockedLevels}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">已完成:</span>
                    <span className="stat-value">{stats.completedLevels}</span>
                  </div>
                </div>
              </div>

              <div className="controls-section">
                <h3>🎮 控制面板</h3>
                
                <div className="control-group">
                  <button
                    className={`dev-button ${developerMode.enabled ? 'active' : ''}`}
                    onClick={handleToggleDeveloperMode}
                  >
                    {developerMode.enabled ? '🟢 关闭开发者模式' : '🔴 启用开发者模式'}
                  </button>
                </div>

                {developerMode.enabled && (
                  <>
                    <div className="control-group">
                      <button
                        className={`dev-button ${developerMode.unlockAllLevels ? 'active' : ''}`}
                        onClick={handleUnlockAllLevels}
                      >
                        🔓 {developerMode.unlockAllLevels ? '重新锁定关卡' : '解锁所有关卡'}
                      </button>
                    </div>

                    <div className="control-group">
                      <button
                        className={`dev-button ${developerMode.skipLevelRequirements ? 'active' : ''}`}
                        onClick={handleToggleSkipRequirements}
                      >
                        ⏭️ {developerMode.skipLevelRequirements ? '启用通关要求' : '跳过通关要求'}
                      </button>
                    </div>

                    <div className="control-group">
                      <button
                        className={`dev-button ${developerMode.showDebugInfo ? 'active' : ''}`}
                        onClick={handleToggleDebugInfo}
                      >
                        🐛 {developerMode.showDebugInfo ? '隐藏调试信息' : '显示调试信息'}
                      </button>
                    </div>

                    <div className="control-group">
                      <button
                        className="dev-button danger"
                        onClick={handleResetProgress}
                      >
                        🗑️ 重置所有进度
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="help-section">
                <h3>💡 使用说明</h3>
                <ul>
                  <li><strong>解锁所有关卡:</strong> 立即解锁所有关卡，方便测试</li>
                  <li><strong>跳过通关要求:</strong> 无需达到80%正确率即可通关</li>
                  <li><strong>显示调试信息:</strong> 在游戏界面显示详细的调试信息</li>
                  <li><strong>快捷键:</strong> 按 Ctrl+Shift+D 开启/关闭开发者模式</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeveloperPanel;
