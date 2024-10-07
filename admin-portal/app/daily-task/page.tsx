"use client";

import { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import SearchComponent from './searchComponent';
import AddNewTaskButton from './addNewTask';
import TaskTable from './taskTable';
import { useAuthRedirect } from '../components/commonClientSideFunctions';
import { apiUrl } from '../components/commonConstants';

type TaskData = {
  id: number;
  taskTitle: string;
  amountReward: number;
  amountPoint: number;
  createdAt: string;
};

type SortDirection = 'asc' | 'desc';

export default function DailyTaskPage() {
  const [dummyData, setDummyData] = useState<TaskData[]>([]);
  const [searchField, setSearchField] = useState<keyof TaskData>('taskTitle');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof TaskData | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [loader,setLoader] = useState(true);

  const itemsPerPage = 7;

  // Fetch and map the response to TaskData format
  useEffect(() => {
    const adminID = localStorage.getItem('adminId');
    if (adminID) {
      fetch(`${apiUrl}DailyTask/GetAllTasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          const mappedData = data.data.map((task: any) => ({
            id: task.id,
            taskTitle: task.name,
            amountReward: task.amountGetGold,
            amountPoint: task.amountOfTarget,
            createdAt: new Date(task.createdAt).toLocaleDateString(), // Format date as string
            isActive: task.isActive
          }));
          setDummyData(mappedData); // Set the mapped data to dummyData
          setLoader(false);
        })
        .catch((error) => {
          console.error('Error fetching daily tasks:', error);
        });
    }
  }, [apiUrl]);

  const filteredData = dummyData.filter(item => item && item[searchField] && 
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

  const handleSort = (field: keyof TaskData) => {
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
    loader? <div className="loader"></div>:
    <div className="flex h-screen flex-col">
      <Header title="Daily Task" />
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
