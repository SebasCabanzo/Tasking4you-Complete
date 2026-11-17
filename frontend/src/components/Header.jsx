import { Search, Bell, Sun, Moon } from 'lucide-react';

function Header({ searchTerm, setSearchTerm, theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="header">
      <div className="header-greeting">
        <span>ESPACIO PERSONAL</span>
        <h2>Mi tablero</h2>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <Search size={19} />
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="header-icon"
          type="button"
          aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          title={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
          onClick={onToggleTheme}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="header-icon notification-button"
          type="button"
          aria-label="Notificaciones"
          title="Notificaciones"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
