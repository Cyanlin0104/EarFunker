import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarioCharacter from './MarioCharacter';
import JumpTrajectory from './JumpTrajectory';
import { useCharacterAnimation } from '../hooks/useCharacterAnimation';

interface CharacterProps {
  position: number;
  isJumping: boolean;
  isFalling: boolean;
  gridLength: number;
  startPosition?: number; // 跳跃起始位置
  targetPosition?: number; // 跳跃目标位置
  showTrajectory?: boolean; // 是否显示轨迹
}

const Character: React.FC<CharacterProps> = ({ 
  position, 
  isJumping, 
  isFalling, 
  gridLength: _gridLength,
  startPosition = 0,
  targetPosition = 0,
  showTrajectory = false
}) => {
  // 使用共用的角色动画Hook
  const {
    controls,
    characterWidth,
    characterTop,
    startX,
    endX,
    intervalDistance
  } = useCharacterAnimation({
    position,
    isJumping,
    isFalling,
    startPosition,
    targetPosition,
    showTrajectory
  });

  return (
    <>
      {/* 跳跃轨迹 */}
      <AnimatePresence>
        {showTrajectory && (
          <JumpTrajectory
            startX={startX}
            endX={endX}
            isVisible={showTrajectory}
            intervalDistance={intervalDistance}
          />
        )}
      </AnimatePresence>

      {/* 马里奥角色 */}
      <motion.div
        className="character"
        style={{
          position: 'absolute',
          top: `${characterTop}px`, // 自动计算的起始高度
          zIndex: 10,
          left: 0,
          width: characterWidth,
          height: characterWidth
        }}
        animate={controls} // 使用动画控制器
        initial={{ 
          y: 0, 
          scale: 1, 
          opacity: 1 
        }}
      >
        <MarioCharacter 
          size={characterWidth}
          isJumping={isJumping}
          isFalling={isFalling}
        />
      </motion.div>
    </>
  );
};

export default Character;
