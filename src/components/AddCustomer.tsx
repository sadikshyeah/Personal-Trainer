import { useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'
import CustomerForm from './CustomerForm'
import type { NewCustomer } from '../types'

type AddCustomerProps = {
  handleAdd: (customer: NewCustomer) => void
}

const emptyCustomer: NewCustomer = {
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  streetaddress: '',
  postcode: '',
  city: '',
}

function AddCustomer({ handleAdd }: AddCustomerProps) {
  const [open, setOpen] = useState(false)
  const [customer, setCustomer] = useState<NewCustomer>(emptyCustomer)

  const handleSubmit = () => {
    handleAdd(customer)
    setOpen(false)
    setCustomer(emptyCustomer)
  }

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Customer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Customer</DialogTitle>
        <CustomerForm customer={customer} setCustomer={setCustomer} />
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddCustomer
