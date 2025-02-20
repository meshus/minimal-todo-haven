
import React, { useState, useEffect } from 'react';
import { Calendar, Settings, Plus, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'today' | 'someday';
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [currentCategory, setCurrentCategory] = useState<'today' | 'someday'>('today');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "There was a problem loading your tasks. Please try refreshing the page.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast({
        title: "Error saving tasks",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
        category: currentCategory,
      };
      setTasks([...tasks, task]);
      setNewTask('');
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, completed: !task.completed };
        toast({
          title: updatedTask.completed ? "Task completed" : "Task uncompleted",
          description: updatedTask.text,
        });
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: taskToDelete?.text,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const switchCategory = (category: 'today' | 'someday') => {
    setCurrentCategory(category);
    setNewTask('');
  };

  const getTodayTasks = () => tasks.filter(task => task.category === 'today');
  const getSomedayTasks = () => tasks.filter(task => task.category === 'someday');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => switchCategory('today')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentCategory === 'today'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => switchCategory('someday')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentCategory === 'someday'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Someday
            </button>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Settings size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder={`Add a ${currentCategory} task...`}
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          />
          <button
            onClick={addTask}
            disabled={!newTask.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
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
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {getTodayTasks().length === 0 && (
              <div className="text-gray-400 text-sm text-center py-2">
                No tasks for today
              </div>
            )}
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
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {getSomedayTasks().length === 0 && (
              <div className="text-gray-400 text-sm text-center py-2">
                No tasks for someday
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
