// src/components/ProgressBar.jsx
import React, { useState } from 'react'

const ProgressBar = ({ progress, onProgressChange, currentPage, totalPages }) => {
  const [localProgress, setLocalProgress] = useState(progress)
  const [localPage, setLocalPage] = useState(currentPage)
  
  const handlePageChange = (e) => {
    const newPage = parseInt(e.target.value) || 0
    setLocalPage(Math.min(Math.max(newPage, 1), totalPages))
    
    if (totalPages > 0) {
      const newProgress = Math.round((newPage / totalPages) * 100)
      setLocalProgress(newProgress)
      if (onProgressChange) {
        onProgressChange(newProgress, newPage)
      }
    }
  }
  
  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value) || 0
    setLocalProgress(newProgress)
    
    if (totalPages > 0) {
      const newPage = Math.round((newProgress / 100) * totalPages)
      setLocalPage(newPage)
      if (onProgressChange) {
        onProgressChange(newProgress, newPage)
      }
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-700 font-medium">Reading Progress</span>
        <span className="text-blue-600 font-bold">{localProgress}%</span>
      </div>
      
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={localProgress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {totalPages > 0 && (
        <div className="flex items-center">
          <span className="text-gray-700 mr-3">Current Page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={localPage}
            onChange={handlePageChange}
            className="w-24 px-3 py-1 border border-gray-300 rounded text-center"
          />
          <span className="text-gray-600 ml-2">of {totalPages}</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar