"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Faqs from "../components/Home/Faqs";
import Feedback from "../components/Home/feedback";
import styles from "../page.module.css";

const Reveal = ({ children, className = "", delay = 0, style, ...rest }) => {
    const nodeRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) {
            return;
        }

        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
            if (mediaQuery?.matches) {
                setIsVisible(true);
                return;
            }
        }

        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={nodeRef}
            className={[styles.reveal, className, isVisible ? styles.revealVisible : ""].filter(Boolean).join(" ")}
            style={{
                ...(style ?? {}),
                transitionDelay: `${delay}ms`,
            }}
            {...rest}
        >
            {children}
        </div>
    );
};

// import Aboutus from "./Aboutus";

// ============================================
// VALUES DATA - Add your values here
// ============================================

const whyFixNex = [
    {
        title: "Monitor",
        description: "IoT sensors track temperature, power ,water and system health"
    },
    {
        title: "Simplicity",
        description: "AI identifies unusual patterns and prdicts upcoming failures."
    },
    {
        title: "Alert",
        description: "The Fixnex assistant notifies you instantly.."
    },
    {
        title: "Fix",
        description: "A technician is dispatched automatically, efficiently perfectly timed, Result: Fewer Breakdowns, logner asset life, lower costs."
    },

];
const ourValues = [
    {
        title: "Innovation",
        description: "Always improving, always ahead."
    },
    {
        title: "Simplicity",
        description: "Hassle-free from start to finish."
    },
    {
        title: "Trust",
        description: "Transparent pricing, honest service."
    },
    {
        title: "Sustainability",
        description: "Smarter maintenance, longer equipment life."
    }
];

