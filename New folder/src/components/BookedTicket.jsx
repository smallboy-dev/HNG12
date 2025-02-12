import React, { useEffect, useState } from 'react'
import EventTicket from './EventTicket';

const BookedTicket = () => {
  const [ticketDetails, setTicketDetails] = useState(null);

  useEffect(() => {
    // Get ticket details first
    const details = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
    
    if (Object.keys(details).length > 0) {
      setTicketDetails(details);

      const existingTickets = JSON.parse(localStorage.getItem('myTickets') || '[]');
      // Check if ticket already exists before adding
      const ticketExists = existingTickets.some(ticket => 
        ticket.name === details.name && 
        ticket.email === details.email &&
        ticket.ticketType === details.ticketType
      );

      if (!ticketExists) {
        const updatedTickets = [...existingTickets, details];
        localStorage.setItem('myTickets', JSON.stringify(updatedTickets));
      }

      setTimeout(() => {
        localStorage.removeItem('ticketDetails');
      }, 0);
    }
  }, []);

  return <div className='max-w-72 sm:max-w-sm mx-auto'>
    <EventTicket isStep={true} ticketDetails={ticketDetails} />
  </div>

}

export default BookedTicket;