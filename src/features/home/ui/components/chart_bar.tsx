import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface BarDataPoint {
  day: string;
  sessions: number;
  commits: number;
}

const WEEKLY_DATA: BarDataPoint[] = [
  { day: 'Lun', sessions: 18, commits: 42 },
  { day: 'Mar', sessions: 26, commits: 58 },
  { day: 'Mié', sessions: 22, commits: 51 },
  { day: 'Jue', sessions: 34, commits: 76 },
  { day: 'Vie', sessions: 40, commits: 88 },
  { day: 'Sáb', sessions: 28, commits: 62 },
  { day: 'Dom', sessions: 19, commits: 45 },
];

export const ChartBar: React.FC = () => {
  const maxVal = 100;
  const chartHeight = 190;
  const barGroupWidth = 58;
  const svgWidth = WEEKLY_DATA.length * barGroupWidth + 48;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Actividad Semanal de Colaboración
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sesiones activas vs. sincronizaciones en tiempo real (CRDT)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Chip
            size="small"
            label="Sesiones"
            sx={{ bgcolor: 'rgba(91, 86, 221, 0.12)', color: '#5b56dd', fontWeight: 600 }}
          />
          <Chip
            size="small"
            label="Sincronizaciones"
            sx={{ bgcolor: 'rgba(38, 181, 156, 0.14)', color: '#1b9982', fontWeight: 600 }}
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto', pt: 1 }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${chartHeight + 40}`}
          style={{ width: '100%', height: 'auto', minHeight: 220, display: 'block' }}
          role="img"
          aria-label="Gráfica de barras de actividad semanal"
        >
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = chartHeight - (tick / maxVal) * (chartHeight - 20);
            return (
              <g key={tick}>
                <line
                  x1={32}
                  y1={y}
                  x2={svgWidth - 8}
                  y2={y}
                  stroke="#e5e7f0"
                  strokeDasharray={tick === 0 ? 'none' : '4 4'}
                  strokeWidth={1}
                />
                <text
                  x={24}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#7b809a"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {WEEKLY_DATA.map((item, idx) => {
            const baseX = 44 + idx * barGroupWidth;
            const sessionBarHeight = (item.sessions / maxVal) * (chartHeight - 20);
            const commitBarHeight = (item.commits / maxVal) * (chartHeight - 20);
            const sessionY = chartHeight - sessionBarHeight;
            const commitY = chartHeight - commitBarHeight;

            return (
              <g key={item.day}>
                <rect
                  x={baseX}
                  y={sessionY}
                  width={16}
                  height={sessionBarHeight}
                  rx={4}
                  fill="#5b56dd"
                />
                <text
                  x={baseX + 8}
                  y={sessionY - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#5b56dd"
                >
                  {item.sessions}
                </text>

                <rect
                  x={baseX + 20}
                  y={commitY}
                  width={16}
                  height={commitBarHeight}
                  rx={4}
                  fill="#26b59c"
                />
                <text
                  x={baseX + 28}
                  y={commitY - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#1b9982"
                >
                  {item.commits}
                </text>

                <text
                  x={baseX + 18}
                  y={chartHeight + 22}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#343a54"
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </Box>
    </Box>
  );
};

export default ChartBar;
