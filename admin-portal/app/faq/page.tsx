"use client";

import { useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import SearchComponent from './searchComponent';
import AddNewTaskButton from './addNewFAQ';
import TaskTable from './taskTable';
import { useAuthRedirect } from '../components/commonClientSideFunctions';

type FAQData = {
  id: number;
  faqTitle: string;
  description: string;
  createdAt: string;
};

type SortDirection = 'asc' | 'desc';

const dummyData: FAQData[] = [
  { id: 1, faqTitle: 'How to Save Money', description: "Learn effective strategies for saving money, including budgeting tips and investment advice.", createdAt: "14-09-2024" },
  { id: 2, faqTitle: 'Tracking Your Income', description: "Understand the best practices for tracking and managing your income streams for better financial control.", createdAt: "14-09-2024" },
  { id: 3, faqTitle: 'How to Visit Friends Abroad', description: "Get tips on planning international trips to visit friends, including travel documentation and safety precautions.", createdAt: "14-09-2024" },
  { id: 4, faqTitle: 'Completing Online Quizzes', description: "Find out how to successfully complete online quizzes, including preparation and strategies for better scores.", createdAt: "14-09-2024" },
  { id: 5, faqTitle: 'Writing Effective Blog Posts', description: "Tips and tricks for crafting engaging and well-written blog posts to attract and retain readers.", createdAt: "14-09-2024" },
  { id: 6, faqTitle: 'Establishing a Fitness Routine', description: "Explore how to create and maintain a consistent fitness routine that fits your lifestyle and goals.", createdAt: "14-09-2024" },
  { id: 7, faqTitle: 'Learning New Skills', description: "Discover ways to learn new skills efficiently, including online resources and practical exercises.", createdAt: "14-09-2024" },
  { id: 8, faqTitle: 'Attending Networking Events', description: "Maximize the benefits of networking events with strategies for making connections and following up.", createdAt: "14-09-2024" },
  { id: 9, faqTitle: 'Setting Reading Goals', description: "Learn how to set and achieve reading goals to improve knowledge and personal growth.", createdAt: "14-09-2024" },
  { id: 10, faqTitle: 'Getting Involved in Volunteer Work', description: "Find opportunities for volunteer work and understand how it can positively impact your community and personal life.", createdAt: "14-09-2024" },
  { id: 11, faqTitle: 'Engaging in Creative Projects', description: "Explore various creative projects to enhance your skills and express your creativity effectively.", createdAt: "14-09-2024" },
];

export default function FAQPage() {
  const [searchField, setSearchField] = useState<keyof FAQData>('faqTitle');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof FAQData | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const itemsPerPage = 7;

  const filteredData = dummyData.filter(item =>
    item[searchField].toString().toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (!sortField) return 0;
    return (
      a[sortField].toString().localeCompare(b[sortField].toString()) *
      (sortDirection === 'asc' ? 1 : -1)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (field: keyof FAQData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const isLoggedIn = useAuthRedirect(); // Use the reusable function

  if (!isLoggedIn) {
    return null; // Prevent rendering until authentication is verified
  }

  return (
    <div className="flex h-screen flex-col">
      <Header title="FAQ" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-20 w-screen md:pl-64 md:pt-20"> {/*This is a very important part for mobile friendly resolution */}
          <div className="p-6">
          <div className="flex flex-col-reverse lg:flex-row lg:justify-between mb-4 lg:items-center gap-4">
            <SearchComponent
              searchField={searchField}
              setSearchField={setSearchField}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <AddNewTaskButton />
          </div>
            <TaskTable
              data={currentItems}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              indexOfFirstItem={indexOfFirstItem}
              filteredDataLength={filteredData.length}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