const AboutUsPage = () => {
    return (
        <div className="w-full bg-black h-full relative">
            <div className="w-full bg-black pt-30 relative z-10" >
            <Header/>
           
           <div className="w-full h-full bg-black flex flex-col justify-center items-center  px-4 md:px-20 relative">
            {/* Animated Blue Gradient Glow - Primary Layer (Right Middle) */}
            <div 
                className="absolute top-1/2   left-[80%]  h-[600px] pointer-events-none z-10 animate-pulse-glow"
                style={{
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(80px)',
                }}
            />
            
            {/* Secondary Glow Layer - Cyan for Depth (Right Middle) */}
            <div 
                className="absolute top-1/2 left-[85%] h-[800px] pointer-events-none z-9 animate-pulse-glow-slow"
                style={{
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, rgba(6, 182, 212, 0.12) 30%, transparent 60%)',
                    transform: 'translate(-50%, -50%)',
                    filter: 'blur(100px)',
                }}
            />
            
            <style jsx>{`
                @keyframes pulseGlow {
                    0%, 100% {
                        opacity: 0.6;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.15);
                    }
                }
                
                @keyframes pulseGlowSlow {
                    0%, 100% {
                        opacity: 0.4;
                        transform: translate(-50%, -50%) scale(0.95);
                    }
                    50% {
                        opacity: 0.8;
                        transform: translate(-50%, -50%) scale(1.1);
                    }
                }
                
                .animate-pulse-glow {
                    animation: pulseGlow 3s ease-in-out infinite;
                }
                
                .animate-pulse-glow-slow {
                    animation: pulseGlowSlow 5s ease-in-out infinite;
                }
            `}</style>
            
            {/* Grid Background Pattern */}
            <div 
                className="absolute inset-0 w-full h-full pointer-events-none z-0 "
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(59, 130, 246, 0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '0 0',
                    maskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, rgba(0, 0, 0, 0.5) 50%, rgba(0, 0, 0, 1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 1) 100%)'
                }}
            />
            <div className="relative z-10 w-full ">
                <Reveal data-layer="Frame 48099017" className="Frame48099017 inline-flex flex-col justify-start items-start gap-12">
                    <Reveal data-layer="Frame 48099016" className="Frame48099016 self-stretch flex flex-col justify-start items-start gap-5">
                        <Reveal
                            className="self-stretch text-white text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-medium font-['Space_Grotesk'] leading-snug md:leading-[55.20px]"
                            delay={40}
                        >
                            Our Story FixNex was born from a single idea that maintenance <br/>should be as intelligent as the homes and buildings it protects.
                        </Reveal>
                        <Reveal
                            className="w-full max-w-xl text-white text-base sm:text-lg md:text-xl font-medium leading-7"
                            delay={120}
                        >
                            Founded by an innovative investment group in Dubai, FixNex blends AI, IoT, and automation to redefine property care for the modern world.
                        </Reveal>
                    </Reveal>
                    <Reveal
                        className="self-stretch text-neutral-200 text-sm sm:text-base md:text-lg font-normal font-['Inter'] leading-6"
                        delay={200}
                    >
                        We’re not another maintenance company.   We are the next generation of fixing. <br/>
                        Mission - To revolutionize the maintenance industry through intelligence, prediction, and trust. <br/>
                        Vision - A UAE where every property runs smoothly and sustainably — powered by FixNex technology.<br/>
                    </Reveal>
                </Reveal>

                <div className="mt-20 flex justify-start items-start flex-col w-full">
                    <Reveal className="w-full" delay={40}>
                        <h2 className="text-white text-4xl mb-10 font-medium font-['Space_Grotesk'] leading-[55.20px]">Our Values</h2>
                    </Reveal>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
                        {ourValues.map((value, index) => (
                            <Reveal
                                key={value.title}
                                data-layer={`Frame 48098905-${index}`}
                                className="px-5 py-7 bg-gradient-to-b from-sky-900/20 to-slate-900/20 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-900 inline-flex flex-col justify-start items-start gap-1"
                                delay={80 + index * 80}
                            >
                                <div
                                    data-layer={value.title}
                                    className="self-stretch justify-start text-white text-xl font-normal font-['Poppins'] leading-7 tracking-tight"
                                >
                                    {value.title}
                                </div>
                                <div
                                    data-layer={value.description}
                                    className="self-stretch justify-start text-stone-300 text-base font-light leading-6 tracking-tight"
                                >
                                    {value.description}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div className="mt-20 flex justify-start items-start flex-col w-full">
                    <Reveal className="w-full" delay={40}>
                        <h2 className="text-white text-4xl mb-10 font-medium font-['Space_Grotesk'] leading-[55.20px]">Smarter maintenance, longer equipment life.</h2>
                    </Reveal>
                    <Reveal className="w-full" delay={100}>
                        <span className="text-neutral-200 text-base font-normal leading-6 tracking-tight">
                            Founded by an innovative investment group in Dubai, FixNex blends AI, IoT, and automation to redefine<br/> property care for the modern world.
                        </span>
                    </Reveal>
                    <Reveal className="w-full" delay={160}>
                        <span className="text-neutral-200 text-base font-normal leading-6 tracking-tight my-15">
                            We’re not another maintenance company. <br/>We are the next generation of fixing.<br/>
                            Mission - To revolutionize the maintenance industry through intelligence, prediction, and trust.&nbsp;
                            <br/>Vision - A UAE where every property runs smoothly and sustainably — powered by FixNex technology.
                        </span>
                    </Reveal>
                </div>

                <div className="mt-20 flex justify-start items-start flex-col w-full">
                    <Reveal className="w-full" delay={40}>
                        <h2 className="text-white text-4xl mb-10 font-medium font-['Space_Grotesk'] leading-[55.20px]">Why FixNex</h2>
                    </Reveal>
                    <Reveal className="w-full" delay={100}>
                        <span className="text-neutral-200 text-base font-normal leading-8 tracking-tight ">
                            &nbsp;Our predictive AI monitors your systems 24/7, analyzing data from sensors across your property.<br/>When the system detects an anomaly, FixNex automatically schedules a visit — often before you even know there’s an issue.&nbsp;
                        </span>
                    </Reveal>
                </div>

                <div className="w-full">
                    <div data-layer="Frame 48098987" className="Frame48098987 self-stretch rounded-xl inline-flex justify-start items-center gap-4">
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full my-30 ">
                        {whyFixNex.map((value, index) => (
                            <Reveal
                                key={value.title}
                                data-layer={`Frame 48098905-${index}`}
                                className="px-5 py-7 bg-gradient-to-b from-sky-900/20 to-slate-900/20 rounded-xl outline outline-1 outline-offset-[-1px] outline-sky-900 inline-flex flex-col justify-start items-start gap-1"
                                delay={80 + index * 80}
                            >
                                <div
                                    data-layer={value.title}
                                    className="self-stretch justify-start text-white text-xl font-normal font-['Poppins'] leading-7 tracking-tight"
                                >
                                    {value.title}
                                </div>
                                <div
                                    data-layer={value.description}
                                    className="self-stretch justify-start text-stone-300 text-base font-light leading-6 tracking-tight"
                                >
                                    {value.description}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>


            </div>



        </div>
        <Reveal delay={40}>
            <Feedback/>
        </Reveal>
        <Reveal delay={100}>
            <Faqs/>
        </Reveal>  

           


            </div>
            {/* <Aboutus/> */}
            <Footer/>
        </div>
    )
}

export default AboutUsPage;