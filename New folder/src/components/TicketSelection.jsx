"use client";
import React, { useState, useEffect } from "react";
import { content } from "../js/content";
import Image from "next/image";

const TicketSelection = ({ setIsTicketSelected, showErrors }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState(null);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketsLeft, setTicketsLeft] = useState({});
  const [errors, setErrors] = useState({
    ticketType: "",
    ticketCount: "",
  });

  // Load from localStorage and calculate tickets left
  useEffect(() => {
    const savedTicketDetails = localStorage.getItem("ticketDetails");
    if (savedTicketDetails) {
      const parsedDetails = JSON.parse(savedTicketDetails);
      setSelectedTickets(parsedDetails.numberOfTickets);
      setSelectedTicketType(parsedDetails.ticketType);
    }

    // remaining tickets
    const myTickets = JSON.parse(localStorage.getItem("myTickets") || "[]");
    const ticketCounts = {};

    // Initialize
    content.ticketTypes.forEach((type) => {
      ticketCounts[type.type] = type.limit;
    });

    // Subtract purchased tickets
    myTickets.forEach((ticket) => {
      if (ticketCounts[ticket.ticketType]) {
        ticketCounts[ticket.ticketType] -= ticket.numberOfTickets;
      }
    });

    setTicketsLeft(ticketCounts);
  }, []);

  // Update localStorage in real time
  const updateLocalStorage = (tickets, ticketType) => {
    const ticketDetails = {
      numberOfTickets: tickets || selectedTickets,
      ticketType: ticketType || selectedTicketType,
    };
    localStorage.setItem("ticketDetails", JSON.stringify(ticketDetails));
  };

  // Handle ticket select
  const handleTicketSelect = (num) => {
    setSelectedTickets(num);
    setErrors((prev) => ({ ...prev, ticketCount: "" }));
    updateLocalStorage(num, null);
    setIsDropdownOpen(false);
  };

  // Handle ticket type select
  const handleTicketTypeSelect = (ticketType) => {
    // Reset
    setSelectedTickets(null);
    setSelectedTicketType(ticketType);
    setErrors((prev) => ({ ...prev, ticketType: "" }));
    updateLocalStorage(null, ticketType);
  };

  // Validate and show errors when showErrors is true
  useEffect(() => {
    if (showErrors) {
      const savedTicketDetails = JSON.parse(localStorage.getItem("ticketDetails") || "{}");

      if (!selectedTicketType && !savedTicketDetails.ticketType) {
        setErrors((prev) => ({
          ...prev,
          ticketType: "Please select a ticket type",
        }));
      } else {
        setErrors((prev) => ({ ...prev, ticketType: "" }));
      }

      if (!selectedTickets && !savedTicketDetails.numberOfTickets) {
        setErrors((prev) => ({
          ...prev,
          ticketCount: "Please select number of tickets",
        }));
      } else {
        setErrors((prev) => ({ ...prev, ticketCount: "" }));
      }
    }
    setIsTicketSelected(!!(selectedTicketType && selectedTickets));
  }, [selectedTicketType, selectedTickets, showErrors, setIsTicketSelected]);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden border border-top-0 border-borderthree bg-[#0A0C11]/10 rounded-3xl p-6">
        <div className="absolute top-0 left-0 w-full h-[30vh] bg-[radial-gradient(ellipse_at_top_left,rgba(36,160,181,0.3)_0%,rgba(36,160,181,0)_70%)]" />
        <div className="flex flex-col gap-3 mx-auto text-center justify-center items-center">
          <h2 className="text-4xl md:text-6xl font-roadrage">{content.title}</h2>
          <p className="sm:w-2/3 font-roboto text-sm md:text-base">{content.description}</p>
          <div className="flex flex-col md:flex-row gap-3 items-center font-roboto">
            {/* Location */}
            <p>📍 {content.location}</p>
            <p className="hidden md:block">||</p>
            {/* Date and time */}
            <div className="flex gap-1 items-center">
              <p>{content.date}</p>
              <p>|</p>
              <p>{content.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="bg-borderthree h-1" />

      {/* Ticket Type Selection */}
      <div className="font-roboto">
        <h3 className="mb-3">Select Ticket Type:</h3>
        {showErrors && errors.ticketType && (
          <p className="text-red-500 text-sm mb-2">{errors.ticketType}</p>
        )}
        <div className="p-4 rounded-3xl border border-borderthree bg-greenfive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.ticketTypes.map((ticketType) => {
              const ticketsRemaining = ticketsLeft[ticketType.type] || 0;
              const isDisabled = ticketsRemaining === 0;

              return (
                <div
                  key={ticketType.id}
                  className={`flex justify-between items-start p-4 rounded-xl ${
                    isDisabled
                      ? "bg-gray-500 border-gray-600 cursor-not-allowed opacity-50"
                      : selectedTicketType === ticketType.type
                      ? "bg-greensix border"
                      : "hover:bg-borderfive"
                  } border-2 border-borderone w-full transition-all duration-300 ease-in-out cursor-pointer group`}
                  onClick={() => !isDisabled && handleTicketTypeSelect(ticketType.type)}
                >
                  <div className="flex flex-col gap-1 text-lightgrey group-hover:text-white">
                    <p className="font-semibold text-2xl">
                      {ticketType.price === 0 ? "Free" : `$${ticketType.price}`}
                    </p>
                    <h4 className="uppercase text-lightgrey">{ticketType.type}</h4>
                    <p className="text-sm text-[#D9D9D9]">
                      {ticketsRemaining}/{ticketType.limit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticket Purchase Count Dropdown */}
      <div className="font-roboto">
        <h3 className="mb-3">Number of Tickets</h3>
        {showErrors && errors.ticketCount && (
          <p className="text-red-500 text-sm mb-2">{errors.ticketCount}</p>
        )}
        <div className="relative">
          <button
            onClick={() => selectedTicketType && setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border border-borderthree bg-greenfour ${
              selectedTicketType
                ? "hover:bg-borderone hover:border-borderone"
                : "opacity-50 cursor-not-allowed"
            } transition-all duration-300 ease-in-out`}
          >
            <span className="text-lightgrey">
              {selectedTickets
                ? `${selectedTickets} ${selectedTickets === 1 ? "ticket" : "tickets"}`
                : "Select number of tickets"}
            </span>
            <Image
              src="/chevrondown.svg"
              alt="dropdown arrow"
              width={24}
              height={24}
              className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-[180deg]" : ""}`}
            />
          </button>
          {isDropdownOpen && selectedTicketType && (
            <div className="absolute top-full left-0 w-full mt-2 p-2 rounded-xl border border-borderthree bg-greenfour">
              {Array.from({ length: Math.min(5, ticketsLeft[selectedTicketType] || 0) }, (_, i) => i + 1).map((num) => (
                <div
                  key={num}
                  onClick={() => handleTicketSelect(num)}
                  className="p-3 rounded-lg hover:bg-borderone cursor-pointer text-lightgrey hover:text-white transition-colors"
                >
                  {num} {num === 1 ? "ticket" : "tickets"}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketSelection;
