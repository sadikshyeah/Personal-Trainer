import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Box, Paper, TextField, Typography } from '@mui/material'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import type { Training } from '../types'

type TrainingListProps = {
  trainings: Training[]
}

function TrainingList({ trainings }: TrainingListProps) {
  const [search, setSearch] = useState('')

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
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography variant="h6">Training List</Typography>
        <TextField
          size="small"
          label="Search trainings"
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
            sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
          }}
        />
      </Paper>
    </Box>
  )
}

export default TrainingList
