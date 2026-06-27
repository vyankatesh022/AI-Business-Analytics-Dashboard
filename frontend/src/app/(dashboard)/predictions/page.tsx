'use client';

import React from 'react';
import { PredictionsProvider } from '@/features/predictions/context/PredictionsContext';
import { PredictionCenterDashboard } from '@/features/predictions/components/PredictionCenterDashboard';

export default function PredictionsPage() {
  return (
    <PredictionsProvider>
      <PredictionCenterDashboard />
    </PredictionsProvider>
  );
}
