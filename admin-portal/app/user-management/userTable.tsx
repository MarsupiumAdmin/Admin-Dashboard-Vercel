import { ChevronDown, ChevronUp, Edit, Trash, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useState } from 'react';
import PopUp from '../popups/popup'; // Import your PopUp component
import { apiUrl, countries } from '../components/commonConstants'; // Import your API URL

interface UserData {
  id: number;
  name: string;
  email: string;
  balance: number;
  saving: number;
  goal: number;
  country: string;
  createdAt: string;
}

interface UserTableProps {
  data: UserData[];
  sortField: keyof UserData | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof UserData) => void;
  indexOfFirstItem: number;
  filteredDataLength: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export default function UserTable({
  data,
  sortField,
  sortDirection,
  handleSort,
  indexOfFirstItem,
  filteredDataLength,
  currentPage,
  setCurrentPage,
  totalPages,
}: UserTableProps) {
  const SortIcon = ({ field }: { field: keyof UserData }) => (
    sortField === field && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />)
  );

  const [editRowId, setEditRowId] = useState<number | null>(null); // Track the row being edited
  const [editedData, setEditedData] = useState<Partial<UserData>>({}); // Track the edited values
  const [deleteRowId, setDeleteRowId] = useState<number | null>(null); // Track the row to be deleted

  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [popupType, setPopupType] = useState<'confirmation' | 'success' | 'delete' | 'error'>('confirmation');

  // Handle Edit Click
  const handleEditClick = (user: UserData) => {
    setEditRowId(user.id);
    setEditedData(user); // Initialize editedData with the selected row's data
  };

  // Handle Input Changes in Edit Mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserData) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  // Handle Country Change
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedData({
      ...editedData,
      country: e.target.value,
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
  };

  const handleOpenPopUp = (type: 'confirmation' | 'success' | 'delete' | 'error') => {
    setPopupType(type);
    setPopUpOpen(true);
  };

  const handleClose = () => setPopUpOpen(false);

  const handleConfirm = async () => {
    const userId = editedData.id;
    console.log(editedData);
    try {
      if (userId) {
        const response = await fetch(`${apiUrl}User/UpdatePlayerByAdmin/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            username: editedData.name,
            email: editedData.email,
            amountBalance: editedData.balance,
            amountSaving: editedData.saving,
            amountGoldGame: editedData.goal
          }),
        });

        if (response.ok) {
          setPopUpOpen(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update user');
        }
      }
    } catch (error: any) {
      console.error('Failed to update user:', error);
      alert(error.message);
    }
    setEditRowId(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteRowId(id);
    handleOpenPopUp('delete');
  };

  const handleDelete = async () => {
    const userId = deleteRowId;
    try {
      if (userId) {
        const response = await fetch(`${apiUrl}User/DeletePlayerByAdmin/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (response.ok) {
          setPopUpOpen(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete user');
        }
      }
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      alert(error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      {/* Mobile view */}
      <div className="lg:hidden">
        {data.map((item) => (
          <div key={item.id} className="mb-4 border rounded-lg p-4">
            {editRowId === item.id ? (
              <input
                type="text"
                value={editedData.name || ''}
                onChange={(e) => handleInputChange(e, 'name')}
                className="text-lg font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                style={{ maxWidth: '320px' }}
              />
            ) : (
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            )}
            <div className="text-sm mb-2">
              {editRowId === item.id ? (
                <input
                  type="text"
                  value={editedData.email || ''}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className="text-medium font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                  style={{ maxWidth: '320px' }}
                />
              ) : (
                <h3 className="text-medium font-semibold mb-2">{item.email}</h3>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="font-medium">Balance:</div>
              {editRowId === item.id ? (
                <input
                  type="number"
                  value={editedData.balance || ''}
                  onChange={(e) => handleInputChange(e, 'balance')}
                  className="border p-2 rounded"
                />
              ) : (
                <div>${item.balance}</div>
              )}
              <div className="font-medium">Saving:</div>
              {editRowId === item.id ? (
                <input
                  type="number"
                  value={editedData.saving || ''}
                  onChange={(e) => handleInputChange(e, 'saving')}
                  className="border p-2 rounded"
                />
              ) : (
                <div>${item.saving}</div>
              )}
              <div className="font-medium">Goal:</div>
              {editRowId === item.id ? (
                <input
                  type="number"
                  value={editedData.goal || ''}
                  onChange={(e) => handleInputChange(e, 'goal')}
                  className="border p-2 rounded"
                />
              ) : (
                <div>${item.goal}</div>
              )}
            </div>
            <div className="text-sm mb-2">
              <div className="font-medium">Country:</div>
              {/* {editRowId === item.id ? (
                <select
                  className="border p-2 rounded"
                  value={editedData.country || ''}
                  onChange={handleCountryChange}
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              ) : (
                <div>{item.country}</div>
              )} */}
              <div>{item.country}</div>
            </div>
            <div className="text-sm mb-4">
              <div className="font-medium">Created:</div>
              <div>{item.createdAt}</div>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="p-2 text-[#A2D2FF] hover:bg-[#b5d8f8] rounded">
                <Send className="h-5 w-5" />
              </button>
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
              <button
                className="p-2 text-red-600 hover:bg-red-100 rounded"
                onClick={() => handleDeleteClick(item.id)}
              >
                <Trash className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
              >
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
                onClick={() => handleSort('balance')}
              >
                Balance <SortIcon field="balance" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('saving')}
              >
                Saving <SortIcon field="saving" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('goal')}
              >
                Goal <SortIcon field="goal" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('country')}
              >
                Country <SortIcon field="country" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('createdAt')}
              >
                Created At <SortIcon field="createdAt" />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
              >
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
                      type="number"
                      value={editedData.balance || ''}
                      onChange={(e) => handleInputChange(e, 'balance')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    `$${item.balance}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="number"
                      value={editedData.saving || ''}
                      onChange={(e) => handleInputChange(e, 'saving')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    `$${item.saving}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="number"
                      value={editedData.goal || ''}
                      onChange={(e) => handleInputChange(e, 'goal')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    `$${item.goal}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {/* {editRowId === item.id ? (
                    <select
                      className="border p-2 rounded"
                      value={editedData.country || ''}
                      onChange={handleCountryChange}
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.country
                  )} */}
                  <div>{item.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-green-600 hover:text-green-900 mr-4">
                    <Send className="h-5 w-5" />
                  </button>
                  {editRowId === item.id ? (
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
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
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-4 py-1 border rounded-md">{currentPage}</span>
          <button
            className="px-2 py-1 border rounded-md disabled:opacity-50"
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
