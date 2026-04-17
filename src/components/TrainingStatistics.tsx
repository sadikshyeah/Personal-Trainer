// Total training minutes per activity (bar chart).
// Trainings are loaded in App.tsx (fetchTrainings) and passed in as props.

// Recharts (bar chart): https://recharts.org/en-US/api/BarChart
// Lodash groupBy: https://lodash.com/docs/#groupBy
// Lodash sumBy: https://lodash.com/docs/#sumBy

import { useMemo } from 'react'
// Lodash
import { groupBy, sumBy } from 'lodash'
// MUI
import { Box, Paper, Typography } from '@mui/material'
// Recharts
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
// Types
import type { Training } from '../types'

// Props from App: same trainings array as Training list / Calendar.
type TrainingStatisticsProps = {
  trainings: Training[]
}

// One object per bar in the chart.
type ActivityStat = {
  activity: string
  minutes: number
}

// Use the activity string from the API on the X axis. Empty string has no visible label, so show "".
const formatActivityAxisLabel = (activityFromApi: string) => {
  if (activityFromApi === '') {
    return '""'
  }
  return activityFromApi
}

function TrainingStatistics({ trainings }: TrainingStatisticsProps) {
  // Recompute chart rows only when the trainings list changes.
  const activityStats = useMemo<ActivityStat[]>(() => {
    // Same activity name -> one group with all sessions of that activity.
    const groupedByActivity = groupBy(trainings, (training) => training.activity)

    // One row per activity group
    return Object.entries(groupedByActivity)
      .map(([activity, sessions]) => ({
        activity: formatActivityAxisLabel(activity),
        minutes: sumBy(sessions, 'duration'),
      }))
      .sort((a, b) => b.minutes - a.minutes)
  }, [trainings])

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Training Statistics
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        {activityStats.length === 0 ? (
          <Typography color="text.secondary">No training data available for statistics.</Typography>
        ) : (
          <Box sx={{ width: '100%', height: 360 }}>
            {/* Chart grows with the container width; height is set on the Box above. */}
            <ResponsiveContainer>
              <BarChart data={activityStats} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis
                  label={{
                    value: 'Minutes',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Bar dataKey="minutes" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default TrainingStatistics
