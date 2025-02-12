'use client';

import { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';

const Stepper = ({ steps, onFormSubmit, canProceed, setCanProceed, isTicketSelected, setShowTicketErrors }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef(null);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const downloadTicket = async () => {
    try {
      setIsDownloading(true);
      const element = ticketRef.current;
      if (!element) return;

      // Remove hover effects temporarily
      element.style.transform = 'none';
      
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        skipAutoScale: true,
        style: {
          transform: 'none',
          transition: 'none'
        }
      });

      // Restore hover effects
      element.style.transform = '';

      // Create download link
      const link = document.createElement('a');
      const ticketDetails = JSON.parse(localStorage.getItem('ticketDetails') || '{}');
      link.download = `ticket-${ticketDetails.name || 'event'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading ticket:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGetTicket = async () => {
    if (onFormSubmit) {
      onFormSubmit();
    }
  };

  useEffect(() => {
    if (canProceed && currentStep === 1) {
      setCurrentStep(prev => prev + 1);
      setCanProceed(false);
    }
  }, [canProceed, currentStep, setCanProceed]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!isTicketSelected) {
        setShowTicketErrors(true);
      } else {
        setCurrentStep(prev => prev + 1);
        setShowTicketErrors(false);
      }
    }
  };

  const renderButtons = () => {
    switch(currentStep) {
      // step 1
      case 0:
        return (
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-6 w-full py-3 rounded-lg border border-greenone text-greenone hover:bg-primary/40 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-6 w-full py-3 rounded-lg bg-greenone hover:bg-borderone text-white transition-colors whitespace-nowrap"
            >
              Next
            </button>
          </div>
        );
      // step 2
      case 1:
        return (
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-6 w-full py-3 rounded-lg border border-greenone text-greenone hover:bg-primary/40 transition-colors whitespace-nowrap"
            >
              Back
            </button>
            <button
              onClick={handleGetTicket}
              className={`px-6 w-full py-3 rounded-lg bg-greenone hover:bg-borderone text-white transition-colors whitespace-nowrap`}
            >
              Get My Free Ticket
            </button>
          </div>
        );
      // step 3
      case 2:
        return (
          <div className="flex flex-col-reverse md:flex-row gap-3 mt-8">
            <button
              onClick={() => setCurrentStep(0)}
              className="px-6 w-full py-3 rounded-lg border border-greenone text-greenone hover:bg-primary/40 transition-colors whitespace-nowrap"
            >
              Book Another Ticket
            </button>
            <button
              onClick={downloadTicket}
              disabled={isDownloading} 
              className="px-6 w-full py-3 rounded-lg bg-greenone hover:bg-borderone text-white transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? 'Downloading...' : 'Download Ticket'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto rounded-[40px] p-6 md:p-12 border border-bordertwo bg-greentwo">
      <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
        <h2 className="text-2xl md:text-3xl">
          {steps[currentStep].title}
        </h2>
        <span className="text-lightgrey text-sm md:text-base font-roboto">
          Step {currentStep + 1}/{steps.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-greenthree rounded-full mb-8">
        <div 
          className="h-full bg-greenone rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content */}
      {currentStep === 2 ? (
        <div className="mt-6">
          <div className='text-center font-roboto'>
            <h3 className='pb-4 text-2xl md:text-3xl'>Your Ticket is Booked!</h3>
            <p className='text-lightgrey text-sm md:text-base'>
              Check your email for a copy or you can <span className='font-bold'>download</span>
            </p>
            <div className='my-16 flex justify-center'>
              <div ref={ticketRef}>
                {steps[currentStep].component}
              </div>
            </div>
          </div>
          {renderButtons()}
        </div>
      ) : (
        <div className="mt-6 md:p-6 md:bg-greenfour md:rounded-[32px] md:border border-greenthree">
          {steps[currentStep].component}
          {renderButtons()}
        </div>
      )}
    </div>
  );
};

export default Stepper;