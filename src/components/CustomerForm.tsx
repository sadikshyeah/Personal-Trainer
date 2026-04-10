import { Box, TextField } from '@mui/material'
import type { Dispatch, SetStateAction } from 'react'
import type { NewCustomer } from '../types'

type CustomerFormProps = {
  customer: NewCustomer
  setCustomer: Dispatch<SetStateAction<NewCustomer>>
}

function CustomerForm({ customer, setCustomer }: CustomerFormProps) {
  return (
    <Box sx={{ px: 3, pt: 1, display: 'grid', gap: 1.5 }}>
      <TextField
        label="First name"
        value={customer.firstname}
        onChange={(event) => setCustomer((prev) => ({ ...prev, firstname: event.target.value }))}
      />
      <TextField
        label="Last name"
        value={customer.lastname}
        onChange={(event) => setCustomer((prev) => ({ ...prev, lastname: event.target.value }))}
      />
      <TextField
        label="Email"
        value={customer.email}
        onChange={(event) => setCustomer((prev) => ({ ...prev, email: event.target.value }))}
      />
      <TextField
        label="Phone"
        value={customer.phone}
        onChange={(event) => setCustomer((prev) => ({ ...prev, phone: event.target.value }))}
      />
      <TextField
        label="Street address"
        value={customer.streetaddress}
        onChange={(event) => setCustomer((prev) => ({ ...prev, streetaddress: event.target.value }))}
      />
      <TextField
        label="Postcode"
        value={customer.postcode}
        onChange={(event) => setCustomer((prev) => ({ ...prev, postcode: event.target.value }))}
      />
      <TextField
        label="City"
        value={customer.city}
        onChange={(event) => setCustomer((prev) => ({ ...prev, city: event.target.value }))}
      />
    </Box>
  )
}

export default CustomerForm
