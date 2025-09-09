import React from 'react';
import { motion } from 'framer-motion';

interface PrincessCharacterProps {
  isJumping: boolean;
  size?: number;
}

const PrincessCharacter: React.FC<PrincessCharacterProps> = ({ 
  isJumping, 
  size = 40 
}) => {
  const characterSize = size;

  return (
    <div className="princess-character-container" style={{ width: characterSize, height: characterSize }}>
      {/* 公主图像 */}
      <motion.img
        src={isJumping ? "/images/princess-jumping.svg" : "/images/princess-standing.svg"}
        alt="Princess"
        className="princess-image"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 2px 4px rgba(255, 182, 193, 0.3))'
        }}
        animate={{
          y: isJumping ? -5 : 0,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* 跳跃时的动作线 */}
      {isJumping && (
        <>
          <motion.div
            className="motion-line"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              left: '-10px',
              top: '50%',
              width: '15px',
              height: '2px',
              background: 'linear-gradient(to left, rgba(255, 182, 193, 0.8), transparent)',
              transform: 'translateY(-50%)',
            }}
          />
          <motion.div
            className="motion-line"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              right: '-10px',
              top: '50%',
              width: '15px',
              height: '2px',
              background: 'linear-gradient(to right, rgba(255, 182, 193, 0.8), transparent)',
              transform: 'translateY(-50%)',
            }}
          />
        </>
      )}
      
      {/* 落地时的粒子效果 */}
      {!isJumping && (
        <motion.div
          className="landing-particles"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ 
                x: 0, 
                y: characterSize / 2,
                scale: 0 
              }}
              animate={{ 
                x: (i % 2 === 0 ? 1 : -1) * (10 + i * 5),
                y: characterSize / 2 + 10,
                scale: [0, 1, 0],
                opacity: [1, 0.5, 0]
              }}
              transition={{ 
                duration: 0.5,
                delay: i * 0.05
              }}
              style={{
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: '#FFB6C1',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PrincessCharacter;