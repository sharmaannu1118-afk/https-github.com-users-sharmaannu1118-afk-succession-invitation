import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CRMProvider } from './context/CRMContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Contacts from './pages/Contacts';
import Leads from './pages/Leads';
import Candidates from './pages/Candidates';
import Jobs from './pages/Jobs';
import Placements from './pages/Placements';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Search from './pages/Search';

export default function App() {
  return (
    <CRMProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/"            element={<Dashboard />} />
            <Route path="/clients"     element={<Clients />} />
            <Route path="/contacts"    element={<Contacts />} />
            <Route path="/leads"       element={<Leads />} />
            <Route path="/candidates"  element={<Candidates />} />
            <Route path="/jobs"        element={<Jobs />} />
            <Route path="/placements"  element={<Placements />} />
            <Route path="/activities"  element={<Activities />} />
            <Route path="/reports"     element={<Reports />} />
            <Route path="/search"      element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CRMProvider>
  );
}
