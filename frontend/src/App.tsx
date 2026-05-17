import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<BoardListPage />} />
          <Route path="/boards/:boardId" element={<BoardDetailPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
      </main>
    </div>
  );
}
