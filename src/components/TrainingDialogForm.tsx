import type { Dispatch, SetStateAction } from 'react'
import { DialogContent, MenuItem, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { TrainingFormValue } from './trainingFormState'
import type { Customer } from '../types'

type TrainingDialogFormProps = {
  value: TrainingFormValue
  setValue: Dispatch<SetStateAction<TrainingFormValue>>
  customers: Customer[]
}

function TrainingDialogForm({ value, setValue, customers }: TrainingDialogFormProps) {
  return (
    <DialogContent sx={{ pt: 1, display: 'grid', gap: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          label="Date and time"
          value={value.date}
          onChange={(newValue) => setValue((prev) => ({ ...prev, date: newValue }))}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </LocalizationProvider>
      <TextField
        label="Activity"
        value={value.activity}
        onChange={(event) => setValue((prev) => ({ ...prev, activity: event.target.value }))}
      />
      <TextField
        label="Duration (min)"
        type="number"
        value={value.duration}
        onChange={(event) => setValue((prev) => ({ ...prev, duration: Number(event.target.value) }))}
      />
      {/* value is the customer's link from the api */}
      <TextField
        select
        label="Customer"
        value={value.customerUrl}
        onChange={(event) => setValue((prev) => ({ ...prev, customerUrl: event.target.value }))}
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
  )
}

export default TrainingDialogForm
