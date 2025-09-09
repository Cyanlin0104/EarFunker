import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrincessCharacter from './PrincessCharacter';
import JumpTrajectory from './JumpTrajectory';
import { useCharacterAnimation } from '../hooks/useCharacterAnimation';

interface PrincessCharacterWithAnimationProps {
  position: number;
  isJumping: boolean;
  isFalling?: boolean;
  gridLength: number;
  startPosition?: number;
  targetPosition?: number;
  showTrajectory?: boolean;
}

const PrincessCharacterWithAnimation: React.FC<PrincessCharacterWithAnimationProps> = ({ 
  position, 
  isJumping, 
  isFalling = false,
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
    targetPosition
  });

  // 注释掉冲突的入场动画，让useCharacterAnimation Hook统一处理所有动画

  return (
    <>
      {/* 公主的跳跃轨迹 */}
      <AnimatePresence>
        {showTrajectory && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              zIndex: 12
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.2, // 与公主出现时间同步
              delay: 0 // 不延迟，与公主同时开始
            }}
          >
            <JumpTrajectory
              startX={startX}
              endX={endX}
              isVisible={showTrajectory}
              intervalDistance={intervalDistance}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 公主角色本体 */}
      <motion.div
        className="princess-character-absolute"
        style={{
          position: 'absolute',
          top: `${characterTop}px`, // 自动计算的起始高度
          left: 0,
          width: `${characterWidth}px`,
          height: `${characterWidth}px`,
          zIndex: 15, // 高于常规角色
          pointerEvents: 'none'
        }}
        animate={controls} // 使用动画控制器
        initial={{ 
          opacity: 0,  // 从不透明开始
          scale: 0.5,  // 从小尺寸开始
          y: 0
        }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ 
          opacity: { duration: 0.5, ease: "easeOut" }, // 渐入动画
          scale: { duration: 0.5, ease: "easeOut" }    // 缩放动画
        }}
      >
        <PrincessCharacter 
          isJumping={isJumping} 
          size={characterWidth}
        />
        
        {/* 公主特有的闪闪发光效果 */}
        {/* <motion.div
          style={{
            position: 'absolute',
            top: '-15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '6px',
            background: 'linear-gradient(90deg, transparent, #FFD700, #FF69B4, #FFD700, transparent)',
            borderRadius: '3px',
            opacity: 0.9
          }}
          animate={{
            scaleX: [1, 1.3, 1],
            opacity: [0.9, 1, 0.9],
            background: [
              'linear-gradient(90deg, transparent, #FFD700, #FF69B4, #FFD700, transparent)',
              'linear-gradient(90deg, transparent, #FF69B4, #DDA0DD, #FF69B4, transparent)',
              'linear-gradient(90deg, transparent, #FFD700, #FF69B4, #FFD700, transparent)'
            ]
          }}
          transition={{
            duration: 1.2, // 与跳跃动画时长同步
            repeat: Infinity,
            ease: "easeInOut"
          }}
        /> */}
        
        {/* 公主专属的星星装饰 */}
        {/* {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${-15 + i * 25}px`,
              top: `${-10 + (i % 2) * -8}px`,
              fontSize: '12px',
              pointerEvents: 'none',
              zIndex: 16
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5 + i * 0.3, // 与跳跃节奏协调
              repeat: Infinity,
              delay: i * 0.15
            }}
          >
            ✨
          </motion.div>
        ))} */}
      </motion.div>
    </>
  );
};

export default PrincessCharacterWithAnimation;
