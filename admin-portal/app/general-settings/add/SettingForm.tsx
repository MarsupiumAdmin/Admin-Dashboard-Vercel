import { useState } from 'react';

interface TaskFormProps {
  onSubmit: (settingName: string, settingCode: string, description: string) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [settingName, setSettingName] = useState('');
  const [settingCode, setSettingCode] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settingName, settingCode, description);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="mb-4">
        <label htmlFor="settingName" className="block text-sm font-medium text-gray-700 mb-1">
          Setting Name
        </label>
        <input
          type="text"
          id="settingName"
          value={settingName}
          onChange={(e) => setSettingName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter Setting Name"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="settingCode" className="block text-sm font-medium text-gray-700 mb-1">
          Setting Code
        </label>
        <input
          type="number"
          id="settingCode"
          value={settingCode}
          onChange={(e) => setSettingCode(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter Setting Code"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="number"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter Description"
          required
        />
      </div>
    </form>
  );
}
