import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { Dialog, DialogActions, DialogTitle, IconButton, Tooltip, Button } from '@mui/material'
import CustomerForm from './CustomerForm'
import type { Customer, NewCustomer } from '../types'

type EditCustomerProps = {
  customer: Customer
  handleUpdate: (url: string, customer: NewCustomer) => void
}

function EditCustomer({ customer, handleUpdate }: EditCustomerProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<NewCustomer>({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: '',
  })

  const handleOpen = () => {
    setValue({
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phone: customer.phone,
      streetaddress: customer.streetaddress ?? '',
      postcode: customer.postcode ?? '',
      city: customer.city ?? '',
    })
    setOpen(true)
  }

  const selfUrl = customer._links?.self?.href

  const handleSubmit = () => {
    if (!selfUrl) {
      return
    }
    handleUpdate(selfUrl, value)
    setOpen(false)
  }

  return (
    <>
      <Tooltip title="Edit customer">
        <IconButton size="small" onClick={handleOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Customer</DialogTitle>
        <CustomerForm customer={value} setCustomer={setValue} />
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

export default EditCustomer
