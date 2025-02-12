'use client'
import React, { useEffect, useState, useRef } from 'react'
import EventTicket from '@/components/EventTicket'
import { toPng } from 'html-to-image'

const TicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [downloadingTickets, setDownloadingTickets] = useState({})
  const [searchQuery, setSearchQuery] = useState({ name: '', email: '' })
  const ticketRefs = useRef({})

  // Load tickets from local storage and reverse them
  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true)
      const savedTickets = JSON.parse(localStorage.getItem('myTickets') || '[]').reverse()
      setTickets(savedTickets)
      setFilteredTickets(savedTickets)
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
    }
    loadTickets()
  }, [])

  // Tickets Search and Filter
  useEffect(() => {
    const filtered = tickets.filter(ticket => {
      const nameMatch = ticket.name.toLowerCase().includes(searchQuery.name.toLowerCase())
      const emailMatch = ticket.email.toLowerCase().includes(searchQuery.email.toLowerCase())
      return nameMatch && emailMatch
    })
    setFilteredTickets(filtered)
  }, [searchQuery, tickets])

  // Download ticket
  const downloadTicket = async (index) => {
    try {
      setDownloadingTickets(prev => ({ ...prev, [index]: true }))
      const element = ticketRefs.current[index]
      if (!element) {
        throw new Error('Ticket element not found')
      }

      // Remove hover effects temporarily
      const originalTransform = element.style.transform
      element.style.transform = 'none'
      
      // Create a clone of the element to avoid interference from other tickets
      const clone = element.cloneNode(true)
      clone.style.transform = 'none'
      clone.style.transition = 'none'
      
      // Temporarily append clone to document
      document.body.appendChild(clone)
      
      const dataUrl = await toPng(clone, {
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: true
      })

      // Remove clone
      document.body.removeChild(clone)
      
      // Restore hover effects
      element.style.transform = originalTransform

      // Create download link
      const link = document.createElement('a')
      link.download = `ticket-${filteredTickets[index].eventName || 'event'}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Error downloading ticket:', err.message || err)
    } finally {
      setDownloadingTickets(prev => ({ ...prev, [index]: false }))
    }
  }

  // Ticket Skeleton Loader
  const TicketSkeleton = () => (
    <div className="animate-pulse">
      <div className="w-full max-w-md mx-auto">
        {/* Top section */}
        <div className="bg-gray-300 p-5 rounded-t-[20px] space-y-4">
          <div className="h-8 bg-gray-400 rounded-lg w-3/4 mx-auto"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-400 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-gray-400 rounded w-2/3 mx-auto"></div>
          </div>
          <div className="flex justify-center">
            <div className="w-[140px] h-[140px] bg-gray-400 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-gray-400 p-4 rounded-lg">
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
            <div className="h-12 bg-gray-300 rounded col-span-2"></div>
          </div>
        </div>
        
        {/* Tear line */}
        <div className="h-2 bg-gray-300 mx-8 flex justify-between">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-4 h-2 bg-gray-400 rounded-full"></div>
          ))}
        </div>
        
        {/* Bottom section */}
        <div className="bg-gray-300 p-6 rounded-b-[20px]">
          <div className="h-16 bg-gray-400 rounded-lg w-3/4 mx-auto"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-20">
      <h1 className="text-4xl md:text-5xl font-roadrage text-center mb-12">My Tickets</h1>

      {/* Search Area */}
      <div className="mb-12 p-6 bg-greenfour rounded-[32px] border border-greenthree">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery.name}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-greentwo border border-greenthree focus:border-greenone focus:outline-none text-darkgrey placeholder-lightgrey transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lightgrey">🔍</span>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery.email}
              onChange={(e) => setSearchQuery(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-greentwo border border-greenthree focus:border-greenone focus:outline-none text-darkgrey placeholder-lightgrey transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lightgrey">✉️</span>
          </div>
        </div>
      </div>

      {/* Tickets Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[...Array(4)].map((_, i) => (
            <TicketSkeleton key={i} />
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center font-roboto text-lightgrey">
          <p className="text-xl">No tickets found</p>
          <p className="mt-2">Book some tickets to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {filteredTickets.map((ticket, index) => (
            <div key={index} className="group relative">
              <div 
                ref={el => {
                  if (el) ticketRefs.current[index] = el
                }}
                data-ticket={index}
                className="transform group-hover:scale-[1.02] transition-all duration-300"
              >
                <EventTicket ticketDetails={ticket} />
              </div>
              
              {/* Overlay with download button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] flex items-center justify-center">
                <button
                  onClick={() => downloadTicket(index)}
                  disabled={downloadingTickets[index]}
                  className="flex items-center gap-2 bg-borderone hover:bg-bordertwo text-white font-roboto py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-90"
                  >
                    <path 
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {downloadingTickets[index] ? 'Downloading...' : 'Download Ticket'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TicketsPage