import React from 'react';
import { Box, Typography } from '@mui/material';

interface PieSlice {
  label: string;
  percentage: number;
  color: string;
}

const LANGUAGE_DISTRIBUTION: PieSlice[] = [
  { label: 'JavaScript (ES6+)', percentage: 45, color: '#5b56dd' },
  { label: 'HTML5 Semántico', percentage: 30, color: '#26b59c' },
  { label: 'CSS3 / Flexbox', percentage: 25, color: '#f59e0b' },
];

export const ChartPie: React.FC = () => {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Distribución por Lenguaje
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Proporción de código editado en salas colaborativas
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: 3,
          py: 1,
        }}
      >
        <Box sx={{ position: 'relative', width: 160, height: 160, display: 'grid', placeItems: 'center' }}>
          <svg
            viewBox="0 0 150 150"
            style={{ width: 160, height: 160, transform: 'rotate(-90deg)' }}
            role="img"
            aria-label="Gráfica circular de distribución por lenguaje"
          >
            <circle cx="75" cy="75" r={radius} fill="transparent" stroke="#eef0f7" strokeWidth="22" />
            {LANGUAGE_DISTRIBUTION.map((slice) => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((cumulativePercent / 100) * circumference);
              cumulativePercent += slice.percentage;

              return (
                <circle
                  key={slice.label}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth="22"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <Box sx={{ position: 'absolute', textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
              100%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sandbox
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 180 }}>
          {LANGUAGE_DISTRIBUTION.map((slice) => (
            <Box
              key={slice.label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: slice.color,
                    flexShrink: 0,
                  }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {slice.label}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight={700} color="text.secondary">
                {slice.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChartPie;
