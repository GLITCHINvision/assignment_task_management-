'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CornerDownRight, AlignLeft, ShieldCheck, Shield, ShieldAlert } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
}

interface Props {
  onSuccess: () => void;
  editTask: Task | null;
  onCancel: () => void;
}

const PRIORITY_OPTIONS = [
  { id: 'LOW', label: 'Low', icon: ShieldCheck, color: 'var(--low)' },
  { id: 'MEDIUM', label: 'Medium', icon: Shield, color: 'var(--medium)' },
  { id: 'HIGH', label: 'High', icon: ShieldAlert, color: 'var(--high)' },
];

export default function TaskForm({ onSuccess, editTask, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      setPriority(editTask.priority || 'MEDIUM');
    } else {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    }
  }, [editTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editTask) {
        await api.patch(`/tasks/${editTask.id}`, { title, description, priority });
        toast.success('System Updated');
      } else {
        await api.post('/tasks', { title, description, priority });
        toast.success('Objective Added');
      }
      onSuccess();
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    } catch (error) {
      toast.error('Failed to save objective');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '4rem', maxWidth: '800px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500', color: 'var(--text-muted)' }}>
          {editTask ? 'Re-define Objective' : 'New Objective'}
        </h2>
        {editTask && (
          <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} className="subtle-hover">
            <X size={16} />
          </button>
        )}
      </header>
      
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Objective Title..."
          className="input-field"
          style={{ fontSize: '1.5rem', fontWeight: '300', color: 'var(--primary)' }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', marginTop: '8px' }}>
          <CornerDownRight size={14} style={{ marginTop: '12px' }} />
          <textarea
            placeholder="Add specific details or sub-tasks..."
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ fontSize: '0.9rem', minHeight: '60px', padding: '12px' }}
          />
        </div>

        {/* Unique & Professional Priority Controller */}
        <div style={{ marginTop: '2.5rem', paddingLeft: '24px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>
            Priority Magnitude
          </span>
          
          <div style={{ 
            display: 'inline-flex', 
            background: 'rgba(255, 255, 255, 0.5)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)',
            padding: '4px',
            borderRadius: '12px',
            position: 'relative',
            gap: '4px'
          }}>
            {PRIORITY_OPTIONS.map((opt) => {
              const isActive = priority === opt.id;
              const Icon = opt.icon;
              
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPriority(opt.id)}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    color: isActive ? opt.color : 'var(--text-muted)',
                    transition: 'color 0.3s ease',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{opt.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="priority-bg"
                      className="priority-selector-bg"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: `0 4px 12px ${opt.color}20`,
                        border: `1px solid ${opt.color}40`,
                        zIndex: -1
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <button type="submit" className="primary-btn">
          {editTask ? 'Update System' : 'Commit Objective'}
        </button>
      </div>
    </form>
  );
}
