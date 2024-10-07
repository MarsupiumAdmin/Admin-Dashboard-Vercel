import { ChevronDown, ChevronUp, Edit, Trash, ChevronLeft, ChevronRight, Send } from 'lucide-react'

interface NotificationData {
  id:number;
  title: string;
  textNotification: string;
  createdAt: string;
}

interface NotificationTableProps {
  data: NotificationData[]
  sortField: keyof NotificationData | null
  sortDirection: 'asc' | 'desc'
  handleSort: (field: keyof NotificationData) => void
  indexOfFirstItem: number
  filteredDataLength: number
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
}

export default function NotificationTable({
  data,
  sortField,
  sortDirection,
  handleSort,
  indexOfFirstItem,
  filteredDataLength,
  currentPage,
  setCurrentPage,
  totalPages,
}: NotificationTableProps) {
  const SortIcon = ({ field }: { field: keyof NotificationData }) => (
    sortField === field && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />)
  )

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      {/* Mobile view */}
      <div className="lg:hidden">
        {data.map((item, index) => (
          <div key={item.id} className="mb-4 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Notification:</div>
              <div>{item.textNotification}</div>
              <div className="font-medium">Created:</div>
              <div>{item.createdAt}</div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
            <button className="p-2 text-green-600 hover:bg-green-100 rounded">
              <Send className="h-5 w-5" />
            </button>
            <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
              <Edit className="h-5 w-5" />
            </button>
            <button className="p-2 text-red-600 hover:bg-red-100 rounded">
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider ">
                No
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Notification Title <SortIcon field="title" />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('textNotification')}
              >
                Notification <SortIcon field="textNotification" />
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
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.textNotification}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.createdAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-green-600 hover:text-green-900 mr-4">
                    <Send className="h-5 w-5" />
                  </button>
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-900">
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