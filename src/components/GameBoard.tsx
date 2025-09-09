import React from 'react';
import { motion } from 'framer-motion';
import GridCell from './GridCell';
import Character from './Character';
import PrincessCharacterWithAnimation from './PrincessCharacterWithAnimation';
import { AudioEngine } from '../utils/audioUtils';
import { GridNote } from '../types';


interface GameBoardProps {
  gridNotes: GridNote[];
  referenceNote: number;
  selectedNote: number | null;
  isCorrect: boolean | null;
  onCellClick: (note: number, position: number) => void;
  disabled: boolean;
  audioEngine: AudioEngine;
  characterPosition: number;
  isCharacterJumping: boolean;
  isCharacterFalling: boolean;
  isSolfegeMode: boolean;
  isChromatic: boolean;
  characterStartPosition?: number;
  characterTargetPosition?: number;
  showTrajectory?: boolean;
  keySignature: number; // 用户设置的调性
  // 公主角色相关
  showPrincessDemo?: boolean;
  princessPosition?: number;
  princessStartPosition?: number;
  princessTargetPosition?: number;
  isPrincessJumping?: boolean;
  showPrincessTrajectory?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({
  gridNotes,
  referenceNote,
  selectedNote,
  isCorrect,
  onCellClick,
  disabled,
  audioEngine,
  characterPosition,
  isCharacterJumping,
  isCharacterFalling,
  isSolfegeMode,
  isChromatic,
  characterStartPosition = 0,
  characterTargetPosition = 0,
  showTrajectory = false,
  keySignature,
  // 公主角色相关
  showPrincessDemo = false,
  princessPosition = 0,
  princessStartPosition = 0,
  princessTargetPosition = 0,
  isPrincessJumping = false,
  showPrincessTrajectory = false
}) => {
  const handleCellClick = (note: number, position: number) => {
    if (disabled || note === referenceNote) return;
    
    // 播放点击的音符
    audioEngine.playNote(note, 0.5).catch(console.error);
    onCellClick(note, position);
  };

  return (
    <motion.div 
      className="game-board"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid-container" style={{ position: 'relative' }}>
        {gridNotes.map((gridNote, index) => (
          <GridCell
            key={`${gridNote.midiNote}-${index}`}
            note={gridNote.midiNote}
            isReference={gridNote.midiNote === referenceNote}
            isSelected={gridNote.midiNote === selectedNote}
            isCorrect={gridNote.midiNote === selectedNote ? isCorrect : null}
            onClick={() => handleCellClick(gridNote.midiNote, gridNote.position)}
            disabled={disabled}
            noteName={audioEngine.getNoteName(gridNote.midiNote)}
            solfegeData={audioEngine.getSolfegeNoteName(gridNote.midiNote, isChromatic, keySignature)}
            isSolfegeMode={isSolfegeMode}
            position={gridNote.position}
            semitoneOffset={gridNote.semitoneOffset}
          />
        ))}
        
        <Character
          position={characterPosition}
          isJumping={isCharacterJumping}
          isFalling={isCharacterFalling}
          gridLength={gridNotes.length}
          startPosition={characterStartPosition}
          targetPosition={characterTargetPosition}
          showTrajectory={showTrajectory}
        />
        
        {/* 公主演示角色 */}
        {showPrincessDemo && (
          <PrincessCharacterWithAnimation
            position={princessPosition}
            isJumping={isPrincessJumping}
            isFalling={false}
            gridLength={gridNotes.length}
            startPosition={princessStartPosition}
            targetPosition={princessTargetPosition}
            showTrajectory={showPrincessTrajectory}
          />
        )}
      </div>
    </motion.div>
  );
};

export default GameBoard;
