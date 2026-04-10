
import { useMemo, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import AddCustomer from './AddCustomer'
import ConfirmDialog from './ConfirmDialog'
import EditCustomer from './EditCustomer'
import type { Customer, NewCustomer } from '../types'


type CustomerListProps = {
    customers: Customer[]
    handleAdd: (customer: NewCustomer) => void
    handleUpdate: (url: string, customer: NewCustomer) => void
    handleDelete: (url: string) => void
}

function CustomerList({ customers, handleAdd, handleDelete, handleUpdate }: CustomerListProps) {
    const [search, setSearch] = useState('')
    const [deleteUrl, setDeleteUrl] = useState('')

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
        {
            field: 'edit',
            headerName: 'Edit',
            sortable: false,
            filterable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 80,
            renderCell: (params: GridRenderCellParams) => <EditCustomer customer={params.row as Customer} handleUpdate={handleUpdate} />,
        },
        {
            field: 'delete',
            headerName: 'Delete',
            sortable: false,
            filterable: false,
            align: 'center',
            headerAlign: 'center',
            minWidth: 90,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title="Delete customer">
                    <IconButton
                        color="error"
                        size="small"
                        onClick={() => setDeleteUrl((params.row as Customer)._links?.self?.href ?? '')}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6">Customer List</Typography>
        <Stack direction="row" gap={1}>
          <TextField
            size="small"
            label="Search customers"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <AddCustomer handleAdd={handleAdd} />
        </Stack>
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
       <ConfirmDialog
        open={Boolean(deleteUrl)}
        title="Delete customer?"
        message="Are you sure you want to delete this customer?"
        onCancel={() => setDeleteUrl('')}
        onConfirm={() => {
          handleDelete(deleteUrl)
          setDeleteUrl('')
        }}
      />
    </Box>
  )
}

export default CustomerList
