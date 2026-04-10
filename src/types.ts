export type Customer = {
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress?: string
  postcode?: string
  city?: string
  _links?: {
    self?: {
      href: string
    }
  }
}

export type Training = {
  activity: string
  duration: number
  date: string
  customer?: {
    firstname: string
    lastname: string
  }
  _links?: {
    self?: {
      href: string
    }
    customer?: {
      href: string
    }
  }
}
export type NewCustomer = {
  firstname: string
  lastname: string
  email: string
  phone: string
  streetaddress: string
  postcode: string
  city: string
}

export type NewTraining = {
  activity: string
  duration: number
  date: string
  customer: string
}

