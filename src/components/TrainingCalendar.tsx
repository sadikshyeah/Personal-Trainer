import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import { Box, Paper, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { Training } from '../types'

type TrainingCalendarProps = {
  trainings: Training[]
}

function TrainingCalendar({ trainings }: TrainingCalendarProps) {
  const events = trainings.map((training) => {
    const start = dayjs(training.date)
    const end = start.add(training.duration, 'minute')
    const customerName = `${training.customer?.firstname ?? ''} ${training.customer?.lastname ?? ''}`.trim()

    return {
      title: `${training.activity}${customerName ? ` / ${customerName}` : ''}`,
      start: start.toISOString(),
      end: end.toISOString(),
    }
  })

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Training Calendar
      </Typography>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
          allDaySlot={false}
          events={events}
          height="auto"
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
        />
      </Paper>
    </Box>
  )
}

export default TrainingCalendar
