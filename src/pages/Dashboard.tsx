import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { Customer, Training } from '../types'

type DashboardProps = {
  customers: Customer[]
  trainings: Training[]
}

function formatTotalMinutes(total: number): string {
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function summarizeWeek(
  trainings: Training[],
  anchor: dayjs.Dayjs,
  includeMinutes: boolean,
): { count: number; minutes: number } {
  const weekStart = anchor.startOf('week')
  const weekEnd = anchor.endOf('week')
  let count = 0
  let minutes = 0
  for (const t of trainings) {
    const d = dayjs(t.date)
    if (d.isBefore(weekStart, 'day') || d.isAfter(weekEnd, 'day')) continue
    count++
    if (includeMinutes && Number.isFinite(t.duration)) minutes += t.duration
  }
  return { count, minutes }
}

export default function Dashboard({ customers, trainings }: DashboardProps) {
  const thisWeek = useMemo(() => summarizeWeek(trainings, dayjs(), true), [trainings])
  const nextWeek = useMemo(
    () => summarizeWeek(trainings, dayjs().startOf('week').add(1, 'week'), false),
    [trainings],
  )

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%', mb: 1.5 }}>
      <Typography variant="h6" sx={{ mb: 0.75 }}>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.5,
        }}
      >
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Total Customers
          </Typography>
          <Typography variant="h6">{customers.length}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Trainings this week
          </Typography>
          <Typography variant="h6">{thisWeek.count}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Coaching time this week
          </Typography>
          <Typography variant="h6">{formatTotalMinutes(thisWeek.minutes)}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            Trainings next week
          </Typography>
          <Typography variant="h6">{nextWeek.count}</Typography>
        </Paper>
      </Box>
    </Box>
  )
}
