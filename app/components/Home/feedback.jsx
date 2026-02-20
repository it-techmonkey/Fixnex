const Feedback = () => {
    const testimonials = [
        {
            name: "Ahmed Hassan",
            handle: "@ahmedhassan",
            text: "I booked my service online, and the issue was fixed the very same day. There were no phone calls, no complications just a smooth, efficient process from start to finish. It was one of the easiest repair experiences I've ever had.",
            avatar: "AH"
        },
        {
            name: "Fatima Ali",
            handle: "@fatimaali",
            text: "The team identified a potential issue with my AC before it even stopped working, which saved me a lot of trouble later on. Their attention to detail and proactive approach were truly impressive. I highly recommend their services for anyone who values reliability and expertise.",
            avatar: "FA"
        },
        {
            name: "Muhammad Ibrahim",
            handle: "@mibrahim",
            text: "The pricing was completely transparent, and the response time was outstanding. Every step of the job was completed exactly as promised and on schedule. It's refreshing to work with a company that delivers precisely what they advertise.",
            avatar: "MI"
        },
        {
            name: "Aisha Khan",
            handle: "@aishakhan",
            text: "Booking through the website was quick and straightforward, and I received regular updates until the work was completed. The communication was clear and consistent throughout the process. It couldn't have been easier to get everything taken care of.",
            avatar: "AK"
        },
        {
            name: "Omar Khalid",
            handle: "@omarkhalid",
            text: "FixNex continues to impress with their reliability and professionalism. The process is simple, the pricing is honest, and there are never any hidden fees.",
            avatar: "OK"
        },
        {
            name: "Zainab Malik",
            handle: "@zainabmalik",
            text: "My washing machine broke down on a Friday evening, and I thought I'd have to wait until Monday. But FixNex had someone at my door the next morning. The technician was professional, fixed it quickly, and the price was exactly what was quoted online. No surprises, just great service.",
            avatar: "ZM"
        },
        {
            name: "Yusuf Rahman",
            handle: "@yusufr",
            text: "I've used FixNex for multiple services now - AC maintenance, appliance repair, and even some home automation. Each time, the experience has been consistent: fast booking, transparent pricing, and quality work. They've become my go-to for all home services.",
            avatar: "YR"
        },
        {
            name: "Amina Sheikh",
            handle: "@aminasheikh",
            text: "What I love most about FixNex is how they explain everything clearly. The technician took time to show me what was wrong, what they were fixing, and how to prevent similar issues. It's not just about fixing things - they actually care about educating their customers.",
            avatar: "AS"
        }
    ];

    // Split into two rows (4 cards each)
    const row1 = testimonials.slice(0, 4);
    const row2 = testimonials.slice(4, 8);

    // Duplicate for seamless infinite scroll (need at least 2 copies for seamless loop)
    const duplicatedRow1 = [...row1, ...row1];
    const duplicatedRow2 = [...row2, ...row2];

    const formatText = (text) => {
        const parts = text.split(/(@\w+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="text-blue-400">{part}</span>;
            }
            return part;
        });
    };

    const TestimonialCard = ({ testimonial }) => (
        <div className="bg-[#17181b] rounded-xl p-4 sm:p-6 flex flex-col gap-4 hover:bg-gray-800/90 transition-colors shrink-0 w-[220px] sm:w-[300px] md:w-[340px] lg:w-[380px]">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-[10px] sm:text-sm font-medium border-2 border-gray-700">
                    {testimonial.avatar}
                </div>
                <div className="flex flex-col">
                    <div className="text-white text-sm sm:text-base font-medium">
                        {testimonial.name}
                    </div>
                    <div className="text-neutral-400 text-xs sm:text-sm">
                        {testimonial.handle}
                    </div>
                </div>
            </div>
            <div className="text-gray-200 text-xs leading-5 sm:text-sm sm:leading-6">
                {formatText(testimonial.text)}
            </div>
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes scrollLeftToRight {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                @keyframes scrollRightToLeft {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                
                .animate-scroll-ltr {
                    animation: scrollLeftToRight 40s linear infinite;
                }
                
                .animate-scroll-rtl {
                    animation: scrollRightToLeft 40s linear infinite;
                }

                @media (max-width: 640px) {
                    .animate-scroll-ltr {
                        animation-duration: 10s;
                    }
                    .animate-scroll-rtl {
                        animation-duration: 10s;
                    }
                }
            `}</style>
            
            <div className="w-full py-12  sm:px-6 lg:px-8 bg-black overflow-hidden">
                <div className="mx-auto flex flex-col items-center text-center gap-3 mb-10 sm:mb-12 max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
                        Testimonials
                    </div>
                    <div className="text-white text-3xl sm:text-4xl font-medium font-['Space_Grotesk'] leading-tight sm:leading-[55.20px]">
                        Trusted by thousands
                    </div>
                    <span className="text-neutral-500 text-sm sm:text-base font-normal leading-6 tracking-tight max-w-xl">
                        Here's what People are saying about us
                    </span>
                </div>
                
                {/* First Row - Left to Right (cards flow from left to right) */}
                <div className="relative overflow-hidden mb-6 sm:mb-8">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black via-black/80 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-black via-black/80 to-transparent" />
                    <div className="flex animate-scroll-ltr gap-4 sm:gap-5">
                        {duplicatedRow1.map((testimonial, index) => (
                            <TestimonialCard key={`row1-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
                
                {/* Second Row - Right to Left (cards flow from right to left, opposite direction) */}
                <div className="relative overflow-hidden">
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-black via-black/80 to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-black via-black/80 to-transparent" />
                    <div className="flex animate-scroll-rtl gap-4 sm:gap-5">
                        {duplicatedRow2.map((testimonial, index) => (
                            <TestimonialCard key={`row2-${index}`} testimonial={testimonial} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Feedback;