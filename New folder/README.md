# Conference Ticket Generator System

A modern conference ticket booking application built with [Next.js](https://nextjs.org) For the stage 2 of HNG 12.0 Internship.

## Features

- Conference ticket selection and booking
- Multi-step booking process with stepper navigation
- Attendee information collection
- Ticket management and viewing
- Responsive design for all devices
- Downloadable ticket in PNG format

## Getting Started

First, Clone the repository:

```bash
git clone https://github.com/vermilion4/hng12-stage2-conference-ticket-generator.git
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/
│   └── layout.js         # Main application layout
│   └── page.js             # Home page
│   └── tickets/
│       └── page.js         # Tickets page
│   └── project/
│       └── page.js         # Project page
├── components/
│   ├── AttendeeDetails.jsx   # Attendee information form
│   ├── BookedTicket.jsx      # Booked ticket display
│   ├── EventTicket.jsx       # Individual ticket type component
│   ├── Navigation.jsx        # Navigation component
│   ├── Stepper.jsx          # Multi-step progress indicator
│   └── TicketSelection.jsx   # Ticket selection interface
└── constants/
    └── eventDetails.js       # Event configuration and details
```

## Environment Setup

Make sure to set up your environment variables in `.env` file:

```env
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
# cloudinary preset should be: ml_default
```