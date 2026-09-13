import React from 'react';
import './PlayPhase.css';
import { WorldRun } from '../../features/play/WorldRun.jsx';
import KingdomMap from '../gamification/KingdomMap.jsx';

export default function PlayPhase({ activeWorldId, onSelectWorld, onBackToWorlds }) {
  if (activeWorldId) {
    return <WorldRun worldId={activeWorldId} onBackToWorlds={onBackToWorlds} />;
  }
  return <KingdomMap onSelectWorld={onSelectWorld} />;
}

export { PlayPhase };
