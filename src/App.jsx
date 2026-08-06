import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { RouteProgress } from './components/common/RouteProgress';

const baseUrl = import.meta.env.BASE_URL;
const basename = baseUrl === '/' ? '/' : baseUrl.replace(/\/$/, '');

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter basename={basename}><RouteProgress /><AppRoutes /></BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
