import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameSettings, TrainingMode, KEY_SIGNATURES } from '../types';

interface SettingsProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange, onClose }) => {
  // 使用内部状态来管理临时设置，避免每次更改都触发重新播放
  const [tempSettings, setTempSettings] = useState<GameSettings>(settings);
  const handleTrainingModeChange = (mode: TrainingMode) => {
    setTempSettings({
      ...tempSettings,
      trainingMode: mode
    });
  };

  const handleRangeChange = (direction: 'up' | 'down', value: number) => {
    setTempSettings({
      ...tempSettings,
      [direction === 'up' ? 'noteRangeUp' : 'noteRangeDown']: value
    });
  };

  const handleChromaticChange = (isChromatic: boolean) => {
    setTempSettings({
      ...tempSettings,
      isChromatic
    });
  };

  const handleMultiTargetChange = (enable: boolean) => {
    setTempSettings({
      ...tempSettings,
      enableMultiTarget: enable
    });
  };

  const handleMultiTargetCountChange = (count: number) => {
    setTempSettings({
      ...tempSettings,
      multiTargetCount: count
    });
  };

  const handleSaveSettings = () => {
    // 只有在点击保存按钮时才提交所有更改
    onSettingsChange(tempSettings);
    onClose();
  };

  const handleCancel = () => {
    // 取消时不保存更改，直接关闭
    onClose();
  };

