import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function BackButton() {
  return (
    <Link href="/faq" className="flex items-center text-teal-600 hover:text-teal-800 mb-4">
      <ChevronLeft className="h-5 w-5 mr-1" />
      <span className="text-sm sm:text-base">Back</span>
    </Link>
  );
}
