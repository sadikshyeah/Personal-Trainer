import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import TrainingDialogForm from './TrainingDialogForm'
import { emptyTrainingForm, type TrainingFormValue } from './trainingFormState'
import type { Customer, NewTraining } from '../types'

type AddTrainingProps = {
  customers: Customer[]
  handleAdd: (training: NewTraining) => void
}

function AddTraining({ customers, handleAdd }: AddTrainingProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TrainingFormValue>(() => emptyTrainingForm())

  const handleSubmit = () => {
    const { date, activity, duration, customerUrl } = form
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
    setForm(emptyTrainingForm())
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Training
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Training</DialogTitle>
        <TrainingDialogForm value={form} setValue={setForm} customers={customers} />
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddTraining
