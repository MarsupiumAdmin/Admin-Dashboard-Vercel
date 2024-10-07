"use client";

import { useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import SearchComponent from './searchComponent';
import AddNewNotification from './addNewNotification';
import NotificationTable from './notificationTable';
import { useAuthRedirect } from '../components/commonClientSideFunctions';

interface NotificationData {
  id:number;
  title: string;
  textNotification: string;
  createdAt: string;
}

type SortDirection = 'asc' | 'desc';

const dummyData: NotificationData[] = [
  { id: 1, title: 'Welcome!', textNotification: 'Welcome to the platform', createdAt: '2024-09-16' },
  { id: 2, title: 'Maintenance Notice', textNotification: 'Scheduled maintenance on Sept 20th', createdAt: '2024-09-15' },
  { id: 3, title: 'Reminder', textNotification: 'Complete your profile by Sept 22nd', createdAt: '2024-09-14' },
];

export default function NotificationPage() {
  const [searchField, setSearchField] = useState<keyof NotificationData>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof NotificationData | null>(null);
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

  const handleSort = (field: keyof NotificationData) => {
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
      <Header title="Notification" />
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
            <AddNewNotification />
          </div>
            <NotificationTable
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
