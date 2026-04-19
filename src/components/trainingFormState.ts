import dayjs, { type Dayjs } from 'dayjs'

export type TrainingFormValue = {
  date: Dayjs | null
  activity: string
  duration: number
  customerUrl: string
}

export function emptyTrainingForm(): TrainingFormValue {
  return {
    date: dayjs(),
    activity: '',
    duration: 60,
    customerUrl: '',
  }
}
