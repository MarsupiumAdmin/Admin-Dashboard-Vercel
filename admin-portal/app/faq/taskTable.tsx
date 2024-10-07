import { ChevronDown, ChevronUp, Edit, Trash, ChevronLeft, ChevronRight } from 'lucide-react'

interface FAQData {
  id: number;
  faqTitle: string;
  createdAt: string;
  description: string;
}

interface FAQTableProps {
  data: FAQData[]
  sortField: keyof FAQData | null
  sortDirection: 'asc' | 'desc'
  handleSort: (field: keyof FAQData) => void
  indexOfFirstItem: number
  filteredDataLength: number
  currentPage: number
  setCurrentPage: (page: number) => void
  totalPages: number
}

export default function FAQTable({
  data,
  sortField,
  sortDirection,
  handleSort,
  indexOfFirstItem,
  filteredDataLength,
  currentPage,
  setCurrentPage,
  totalPages,
}: FAQTableProps) {
  const SortIcon = ({ field }: { field: keyof FAQData }) => (
    sortField === field && (sortDirection === 'asc' ? <ChevronUp className="inline ml-1 h-4 w-4" /> : <ChevronDown className="inline ml-1 h-4 w-4" />)
  )

  return (
    <div className="bg-white rounded-lg shadow mx-4">
      {/* Mobile and Desktop view */}
      <div>
        {data.map((item, index) => (
          <div key={item.id} className="mb-4 border-b last:border-b-0 p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">{item.createdAt}</p>
                <h3 className="text-xl font-semibold text-gray-900">{item.faqTitle}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-green-600 hover:text-green-900">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
  )
}