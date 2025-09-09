import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GridCellProps {
  note: number;
  isReference: boolean;
  isSelected: boolean;
  isCorrect: boolean | null;
  onClick: () => void;
  disabled: boolean;
  noteName: string;
  solfegeData?: { note: string; highDots: string; lowDots: string };
  isSolfegeMode?: boolean;
  position: number; // 视觉位置（按半音距离计算）
  semitoneOffset: number; // 相对于参考音的半音偏移
}

const GridCell: React.FC<GridCellProps> = ({
  note,
  isReference,
  isSelected,
  isCorrect,
  onClick,
  disabled,
  noteName,
  solfegeData,
  isSolfegeMode = false,
  position,
  semitoneOffset
}) => {
  const getCellClassName = () => {
    let className = 'grid-cell';
    
    if (isReference) className += ' reference';
    if (isSelected && !isReference) {
      if (isCorrect === true) className += ' correct';
      else if (isCorrect === false) className += ' incorrect';
      else className += ' selected';
    }
    
    return className;
  };

  const cellVariants = {
    idle: { scale: 1, y: 0 },
    hover: { scale: 1.05, y: -3 },
    selected: { scale: 1.1 },
    correct: { 
      scale: 1.1,
      transition: { 
        type: "spring", 
        stiffness: 500,
        damping: 15
      }
    },
    incorrect: {
      x: [-5, 5, -5, 5, 0],
      y: [0, 0, 0, 0, 100],
      opacity: [1, 1, 1, 1, 0],
      transition: {
        x: { duration: 0.6, ease: "easeInOut" },
        y: { duration: 1, delay: 0.5, ease: "easeIn" },
        opacity: { duration: 0.5, delay: 1 }
      }
    }
  };

  const getAnimationState = () => {
    if (isSelected && !isReference) {
      if (isCorrect === true) return 'correct';
      if (isCorrect === false) return 'incorrect';
      return 'selected';
    }
    return 'idle';
  };

  // 响应式设计状态
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 计算基于半音距离的位置
  const cellWidth = isDesktop ? 60 : 45; // 桌面端60px，移动端45px
  const cellGap = 4; // 基础间距
  const semitoneSpacing = cellWidth + cellGap; // 每个半音的间距
  
  // 使用绝对定位，根据position（半音距离）来计算位置
  const leftPosition = position * semitoneSpacing;

  return (
    <motion.div
      className={getCellClassName()}
      onClick={disabled ? undefined : onClick}
      variants={cellVariants}
      animate={getAnimationState()}
      whileHover={!disabled && !isSelected ? "hover" : {}}
      style={{ 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        position: 'absolute',
        left: `${leftPosition}px`,
        width: `${cellWidth}px`,
        height: `${cellWidth}px`
      }}
          >
        {isSolfegeMode && solfegeData ? (
          <div className="solfege-note">
            {solfegeData.highDots && (
              <div className="solfege-high-dots">{solfegeData.highDots}</div>
            )}
            <div>{solfegeData.note}</div>
            {solfegeData.lowDots && (
              <div className="solfege-low-dots">{solfegeData.lowDots}</div>
            )}
          </div>
        ) : (
          <div className="note-name">{noteName}</div>
        )}
        {isReference && <div className="reference-marker">♪</div>}
      </motion.div>
  );
};

export default GridCell;
