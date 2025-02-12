'use client'
import { useRef, useState } from 'react';
import Stepper from "@/components/img";
import TicketSelection from "@/components/TicketSelection";
import AttendeeDetails from "@/components/AttendeeDetails";
import BookedTicket from '@/components/BookedTicket';

export default function Home() {
  const formRef = useRef();
  const [canProceed, setCanProceed] = useState(false);
  const [isTicketSelected, setIsTicketSelected] = useState(false);
  const [showTicketErrors, setShowTicketErrors] = useState(false);

  const handleFormSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleAttendeeSubmit = (result) => {
    if (result.success) {
      setCanProceed(true);
    } else {
      setCanProceed(false);
    }
  };

  const steps = [
    {
      title: "Ticket Selection",
      component: <TicketSelection setIsTicketSelected={setIsTicketSelected} showErrors={showTicketErrors} />
    },
    {
      title: "Attendee Details",
      component: <AttendeeDetails ref={formRef} onSubmit={handleAttendeeSubmit} />
    },
    {
      title: "Ready",
      component: <BookedTicket />
    }
  ];

  return (
      <main className="z-20 relative w-full">
        <Stepper 
          steps={steps} 
          onFormSubmit={handleFormSubmit} 
          canProceed={canProceed} 
          setCanProceed={setCanProceed}
          isTicketSelected={isTicketSelected}
          setShowTicketErrors={setShowTicketErrors}
        />
      </main>
  );
}
