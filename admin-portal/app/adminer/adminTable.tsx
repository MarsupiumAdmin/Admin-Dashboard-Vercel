import { ChevronDown, ChevronUp, Edit, Trash, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { useState } from 'react';
import { modifyDate } from '../components/commonClientSideFunctions';
import PopUp from '../popups/popup'
import { apiUrl } from '../components/commonConstants';
interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminTableProps {
  data: AdminData[]
  sortField: keyof AdminData | null
  sortDirection: 'asc' | 'desc'
  handleSort: (field: keyof AdminData) => void
  indexOfFirstItem: number
  filteredDataLength: number
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
}

export default function TaskTable({
  data,
  sortField,
  sortDirection,
  handleSort,
  indexOfFirstItem,
  filteredDataLength,
  currentPage,
  setCurrentPage,
  totalPages,
}: AdminTableProps) {

  const [editRowId, setEditRowId] = useState<number | null>(null); // Track the row being edited
  const [editedData, setEditedData] = useState<Partial<AdminData>>({}); // Track the edited values

  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);

  const [isPopUpOpen, setPopUpOpen] = useState(false)
  const [popupType, setPopupType] = useState<'confirmation' | 'success' | 'delete' | 'error'>('confirmation')

  const SortIcon = ({ field }: { field: keyof AdminData }) => (
    sortField === field && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />)
  )

  // Handle Edit Click
  const handleEditClick = (task: AdminData) => {
    setEditRowId(task.id);
    setEditedData(task); // Initialize editedData with the selected row's data
  };

  // Handle Input Changes in Edit Mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof AdminData) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  const handleSaveClick = () => {
    // Compare the original data with the edited data
    const originalData = data.find(item => item.id === editRowId);

    if (originalData && JSON.stringify(originalData) === JSON.stringify(editedData)) {
      // If no changes, do nothing
      setEditRowId(null);
      return;
    }

    handleOpenPopUp('confirmation');

    // Exit edit mode after saving
    setEditRowId(null);
  };


  const handleOpenPopUp = (type: 'confirmation' | 'success' | 'delete' | 'error') => {
    setPopupType(type)
    setPopUpOpen(true)
  }

  const handleClose = () => setPopUpOpen(false)

  const handleConfirm = async () => {
    const adminID = editedData.id;
    try {
      if (adminID) {
        const response = await fetch(`${apiUrl}User/UpdateAdmin/${adminID}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({
              name: editedData.name,
              email: editedData.email,
              role: editedData.role
            }),
          });
        if (response.ok) {
          setPopUpOpen(false)
          window.location.reload();
        }
        else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update task');
        }
      }
    }
    catch (error: any) {
      console.error('Failed to update task:', error);
      // handleOpenPopUp('error');
      alert(error);
    }
  }


  const handleDeleteClick = (id: number) => {
    setDeleteRowId(id);
    handleOpenPopUp('delete');
  }

  const handleDelete = async () => {
    const adminID = deleteRowId;
    try {
      if (adminID) {
        const response = await fetch(`${apiUrl}User/DeleteAdmin/${adminID}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
        if (response.ok) {
          setPopUpOpen(false)
          window.location.reload()
        }
        else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update task');
        }
      }
    }
    catch (error: any) {
      console.error('Failed to Delete task:', error);
      // handleOpenPopUp('error');
      alert(error);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      {/* Mobile view */}
      <div className="lg:hidden">
        {data.map((item, index) => (
          <div key={item.id} className="mb-4 border rounded-lg p-4">
            {editRowId === item.id ? (
              <input
                type="text"
                value={editedData.name || ''}
                onChange={(e) => handleInputChange(e, 'name')}
                className="text-lg font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                style={{ maxWidth: '320px' }} // Explicitly setting the max width for very small screens
              />
            ) : (
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            )}
            <div className="text-sm mb-2">
              {editRowId === item.id ? (
                <input
                  type="email"
                  value={editedData.email || ''}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className="text-medium font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                  style={{ maxWidth: '320px' }}
                />
              ) : (
                <h3 className="text-medium font-semibold mb-2">{item.email}</h3>
              )}
            </div>
            <div className="text-sm mb-2">
              {editRowId === item.id ? (
                <input
                  type="text"
                  value={editedData.role || ''}
                  onChange={(e) => handleInputChange(e, 'role')}
                  className="text-medium font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                  style={{ maxWidth: '320px' }}
                />
              ) : (
                <h3 className="text-medium font-semibold mb-2">{item.role}</h3>
              )}
            </div>
            <div className="text-sm mb-4">
              <div className="font-medium">Created:</div>
              <div>{item.createdAt}</div>
            </div>
            <div className="flex justify-end space-x-2">
              {editRowId === item.id ? (
                <button
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                  onClick={handleSaveClick}
                >
                  Save
                </button>
              ) : (
                <button
                  className="p-2 text-green-600 hover:bg-green-100 rounded"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit className="h-5 w-5" />
                </button>
              )}
              <PopUp
                isOpen={isPopUpOpen}
                type={popupType}
                onClose={handleClose}
                onConfirm={popupType === 'delete' ? handleDelete : handleConfirm}
                onCancel={handleClose}
              />
              {
                <button className="p-2 text-red-600 hover:bg-red-100 rounded" onClick={() => handleDeleteClick(item.id)}>
                  <Trash className="h-5 w-5" />
                </button>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider ">
                No
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                E-mail <SortIcon field="email" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('role')}
              >
                Role <SortIcon field="role" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Created At <SortIcon field="createdAt" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {indexOfFirstItem + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      value={editedData.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      value={editedData.email || ''}
                      onChange={(e) => handleInputChange(e, 'email')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    item.email
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="text"
                      value={editedData.role || ''}
                      onChange={(e) => handleInputChange(e, 'role')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    item.role
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editRowId === item.id ? (
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-900 mr-4"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                  <PopUp
                    isOpen={isPopUpOpen}
                    type={popupType}
                    onClose={handleClose}
                    onConfirm={popupType === 'delete' ? handleDelete : handleConfirm}
                    onCancel={handleClose}
                  />
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center mx-4 pb-4">
        <span className="text-sm text-gray-700 mb-2 sm:mb-0">
          Showing {indexOfFirstItem + 1} - {Math.min(indexOfFirstItem + data.length, filteredDataLength)} of {filteredDataLength}
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="px-2 py-1 border rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}  // Fix here
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-1 border rounded-md">{currentPage}</span>
          <button
            className="px-2 py-1 border rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}  // Fix here
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}