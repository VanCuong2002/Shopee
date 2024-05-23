import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import 'src/i18n/i18n'
import App from 'src/App'
import 'src/assets/css/index.css'
import { AppProvider } from 'src/contexts/app.context'
import ErrorBoundary from 'src/components/ErrorBoundary/ErrorBoundary'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 0
        }
    }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <AppProvider>
                        <ErrorBoundary>
                            <App />
                        </ErrorBoundary>
                    </AppProvider>
                </QueryClientProvider>
            </HelmetProvider>
        </BrowserRouter>
    </React.StrictMode>
)
