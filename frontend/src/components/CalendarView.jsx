import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, CheckCircle2, Clock3 } from 'lucide-react';

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}

function CalendarView({ tasks }) {
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()));

  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, monthIndex, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    return [
      ...Array(offset).fill(null),
      ...Array.from({ length: totalDays }, (_, index) => index + 1)
    ];
  }, [year, monthIndex]);

  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach((task) => {
      if (!task.due_date) return;
      const key = String(task.due_date).slice(0, 10);
      grouped[key] = [...(grouped[key] || []), task];
    });
    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] || [];

  const changeMonth = (amount) => {
    setMonth(new Date(year, monthIndex + amount, 1));
  };

  return (
    <section className="calendar-view">
      <div className="calendar-panel">
        <div className="calendar-heading">
          <div>
            <span className="calendar-eyebrow">PLANIFICACIÓN</span>
            <h2>
              {new Intl.DateTimeFormat('es-CO', {
                month: 'long',
                year: 'numeric'
              }).format(month)}
            </h2>
            <p>Consulta tus actividades según su fecha límite.</p>
          </div>
          <div className="calendar-navigation">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => {
              const today = new Date();
              setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
              setSelectedDate(dateKey(today));
            }}>
              Hoy
            </button>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekdays.map((day) => (
            <div className="calendar-weekday" key={day}>{day}</div>
          ))}
          {days.map((day, index) => {
            if (!day) return <div className="calendar-day empty" key={`empty-${index}`} />;

            const key = dateKey(new Date(year, monthIndex, day));
            const dayTasks = tasksByDate[key] || [];
            const isToday = key === dateKey(new Date());
            const isSelected = key === selectedDate;

            return (
              <button
                type="button"
                key={key}
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayTasks.length ? 'has-tasks' : ''}`}
                onClick={() => setSelectedDate(key)}
              >
                <span>{day}</span>
                {dayTasks.length > 0 && (
                  <span className="calendar-day-indicator">
                    {dayTasks.length} {dayTasks.length === 1 ? 'actividad' : 'actividades'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="calendar-legend">
          <span><i className="legend-today" /> Hoy</span>
          <span><i className="legend-task" /> Tiene actividades</span>
        </div>
      </div>

      <aside className="calendar-agenda">
        <div className="agenda-heading">
          <CalendarDays size={22} />
          <div>
            <h3>Agenda del día</h3>
            <p>{formatDate(selectedDate)}</p>
          </div>
        </div>

        {selectedTasks.length === 0 ? (
          <div className="agenda-empty">
            <CalendarDays size={30} />
            <strong>Día disponible</strong>
            <p>No tienes actividades con fecha límite para este día.</p>
          </div>
        ) : (
          <div className="agenda-list">
            {selectedTasks.map((task) => (
              <article className="agenda-task" key={task.id}>
                <div className="agenda-task-icon">
                  {task.done ? <CheckCircle2 size={19} /> : <Clock3 size={19} />}
                </div>
                <div>
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  <span className={task.done ? 'agenda-done' : 'agenda-pending'}>
                    {task.done ? 'Completada' : 'Pendiente'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </aside>
    </section>
  );
}

export default CalendarView;
