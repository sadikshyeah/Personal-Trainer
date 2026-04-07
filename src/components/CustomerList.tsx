import { useMemo, useState } from 'react'
import { Box, Paper, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { Customer } from '../types'

type CustomerListProps = {
  customers: Customer[]
}

function CustomerList({ customers }: CustomerListProps) {
  const [search, setSearch] = useState('')

  const filteredCustomers = useMemo<Customer[]>(() => {
    // Client-side filtering keeps the UI responsive for small/medium datasets.
    const query = search.trim().toLowerCase()
    return customers.filter((customer) => {
      if (!query) {
        return true
      }

      return [customer.firstname, customer.lastname, customer.email, customer.phone]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [customers, search])

  const rows = useMemo(
    // DataGrid expects a stable unique id per row.
    () => filteredCustomers.map((customer, index) => ({ ...customer, id: `${customer.email}-${index}` })),
    [filteredCustomers],
  )

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First Name', flex: 1, minWidth: 160 },
    { field: 'lastname', headerName: 'Last Name', flex: 1, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 240 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 160 },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6">Customer List</Typography>
        <TextField
          size="small"
          label="Search customers"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Box>

      <Paper variant="outlined" sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
            sorting: { sortModel: [{ field: 'firstname', sort: 'asc' }] },
          }}
        />
      </Paper>
    </Box>
  )
}

export default CustomerList
