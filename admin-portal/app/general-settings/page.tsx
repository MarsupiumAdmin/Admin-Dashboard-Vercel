"use client";

import { useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import SearchComponent from './searchComponent';
import AddNewSettingButton from './addNewSetting';
import SettingTable from './settingTable';
import { useAuthRedirect } from '../components/commonClientSideFunctions';

type SettingData = {
  id: number;
  settingName: string;
  settingCode: string;
  description: string;
  updatedAt: string;
  createdAt: string;
};

type SortDirection = 'asc' | 'desc';

const dummyData: SettingData[] = [
  { id: 1, settingName: 'Save Goals', settingCode: 'A1B2C3', description: "Track and manage your savings goals effectively.", updatedAt: '14/7/2024', createdAt: '14/7/2024' },
  { id: 2, settingName: 'Income Tracking', settingCode: 'D4E5F6', description: "Monitor and categorize your income sources.", updatedAt: '16/7/2024', createdAt: '16/7/2024' },
  { id: 3, settingName: 'Social Outreach', settingCode: 'G7H8I9', description: "Connect with and support your community through various events.", updatedAt: '14/7/2024', createdAt: '14/7/2024' },
  { id: 4, settingName: 'Quiz Participation', settingCode: 'J0K1L2', description: "Engage in quizzes to test and enhance your knowledge.", updatedAt: '14/7/2024', createdAt: '14/7/2024' },
  { id: 5, settingName: 'Content Creation', settingCode: 'M3N4O5', description: "Create and publish blog posts to share your insights and expertise.", updatedAt: '18/7/2024', createdAt: '18/7/2024' },
  { id: 6, settingName: 'Fitness Routine', settingCode: 'P6Q7R8', description: "Follow and maintain a consistent exercise routine for better health.", updatedAt: '19/7/2024', createdAt: '19/7/2024' },
  { id: 7, settingName: 'Skill Development', settingCode: 'S9T0U1', description: "Learn and develop new skills to enhance your personal and professional growth.", updatedAt: '20/7/2024', createdAt: '20/7/2024' },
  { id: 8, settingName: 'Networking Events', settingCode: 'V2W3X4', description: "Participate in events to expand your professional network and opportunities.", updatedAt: '21/7/2024', createdAt: '21/7/2024' },
  { id: 9, settingName: 'Reading Goals', settingCode: 'Y5Z6A7', description: "Set and achieve goals for reading books and improving knowledge.", updatedAt: '22/7/2024', createdAt: '22/7/2024' },
  { id: 10, settingName: 'Volunteer Projects', settingCode: 'B8C9D0', description: "Get involved in volunteer work to make a positive impact in the community.", updatedAt: '23/7/2024', createdAt: '23/7/2024' },
  { id: 11, settingName: 'Creative Work', settingCode: 'E1F2G3', description: "Engage in creative activities and projects to foster innovation and expression.", updatedAt: '24/7/2024', createdAt: '24/7/2024' },
];

export default function DailyTaskPage() {
  const [searchField, setSearchField] = useState<keyof SettingData>('settingName');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof SettingData | null>(null);
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

  const handleSort = (field: keyof SettingData) => {
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
      <Header title="General Setting" />
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
            <AddNewSettingButton />
          </div>
            <SettingTable
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
