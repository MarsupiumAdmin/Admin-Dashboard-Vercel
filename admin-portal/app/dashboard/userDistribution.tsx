import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

// URL for the world map GeoJSON data
const geoUrl = 'https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json'


const UserDistribution = (data: any) => {
  const dummyData = data.data || [];
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3
  const totalPages = Math.ceil(dummyData.length / itemsPerPage)

  // Paginate data
  const currentData = dummyData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const totalUsers = dummyData.reduce((total: any, data: { users: any; }) => total + data.users, 0)

// Function to get country fill color based on the number of users
const getCountryFillColor = (countryName: string) => {
  const countryData = dummyData.find((data : any) => data.country === countryName)
  if (countryData) {
    return '#4B91EC' // Highlight color for countries in dummyData
  }
  return '#A1A28A' // Default color for other countries
}

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">User Distribution by Country</h3>
      <div className="flex flex-col lg:flex-row gap-x-6">
        {/* Map Component */}
        <div className="flex-1 mb-6 lg:mb-0 lg:w-3/5 xl:w-3/5">
          <div className="aspect-w-16 aspect-h-9 lg:aspect-w-1 lg:aspect-h-1">
            <ComposableMap>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getCountryFillColor(geo.properties.name)}
                      stroke={getCountryFillColor(geo.properties.name)}
                    />
                  ))
                }
              </Geographies>
            </ComposableMap>
          </div>
        </div>

        {/* Table Component */}
        <div className="flex-1 lg:w-2/5 xl:w-2/5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-2">COUNTRY</th>
                <th className="text-right pb-2">USERS</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((data : any) => (
                <React.Fragment key={data.country}>
                  <tr>
                    <td className="py-2">{data.country}</td>
                    <td className="text-right py-2">{data.users}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="pb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(data.users / totalUsers) * 100}%` }}
                          role="progressbar"
                          aria-valuenow={data.users}
                          aria-valuemin={0}
                          aria-valuemax={totalUsers}
                          aria-label={`Progress bar for ${data.country}`}
                        ></div>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white md:px-2 md:py-1 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white md:px-2 md:py-1 px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDistribution
