import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import { GoogleProvider } from './context/GoogleContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Contacts from './pages/Contacts';
import Leads from './pages/Leads';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Search from './pages/Search';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';

export default function App() {
  return (
    <CRMProvider>
      <GoogleProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"            element={<Dashboard />} />
              <Route path="/clients"     element={<Clients />} />
              <Route path="/contacts"    element={<Contacts />} />
              <Route path="/leads"       element={<Leads />} />
              <Route path="/candidates"  element={<Candidates />} />
              <Route path="/jobs"        element={<Jobs />} />
              <Route path="/invoices"    element={<Invoices />} />
              <Route path="/activities"  element={<Activities />} />
              <Route path="/tasks"       element={<Tasks />} />
              <Route path="/reports"     element={<Reports />} />
              <Route path="/search"      element={<Search />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GoogleProvider>
    </CRMProvider>
  );
}
