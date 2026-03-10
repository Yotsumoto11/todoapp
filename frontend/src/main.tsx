import { createRoot } from 'react-dom/client'
import { TaskListPage } from './pages/TaskListPage'

const rootElement = document.getElementById('root')

if (rootElement) {
  createRoot(rootElement).render(<TaskListPage />)
}