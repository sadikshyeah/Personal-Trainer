
import { useEffect, useState } from 'react'
import './App.css'
import CustomerList from './components/CustomerList'
import TrainingCalendar from './components/TrainingCalendar'
import TrainingList from './components/TrainingList'
import TrainingStatistics from './components/TrainingStatistics'
import { addCustomer, deleteCustomer, fetchCustomers, updateCustomer } from './customerapi'
import { addTraining, deleteTraining, fetchTrainings, updateTraining } from './trainingapi'
import type { Customer, NewCustomer, NewTraining, Training } from './types'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

function App() {
  const [activePage, setActivePage] = useState<'customers' | 'trainings' | 'calendar' | 'statistics'>('customers')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [trainings, setTrainings] = useState<Training[]>([])

  const refreshData = async () => {
    try {
      const [customersData, trainingsData] = await Promise.all([fetchCustomers(), fetchTrainings()])
      setCustomers(customersData)
      setTrainings(trainingsData)
    } catch (error) {
      console.error('Failed to fetch customers or trainings', error)
    }
  }

  useEffect(() => {
    Promise.all([fetchCustomers(), fetchTrainings()])
      .then(([customersData, trainingsData]) => {
        setCustomers(customersData)
        setTrainings(trainingsData)
      })
      .catch((error) => {
        console.error('Failed to fetch customers or trainings', error)
      })
  }, [])

  const handleAddCustomer = async (customer: NewCustomer) => {
    await addCustomer(customer)
    await refreshData()
  }

  const handleUpdateCustomer = async (url: string, customer: NewCustomer) => {
    await updateCustomer(url, customer)
    await refreshData()
  }

  const handleDeleteCustomer = async (url: string) => {
    await deleteCustomer(url)
    await refreshData()
  }

  const handleAddTraining = async (training: NewTraining) => {
    await addTraining(training)
    await refreshData()
  }

  const handleUpdateTraining = async (url: string, training: NewTraining) => {
    await updateTraining(url, training)
    await refreshData()
  }

  const handleDeleteTraining = async (url: string) => {
    await deleteTraining(url)
    await refreshData()
  }

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
          onChange={(_event, nextValue: 'customers' | 'trainings' | 'calendar' | 'statistics') => setActivePage(nextValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Customers" value="customers" />
          <Tab label="Trainings" value="trainings" />
          <Tab label="Calendar" value="calendar" />
          <Tab label="Statistics" value="statistics" />
        </Tabs>

        <Box>
          {activePage === 'customers' ? (
            <CustomerList
              customers={customers}
              handleAdd={handleAddCustomer}
              handleUpdate={handleUpdateCustomer}
              handleDelete={handleDeleteCustomer}
            />
          ) : activePage === 'trainings' ? (
            <TrainingList
              trainings={trainings}
              customers={customers}
              handleAdd={handleAddTraining}
              handleUpdate={handleUpdateTraining}
              handleDelete={handleDeleteTraining}
            />
          ) : activePage === 'calendar' ? (
            <TrainingCalendar trainings={trainings} />
          ) : (
            <TrainingStatistics trainings={trainings} />
          )}
        </Box>
      </Container>
    </>
  )
}

export default App