  return (
      <motion.div
        className="settings-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleCancel}
      >
      <motion.div
        className="settings-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="settings-header">
          <h2>🎵 游戏设置</h2>
          <button className="close-btn" onClick={handleCancel}>✕</button>
        </div>

        <div className="settings-content">
          {/* 训练模式设置 */}
          <div className="setting-group">
            <h3>🎼 训练模式</h3>
            <div className="setting-options">
              <button
                className={`setting-option ${tempSettings.trainingMode === 'solfege' ? 'active' : ''}`}
                onClick={() => handleTrainingModeChange('solfege')}
              >
                <div className="option-title">🔢 首调模式</div>
                <div className="option-desc">使用数字记号法 (1, 2, 3...)</div>
              </button>
              <button
                className={`setting-option ${tempSettings.trainingMode === 'absolute' ? 'active' : ''}`}
                onClick={() => handleTrainingModeChange('absolute')}
              >
                <div className="option-title">🎵 绝对音模式</div>
                <div className="option-desc">使用音名记号法 (C, D, E...)</div>
              </button>
            </div>
          </div>

          {/* 参考音设置 (仅首调模式显示) */}
          {tempSettings.trainingMode === 'solfege' && (
            <div className="setting-group">
              <h3>🎹 参考音设置</h3>
              <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '10px' }}>选择参考音在大调音阶中的位置</p>
              <div className="setting-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[
                  { value: undefined, label: '默认(1)' },
                  { value: 1, label: '1 (Do)' },
                  { value: 2, label: '2 (Re)' },
                  { value: 3, label: '3 (Mi)' },
                  { value: 4, label: '4 (Fa)' },
                  { value: 5, label: '5 (Sol)' },
                  { value: 6, label: '6 (La)' },
                  { value: 7, label: '7 (Si)' }
                ].map(({ value, label }) => (
                  <button
                    key={value ?? 'default'}
                    className={`setting-option ${tempSettings.referenceNoteDegree === value ? 'active' : ''}`}
                    style={{ padding: '8px', fontSize: '0.9rem' }}
                    onClick={() => setTempSettings({
                      ...tempSettings,
                      referenceNoteDegree: value
                    })}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 调性选择 (仅首调模式显示) */}
          {tempSettings.trainingMode === 'solfege' && (
            <div className="setting-group">
              <h3>🎼 调性设置</h3>
              <p>选择"1"(Do)对应的音高 (支持C2-C5范围)</p>
              <select 
                value={tempSettings.keySignature || 60}
                onChange={(e) => setTempSettings({
                  ...tempSettings,
                  keySignature: Number(e.target.value)
                })}
                className="key-select"
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '1rem',
                  backgroundColor: 'white',
                  maxHeight: '200px'
                }}
              >
                <optgroup label="第2八度 (低音)">
                  {KEY_SIGNATURES.filter(key => key.note >= 36 && key.note < 48).map(key => (
                    <option key={key.note} value={key.note}>
                      {key.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="第3八度">
                  {KEY_SIGNATURES.filter(key => key.note >= 48 && key.note < 60).map(key => (
                    <option key={key.note} value={key.note}>
                      {key.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="第4八度 (中音)">
                  {KEY_SIGNATURES.filter(key => key.note >= 60 && key.note < 72).map(key => (
                    <option key={key.note} value={key.note}>
                      {key.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="第5八度 (高音)">
                  {KEY_SIGNATURES.filter(key => key.note >= 72 && key.note <= 72).map(key => (
                    <option key={key.note} value={key.note}>
                      {key.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* 音符范围设置 */}
          <div className="setting-group">
            <h3>🎯 音符范围</h3>
            
            <div className="range-setting">
              <label>向上范围 (半音数)</label>
              <div className="range-buttons">
                {[3, 5, 7, 12].map(value => (
                  <button
                    key={value}
                    className={`range-btn ${tempSettings.noteRangeUp === value ? 'active' : ''}`}
                    onClick={() => handleRangeChange('up', value)}
                  >
                    {value === 12 ? '一个八度' : `${value}个半音`}
                  </button>
                ))}
              </div>
            </div>

            <div className="range-setting">
              <label>向下范围 (半音数)</label>
              <div className="range-buttons">
                {[3, 5, 7, 12].map(value => (
                  <button
                    key={value}
                    className={`range-btn ${tempSettings.noteRangeDown === value ? 'active' : ''}`}
                    onClick={() => handleRangeChange('down', value)}
                  >
                    {value === 12 ? '一个八度' : `${value}个半音`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 半音设置 */}
          <div className="setting-group">
            <h3>🎹 音阶类型</h3>
            <div className="setting-options">
              <button
                className={`setting-option ${!tempSettings.isChromatic ? 'active' : ''}`}
                onClick={() => handleChromaticChange(false)}
              >
                <div className="option-title">🎼 自然音阶</div>
                <div className="option-desc">只包含7个自然音</div>
              </button>
              <button
                className={`setting-option ${tempSettings.isChromatic ? 'active' : ''}`}
                onClick={() => handleChromaticChange(true)}
              >
                <div className="option-title">🎹 半音阶</div>
                <div className="option-desc">包含所有12个半音</div>
              </button>
            </div>
          </div>

          {/* 多目标音模式设置 */}
          <div className="setting-group">
            <h3>🎯 训练模式</h3>
            <div className="setting-options">
              <button
                className={`setting-option ${!tempSettings.enableMultiTarget ? 'active' : ''}`}
                onClick={() => handleMultiTargetChange(false)}
              >
                <div className="option-title">🎵 单目标音</div>
                <div className="option-desc">经典模式：一个参考音对一个目标音</div>
              </button>
              <button
                className={`setting-option ${tempSettings.enableMultiTarget ? 'active' : ''}`}
                onClick={() => handleMultiTargetChange(true)}
              >
                <div className="option-title">🎼 连续音程</div>
                <div className="option-desc">进阶模式：一个参考音对多个目标音</div>
              </button>
            </div>

            {/* 多目标音数量设置 */}
            {tempSettings.enableMultiTarget && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ marginBottom: '10px', color: '#4a5568' }}>目标音数量</h4>
                <div className="setting-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[2, 3, 4, 5].map(count => (
                    <button
                      key={count}
                      className={`setting-option ${tempSettings.multiTargetCount === count ? 'active' : ''}`}
                      style={{ padding: '8px', fontSize: '0.9rem' }}
                      onClick={() => handleMultiTargetCountChange(count)}
                    >
                      {count}个
                    </button>
                  ))}
                </div>
                
                {/* 最大连续音程设置 */}
                <h4 style={{ marginTop: '15px', marginBottom: '10px', color: '#4a5568' }}>相邻音程最大距离</h4>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '10px' }}>限制相邻两个音之间的最大距离</p>
                <div className="setting-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[
                    { value: 2, label: '2个半音' },
                    { value: 3, label: '3个半音' },
                    { value: 4, label: '4个半音' },
                    { value: 5, label: '5个半音' },
                    { value: 7, label: '7个半音' },
                    { value: 9, label: '9个半音' },
                    { value: 12, label: '12个半音' },
                    { value: 15, label: '15个半音' },
                    { value: 18, label: '18个半音' },
                    { value: 21, label: '21个半音' },
                    { value: 24, label: '24个半音' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      className={`setting-option ${tempSettings.maxSequentialInterval === value ? 'active' : ''}`}
                      style={{ padding: '8px', fontSize: '0.9rem' }}
                      onClick={() => setTempSettings({
                        ...tempSettings,
                        maxSequentialInterval: value
                      })}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn btn-primary" onClick={handleSaveSettings}>
            ✓ 保存设置
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
