import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { MatchesPage } from './pages/MatchesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { StandingsPage } from './pages/StandingsPage';

export const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<StandingsPage />} />
      <Route path="spiele" element={<MatchesPage />} />
      <Route path="spiele/:matchId" element={<MatchDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);
