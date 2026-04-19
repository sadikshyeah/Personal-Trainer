import { useEffect, useState, type ReactNode } from 'react'
import './App.css'
import CustomerList from './components/CustomerList'
import TrainingCalendar from './components/TrainingCalendar'
import TrainingList from './components/TrainingList'
import TrainingStatistics from './components/TrainingStatistics'
import { addCustomer, deleteCustomer, fetchCustomers, updateCustomer } from './customerapi'
import { addTraining, deleteTraining, fetchTrainings, updateTraining } from './trainingapi'
import type { Customer, NewCustomer, NewTraining, Training } from './types'
import BarChartIcon from '@mui/icons-material/BarChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

type PageKey = 'customers' | 'trainings' | 'calendar' | 'statistics'

//drawer handling
const DRAWER_WIDTH = 260

const NAV_ITEMS: { key: PageKey; label: string; icon: ReactNode }[] = [
  { key: 'customers', label: 'Customers', icon: <PeopleIcon /> },
  { key: 'trainings', label: 'Trainings', icon: <FitnessCenterIcon /> },
  { key: 'calendar', label: 'Calendar', icon: <CalendarMonthIcon /> },
  { key: 'statistics', label: 'Statistics', icon: <BarChartIcon /> },
]

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activePage, setActivePage] = useState<PageKey>('customers')
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

  const goToPage = (page: PageKey) => {
    setActivePage(page)
    setDrawerOpen(false)
  }

  const drawer = (
    <Box sx={{ width: DRAWER_WIDTH }} role="presentation">
      <Toolbar>
        <Typography variant="subtitle1" fontWeight={600} noWrap component="div">
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.key} disablePadding>
            <ListItemButton selected={activePage === item.key} onClick={() => goToPage(item.key)}>
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="open navigation menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>

      <Container maxWidth="md" sx={{ mt: 4 }}>
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
