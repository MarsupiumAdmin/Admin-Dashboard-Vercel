import Link from 'next/link';

const AddNewTaskButton = () => (
  <Link href="/adminer/add" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 w-20">
    + Add
  </Link>
);

export default AddNewTaskButton;
