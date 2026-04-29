import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

type QuoteOfTheDay = {
  quote: string
  author: string
}

type CachedQuote = QuoteOfTheDay & {
  date: string
}

type ApiNinjasQuote = {
  quote?: string
  author?: string
  error?: string
}

const CACHE_KEY = 'motivation_quote_of_the_day'

const getTodayKey = () => new Date().toISOString().slice(0, 10)

// Read quote from localStorage so we can avoid calling the API repeatedly.
// If the cached quote is not from today, ignore it and fetch a fresh one.
const getCachedQuote = (): QuoteOfTheDay | null => {
  const cached = localStorage.getItem(CACHE_KEY)
  if (!cached) {
    return null
  }

  try {
    const parsed = JSON.parse(cached) as CachedQuote
    if (parsed.date !== getTodayKey()) {
      return null
    }
    return { quote: parsed.quote, author: parsed.author }
  } catch {
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

function MotivationOfDay() {
  const apiKey = import.meta.env.VITE_API_NINJAS_KEY
  const cachedQuote = getCachedQuote()
  const [quote, setQuote] = useState<QuoteOfTheDay | null>(cachedQuote)
  const [loading, setLoading] = useState(Boolean(apiKey) && !cachedQuote)
  const [error, setError] = useState(
    apiKey ? '' : 'Add VITE_API_NINJAS_KEY to your .env file to show a daily motivation quote.'
  )

  useEffect(() => {
    if (!apiKey || quote) {
      return
    }
    const today = getTodayKey()

    // Fetch one quote for today from API Ninjas.
    // On success, store it in state and cache it for the rest of the day.
    fetch('https://api.api-ninjas.com/v2/quoteoftheday', {
      headers: {
        'X-Api-Key': apiKey,
      },
    })
      .then(async (response) => {
        const payload = (await response.json()) as ApiNinjasQuote | ApiNinjasQuote[]
        if (!response.ok) {
          const detail = !Array.isArray(payload) && payload.error ? ` - ${payload.error}` : ''
          throw new Error(`Request failed: ${response.status}${detail}`)
        }
        return payload
      })
      .then((data: ApiNinjasQuote | ApiNinjasQuote[]) => {
        const item = Array.isArray(data) ? data[0] : data
        const nextQuote = {
          quote: item?.quote ?? 'Stay consistent. Small steps every day create big change.',
          author: item?.author ?? 'Unknown',
        }

        setQuote(nextQuote)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ...nextQuote, date: today }))
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(`Could not load today's motivation quote right now. ${message}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [apiKey, quote])

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Motivation of the Day
        </Typography>
        {/* Show one of three UI states: loading, error, or the quote card. */}
        {loading ? (
          <Typography color="text.secondary">Loading quote...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : quote ? (
          <>
            <Typography sx={{ fontStyle: 'italic' }}>"{quote.quote}"</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              - {quote.author}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">No quote available.</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default MotivationOfDay
