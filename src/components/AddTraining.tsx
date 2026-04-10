import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { Customer, NewTraining } from '../types'

type AddTrainingProps = {
  customers: Customer[]
  handleAdd: (training: NewTraining) => void
}

function AddTraining({ customers, handleAdd }: AddTrainingProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [activity, setActivity] = useState('')
  const [duration, setDuration] = useState(60)
  const [customerUrl, setCustomerUrl] = useState('')

  const handleSubmit = () => {
    if (!date || !customerUrl || !activity.trim()) {
      return
    }

    handleAdd({
      activity: activity.trim(),
      duration,
      date: date.toISOString(),
      customer: customerUrl,
    })
    setOpen(false)
    setActivity('')
    setDuration(60)
    setCustomerUrl('')
    setDate(dayjs())
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Training
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Training</DialogTitle>
        <DialogContent sx={{ pt: 1, display: 'grid', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date and time"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          <TextField label="Activity" value={activity} onChange={(event) => setActivity(event.target.value)} />
          <TextField
            label="Duration (min)"
            type="number"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
          />
          <TextField
            select
            label="Customer"
            value={customerUrl}
            onChange={(event) => setCustomerUrl(event.target.value)}
          >
            {customers.map((customer) => {
              const url = customer._links?.self?.href
              if (!url) {
                return null
              }
              return (
                <MenuItem key={url} value={url}>
                  {`${customer.firstname} ${customer.lastname}`}
                </MenuItem>
              )
            })}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTraining
