
import { useEffect, useState } from 'react'
import './App.css'
import CustomerList from './components/CustomerList.tsx'
import TrainingList from './components/TrainingList.tsx'
import { fetchCustomers, fetchTrainings } from './trainerapi.ts'
import type { Customer, Training } from './types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

function App() {
  const [activePage, setActivePage] = useState<'customers' | 'trainings'>('customers')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, trainingsData] = await Promise.all([fetchCustomers(), fetchTrainings()])
        setCustomers(customersData)
        setTrainings(trainingsData)
      } catch (error) {
        console.error('Failed to fetch customers or trainings', error)
      }
    }

    fetchData()
  }, [])

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Tabs
          value={activePage}
          onChange={(_event, nextValue: 'customers' | 'trainings') => setActivePage(nextValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Customers" value="customers" />
          <Tab label="Trainings" value="trainings" />
        </Tabs>

        <Box>
          {activePage === 'customers' ? <CustomerList customers={customers} /> : <TrainingList trainings={trainings} />}
        </Box>
      </Container>
    </>
  )
}

export default App
