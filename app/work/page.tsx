"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./work.css";

// Interface for website project data
interface Project {
  id: string;
  num: string;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  tech: string;
  url: string;
}

// Initial project dataset spanning multiple industries
const ALL_PROJECTS: Project[] = [
  {
    id: "1",
    num: "01",
    title: "Nova Luxe Penthouses",
    category: "Real Estate",
    description: "A luxury cinema-driven real estate platform for high-end boutique penthouses in Monaco. Features interactive 3D floor plans and drone-integrated video layers.",
    image: "/previews/real_estate.png",
    client: "Monaco Estates Group",
    tech: "Next.js / React Three Fiber / WebGL",
    url: "https://nova-luxe-realestate.example.com"
  },
  {
    id: "2",
    num: "02",
    title: "Aether Telehealth",
    category: "Health",
    description: "Futuristic digital health dashboard offering real-time patient visits, vital scans syncing, and AI-powered biometric analysis in a dark luxury interface.",
    image: "/previews/health.png",
    client: "Aether Health LLC",
    tech: "Next.js / Socket.io / TailwindCSS",
    url: "https://aether-health-telemed.example.com"
  },
  {
    id: "3",
    num: "03",
    title: "Veloce Customizer",
    category: "Ecommerce",
    description: "High-end conceptual electric vehicle storefront with full 3D customizer, modular parts checkout, and instantaneous server-side cart updates.",
    image: "/previews/ecommerce.png",
    client: "Veloce Motorworks",
    tech: "Next.js / Shopify API / GSAP",
    url: "https://veloce-ev-store.example.com"
  },
  {
    id: "4",
    num: "04",
    title: "Krypton Web3 Capital",
    category: "Corporate",
    description: "Corporate landing page and investment hub for a venture capital fund focusing on Web3 projects and quantum computing startups. Minimalist neon outlines.",
    image: "/previews/corporate.png",
    client: "Krypton Capital",
    tech: "HTML5 / GSAP / Canvas Particles",
    url: "https://krypton-corp.example.com"
  },
  {
    id: "5",
    num: "05",
    title: "Verdant Canopy Villas",
    category: "Real Estate",
    description: "Eco-resort booking system showcasing botanical design integrations, local climate trackers, and virtual walkthroughs of treehouse villas.",
    image: "/previews/real_estate.png",
    client: "Verdant Resorts",
    tech: "Next.js / Gatsby Engine / Framer Motion",
    url: "https://verdant-canopy-villas.example.com"
  },
  {
    id: "6",
    num: "06",
    title: "Pulse Cardiology",
    category: "Health",
    description: "Clinical patient portal tracking cardiology trials, real-time heart rate summaries, and research literature grids with dynamic search indexes.",
    image: "/previews/health.png",
    client: "Pulse Medical Labs",
    tech: "React / Recharts / TailwindCSS",
    url: "https://pulse-cardio-health.example.com"
  },
  {
    id: "7",
    num: "07",
    title: "Aura Premium Chrono",
    category: "Ecommerce",
    description: "Immersive high-fashion watches storefront featuring smooth parallax scroll animations, video catalogs, and customized strap configurations.",
    image: "/previews/ecommerce.png",
    client: "Aura Watches",
    tech: "Next.js / Sanity CMS / Lenis Scroll",
    url: "https://aura-watches-store.example.com"
  },
  {
    id: "8",
    num: "08",
    title: "Socrates LMS",
    category: "Education",
    description: "University-grade learning management platform incorporating AI teaching assistants, multi-user whiteboard sharing, and live math editors.",
    image: "/previews/corporate.png",
    client: "Socrates Education",
    tech: "Next.js / WebSockets / Radix UI",
    url: "https://socrates-uni-edu.example.com"
  }
];

const FILTER_CATEGORIES = [
  "All Projects",
  "Corporate",
  "Ecommerce",
  "Education",
  "Health",
  "Real Estate"
];

