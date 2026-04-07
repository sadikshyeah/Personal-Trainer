export type Customer = {
  firstname: string
  lastname: string
  email: string
  phone: string
}

export type Training = {
  activity: string
  duration: number
  date: string
  customer?: {
    firstname: string
    lastname: string
  }
}
