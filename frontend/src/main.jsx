import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import Terms from './pages/Terms.jsx'
import Privacy from './pages/Privacy.jsx'
import Usage from './pages/Usage.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Features from './pages/Features.jsx'
import Testimonials from './pages/Testimonials.jsx'
import About from './pages/About.jsx'
import Brokers from './pages/Brokers.jsx'
import FAQ from './pages/FAQ.jsx'
import Support from './pages/Support.jsx'
import Pricing from './pages/Pricing.jsx'
import Contact from './pages/Contact.jsx'
import Partners from './pages/Partners.jsx'
import Blog from './pages/Blog.jsx'
import Careers from './pages/Careers.jsx'
import Security from './pages/Security.jsx'
import Home from './pages/Home.jsx'
import BrokerRequest from './pages/BrokerRequest.jsx'
import Admin from './pages/Admin.jsx'
import Owqerioeqwirjoweiorioqwerioqwerijower from './pages/owqerioeqwirjoweiorioqwerioqwerijower.jsx'
import Chat from './pages/Chat.jsx'
import Compensation from './pages/Compensation.jsx'
import NotFound from './pages/NotFound.jsx'
import ChatNotFound from './pages/ChatNotFound.jsx'
import TicketNotFound from './pages/TicketNotFound.jsx'
import Ticket from './pages/Ticket.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'how', element: <HowItWorks /> },
      { path: 'features', element: <Features /> },
      { path: 'security', element: <Security /> },
      { path: 'testimonials', element: <Testimonials /> },
      { path: 'terms', element: <Terms /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'usage', element: <Usage /> },
      { path: 'about', element: <About /> },
      { path: 'partners', element: <Partners /> },
      { path: 'brokers', element: <Brokers /> },
      { path: 'blog', element: <Blog /> },
      { path: 'careers', element: <Careers /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'support', element: <Support /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'contact', element: <Contact /> },
      { path: 'broker-request', element: <BrokerRequest /> },
      { path: 'qwiejqijweqiowjeijoqwejio', element: <Admin /> },
      { path: 'owqerioeqwirjoweiorioqwerioqwerijower', element: <Owqerioeqwirjoweiorioqwerioqwerijower /> },
      { path: 'chat', element: <Chat /> },
      { path: 'compensation', element: <Compensation /> },
      { path: 'ticket', element: <Ticket /> },
      { path: 'chat-not-found', element: <ChatNotFound /> },
      { path: 'ticket-not-found', element: <TicketNotFound /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)