export default function WorkPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const leftReelRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState("All Projects");
  const filteredProjects = ALL_PROJECTS.filter(
    (p) => selectedFilter === "All Projects" || p.category === selectedFilter
  );

  // Animation values using refs to run in requestAnimationFrame for high performance
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  
  // React State for current index to drive React render
  const [scrollYState, setScrollYState] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Configuration constants
  const heightPerProject = isMobile ? 120 : 180; // Distance of scroll mapped to one slot
  const angleSpacing = isMobile ? 22 : 30; // Angle degrees between frames
  const numProjects = filteredProjects.length || 1;

  // Responsive Layout detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync scroll target bounds when the project dataset changes due to filtering
  useEffect(() => {
    // Reset scroll values on filter change to snap clean
    targetScrollYRef.current = 0;
    scrollYRef.current = 0;
    setScrollYState(0);
  }, [selectedFilter]);

  // Main Scroll & Touch Listeners
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent standard document scrolling on desktop
      if (!isMobile) {
        e.preventDefault();
        targetScrollYRef.current += e.deltaY * 0.75; // Adjust scrolling speed
        lastScrollTimeRef.current = Date.now();
      }
    };

    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("wheel", handleWheel, { passive: false });
    }

    // Touch Event Handling for Mobile / Trackpad swipe
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      
      if (isMobile) {
        // Mobile horizontal swipe
        const deltaX = touchStartX - touchX;
        targetScrollYRef.current += deltaX * 1.2;
        touchStartX = touchX;
      } else {
        // Desktop vertical swipe
        const deltaY = touchStartY - touchY;
        targetScrollYRef.current += deltaY * 1.5;
        touchStartY = touchY;
      }
      lastScrollTimeRef.current = Date.now();
    };

    const leftReel = leftReelRef.current;
    if (leftReel) {
      leftReel.addEventListener("touchstart", handleTouchStart, { passive: true });
      leftReel.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    return () => {
      if (wrapper) wrapper.removeEventListener("wheel", handleWheel);
      if (leftReel) {
        leftReel.removeEventListener("touchstart", handleTouchStart);
        leftReel.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [isMobile]);

  // Smooth Interpolation & Snapping Animation Loop
  useEffect(() => {
    let animId: number;

    const update = () => {
      const diff = targetScrollYRef.current - scrollYRef.current;
      
      // Apply smooth easing (inertia)
      scrollYRef.current += diff * 0.08;

      // Auto-snap when scroll stops for 180ms
      const timeSinceLastScroll = Date.now() - lastScrollTimeRef.current;
      if (timeSinceLastScroll > 180) {
        const snapTarget = Math.round(targetScrollYRef.current / heightPerProject) * heightPerProject;
        const snapDiff = snapTarget - targetScrollYRef.current;
        targetScrollYRef.current += snapDiff * 0.12; // Snap easing
      }

      setScrollYState(scrollYRef.current);
      animId = requestAnimationFrame(update);
    };

    animId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animId);
  }, [heightPerProject]);

  // Compute indices
  const currentFraction = scrollYState / heightPerProject;
  const activeIndex = Math.round(currentFraction);
  
  // Looped active project for details view
  const loopedActiveIndex = ((activeIndex % numProjects) + numProjects) % numProjects;
  const activeProject = filteredProjects[loopedActiveIndex] || filteredProjects[0];

  // Helper function to snap the reel to a specific index
  const snapToProjectIndex = (index: number) => {
    // Find closest slot representing this project index
    const currentLooped = ((activeIndex % numProjects) + numProjects) % numProjects;
    let diff = index - currentLooped;
    
    // Find shortest wrap-around distance
    if (diff > numProjects / 2) diff -= numProjects;
    if (diff < -numProjects / 2) diff += numProjects;

    const newTargetIndex = activeIndex + diff;
    targetScrollYRef.current = newTargetIndex * heightPerProject;
    lastScrollTimeRef.current = Date.now();
  };

  // Generate slot list in viewport range [-5, +5] around activeIndex
  const visibleSlots = [];
  const range = isMobile ? 3 : 5; // number of items shown on each side
  for (let i = activeIndex - range; i <= activeIndex + range; i++) {
    visibleSlots.push(i);
  }

  // Calculate coordinates for Desktop C-Shape
  const getDesktopCoords = (slotIndex: number) => {
    const phi = (slotIndex - currentFraction) * angleSpacing;
    const rad = (phi * Math.PI) / 180;
    
    const radius = 260; // R (More compact to prevent overflow)
    const offsetLeft = -140; // d (Shifted further left to wrap around the side of the screen)
    const offsetTop = 70; // Shift center 70px below the middle (little up)
    
    const tx = offsetLeft + radius * Math.cos(rad);
    const ty = offsetTop + radius * Math.sin(rad);
    
    return { tx, ty, rot: phi };
  };

  // Calculate coordinates for Mobile curved dome at bottom
  const getMobileCoords = (slotIndex: number) => {
    const phi = (slotIndex - currentFraction) * angleSpacing;
    const rad = (phi * Math.PI) / 180;
    
    const radius = 300; // R on mobile
    const tx = radius * Math.sin(rad);
    
    // Creating upward curved dome (dome shape)
    const ty = -radius * Math.cos(rad) + radius - 60;
    
    return { tx, ty, rot: phi };
  };

  return (
    <div className="work-page-wrapper" ref={wrapperRef}>
      {/* Cinematic Ambient Lights */}
      <div className="ambient-glow-top"></div>
      <div className="ambient-glow-bottom"></div>

      <div className="work-container">
        
        {/* LEFT SIDE: Vertical Film Reel Navigator */}
        <aside className="left-sidebar-reel" ref={leftReelRef}>
          {!isMobile && <div className="reel-hollow-guide"></div>}
          
          <div className="film-reel-viewport">
            <div className="film-slot-container">
              {visibleSlots.map((slotIndex) => {
                const projectIndex = ((slotIndex % numProjects) + numProjects) % numProjects;
                const project = filteredProjects[projectIndex];
                if (!project) return null;

                const { tx, ty, rot } = isMobile 
                  ? getMobileCoords(slotIndex) 
                  : getDesktopCoords(slotIndex);

                const slotPhi = (slotIndex - currentFraction) * angleSpacing;
                const slotRad = (slotPhi * Math.PI) / 180;
                const slotOpacity = Math.max(0, Math.cos(slotRad));

                const isActive = slotIndex === activeIndex;

                return (
                  <div
                    key={slotIndex}
                    className={`film-slot ${isActive ? "active-slot" : ""}`}
                    style={{
                      transform: `translate3d(${tx}px, ${ty}px, 0px) rotate(${rot}deg)`,
                      zIndex: isActive ? 10 : 5 - Math.abs(slotIndex - activeIndex),
                      opacity: isActive ? 1 : slotOpacity * 0.65,
                      pointerEvents: slotOpacity > 0.1 ? "auto" : "none"
                    }}
                  >
                    <div 
                      className="film-frame"
                      onClick={() => snapToProjectIndex(projectIndex)}
                    >
                      <div className="film-image-wrapper">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="film-image"
                          draggable="false"
                        />
                      </div>
                    </div>

                    {/* Metadata showing number & category beside the frame */}
                    <div className="film-meta">
                      <span className="project-num">{project.num}</span>
                      <span className="project-title-reel">{project.title}</span>
                      <span className="project-cat">{project.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE: Hero header, dynamic filters, detailed showcase, and project cards */}
        <main className="right-content-area" ref={rightContentRef}>
          
          {/* Portfolio Hero Header */}
          <section className="portfolio-hero">
            <span className="hero-tag">OUR WORK</span>
            <h1 className="hero-title">Websites We&apos;ve Built</h1>
            <p className="hero-desc">
              Explore our physical archive of high-performance digital systems. 
              Scroll to spin the reel, or filter projects below.
            </p>
          </section>

          {/* Filter Tabs */}
          <nav className="filters-bar">
            {FILTER_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`filter-tab ${selectedFilter === category ? "active-tab" : ""}`}
                onClick={() => setSelectedFilter(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          {/* Active Project Detailed Showcase Panel */}
          {activeProject && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="active-showcase-panel"
              >
                <div className="showcase-header">
                  <div className="showcase-title-area">
                    <span className="showcase-num">PROJECT {activeProject.num}</span>
                    <h2 className="showcase-title">{activeProject.title}</h2>
                  </div>
                  <span className="showcase-category">{activeProject.category}</span>
                </div>

                <div className="showcase-body">
                  <div className="showcase-visual" onClick={() => window.open(activeProject.url, "_blank")}>
                    <img
                      src={activeProject.image}
                      alt={activeProject.title}
                      className="showcase-preview-img"
                    />
                    <div className="showcase-overlay-glow"></div>
                  </div>

                  <div className="showcase-desc-area">
                    <p className="showcase-desc">{activeProject.description}</p>
                    
                    <div className="showcase-specs">
                      <div className="spec-item">
                        <span className="spec-label">CLIENT</span>
                        <span className="spec-val">{activeProject.client}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">STACK</span>
                        <span className="spec-val">{activeProject.tech}</span>
                      </div>
                    </div>

                    <button 
                      className="showcase-btn"
                      onClick={() => window.open(activeProject.url, "_blank")}
                    >
                      LAUNCH ARCHIVE WEBSITE
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 2H13V12M13 2L2 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Dynamic Grid: Lists other projects in active category */}
          <section className="grid-section">
            <h3 className="grid-section-title">Archive Directory</h3>
            
            <div className="portfolio-grid">
              {filteredProjects.map((project, idx) => {
                const isActive = activeProject && activeProject.id === project.id;
                
                return (
                  <div
                    key={project.id}
                    className={`project-grid-card ${isActive ? "active-grid-card" : ""}`}
                    onClick={() => snapToProjectIndex(idx)}
                  >
                    <div className="card-img-wrapper">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="card-img"
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-tag-row">
                        <span className="card-category">{project.category}</span>
                        <span className="card-num">{project.num}</span>
                      </div>
                      <h4 className="card-title">{project.title}</h4>
                      <p className="card-desc">{project.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* Visual Mouse Scroll Indication Hint Overlay (Desktop Only) */}
      {!isMobile && (
        <div className="scroll-hint-overlay">
          <div className="scroll-hint-mouse">
            <div className="scroll-hint-wheel"></div>
          </div>
          <span>Scroll to rotate archive</span>
        </div>
      )}
    </div>
  );
}
