import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { MuscleGroup } from '../models/stats';

const muscleColors: Record<MuscleGroup, string> = {
  chest: '#ff7f7f',
  back: '#ff9f7f',
  shoulders: '#ffbf7f',
  arms: '#ffd27f',
  core: '#b1e1ff',
  legs: '#9fd39f',
  glutes: '#c4b0ff',
  'full-body': '#9ad5d5',
};

interface Props {
  activeMuscles: MuscleGroup[];
}

export const BodySilhouette: React.FC<Props> = ({ activeMuscles }) => {
  const uniqueMuscles = Array.from(new Set(activeMuscles));
  const colorFor = (muscle: MuscleGroup) => (uniqueMuscles.includes(muscle) ? muscleColors[muscle] : '#e0e0e0');

  return (
    <Svg height="220" width="160" viewBox="0 0 160 220">
      <Path d="M70 10 L90 10 L95 40 L65 40 Z" fill={colorFor('shoulders')} />
      <Path d="M65 40 L95 40 L100 100 L60 100 Z" fill={colorFor('chest')} />
      <Path d="M60 100 L100 100 L105 150 L55 150 Z" fill={colorFor('core')} />
      <Path d="M55 150 L75 150 L78 210 L52 210 Z" fill={colorFor('legs')} />
      <Path d="M85 150 L105 150 L108 210 L82 210 Z" fill={colorFor('legs')} />
      <Path d="M55 60 L65 60 L60 120 L50 120 Z" fill={colorFor('arms')} />
      <Path d="M95 60 L105 60 L110 120 L100 120 Z" fill={colorFor('arms')} />
      <Path d="M62 120 L98 120 L96 150 L64 150 Z" fill={colorFor('glutes')} />
      <Path d="M50 90 L60 90 L52 130 L42 130 Z" fill={colorFor('back')} />
      <Path d="M100 90 L110 90 L118 130 L108 130 Z" fill={colorFor('back')} />
    </Svg>
  );
};
