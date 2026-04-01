'use client';

import api from '@/lib/api';
import { toast } from 'sonner';
import { Trash2, CheckCircle2, Circle, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
}

interface Props {
  task: Task;
  onRefresh: () => void;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onRefresh, onEdit }: Props) {
  const toggleStatus = async () => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`);
      onRefresh();
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  const deleteTask = async () => {
    if (!confirm('Permanently remove this objective?')) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success('Objective Removed');
      onRefresh();
    } catch (error) {
      toast.error('Removal failed');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: task.status === 'COMPLETED' ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ x: 5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`minimalist-item ${task.priority === 'HIGH' && task.status !== 'COMPLETED' ? 'high-priority-item' : ''}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flex: 1 }}>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={toggleStatus}
          style={{
            color: task.status === 'COMPLETED' ? 'var(--success)' : 'var(--text-muted)',
            paddingTop: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {task.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </motion.button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className={`priority-badge badge-${task.priority.toLowerCase()}`}>
              <span className={`priority-dot priority-${task.priority.toLowerCase()}`}></span>
              {task.priority}
            </span>
          </div>
          <motion.h3
            animate={{
              color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--primary)',
              textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none',
            }}
            style={{
              fontSize: '1.15rem',
              fontWeight: '400',
            }}
          >
            {task.title}
          </motion.h3>
          {task.description && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', maxWidth: '650px', fontWeight: '300' }}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '2rem' }}>
        <button
          onClick={() => onEdit(task)}
          className="subtle-hover"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0 }}
        >
          <Edit3 size={15} />
        </button>
        <button
          onClick={deleteTask}
          className="subtle-hover"
          style={{ color: 'var(--error)', opacity: 0.6, background: 'none', border: 'none', padding: 0 }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </motion.div>
  );
}
