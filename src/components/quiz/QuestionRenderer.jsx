import React from 'react';
import './QuestionRenderer.css';
import { QuestionCard } from '../../features/play/QuestionCard.jsx';

export default function QuestionRenderer(props) {
  return <QuestionCard {...props} />;
}

export { QuestionRenderer };
