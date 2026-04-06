"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion, useSpring, AnimatePresence } from "framer-motion";

// Update this to match your actual total image count
const TOTAL_FRAMES = 192;

// Constant game-style tips
const GAME_TIPS = [
    "Tip: Our cashews are hand-selected for the perfect curve and crunch.",
    "Did you know? Cashews grow outside of the cashew apple as the true fruit.",
    "Tip: Precision roasting unlocks the anti-gravity luxury flavor.",
    "Hint: The golden standard starts with ethical, sustainable sourcing.",
    "System: Preparing the collection... Quality is our signature."
];

export default function ScrollySequence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
    const [activeTip, setActiveTip] = useState(0);

    // Rotate game tips while loading
    useEffect(() => {
        if (imagesLoaded) return;
        const interval = setInterval(() => {
            setActiveTip((prev) => (prev + 1) % GAME_TIPS.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [imagesLoaded]);

    // 1. Preload the Image Sequence
    useEffect(() => {
        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new Image();
            // Assuming format: frame_0000.jpg, frame_0001.jpg
            const frameIndex = i.toString().padStart(4, '0');
            img.src = `/sequence/frame_${frameIndex}.jpg`;

            const checkLoad = () => {
                loadedCount++;
                setLoadProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
                if (loadedCount === TOTAL_FRAMES) setImagesLoaded(true);
            };

            img.onload = checkLoad;
            img.onerror = checkLoad; // Prevents infinite loading if a frame is missing

            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    // 2. Setup Scroll Tracking
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Apply ultra-smooth physics-based interpolation to the scroll sequence (eliminates choppy mouse wheel jumps)
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 25,
        restDelta: 0.0001
    });

    // Map 0 -> 1 scroll to 0 -> 99 index
    const frameIndex = useTransform(smoothProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // 3. Canvas Rendering Loop
    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = (index: number) => {
            const img = images[Math.round(index)];

            // Pure dark background matching image edge
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (!img || !img.complete || img.naturalWidth === 0) return;

            // Cover scaling logic ensuring aspect ratio consistency
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;

            let drawWidth = canvas.width;
            let drawHeight = canvas.height;
            let offsetX = 0;
            let offsetY = 0;

            if (imgRatio > canvasRatio) {
                // Image is wider than canvas relative to height; fit height, crop sides
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
            } else {
                // Image is taller than canvas relative to width; fit width, crop top/bottom
                drawHeight = drawWidth / imgRatio;
                offsetY = (canvas.height - drawHeight) / 2;
            }

            // Apply Real-Time GPU "Ultra-HD" Enhancement Filters (Color Grading)
            // Boosts contrast to deepen blacks, increases saturation for the gold/emerald mix, and applies a tiny sharpen via contrast
            ctx.filter = "contrast(1.15) saturate(1.2) brightness(0.95) drop-shadow(0px 0px 0px black)";

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Reset filter so it doesn't accidentally affect backfill on the next frame loop
            ctx.filter = "none";
        };

        render(0); // Initial frame

        // Re-render when Framer Motion progress updates
        const unsubscribe = frameIndex.on("change", (latest) => render(latest));
        return () => unsubscribe();
    }, [imagesLoaded, images, frameIndex]);

    // Handle Resize Events dynamically (Support True 4K / Ultra HD Retina Screens)
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                // Multiply target literal width by Pixel density to actually pack sharp pixels!
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;

                // Keep the visual size bounded natively via CSS coordinates
                canvasRef.current.style.width = `${window.innerWidth}px`;
                canvasRef.current.style.height = `${window.innerHeight}px`;
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 4. Scroll-linked Typography Animations
    const opacityHero = useTransform(smoothProgress, [0, 0.15, 0.25], [1, 1, 0]);
    const yHero = useTransform(smoothProgress, [0, 0.25], [0, -50]);

    const opacityF1 = useTransform(smoothProgress, [0.2, 0.3, 0.4, 0.5], [0, 1, 1, 0]);
    const yF1 = useTransform(smoothProgress, [0.2, 0.3, 0.5], [50, 0, -50]);

    const opacityF2 = useTransform(smoothProgress, [0.5, 0.6, 0.7, 0.8], [0, 1, 1, 0]);
    const yF2 = useTransform(smoothProgress, [0.5, 0.6, 0.8], [50, 0, -50]);

    const opacityCta = useTransform(smoothProgress, [0.8, 0.9, 1], [0, 1, 1]);
    const yCta = useTransform(smoothProgress, [0.8, 0.9], [50, 0]);

    const pointerEventsCta = useTransform(smoothProgress, [0.8, 0.81], ["none", "auto"]);

    return (
        <div ref={containerRef} id="home" className="h-[400vh] relative bg-[#000000]">
            {/* Header / Navbar Appears at 90% */}
            <motion.nav style={{ opacity: opacityCta, pointerEvents: pointerEventsCta as any }} className="navbar fixed top-0 w-full z-[1000] flex justify-between items-center py-6 px-8 md:px-12 bg-black border-b border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-b-3xl">
                <a href="#home" className="logo font-playfair text-[#D4AF37] tracking-[4px] cursor-pointer hover:text-[#F3E5AB] transition">QASHEW</a>
                <div
                    className={`hamburger flex flex-col gap-[6px] cursor-pointer z-[1001] ${menuOpen ? 'active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <div className="line w-[30px] h-[2px] bg-[#D4AF37] transition-all"></div>
                    <div className="line w-[30px] h-[2px] bg-[#D4AF37] transition-all"></div>
                    <div className="line w-[30px] h-[2px] bg-[#D4AF37] transition-all"></div>
                </div>
            </motion.nav>

            <motion.div style={{ opacity: opacityCta, pointerEvents: pointerEventsCta as any }} className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
                <div className="mobile-links">
                    <a href="/#home" onClick={() => setMenuOpen(false)}>Home</a>
                    <a href="/mission" onClick={() => setMenuOpen(false)}>Mission</a>
                    <a href="/#craftsmanship" onClick={() => setMenuOpen(false)}>Craftsmanship</a>
                    <a href="/#products" onClick={() => setMenuOpen(false)}>Collection</a>
                    <a href="/#export" onClick={() => setMenuOpen(false)}>Global</a>
                </div>
            </motion.div>

            {/* Loading State */}
            {!imagesLoaded && (
                <div className="fixed inset-0 min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] z-[9999] border-y-[4px] border-[#D4AF37]/20 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,30,20,0.6)_0%,rgba(5,5,5,1)_100%)] pointer-events-none"></div>
                    
                    <div className="relative flex flex-col items-center justify-center gap-6 z-10 w-full px-8">
                        {/* Luxury Cashew Animation */}
                        <motion.div 
                            className="relative flex items-center justify-center w-40 h-40 mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            {/* Outer ethereal rings */}
                            <motion.div 
                                className="absolute inset-0 border-[1px] border-[#D4AF37]/20 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div 
                                className="absolute inset-4 border-[1px] border-dashed border-[#D4AF37]/30 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Floating Cashew Core */}
                            <motion.div
                                animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative z-10 flex items-center justify-center"
                            >
                                <svg width="70" height="90" viewBox="0 0 70 90" className="drop-shadow-[0_0_25px_rgba(212,175,55,0.8)]">
                                    <defs>
                                        <linearGradient id="cashew-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.95" />
                                            <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#8A6327" stopOpacity="1" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                            <feMerge>
                                                <feMergeNode in="coloredBlur"/>
                                                <feMergeNode in="SourceGraphic"/>
                                            </feMerge>
                                        </filter>
                                    </defs>
                                    
                                    {/* The Cashew Nut Path */}
                                    <motion.path
                                        d="M 28 12 C 55 2 75 35 50 65 C 25 95 -10 65 12 45 C 20 38 20 22 28 12 Z"
                                        stroke="#F3E5AB"
                                        strokeWidth="2"
                                        fill="url(#cashew-gradient)"
                                        filter="url(#glow)"
                                        initial={{ pathLength: 0, opacity: 0.2 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                    
                                    {/* Inner sheen line for 3D effect */}
                                    <motion.path
                                        d="M 32 18 C 50 12 65 35 48 58"
                                        stroke="#FFFFFF"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        fill="transparent"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.6 }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    />
                                </svg>
                            </motion.div>

                            {/* Orbiting Sparkles */}
                            <motion.div 
                                className="absolute inset-0"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#F3E5AB] rounded-full shadow-[0_0_10px_#F3E5AB] -translate-x-1/2 -translate-y-1/2"></div>
                            </motion.div>
                            <motion.div 
                                className="absolute inset-2"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_#D4AF37] translate-x-1/2 translate-y-1/2"></div>
                            </motion.div>
                        </motion.div>

                        {/* QASHEW Text Shimmer */}
                        <div className="text-3xl md:text-5xl font-bold tracking-[0.4em] text-center uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
                            <span className="text-[#C8A97E] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                                QASHEW
                            </span>
                        </div>

                        {/* Game-style Cashew Progress Bar */}
                        <div className="w-64 md:w-96 mt-6 flex flex-col items-center relative">
                            <div className="flex justify-between w-full mb-4 px-1">
                                <span className="text-[#D4AF37] font-mono text-[10px] tracking-widest uppercase animate-pulse">Loading Assets</span>
                                <span className="text-[#D4AF37] font-mono text-[10px] tracking-widest">{loadProgress}%</span>
                            </div>
                            
                            {/* Track Container */}
                            <div className="w-full h-[3px] bg-white/10 relative rounded-full">
                                
                                {/* Filled Track */}
                                <motion.div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#C8A97E] to-[#F3E5AB] rounded-full shadow-[0_0_12px_rgba(212,175,55,0.8)]"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${loadProgress}%` }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                />

                                {/* Travelling Cashew Animation Node */}
                                <motion.div 
                                    className="absolute top-1/2 -mt-4 -ml-4 w-8 h-8 flex items-center justify-center pointer-events-none drop-shadow-[0_0_10px_rgba(212,175,55,1)]"
                                    initial={{ left: "0%" }}
                                    animate={{ left: `${loadProgress}%` }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                >
                                    <motion.svg 
                                        width="100%" height="100%" viewBox="0 0 70 90" 
                                        animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <path
                                            d="M 28 12 C 55 2 75 35 50 65 C 25 95 -10 65 12 45 C 20 38 20 22 28 12 Z"
                                            fill="url(#mini-cashew-gradient)"
                                            stroke="#FFFFFF"
                                            strokeWidth="1.5"
                                        />
                                        <defs>
                                            <linearGradient id="mini-cashew-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#F3E5AB" />
                                                <stop offset="100%" stopColor="#D4AF37" />
                                            </linearGradient>
                                        </defs>
                                    </motion.svg>
                                </motion.div>
                            </div>
                        </div>

                        {/* Rotating Game Tips */}
                        <div className="h-10 mt-4 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p 
                                    key={activeTip}
                                    initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                                    transition={{ duration: 0.6 }}
                                    className="tracking-[0.2em] uppercase text-[9px] md:text-[10px] text-[#C8A97E]/70 font-light text-center max-w-sm px-4"
                                >
                                    {GAME_TIPS[activeTip]}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}

            <div className={`sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transition-opacity duration-1000 ${imagesLoaded ? "opacity-100" : "opacity-0"}`}>

                {/* Render Canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* Cinematic "8K Film" Overlay: Subtle vignette shadow + digital noise grain to mask JPEG compression and add high-end texture */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>

                {/* Text Overlay Layer */}
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 z-10 pointer-events-none">

                    {/* 0% Scroll: Hero */}
                    <motion.div style={{ opacity: opacityHero, y: yHero }} className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-white/90">
                            True Quality Has The Taste
                        </h1>
                    </motion.div>

                    {/* 30% Scroll: Mission */}
                    <motion.div style={{ opacity: opacityF1, y: yF1 }} className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 max-w-lg">
                        <p className="text-[#D4AF37] tracking-[0.4em] text-sm font-semibold mb-4 uppercase drop-shadow-md">
                            Our Mission
                        </p>
                        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white/90 mb-6" style={{ fontFamily: 'Playfair Display, serif', textShadow: '0px 4px 20px rgba(0,0,0,0.6)' }}>
                            A heritage of excellence.
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light drop-shadow-lg">
                            To redefine the standard of luxury snacking through uncompromising quality, sustainable sourcing, and artisanal craftsmanship.
                        </p>
                    </motion.div>

                    {/* 60% Scroll: Feature 2 */}
                    <motion.div style={{ opacity: opacityF2, y: yF2 }} className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 max-w-md text-right">
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white/90 mb-4">
                            Golden standard from the inside out.
                        </h2>
                        <p className="text-lg text-white/60">
                            From the roasted perfection down to the pure elements of nature.
                        </p>
                    </motion.div>

                    {/* 90% Scroll: CTA */}
                    <motion.div style={{ opacity: opacityCta, y: yCta }} className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center flex flex-col items-center pointer-events-auto px-4">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest text-white mb-4 uppercase relative z-10" style={{ fontFamily: 'Playfair Display, serif', textShadow: '0px 10px 30px rgba(0,0,0,0.8), 0px 0px 20px rgba(212,175,55,0.3)' }}>
                            QASHEW COMPANY
                        </h2>

                        <p className="text-[#D4AF37] tracking-[0.4em] text-xs md:text-sm font-semibold mb-10 uppercase relative z-10 drop-shadow-lg">
                            Because Quality Is Our Signature
                        </p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
