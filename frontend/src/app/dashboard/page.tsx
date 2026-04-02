'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import TaskItem from '@/components/TaskItem';
import TaskForm from '@/components/TaskForm';
import { Search, LogOut, SlidersHorizontal, ArrowLeft, ArrowRight, Activity, Target, Zap } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEdit = (task: Task) => {
    setEditTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    
    const highPriorityCount = tasks.filter(t => t.priority === 'HIGH' && t.status === 'PENDING').length;

    return { completed, pending, completionRate, highPriorityCount };
  }, [tasks, total]);

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '10rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6rem' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '200', letterSpacing: '-0.03em', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            {user?.name || 'My Tasks'}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '500' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button onClick={logout} style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          color: 'var(--text-muted)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em' 
        }} className="subtle-hover">
          <LogOut size={14} /> Exit System
        </button>
      </header>

      {/* Pro Analytics Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={14} color="var(--primary)" />
            <span className="stat-value">{total}</span>
          </div>
          <span className="stat-label">Objectives</span>
        </div>
        <div className="stat-item" style={{ color: stats.highPriorityCount > 0 ? 'var(--high)' : 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={14} color={stats.highPriorityCount > 0 ? 'var(--high)' : 'var(--text-muted)'} />
            <span className="stat-value" style={{ color: stats.highPriorityCount > 0 ? 'var(--high)' : 'inherit' }}>{stats.highPriorityCount}</span>
          </div>
          <span className="stat-label">Critical Path</span>
        </div>
        <div className="stat-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} color="var(--success)" />
            <span className="stat-value" style={{ color: 'var(--success)' }}>{stats.completionRate}%</span>
          </div>
          <span className="stat-label">Efficiency</span>
        </div>
        <div className="stat-item" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
            <span className="stat-label" style={{ margin: 0 }}>Progress Stream</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--success)' }}>{stats.completionRate}%</span>
          </div>
          <div className="progress-line-container">
            <div className="progress-line-fill" style={{ width: `${stats.completionRate}%`, background: 'var(--success)' }}></div>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: '850px', margin: '0 auto' }}>
        <TaskForm onSuccess={() => { fetchTasks(); setEditTask(null); }} editTask={editTask} onCancel={() => setEditTask(null)} />
        
        <div style={{ marginTop: '8rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search index..."
                className="input-field"
                style={{ marginBottom: 0, borderBottom: 'none', padding: '4px 12px', background: 'transparent' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <SlidersHorizontal size={14} color="var(--text-muted)" />
              <select
                className="input-field"
                style={{ width: 'auto', marginBottom: 0, borderBottom: 'none', padding: '4px 8px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', background: 'transparent' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status: All</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Processed</option>
              </select>
            </div>
          </div>

          <div className="minimalist-list">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', fontWeight: '200' }}>Accessing data stream...</p>
            ) : tasks.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onRefresh={fetchTasks} onEdit={handleEdit} />
                ))}
              </AnimatePresence>
            ) : (
              <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '200', borderBottom: '1px solid var(--border)' }}>
                System data state is currently zero.
              </div>
            )}
          </div>

          {total > 10 && (
            <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5rem', padding: '3rem 0', borderTop: '1px solid var(--border)', opacity: 0.5 }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ opacity: page === 1 ? 0.1 : 1, background: 'none', border: 'none', cursor: 'pointer' }} className="subtle-hover">
                <ArrowLeft size={18} />
              </button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Page {page} of {Math.ceil(total / 10)}</span>
              <button disabled={page * 10 >= total} onClick={() => setPage(p => p + 1)} style={{ opacity: page * 10 >= total ? 0.1 : 1, background: 'none', border: 'none', cursor: 'pointer' }} className="subtle-hover">
                <ArrowRight size={18} />
              </button>
            </footer>
          )}
        </div>
      </section>
    </div>
  );
}
