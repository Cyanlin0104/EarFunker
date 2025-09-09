import React from 'react';
import { motion } from 'framer-motion';

interface MarioCharacterProps {
  size: number;
  isJumping: boolean;
  isFalling: boolean;
}

const MarioCharacter: React.FC<MarioCharacterProps> = ({ 
  size, 
  isJumping, 
  isFalling 
}) => {
  // 根据状态选择图片 - 使用用户提供的原版马里奥图片
  const getMarioImage = () => {
    if (isJumping) {
      // 跳跃状态：使用右图（跳跃姿态）
      return '/images/mario-jumping.svg';
    } else {
      // 站立状态：使用左图（站立姿态）
      return '/images/mario-standing.svg';
    }
  };

  return (
    <div 
      style={{ 
        width: size, 
        height: size, 
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={getMarioImage()}
        alt="Mario"
        style={{
          width: size,
          height: size,
          imageRendering: 'pixelated', // 保持像素化效果
          objectFit: 'contain',
          filter: isFalling ? 'hue-rotate(180deg) saturate(150%)' : 'none',
          transform: isJumping ? 'rotate(-5deg) scale(1.1)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* 跳跃时的运动线条 */}
      {isJumping && (
        <>
          <motion.div 
            style={{
              position: 'absolute',
              top: '15px',
              left: '-5px',
              width: '4px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '1px'
            }}
            animate={{
              x: [-5, -10, -5],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            style={{
              position: 'absolute',
              top: '25px',
              left: '-8px',
              width: '6px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              borderRadius: '1px'
            }}
            animate={{
              x: [-8, -15, -8],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.1
            }}
          />
          <motion.div 
            style={{
              position: 'absolute',
              top: '35px',
              left: '-6px',
              width: '5px',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '1px'
            }}
            animate={{
              x: [-6, -12, -6],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.2
            }}
          />
        </>
      )}

      {/* 坠落时的特效 */}
      {isFalling && (
        <>
          <motion.div 
            style={{
              position: 'absolute',
              top: '5px',
              left: '35px',
              fontSize: '12px',
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [1, 0.4, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity
            }}
          >
            💫
          </motion.div>
          <motion.div 
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              fontSize: '10px',
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [1, 0.2, 1]
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              delay: 0.2
            }}
          >
            ⭐
          </motion.div>
          <motion.div 
            style={{
              position: 'absolute',
              top: '8px',
              left: '40px',
              fontSize: '8px',
            }}
            animate={{
              rotate: [0, -180, -360],
              scale: [1, 0.7, 1]
            }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              delay: 0.1
            }}
          >
            ✨
          </motion.div>
          <motion.div 
            style={{
              position: 'absolute',
              top: '15px',
              left: '-5px',
              fontSize: '6px',
            }}
            animate={{
              x: [0, -10, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.3
            }}
          >
            💥
          </motion.div>
        </>
      )}
    </div>
  );
};

export default MarioCharacter;
