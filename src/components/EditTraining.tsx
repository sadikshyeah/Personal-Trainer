import { useState } from 'react'
import dayjs from 'dayjs'
import EditIcon from '@mui/icons-material/Edit'
import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip } from '@mui/material'
import TrainingDialogForm from './TrainingDialogForm'
import { emptyTrainingForm, type TrainingFormValue } from './trainingFormState'
import type { Customer, NewTraining, Training } from '../types'

type EditTrainingProps = {
  training: Training
  customers: Customer[]
  handleUpdate: (url: string, training: NewTraining) => void
}

function EditTraining({ training, customers, handleUpdate }: EditTrainingProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TrainingFormValue>(() => emptyTrainingForm())

  const handleOpen = () => {
    // show this row's data in the form
    setForm({
      date: dayjs(training.date),
      activity: training.activity,
      duration: training.duration,
      customerUrl: training._links?.customer?.href ?? '',
    })
    setOpen(true)
  }

  const selfUrl = training._links?.self?.href // which training to update

  const handleSubmit = () => {
    const { date, activity, duration, customerUrl } = form
    if (!selfUrl || !date || !customerUrl || !activity.trim()) {
      return
    }

    handleUpdate(selfUrl, {
      activity: activity.trim(),
      duration,
      date: date.toISOString(),
      customer: customerUrl,
    })
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="Edit training">
        <IconButton size="small" onClick={handleOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Training</DialogTitle>
        <TrainingDialogForm value={form} setValue={setForm} customers={customers} />
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selfUrl}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditTraining
