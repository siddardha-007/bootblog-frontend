import { useState, useEffect } from "react";

function SidebarCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome to BootBlog",
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-gray-600 font-medium leading-relaxed">
            A secure full-stack blogging architecture designed for developers,
            students, and engineers to publish digital articles and discover
            system ideas.
          </p>
          <div className="bg-[#f2f9f4]/50 rounded-xl p-3 border border-emerald-900/5 space-y-2">
            <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-800">
              Core Capabilities
            </span>
            <ul className="grid grid-cols-1 gap-2 text-gray-700 font-semibold">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5 select-none">•</span>
                <span>
                  Explore technical categories & utilize indexed search
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5 select-none">•</span>
                <span>
                  Publish, manage, and update structured markdown articles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5 select-none">•</span>
                <span>
                  Engage with the engineering community via active comments
                </span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Quick Start Guide",
      content: (
        <div className="space-y-2 text-[11px] font-semibold text-gray-700">
          <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="bg-[#5ea134] text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
              01
            </span>
            <p className="text-gray-600">
              Create your account and authenticate securely with JWT-based authentication and role-based access control.
            </p>
          </div>
          <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="bg-[#5ea134] text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
              02
            </span>
            <p className="text-gray-600">
              Publish and manage blog posts with rich content, and content creation workflows.
            </p>
          </div>
          <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="bg-[#5ea134] text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
              03
            </span>
            <p className="text-gray-600">
              Discover articles through structured categories, intuitive navigation, and personalized content experiences.
            </p>
          </div>
          <div className="flex gap-3 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
            <span className="bg-[#5ea134] text-white rounded-md w-5 h-5 flex items-center justify-center text-[10px] shrink-0 font-mono font-bold">
              04
            </span>
            <p className="text-gray-600">
              Engage with the community by commenting on posts, sharing insights, and participating in meaningful discussions. Manage categories and platform content with admin controls.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Core Principles",
      content: (
        <div className="space-y-3 text-xs font-semibold">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-[#4c8529] tracking-wider block">
              Quality Content
            </span>
            <p className="text-gray-600 pl-2 border-l-2 border-l-[#5ea134]/30">
              Create and share authentic articles and perspectives.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-[#4c8529] tracking-wider block">
              Respectful Discussions
            </span>
            <p className="text-gray-600 pl-2 border-l-2 border-l-red-200">
              Engage in constructive conversations and maintain a welcoming environment.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-red-600 tracking-wider block">
              Authentic Contributions
            </span>
            <p className="text-gray-600 pl-2 border-l-2 border-l-red-200">
              Share accurate information and give proper credit when referencing external sources.
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-black text-red-600 tracking-wider block">
              Content Integrity & Platform Standards
            </span>
            <p className="text-gray-600 pl-2 border-l-2 border-l-red-200">
              Avoid spam, misleading information, and duplicate content. Follow community guidelines to ensure a professional and enjoyable experience for everyone.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "About the Developer",
      content: (
        <div className="space-y-3 text-xs">
          <p className="text-gray-600 font-medium leading-relaxed">
            Designed and built by{" "}
            <span className="font-bold text-gray-900">Siddardha</span>, a
            Computer Science student focusing on full-stack application
            reliability, scalable backend systems, API modeling, and clean
            layout patterns.
          </p>
          <div className="bg-gray-50 rounded-xl p-2.5 border border-gray-100 flex flex-wrap gap-1.5 justify-center text-[10px] font-black text-emerald-800">
            <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-3xs">
              Spring Boot
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-3xs">
              React
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-3xs">
              Tailwind
            </span>
            <span className="bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-3xs">
              PostgreSQL
            </span>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-900/5 shadow-xs p-6 md:p-8 flex flex-col justify-between h-96 w-full relative overflow-hidden">
      <div>
        <header className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-5 pl-1">
          <div className="w-1.5 h-4 bg-[#5ea134] rounded-full"></div>
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
            {slides[currentSlide].title}
          </h4>
        </header>

        <div className="animate-fade-in transition-all duration-300">
          {slides[currentSlide].content}
        </div>
      </div>

      <footer className="pt-3 border-t border-gray-100 flex items-center justify-between select-none">
        <button
          onClick={prevSlide}
          className="text-xs font-black text-gray-400 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          <span className="transform group-hover:-translate-x-0.5 transition-transform">
            ◀
          </span>{" "}
          Prev
        </button>

        <span className="text-[11px] font-black text-emerald-900/40 tracking-widest font-mono">
          {slides[currentSlide].id} / {slides.length}
        </span>

        <button
          onClick={nextSlide}
          className="text-xs font-black text-gray-400 hover:text-emerald-800 transition-colors cursor-pointer flex items-center gap-1 group"
        >
          Next{" "}
          <span className="transform group-hover:translate-x-0.5 transition-transform">
            ▶
          </span>
        </button>
      </footer>
    </div>
  );
}

export default SidebarCarousel;
