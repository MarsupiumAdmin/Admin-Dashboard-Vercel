import { ChevronDown, ChevronUp, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { modifyDate } from '../components/commonClientSideFunctions';
import PopUp from '../popups/popup'
import { apiUrl } from '../components/commonConstants';

interface TaskData {
  id: number;
  taskTitle: string;
  amountReward: number;
  amountPoint: number;
  createdAt: string;
}

interface TaskTableProps {
  data: TaskData[];
  sortField: keyof TaskData | null;
  sortDirection: 'asc' | 'desc';
  handleSort: (field: keyof TaskData) => void;
  indexOfFirstItem: number;
  filteredDataLength: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
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
}: TaskTableProps) {
  const [editRowId, setEditRowId] = useState<number | null>(null); // Track the row being edited
  const [editedData, setEditedData] = useState<Partial<TaskData>>({}); // Track the edited values

  const [deleteRowId, setDeleteRowId] = useState<number | null>(null);

  const [isPopUpOpen, setPopUpOpen] = useState(false)
  const [popupType, setPopupType] = useState<'confirmation' | 'success' | 'delete' | 'error'>('confirmation')

  const SortIcon = ({ field }: { field: keyof TaskData }) => (
    sortField === field && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />)
  );

  // Handle Edit Click
  const handleEditClick = (task: TaskData) => {
    setEditRowId(task.id);
    setEditedData(task); // Initialize editedData with the selected row's data
  };

  // Handle Input Changes in Edit Mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TaskData) => {
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
  const taskID = editedData.id;
  try {
    if (taskID) {
      const response = await fetch(`${apiUrl}DailyTask/EditTask/${taskID}`,
        {
          method: 'PUT',
          headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${localStorage.getItem("accessToken")}`
          },
          body: JSON.stringify({
            name: editedData.taskTitle,
            amountGetGold: editedData.amountReward,
            amountOfTarget: editedData.amountPoint
          }), 
        });
        if(response.ok){
          setPopUpOpen(false)
          window.location.reload()
        }
        else{
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update task');
        }
      }
    } 
    catch (error:any) {
      console.error('Failed to update task:', error);
      // handleOpenPopUp('error');
      alert(error);
    }
  }


  const handleDeleteClick = (id : number) => {
    setDeleteRowId(id);
    handleOpenPopUp('delete');
  }

  const handleDelete = async () => {
    const taskID = deleteRowId;
    try{
      if (taskID) {
        const response = await fetch(`${apiUrl}DailyTask/DeleteTask/${taskID}`,
          {
            method: 'DELETE',
            headers:{
              'Content-Type':'application/json',
              'Authorization':`Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          if(response.ok){
            setPopUpOpen(false)
            window.location.reload()
          }
          else{
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update task');
          }
        }
    }
    catch (error:any) {
      console.error('Failed to Delete task:', error);
      // handleOpenPopUp('error');
      alert(error);
    }
  }




  return (
    <div className="bg-white rounded-lg shadow mx-4">
      {/* Mobile view */}
      <div className="lg:hidden">
        {data.map((item) => (
          <div key={item.id} className="mb-4 border rounded-lg p-4">
            {editRowId === item.id ? (
              <input
                type="text"
                value={editedData.taskTitle || ''}
                onChange={(e) => handleInputChange(e, 'taskTitle')}
                className="text-lg font-semibold mb-2 border p-2 rounded w-full sm:w-auto max-w-xs sm:max-w-none"
                style={{ maxWidth: '320px' }} // Explicitly setting the max width for very small screens
              />
            ) : (
              <h3 className="text-lg font-semibold mb-2">{item.taskTitle}</h3>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Reward:</div>
              {editRowId === item.id ? (
                <input
                  type="number"
                  value={editedData.amountReward || ''}
                  onChange={(e) => handleInputChange(e, 'amountReward')}
                  className="border p-2 rounded"
                />
              ) : (
                <div>${item.amountReward && item.amountReward.toLocaleString()}</div>
              )}
              <div className="font-medium">Points:</div>
              {editRowId === item.id ? (
                <input
                  type="number"
                  value={editedData.amountPoint || ''}
                  onChange={(e) => handleInputChange(e, 'amountPoint')}
                  className="border p-2 rounded"
                />
              ) : (
                <div>${item.amountPoint && item.amountPoint.toLocaleString()}</div>
              )}
              <div className="font-medium">Created:</div>
              <div>{modifyDate(item.createdAt)}</div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
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
                        onConfirm={popupType === 'delete'? handleDelete : handleConfirm}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                No
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('taskTitle')}
              >
                Task Title <SortIcon field="taskTitle" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amountReward')}
              >
                Amount Reward <SortIcon field="amountReward" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amountPoint')}
              >
                Amount Point <SortIcon field="amountPoint" />
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
                      value={editedData.taskTitle || ''}
                      onChange={(e) => handleInputChange(e, 'taskTitle')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    item.taskTitle
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="number"
                      value={editedData.amountReward || ''}
                      onChange={(e) => handleInputChange(e, 'amountReward')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    `$${item.amountReward && item.amountReward.toLocaleString()}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editRowId === item.id ? (
                    <input
                      type="number"
                      value={editedData.amountPoint || ''}
                      onChange={(e) => handleInputChange(e, 'amountPoint')}
                      className="border p-2 rounded"
                    />
                  ) : (
                    `$${item.amountPoint && item.amountPoint.toLocaleString()}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {modifyDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editRowId === item.id ? (
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="h-5 w-5 inline" />
                    </button>
                  )}
                        <PopUp
                        isOpen={isPopUpOpen}
                        type={popupType}
                        onClose={handleClose}
                        onConfirm={popupType === 'delete'? handleDelete : handleConfirm}
                        onCancel={handleClose}
                      />
                  <button className="ml-4 text-red-600 hover:text-red-900"
                  onClick={() => handleDeleteClick(item.id)}
                  >
                    <Trash className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between p-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 disabled:text-gray-400"
        >
          <ChevronLeft className="inline h-6 w-6" />
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-gray-600 disabled:text-gray-400"
        >
          <ChevronRight className="inline h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
