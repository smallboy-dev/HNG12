
const ProjectPage = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-20">
      <h1 className="text-4xl md:text-5xl font-roadrage text-center mb-12">About The Project</h1>

      <div className="space-y-8">
        <div className="p-6 bg-greenfour rounded-[32px] border border-greenthree">
          <h2 className="text-2xl font-roadrage mb-4">Tech Stack</h2>
          <div className="font-roboto space-y-2">
            <p>• Next.js 13 with App Router</p>
            <p>• TailwindCSS for styling</p>
            <p>• Local Storage for data persistence</p>
            <p>• QR Code generation</p>
            <p>• HTML to Image conversion for ticket downloads</p>
          </div>
        </div>

        <div className="p-6 bg-greenfour rounded-[32px] border border-greenthree">
          <h2 className="text-2xl font-roadrage mb-4">Key Features</h2>
          <div className="font-roboto space-y-2">
            <p>• Dynamic ticket generation with QR codes</p>
            <p>• Responsive design that works on all devices</p>
            <p>• Ticket management system with search functionality</p>
            <p>• Downloadable tickets as PNG images</p>
            <p>• Real-time ticket availability tracking</p>
          </div>
        </div>

        <div className="p-6 bg-greenfour rounded-[32px] border border-greenthree">
          <h2 className="text-2xl font-roadrage mb-4">Development Process</h2>
          <p className="font-roboto">
            This project was built as a demonstration of modern web development practices. 
            The focus was on creating a seamless user experience while maintaining clean, 
            maintainable code. The ticket design was carefully crafted to be both 
            visually appealing and functional, with features like QR codes for easy 
            verification and downloadable formats for user convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
