import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onRowClick,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  className,
  ...props
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);
  
  const handleSort = (column) => {
    if (onSort && column.sortable) {
      const newDirection = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
      onSort(column.key, newDirection);
    }
  };
  
  const handleRowSelect = (rowId, checked) => {
    if (onSelectionChange) {
      const newSelection = checked
        ? [...selectedRows, rowId]
        : selectedRows.filter(id => id !== rowId);
      onSelectionChange(newSelection);
    }
  };
  
  const handleSelectAll = (checked) => {
    if (onSelectionChange) {
      const newSelection = checked ? data.map(row => row.id) : [];
      onSelectionChange(newSelection);
    }
  };
  
  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        No data available
      </div>
    );
  }
  
  return (
    <div className={twMerge('overflow-hidden', className)} {...props}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isIndeterminate;
                      }
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={twMerge(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100'
                  )}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={twMerge(
                            'w-3 h-3',
                            sortColumn === column.key && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <svg
                          className={twMerge(
                            'w-3 h-3 -mt-1',
                            sortColumn === column.key && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'
                          )}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={twMerge(
                  'transition-colors',
                  onRowClick && 'cursor-pointer',
                  hoveredRow === index && 'bg-gray-50',
                  selectedRows.includes(row.id) && 'bg-blue-50'
                )}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {selectable && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={twMerge(
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                        currentPage === pageNum
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
