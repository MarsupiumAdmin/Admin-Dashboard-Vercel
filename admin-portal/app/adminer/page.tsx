"use client";

import { useEffect, useState } from 'react';
import Header from '../components/header';
import Sidebar from '../components/sidebar';
import SearchComponent from './searchComponent';
import AddNewAdminButton from './addNewAdmin';
import AdminTable from './adminTable';
import { useAuthRedirect } from '../components/commonClientSideFunctions';
import { apiUrl } from '../components/commonConstants';

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

type SortDirection = 'asc' | 'desc';



export default function AdminPage() {
  const [searchField, setSearchField] = useState<keyof AdminData>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof AdminData | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [dummyData, setDummyData] = useState<AdminData[]>([]);
  const [loader,setLoader] = useState(true);
  const itemsPerPage = 7;

  useEffect(() => {
    const adminID = localStorage.getItem('adminId');
    if (adminID) {
      fetch(`${apiUrl}User/GetAllAdmins`, {
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
          const mappedData = data && data.data.map((admin: any) => ({
            id: admin.id,
            name: admin.username,
            email: admin.email,
            role: admin.role ? admin.role : "Admin",
            createdAt: admin.createdAt,
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

  const handleSort = (field: keyof AdminData) => {
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
      <Header title="Admins" />
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
            <AddNewAdminButton />
          </div>
            <AdminTable
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
