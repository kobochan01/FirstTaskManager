import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="app-title">FirstTaskManager</Link>
      <SearchBar />
    </header>
  );
}
