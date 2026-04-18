// Training sessions grid: filter, add, delete (customer picked from loaded list).
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid'
import AddTraining from './AddTraining'
import ConfirmDialog from './ConfirmDialog'
import EditTraining from './EditTraining'
import type { Customer, NewTraining, Training } from '../types'

type TrainingListProps = {
  trainings: Training[]
  customers: Customer[]
  handleAdd: (training: NewTraining) => void
  handleUpdate: (url: string, training: NewTraining) => void
  handleDelete: (url: string) => void
}

function TrainingList({ trainings, customers, handleAdd, handleUpdate, handleDelete }: TrainingListProps) {
  const [search, setSearch] = useState('')
  const [deleteUrl, setDeleteUrl] = useState('')

  const filteredTrainings = useMemo<Training[]>(() => {
    // Filter by activity, customer name, and duration text from one search box.
    const query = search.trim().toLowerCase()
    return trainings.filter((training) => {
      const customerName = `${training.customer?.firstname ?? ''} ${training.customer?.lastname ?? ''}`
      if (!query) {
        return true
      }

      return [training.activity, customerName, training.duration.toString()]
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [search, trainings])

  const rows = useMemo(
    () =>
      filteredTrainings.map((training, index) => ({
        ...training,
        id: `${training.activity}-${training.date}-${index}`,
        // Flatten nested customer object so DataGrid can bind it as a column field.
        customerName: `${training.customer?.firstname ?? ''} ${training.customer?.lastname ?? ''}`.trim(),
      })),
    [filteredTrainings],
  )

  const columns: GridColDef[] = [
    { field: 'activity', headerName: 'Activity', flex: 1, minWidth: 150 },
    { field: 'duration', headerName: 'Duration (min)', type: 'number', flex: 1, minWidth: 130 },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1.2,
      minWidth: 180,
      valueFormatter: (value) => dayjs(value).format('DD.MM.YYYY HH:mm'),
    },
    { field: 'customerName', headerName: 'Customer', flex: 1.2, minWidth: 190 },
    {
      field: 'edit',
      headerName: 'Edit',
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      minWidth: 80,
      renderCell: (params: GridRenderCellParams) => (
        <EditTraining training={params.row as Training} customers={customers} handleUpdate={handleUpdate} />
      ),
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
        <Tooltip title="Delete training">
          <IconButton color="error" size="small" onClick={() => setDeleteUrl((params.row as Training)._links?.self?.href ?? '')}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6">Training List</Typography>
        <Stack direction="row" gap={1}>
          <TextField
            size="small"
            label="Search trainings"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <AddTraining customers={customers} handleAdd={handleAdd} />
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
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
        />
      </Paper>
      <ConfirmDialog
        open={Boolean(deleteUrl)}
        title="Delete training?"
        message="Are you sure you want to delete this training?"
        onCancel={() => setDeleteUrl('')}
        onConfirm={() => {
          handleDelete(deleteUrl)
          setDeleteUrl('')
        }}
      />
    </Box>
  )
}

export default TrainingList
