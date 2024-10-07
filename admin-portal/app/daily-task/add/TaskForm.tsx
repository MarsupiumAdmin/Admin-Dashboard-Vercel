import { useState } from 'react';
import Link from 'next/link';

interface TaskFormProps {
  onSubmit: (taskTitle: string, amountReward: string, amountPoint: string, type: string) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [amountReward, setAmountReward] = useState('');
  const [amountPoint, setAmountPoint] = useState('');
  const [type, setType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call the parent onSubmit function with the form values
    await onSubmit(taskTitle, amountReward, amountPoint, type);

    // Reset form fields after submission
    setTaskTitle('');
    setAmountReward('');
    setAmountPoint('');
    setType('');
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="mb-4">
        <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          id="taskTitle"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="amountReward" className="block text-sm font-medium text-gray-700 mb-1">
          Amount Reward
        </label>
        <input
          type="number"
          id="amountReward"
          value={amountReward}
          onChange={(e) => setAmountReward(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter amount reward"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="amountPoint" className="block text-sm font-medium text-gray-700 mb-1">
          Amount Point
        </label>
        <input
          type="number"
          id="amountPoint"
          value={amountPoint}
          onChange={(e) => setAmountPoint(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter amount point"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <input
          type="text"
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter type"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 mt-auto">
        <Link
          href="/daily-task"
          className="px-4 py-2 border bg-[#FF5454] border-gray-300 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 ${isSubmitting ? 'bg-gray-400' : 'bg-[#43CDC4]'} text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
