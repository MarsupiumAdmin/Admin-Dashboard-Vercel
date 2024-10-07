import { useState } from 'react';

interface NotificationFormProps {
  onSubmit: (notificationTitle: string, textNotification: string) => void;
}

export default function NotificationForm({ onSubmit }: NotificationFormProps) {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [textNotification, setTextNotification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(notificationTitle, textNotification);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
      <div className="mb-4">
        <label htmlFor="notificationTitle" className="block text-sm font-medium text-gray-700 mb-1">
          Notification Title
        </label>
        <input
          type="text"
          id="notificationTitle"
          value={notificationTitle}
          onChange={(e) => setNotificationTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter notification title"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="textNotification" className="block text-sm font-medium text-gray-700 mb-1">
          Notification Text
        </label>
        <textarea
          id="textNotification"
          value={textNotification}
          onChange={(e) => setTextNotification(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Enter text notification"
          required
        />
      </div>

    </form>
  );
}
