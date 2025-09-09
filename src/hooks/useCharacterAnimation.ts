import { useState, useEffect } from 'react';
import { useAnimation } from 'framer-motion';

// 从CSS变量动态读取容器设置的工具函数
const getContainerSettings = () => {
  if (typeof window === 'undefined') return { padding: 30, minHeight: 200 };
  
  const gridContainer = document.querySelector('.grid-container');
  if (!gridContainer) return { padding: 30, minHeight: 200 };
  
  const styles = getComputedStyle(gridContainer);
  const padding = parseInt(styles.getPropertyValue('--container-padding') || '30px', 10);
  const minHeight = parseInt(styles.getPropertyValue('--container-min-height') || '200px', 10);
  
  return { padding, minHeight };
};

interface UseCharacterAnimationProps {
  position: number;
  isJumping: boolean;
  isFalling?: boolean;
  startPosition?: number;
  targetPosition?: number;
}

interface UseCharacterAnimationReturn {
  controls: any; // Framer Motion 控制器
  cellWidth: number;
  cellGap: number;
  characterWidth: number;
  characterTop: number;
  currentX: number;
  targetX: number;
  semitoneSpacing: number;
  // 轨迹相关
  startX: number;
  endX: number;
  intervalDistance: number;
  isDesktop: boolean;
}

export const useCharacterAnimation = ({
  position,
  isJumping,
  isFalling = false,
  startPosition = 0,
  targetPosition = 0
}: UseCharacterAnimationProps): UseCharacterAnimationReturn => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const controls = useAnimation(); // 动画控制器

  // 响应式监听
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 计算角色在格子中的精确位置
  const cellWidth = isDesktop ? 60 : 45;
  const cellGap = 4;
  const characterWidth = isDesktop ? 40 : 30;
  const semitoneSpacing = cellWidth + cellGap;
  
  // 角色应该站在格子上
  const containerSettings = getContainerSettings();
  const containerHeight = containerSettings.minHeight;
  const gridTop = containerHeight / 3; // 格子顶部在1/3位置
  const characterTop = gridTop - characterWidth; // 角色底部接触格子顶部
  
  // 计算当前位置和目标位置
  const currentX = position * semitoneSpacing + (cellWidth - characterWidth) / 2;
  const targetX = targetPosition * semitoneSpacing + (cellWidth - characterWidth) / 2;

  // 计算轨迹的起始和结束位置
  const startX = startPosition * semitoneSpacing + cellWidth / 2;
  const endX = targetPosition * semitoneSpacing + cellWidth / 2;
  const intervalDistance = targetPosition - startPosition;

  // 监听跳跃状态变化，触发完整的跳跃动画序列
  useEffect(() => {
    console.log('🔍 useCharacterAnimation Hook触发:', { isJumping, isFalling, targetX, startPosition, targetPosition });
    
    if (isJumping && !isFalling) {
      // 根据音程距离计算动画时长
      const distance = Math.abs(targetPosition - startPosition);
      const baseDuration = 0.4; // 基础时长
      const distanceFactor = 0.02; // 每个格子增加0.05秒
      const jumpDuration = baseDuration + (distance * distanceFactor);
      
      console.log('🎬 开始跳跃动画:', { distance, jumpDuration, targetX, yAnimation: [0, -80, 0] });
      
      // 执行完整的跳跃序列：0 → -80 → 0
      controls.start({
        y: [0, -80, 0], // 关键帧序列
        x: targetX,     // 同时移动到目标位置
        opacity: 1,     // 确保跳跃时完全显示
        scale: 1,       // 确保正常大小
        transition: {
          y: {
            duration: jumpDuration,
            times: [0, 0.5, 1], // 0%时在0, 50%时在-80, 100%时回到0
            ease: ["easeOut", "easeIn"], // 上升缓出，下降缓入
          },
          x: { 
            duration: jumpDuration,
            ease: "linear" // 匀速移动
          },
          opacity: { duration: 0.3, ease: "easeOut" },
          scale: { duration: 0.3, ease: "easeOut" }
        }
      });
    } else if (isFalling) {
      // 下落动画（马里奥专用）
      controls.start({
        y: 100,
        x: targetX,
        scale: 0.8,
        opacity: 0,
        transition: {
          duration: 1.2,
          ease: "easeIn"
        }
      });
    } else {
      // 普通状态 - 包括公主初次出现
      console.log('🏠 普通状态动画:', { isJumping, isFalling, currentX, targetX });
      
      controls.start({
        y: 0,
        x: currentX, // 使用当前位置，避免位移
        scale: 1,
        opacity: 1,
        transition: { 
          duration: 0.4,
          x: { duration: 0 }, // 无位移动画
          opacity: { duration: 0.5, ease: "easeOut" }, // 平滑出现
          scale: { duration: 0.5, ease: "easeOut" }    // 平滑缩放
        }
      });
    }
  }, [isJumping, isFalling, controls, currentX, targetX, position, startPosition, targetPosition]);

  return {
    controls,
    cellWidth,
    cellGap,
    characterWidth,
    characterTop,
    currentX,
    targetX,
    semitoneSpacing,
    startX,
    endX,
    intervalDistance,
    isDesktop
  };
};
