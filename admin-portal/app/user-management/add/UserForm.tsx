import { Link } from 'lucide-react';
import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (user: string, email: string, balance: string, saving: string, goal: string, createdAt: string, password: string) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [balance, setBalance] = useState('');
  const [saving, setSaving] = useState('');
  const [goal, setGoal] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await onSubmit(user, email, balance, saving, goal, createdAt, password );

    setBalance('');
    setEmail('');
    setBalance('');
    setSaving('');
    setGoal('');
    setCreatedAt('');
    setPassword('');


    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="mb-4">
        <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
          User
        </label>
        <input
          type="text"
          id="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter user name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter password"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="balance" className="block text-sm font-medium text-gray-700 mb-1">
          Balance
        </label>
        <input
          id="balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter balance"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="saving" className="block text-sm font-medium text-gray-700 mb-1">
          Saving
        </label>
        <input
          id="saving"
          value={saving}
          onChange={(e) => setSaving(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter saving"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
          Goal
        </label>
        <input
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter goal"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 mt-auto">
        <Link
          href="/user-management"
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
