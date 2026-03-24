// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import { Dashboard } from './dashboard';
import NxWelcome from './nx-welcome';
import { Login } from './pages/login-page';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
