import React from 'react';
import { motion } from 'framer-motion';

interface JumpTrajectoryProps {
  startX: number;
  endX: number;
  isVisible: boolean;
  intervalDistance: number; // 音程距离（格子数）
}

const JumpTrajectory: React.FC<JumpTrajectoryProps> = ({
  startX,
  endX,
  isVisible,
  intervalDistance
}) => {
  if (!isVisible) return null;

  const distance = Math.abs(endX - startX);
  const direction = endX > startX ? 1 : -1;
  const midX = (startX + endX) / 2;
  
  // 根据音程距离调整抛物线高度
  const height = Math.min(30 + Math.abs(intervalDistance) * 6, 80);
  
  // 计算与公主跳跃同步的动画时长（与useCharacterAnimation保持一致）
  const jumpDistance = Math.abs(intervalDistance);
  const baseDuration = 0.5; // 基础时长
  const distanceFactor = 0.03; // 距离系数
  const syncedJumpDuration = baseDuration + (jumpDistance * distanceFactor);
  
  // 调试信息
  console.log('JumpTrajectory 渲染中:', { startX, endX, intervalDistance, height, distance, syncedJumpDuration, isVisible });
  
  // 创建平滑彩虹曲线路径
  const createRainbowCurvePath = () => {
    const numPoints = 100; // 增加点数以获得更平滑的曲线
    let path = '';
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = startX + (endX - startX) * t;
      // 抛物线公式：y = -4ht(1-t)，其中h是最大高度
      const y = 60 - 4 * height * t * (1 - t); // 60px是基准高度
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path;
  };

  // 创建流动粒子效果
  const createFlowingParticles = () => {
    const particles = [];
    const numParticles = Math.min(5, Math.max(3, Math.abs(intervalDistance)));
    
    for (let i = 0; i < numParticles; i++) {
      particles.push(
        <motion.div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,215,0,0.8) 100%)',
            boxShadow: '0 0 8px rgba(255,215,0,0.6), 0 0 16px rgba(255,255,255,0.4)',
            zIndex: 8,
            filter: 'blur(0.5px)'
          }}
          animate={{
            x: [startX - 3, endX - 3],
            y: Array.from({ length: 101 }, (_, i) => {
              const t = i / 100;
              return 60 - 4 * height * t * (1 - t) - 3;
            })
          }}
          transition={{
            duration: syncedJumpDuration + i * 0.2,
            repeat: Infinity,
            ease: "linear",
            delay: i * (syncedJumpDuration / numParticles)
          }}
        />
      );
    }
    
    return particles;
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '150px',
        pointerEvents: 'none',
        zIndex: 5
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      
      {/* 平滑彩虹曲线 */}
      <motion.svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '150px',
          overflow: 'visible',
          zIndex: 6
        }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ 
          pathLength: { duration: 1.2, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
      >
        {/* 定义彩虹渐变 */}
        <defs>
          <linearGradient
            id={`rainbow-gradient-${startX}-${endX}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="20%" stopColor="#FF4500" />
            <stop offset="40%" stopColor="#FF7F00" />
            <stop offset="60%" stopColor="#FFD700" />
            <stop offset="80%" stopColor="#ADFF2F" />
            <stop offset="100%" stopColor="#00FF7F" />
          </linearGradient>
          
          {/* 发光效果滤镜 */}
          <filter id={`glow-${startX}-${endX}`}>
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 主曲线 */}
        <motion.path
          d={createRainbowCurvePath()}
          fill="none"
          stroke={`url(#rainbow-gradient-${startX}-${endX})`}
          strokeWidth="30"
          strokeLinecap="round"
          filter={`url(#glow-${startX}-${endX})`}
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: syncedJumpDuration, ease: "easeOut" }}
        />
        
        {/* 外层发光曲线 */}
        <motion.path
          d={createRainbowCurvePath()}
          fill="none"
          stroke={`url(#rainbow-gradient-${startX}-${endX})`}
          strokeWidth="54"
          strokeLinecap="round"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: syncedJumpDuration, ease: "easeOut" }}
        />
        
        {/* 内层高亮曲线 */}
        <motion.path
          d={createRainbowCurvePath()}
          fill="none"
          stroke="rgba(255, 255, 255, 0.9)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: syncedJumpDuration, ease: "easeOut" }}
        />
      </motion.svg>
      
      {/* 流动粒子效果 */}
      {createFlowingParticles()}
      
      {/* 起始点标记 */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${startX}px`,
          top: '60px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          zIndex: 7
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0, type: "spring", stiffness: 300 }}
      />
      
      {/* 结束点标记 */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${endX}px`,
          top: '60px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#E60012',
          border: '2px solid white',
          transform: 'translate(-50%, -50%)',
          zIndex: 7
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0, type: "spring", stiffness: 300 }}
      />
      
      {/* 音程距离标签 */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${midX}px`,
          top: `${60 - height - 20}px`,
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#333',
          border: '1px solid #ddd',
          zIndex: 8,
          whiteSpace: 'nowrap'
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.2 }}
      >
        {Math.abs(intervalDistance)}格 {direction > 0 ? '↗' : '↙'}
      </motion.div>
      
      {/* 音符符号装饰 */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${startX - 15}px`,
          top: '45px',
          fontSize: '16px',
          transform: 'translate(-50%, -50%)',
          zIndex: 8
        }}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0, duration: 0.2 }}
      >
        🎵
      </motion.div>
      
      <motion.div
        style={{
          position: 'absolute',
          left: `${endX + 15}px`,
          top: '45px',
          fontSize: '16px',
          transform: 'translate(-50%, -50%)',
          zIndex: 8
        }}
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ delay: 0, duration: 0.2 }}
      >
        🎯
      </motion.div>

      {/* 轨迹背景光晕 */}
      <motion.div
        style={{
          position: 'absolute',
          left: `${Math.min(startX, endX) - 20}px`,
          top: `${60 - height - 25}px`,
          width: `${distance + 40}px`,
          height: `${height + 50}px`,
          background: `radial-gradient(ellipse, 
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 192, 203, 0.05) 30%,
            transparent 70%)`,
          borderRadius: '50%',
          zIndex: 3,
          filter: 'blur(8px)'
        }}
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      />
    </motion.div>
  );
};

export default JumpTrajectory;
