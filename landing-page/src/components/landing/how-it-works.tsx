"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, Lightbulb, Rocket, Volume2, VolumeX, Play, Pause } from "lucide-react";
import Container from "../global/container";

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const STEPS = [
    {
        id: "01",
        title: "Describe your product",
        description: "Share your idea in plain language. Explain what you're building, who it's for, and the core problem it solves.",
        icon: Lightbulb,
    },
    {
        id: "02",
        title: "Generate artifacts",
        description: "ProdMate instantly creates roadmaps, user stories, API designs, schemas, and technical documentation.",
        icon: Cpu,
    },
    {
        id: "03",
        title: "Build with confidence",
        description: "Use the generated blueprints as a foundation for development and collaborate with your team effectively.",
        icon: Rocket,
    }
];

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------

const HowItWorks = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <section className="relative w-full pt-12 md:pt-20 pb-28 md:pb-40 bg-[#09090b] border-y border-white/[0.05] overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/3 left-1/2 -z-10 w-[700px] h-[450px] -translate-x-1/2 blur-[160px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-blue-600/15 pointer-events-none"></div>

            <Container>
                <div className="flex flex-col items-center w-full max-w-5xl mx-auto">

                    {/* ========================================== */}
                    {/* HEADER SECTION                             */}
                    {/* ========================================== */}
                    <div className="flex flex-col items-center text-center max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_0_20px_rgba(134,120,249,0.1)] hover:border-white/[0.15] transition-all duration-300"
                        >
                            <div className="flex items-center justify-center w-2 h-2 rounded-full bg-[#8678f9] animate-pulse"></div>
                            <span className="text-[11px] font-medium tracking-[0.06em] uppercase bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe] bg-[200%_auto] bg-clip-text text-transparent">
                                Interactive Product Demo
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#ededed] leading-[1.12]"
                        >
                            From raw idea to <br className="hidden md:block" />{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b2a8fd] via-[#8678f9] to-[#c7d2fe]">
                                engineering blueprint.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-base leading-relaxed md:text-lg text-[#a1a1aa] max-w-2xl"
                        >
                            Watch how ProdMate transforms a simple prompt into a structured, production-ready development architecture in seconds.
                        </motion.p>
                    </div>

                    {/* ========================================== */}
                    {/* SAFARI DEMO VIDEO FRAME                    */}
                    {/* ========================================== */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        className="w-full relative mt-14 md:mt-20 group"
                    >
                        {/* Ambient Glow behind window */}
                        <div className="absolute -inset-4 -z-10 blur-[100px] bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-blue-500/20 opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        <div className="relative bg-[#0a0a0c] rounded-xl md:rounded-2xl border border-white/[0.1] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col transition-all duration-500 hover:border-white/[0.18]">
                            {/* Authentic Dark Mode Safari Header */}
                            <div className="flex items-center w-full px-4 h-12 border-b border-white/[0.08] bg-[#1c1c1e]/90 backdrop-blur-md flex-shrink-0 relative select-none">

                                {/* macOS Traffic Light Controls */}
                                <div className="flex gap-2 absolute left-4 top-1/2 -translate-y-1/2">
                                    <div className="w-3 h-3 rounded-full bg-[#ED6A5E] border border-[#d24e43] shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#F4BF4F] border border-[#d6a241] shadow-sm"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#61C554] border border-[#4da841] shadow-sm"></div>
                                </div>

                                {/* Safari URL Bar */}
                                <div className="mx-auto flex items-center justify-center h-7 px-8 md:px-32 bg-[#09090b]/80 border border-white/[0.08] rounded-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]">
                                    <div className="flex items-center gap-1.5 text-white/50 text-[11px] md:text-xs font-medium tracking-wide">
                                        <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        prodmate.dev
                                    </div>
                                </div>
                            </div>

                            {/* Video Container */}
                            <div 
                                className="relative w-full aspect-video bg-black cursor-pointer overflow-hidden group/video"
                                onClick={() => togglePlay()}
                            >
                                <video
                                    ref={videoRef}
                                    src="https://pub-3b2ce5759e8b401ba99b5a001278e200.r2.dev/Final%20Prodmate.mp4"
                                    autoPlay
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-[1.01]"
                                />
                                
                                {/* Inner ring to prevent video bleeding over the border curve */}
                                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.05]"></div>

                                {/* Subtle Dark Gradient Overlay at bottom for controls visibility */}
                                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none opacity-90 transition-opacity duration-300"></div>

                                {/* Custom Floating Interactive Video Controls */}
                                <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 z-20 flex items-center gap-2.5 md:gap-3">
                                    <button
                                        onClick={togglePlay}
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                                        title={isPlaying ? "Pause Demo" : "Play Demo"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-4 h-4 text-white group-hover/btn:text-[#8678f9] transition-colors" />
                                        ) : (
                                            <Play className="w-4 h-4 text-white ml-0.5 group-hover/btn:text-[#8678f9] transition-colors" />
                                        )}
                                    </button>

                                    <button
                                        onClick={toggleMute}
                                        className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/75 hover:bg-black/95 text-white text-xs md:text-sm font-medium border border-white/20 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 group/btn"
                                    >
                                        {isMuted ? (
                                            <>
                                                <VolumeX className="w-4 h-4 text-[#a1a1aa] group-hover/btn:text-white transition-colors" />
                                                <span className="text-[#d4d4d8] group-hover/btn:text-white transition-colors">Tap to Unmute Demo</span>
                                            </>
                                        ) : (
                                            <>
                                                <Volume2 className="w-4 h-4 text-[#8678f9] animate-pulse" />
                                                <span className="text-white font-semibold">Voice Enabled</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ========================================== */}
                    {/* CRISP 3-COLUMN GRID CARDS                  */}
                    {/* ========================================== */}
                    <div className="grid w-full grid-cols-1 gap-6 mt-16 md:mt-24 md:grid-cols-3 md:gap-6 lg:gap-8">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                                    className="relative flex flex-col p-6 md:p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.2] hover:bg-white/[0.06] transition-all duration-300 group shadow-lg hover:shadow-[0_10px_30px_rgba(134,120,249,0.08)] hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Top border glow on hover */}
                                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8678f9]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="flex items-center justify-between w-full mb-8">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] group-hover:text-[#8678f9] group-hover:border-[#8678f9]/30 group-hover:bg-[#8678f9]/10 transition-all duration-300 shadow-inner">
                                            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-sm font-mono font-bold text-white/20 group-hover:text-[#8678f9]/80 transition-colors duration-300">
                                            {step.id}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-lg font-semibold tracking-tight text-[#ededed] group-hover:text-white transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] leading-relaxed text-[#a1a1aa] group-hover:text-[#d4d4d8] transition-colors">
                                        {step.description}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default HowItWorks;