
import React, { useState } from 'react';
import { Calendar, Settings, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'today' | 'someday';
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', text: 'Buy X and rename it Twitter', completed: false, category: 'today' },
    { id: '2', text: 'Make X Post', completed: false, category: 'today' },
    { id: '3', text: 'Call Elon', completed: false, category: 'today' },
    { id: '4', text: 'Do Client Works', completed: false, category: 'someday' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [currentCategory, setCurrentCategory] = useState<'today' | 'someday'>('today');

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        category: currentCategory,
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const getTodayTasks = () => tasks.filter(task => task.category === 'today');
  const getSomedayTasks = () => tasks.filter(task => task.category === 'someday');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="w-8" /> {/* Spacer */}
          <div className="relative">
            <input
              type="text"
              placeholder="Add a task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-64 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
            />
            <button
              onClick={addTask}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Settings size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Today's Tasks */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-lg shadow-gray-200/50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-gray-600" />
              <h2 className="text-gray-600 font-medium">today</h2>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                {getTodayTasks().length}
              </span>
            </div>
            <AnimatePresence>
              {getTodayTasks().map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group flex items-center gap-3 py-2"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${task.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 group-hover:border-gray-400'}`}
                  >
                    {task.completed && <Check size={12} />}
                  </button>
                  <span className={`flex-1 transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Someday Tasks */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-gray-600" />
              <h2 className="text-gray-600 font-medium">someday</h2>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                {getSomedayTasks().length}
              </span>
            </div>
            <AnimatePresence>
              {getSomedayTasks().map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="group flex items-center gap-3 py-2"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                      ${task.completed 
                        ? 'border-green-500 bg-green-500 text-white' 
                        : 'border-gray-300 group-hover:border-gray-400'}`}
                  >
                    {task.completed && <Check size={12} />}
                  </button>
                  <span className={`flex-1 transition-all ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
