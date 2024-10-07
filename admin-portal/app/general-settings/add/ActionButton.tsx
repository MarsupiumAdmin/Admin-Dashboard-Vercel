import Link from 'next/link';

interface ActionButtonsProps {
  onSave: () => void;
}

export default function ActionButtons({ onSave }: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-4 mt-auto">
      <Link
        href="/general-settings"
        className="px-4 py-2 border bg-[#FF5454] border-gray-300 rounded-md text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        Cancel
      </Link>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-[#43CDC4] text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        Save
      </button>
    </div>
  );
}
