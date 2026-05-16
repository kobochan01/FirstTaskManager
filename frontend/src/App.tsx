import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SearchResultsPage from './pages/SearchResultsPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<BoardListPage />} />
        <Route path="/boards/:boardId" element={<BoardDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
      </Routes>
    </div>
  );
}
