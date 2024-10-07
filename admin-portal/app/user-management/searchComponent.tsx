import { Search } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  balance: string;
  saving: string;
  goal: string;
  country: string;
  createdAt: string;
}

interface SearchComponentProps {
  searchField: keyof UserData;
  setSearchField: (field: keyof UserData) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchComponent = ({ searchField, setSearchField, searchQuery, setSearchQuery }: SearchComponentProps) => (
  <div className="flex flex-col md:flex-row md:mr-20">
    {/* Select Dropdown */}
    <select
      className="bg-gray-800 text-white rounded-t-md md:rounded-l-md md:rounded-t-none px-3 py-2 mb-2 md:mb-0"
      value={searchField}
      onChange={(e) => setSearchField(e.target.value as keyof UserData)}
    >
      <option value="name">Name</option>
      <option value="email">Email</option>
      <option value="balance">Balance</option>
      <option value="saving">Saving</option>
      <option value="textNotification">Text Notification</option>
      <option value="goal">Goal</option>
      <option value="country">Country</option>
      <option value="createdAt">Created At</option>
    </select>

    {/* Search Input */}
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-800 text-white rounded-b-md md:rounded-r-md md:rounded-b-none pl-10 pr-4 py-2 w-full md:w-64"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  </div>
);


export default SearchComponent;
