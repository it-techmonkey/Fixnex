import React from 'react';

/**
 * FixNex Icon Library
 * Organized by category for easy discovery and maintenance
 */

// ============================================
// NAVIGATION ICONS
// ============================================

export const ArrowRight = ({ className = "", width = 26, height = 26 }) => (
    <svg width={width} height={height} viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21.9375 13L4.0625 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11.375 20.3125L4.0625 13L11.375 5.6875" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// ============================================
// HOME & PROPERTY MAINTENANCE ICONS
// ============================================

export const Fan = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_fan)">
            <path d="M29.125 16.8752C28.8222 15.7441 28.2587 14.6995 27.4797 13.8253C26.7006 12.951 25.7277 12.2713 24.6388 11.8406C23.5499 11.4098 22.3753 11.2401 21.209 11.3449C20.0427 11.4496 18.9172 11.8261 17.9225 12.444L19.9712 4.26397C20.0221 4.06073 20.0078 3.84667 19.9304 3.65199C19.853 3.45732 19.7165 3.29185 19.54 3.17897C18.6895 2.64191 17.7396 2.28143 16.7469 2.11897C15.7542 1.95651 14.739 1.9954 13.7617 2.23332C12.7843 2.47124 11.8648 2.90333 11.0579 3.50387C10.251 4.10442 9.57306 4.86115 9.06456 5.72904C8.55606 6.59693 8.22733 7.55824 8.09794 8.55577C7.96855 9.5533 8.04114 10.5667 8.3114 11.5356C8.58166 12.5045 9.04405 13.4091 9.67107 14.1957C10.2981 14.9822 11.0769 15.6346 11.9612 16.114L3.85248 18.4302C3.65104 18.4876 3.47269 18.6068 3.34261 18.7709C3.21252 18.9351 3.13728 19.136 3.12748 19.3452C3.05052 21.0526 3.55903 22.7351 4.5688 24.114C5.57856 25.493 7.02902 26.4856 8.67999 26.9277C9.31676 27.0987 9.97316 27.1857 10.6325 27.1865C11.6372 27.1838 12.6311 26.9795 13.5554 26.5858C14.4798 26.192 15.3157 25.6168 16.0136 24.8941C16.7116 24.1714 17.2574 23.316 17.6188 22.3786C17.9802 21.4411 18.1498 20.4406 18.1175 19.4365L24.1775 25.3015C24.3282 25.4473 24.5209 25.542 24.7284 25.5723C24.9359 25.6026 25.1476 25.5669 25.3337 25.4702C26.85 24.6835 28.0523 23.4027 28.7417 21.8398C29.4311 20.2769 29.5663 18.5254 29.125 16.8752ZM16.305 18.4815C15.8142 18.5418 15.3166 18.4553 14.875 18.2328C14.4334 18.0103 14.0677 17.6619 13.8242 17.2315C13.5806 16.8012 13.4702 16.3083 13.5067 15.8152C13.5433 15.3221 13.7253 14.8509 14.0297 14.4613C14.334 14.0716 14.7471 13.7809 15.2167 13.626C15.6863 13.4711 16.1912 13.4589 16.6677 13.591C17.1442 13.7231 17.5708 13.9935 17.8936 14.368C18.2164 14.7426 18.4209 15.2044 18.4812 15.6952C18.5621 16.3533 18.3783 17.0165 17.9701 17.539C17.562 18.0616 16.963 18.4006 16.305 18.4815Z" fill="url(#paint0_linear_fan)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_fan" x1="16.2498" y1="2.02051" x2="16.2498" y2="27.1865" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_fan">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const HeadCircuit = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_circuit)">
            <path d="M15.9312 9.95036C16.4811 9.95036 16.9269 9.50458 16.9269 8.95467C16.9269 8.40477 16.4811 7.95898 15.9312 7.95898C15.3813 7.95898 14.9355 8.40477 14.9355 8.95467C14.9355 9.50458 15.3813 9.95036 15.9312 9.95036Z" fill="url(#paint0_linear_circuit)"/>
            <path d="M18.9181 17.9162C19.468 17.9162 19.9137 17.4704 19.9137 16.9205C19.9137 16.3706 19.468 15.9248 18.9181 15.9248C18.3681 15.9248 17.9224 16.3706 17.9224 16.9205C17.9224 17.4704 18.3681 17.9162 18.9181 17.9162Z" fill="url(#paint1_linear_circuit)"/>
            <path d="M26.1214 15.6164L12.1817 30.5517C12.034 30.7094 11.839 30.8147 11.6262 30.8518C11.4134 30.8889 11.1942 30.8558 11.0019 30.7574C10.8095 30.6591 10.6544 30.5008 10.5598 30.3066C10.4653 30.1123 10.4365 29.8925 10.4779 29.6805L12.3025 20.5537L5.12976 17.8604C4.97572 17.8028 4.83835 17.7079 4.72992 17.5842C4.62149 17.4606 4.54539 17.312 4.50841 17.1517C4.47143 16.9915 4.47472 16.8245 4.51799 16.6659C4.56126 16.5072 4.64316 16.3617 4.75638 16.2424L18.696 1.30707C18.8438 1.14942 19.0387 1.04409 19.2516 1.00699C19.4644 0.969878 19.6835 1.003 19.8759 1.10136C20.0682 1.19971 20.2234 1.35796 20.3179 1.55223C20.4124 1.7465 20.4412 1.96624 20.3999 2.17829L18.5703 11.315L25.743 14.0046C25.8959 14.0626 26.0322 14.1574 26.1398 14.2806C26.2474 14.4037 26.3229 14.5515 26.3599 14.7108C26.3968 14.8702 26.3939 15.0361 26.3514 15.1941C26.3089 15.352 26.2282 15.497 26.1164 15.6164H26.1214Z" fill="url(#paint2_linear_circuit)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_circuit" x1="15.9312" y1="7.95898" x2="15.9312" y2="9.95036" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <linearGradient id="paint1_linear_circuit" x1="18.9181" y1="15.9248" x2="18.9181" y2="17.9162" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <linearGradient id="paint2_linear_circuit" x1="15.4342" y1="0.992187" x2="15.4342" y2="30.8666" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_circuit">
                <rect width="31.8621" height="31.8621" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const PaintBucket = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_paint)">
            <path d="M31.9999 26.0002C31.9999 26.7958 31.6839 27.5589 31.1213 28.1215C30.5587 28.6841 29.7956 29.0002 28.9999 29.0002C28.2043 29.0002 27.4412 28.6841 26.8786 28.1215C26.316 27.5589 25.9999 26.7958 25.9999 26.0002C25.9999 23.7614 27.9462 20.7789 28.1674 20.4452C28.2587 20.308 28.3825 20.1955 28.5277 20.1177C28.673 20.0399 28.8352 19.9992 28.9999 19.9992C29.1647 19.9992 29.3269 20.0399 29.4722 20.1177C29.6174 20.1955 29.7412 20.308 29.8324 20.4452C30.0537 20.7789 31.9999 23.7614 31.9999 26.0002ZM16.5612 15.5614C16.843 15.2796 17.0013 14.8974 17.0013 14.4989C17.0013 14.1004 16.843 13.7182 16.5612 13.4364C16.2794 13.1546 15.8972 12.9963 15.4987 12.9963C15.1002 12.9963 14.718 13.1546 14.4362 13.4364C14.1591 13.719 14.0049 14.0996 14.0071 14.4953C14.0094 14.8911 14.168 15.2699 14.4483 15.5492C14.7287 15.8286 15.108 15.9858 15.5038 15.9867C15.8996 15.9876 16.2796 15.832 16.5612 15.5539V15.5614ZM4.7062 2.29266C4.51856 2.10519 4.26413 1.99993 3.99888 2.00005C3.73363 2.00016 3.4793 2.10565 3.29182 2.29329C3.10435 2.48093 2.99909 2.73536 2.99921 3.0006C2.99933 3.26585 3.10481 3.52019 3.29245 3.70766L7.36745 7.78266L8.7812 6.37516L4.7062 2.29266ZM29.3162 17.3839C29.4778 17.33 29.6229 17.2357 29.7378 17.1099C29.8528 16.9842 29.9336 16.8312 29.9728 16.6654C30.012 16.4996 30.0082 16.3266 29.9618 16.1627C29.9153 15.9988 29.8278 15.8495 29.7074 15.7289L15.2712 1.29266C15.0837 1.10527 14.8294 1 14.5643 1C14.2992 1 14.045 1.10527 13.8574 1.29266L8.7812 6.37516L13.8349 11.4277C14.5743 11.0275 15.433 10.9069 16.254 11.0878C17.075 11.2687 17.8035 11.7391 18.3062 12.413C18.8089 13.0868 19.0522 13.9191 18.9917 14.7576C18.9313 15.5961 18.571 16.3849 17.9768 16.9796C17.3826 17.5743 16.5942 17.9353 15.7557 17.9965C14.9172 18.0577 14.0847 17.8151 13.4104 17.313C12.7362 16.8109 12.2651 16.0829 12.0835 15.262C11.9018 14.4412 12.0217 13.5824 12.4212 12.8427L7.36745 7.78266L1.87495 13.2714C1.31238 13.834 0.996338 14.597 0.996338 15.3927C0.996338 16.1883 1.31238 16.9513 1.87495 17.5139L12.4862 28.1252C13.0488 28.6877 13.8118 29.0038 14.6074 29.0038C15.4031 29.0038 16.1661 28.6877 16.7287 28.1252L26.5399 18.3139L29.3162 17.3839Z" fill="url(#paint0_linear_paint)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_paint" x1="16.4981" y1="1" x2="16.4981" y2="29.0038" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_paint">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Hammer = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_hammer)">
            <path d="M31.4175 13.9999L22.985 5.50989C20.7329 3.26231 17.6811 2 14.4993 2C11.3176 2 8.26581 3.26231 6.01372 5.50989L6.00247 5.52114L4.28122 7.29989C4.10292 7.49151 4.00685 7.7454 4.01364 8.00705C4.02043 8.26871 4.12954 8.51727 4.31754 8.69938C4.50554 8.88149 4.75745 8.98263 5.01919 8.98109C5.28092 8.97955 5.53163 8.87545 5.71747 8.69114L7.43372 6.91864C8.12421 6.2283 8.91217 5.64291 9.77247 5.18114L15.585 10.9999L3.58497 22.9999C3.39921 23.1856 3.25185 23.4061 3.15131 23.6488C3.05077 23.8915 2.99902 24.1516 2.99902 24.4143C2.99902 24.677 3.05077 24.9371 3.15131 25.1797C3.25185 25.4224 3.39921 25.6429 3.58497 25.8286L6.17122 28.4149C6.35694 28.6007 6.57744 28.748 6.82012 28.8486C7.06281 28.9491 7.32291 29.0008 7.5856 29.0008C7.84828 29.0008 8.10839 28.9491 8.35107 28.8486C8.59375 28.748 8.81425 28.6007 8.99997 28.4149L21 16.4149L25 20.4149C25.1857 20.6007 25.4062 20.748 25.6489 20.8486C25.8916 20.9491 26.1517 21.0008 26.4143 21.0008C26.677 21.0008 26.9371 20.9491 27.1798 20.8486C27.4225 20.748 27.643 20.6007 27.8287 20.4149L31.415 16.8286C31.6009 16.6431 31.7485 16.4227 31.8492 16.1801C31.95 15.9375 32.0019 15.6775 32.0022 15.4148C32.0024 15.1521 31.9509 14.8919 31.8506 14.6492C31.7502 14.4064 31.6031 14.1858 31.4175 13.9999ZM20.2925 14.2911L17.5 17.0836L14.9137 14.4999L17.7075 11.7061C17.8004 11.6133 17.8742 11.503 17.9245 11.3816C17.9749 11.2602 18.0008 11.1301 18.0008 10.9986C18.0008 10.8672 17.9749 10.7371 17.9245 10.6157C17.8742 10.4943 17.8004 10.384 17.7075 10.2911L11.79 4.37489C13.4996 3.89339 15.3067 3.87593 17.0253 4.32433C18.744 4.77272 20.3122 5.67077 21.5687 6.92614L27.0962 12.4899L23.5 16.0824L21.7075 14.2899C21.6146 14.1969 21.5043 14.1232 21.3829 14.0728C21.2615 14.0225 21.1314 13.9966 21 13.9966C20.8686 13.9966 20.7384 14.0225 20.617 14.0728C20.4956 14.1232 20.3853 14.1969 20.2925 14.2899V14.2911ZM26.4175 18.9986L24.9175 17.4986L28.5 13.9061L30 15.4061L26.4175 18.9986Z" fill="url(#paint0_linear_hammer)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_hammer" x1="17.5006" y1="2" x2="17.5006" y2="29.0008" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_hammer">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const CardsThree = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_cards)">
            <path d="M28 13V25C28 25.5304 27.7893 26.0391 27.4142 26.4142C27.0391 26.7893 26.5304 27 26 27H6C5.46957 27 4.96086 26.7893 4.58579 26.4142C4.21071 26.0391 4 25.5304 4 25V13C4 12.4696 4.21071 11.9609 4.58579 11.5858C4.96086 11.2107 5.46957 11 6 11H26C26.5304 11 27.0391 11.2107 27.4142 11.5858C27.7893 11.9609 28 12.4696 28 13ZM7 9H25C25.2652 9 25.5196 8.89464 25.7071 8.70711C25.8946 8.51957 26 8.26522 26 8C26 7.73478 25.8946 7.48043 25.7071 7.29289C25.5196 7.10536 25.2652 7 25 7H7C6.73478 7 6.48043 7.10536 6.29289 7.29289C6.10536 7.48043 6 7.73478 6 8C6 8.26522 6.10536 8.51957 6.29289 8.70711C6.48043 8.89464 6.73478 9 7 9ZM9 5H23C23.2652 5 23.5196 4.89464 23.7071 4.70711C23.8946 4.51957 24 4.26522 24 4C24 3.73478 23.8946 3.48043 23.7071 3.29289C23.5196 3.10536 23.2652 3 23 3H9C8.73478 3 8.48043 3.10536 8.29289 3.29289C8.10536 3.48043 8 3.73478 8 4C8 4.26522 8.10536 4.51957 8.29289 4.70711C8.48043 4.89464 8.73478 5 9 5Z" fill="url(#paint0_linear_cards)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_cards" x1="16" y1="3" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_cards">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const GridFour = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_grid)">
            <path d="M27 7V14.5C27 14.6326 26.9473 14.7598 26.8536 14.8536C26.7598 14.9473 26.6326 15 26.5 15H17V5.5C17 5.36739 17.0527 5.24021 17.1464 5.14645C17.2402 5.05268 17.3674 5 17.5 5H25C25.5304 5 26.0391 5.21071 26.4142 5.58579C26.7893 5.96086 27 6.46957 27 7ZM14.5 5H7C6.46957 5 5.96086 5.21071 5.58579 5.58579C5.21071 5.96086 5 6.46957 5 7V14.5C5 14.6326 5.05268 14.7598 5.14645 14.8536C5.24021 14.9473 5.36739 15 5.5 15H15V5.5C15 5.36739 14.9473 5.24021 14.8536 5.14645C14.7598 5.05268 14.6326 5 14.5 5ZM26.5 17H17V26.5C17 26.6326 17.0527 26.7598 17.1464 26.8536C17.2402 26.9473 17.3674 27 17.5 27H25C25.5304 27 26.0391 26.7893 26.4142 26.4142C26.7893 26.0391 27 25.5304 27 25V17.5C27 17.3674 26.9473 17.2402 26.8536 17.1464C26.7598 17.0527 26.6326 17 26.5 17ZM5 17.5V25C5 25.5304 5.21071 26.0391 5.58579 26.4142C5.96086 26.7893 6.46957 27 7 27H14.5C14.6326 27 14.7598 26.9473 14.8536 26.8536C14.9473 26.7598 15 26.6326 15 26.5V17H5.5C5.36739 17 5.24021 17.0527 5.14645 17.1464C5.05268 17.2402 5 17.3674 5 17.5Z" fill="url(#paint0_linear_grid)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_grid" x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_grid">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Tools = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14 6L6 14L10 18L18 10L14 6Z" fill="url(#paint0_linear_tools)"/>
        <path d="M22 14L18 18L26 26L30 22L22 14Z" fill="url(#paint1_linear_tools)"/>
        <defs>
            <linearGradient id="paint0_linear_tools" x1="10" y1="6" x2="10" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <linearGradient id="paint1_linear_tools" x1="24" y1="14" x2="24" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// HOME & BUILDING ICONS
// ============================================

export const Home = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 4L4 14V28H12V20H20V28H28V14L16 4Z" fill="url(#paint0_linear_home)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_home" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const HouseLine = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_houseline)">
            <path d="M30 26.0003H28V17.0003L28.2925 17.2928C28.4805 17.4805 28.7353 17.5857 29.0009 17.5855C29.2665 17.5853 29.5211 17.4795 29.7087 17.2916C29.8964 17.1036 30.0017 16.8488 30.0014 16.5832C30.0012 16.3176 29.8955 16.063 29.7075 15.8753L17.4137 3.58532C17.0387 3.21053 16.5302 3 16 3C15.4698 3 14.9613 3.21053 14.5863 3.58532L2.2925 15.8753C2.10503 16.063 1.99977 16.3174 1.99989 16.5826C2 16.8479 2.10548 17.1022 2.29312 17.2897C2.48077 17.4772 2.7352 17.5824 3.00044 17.5823C3.26569 17.5822 3.52003 17.4767 3.7075 17.2891L4 17.0003V26.0003H2C1.73478 26.0003 1.48043 26.1057 1.29289 26.2932C1.10536 26.4808 1 26.7351 1 27.0003C1 27.2655 1.10536 27.5199 1.29289 27.7074C1.48043 27.895 1.73478 28.0003 2 28.0003H30C30.2652 28.0003 30.5196 27.895 30.7071 27.7074C30.8946 27.5199 31 27.2655 31 27.0003C31 26.7351 30.8946 26.4808 30.7071 26.2932C30.5196 26.1057 30.2652 26.0003 30 26.0003ZM19 26.0003H13V20.0003C13 19.8677 13.0527 19.7405 13.1464 19.6468C13.2402 19.553 13.3674 19.5003 13.5 19.5003H18.5C18.6326 19.5003 18.7598 19.553 18.8536 19.6468C18.9473 19.7405 19 19.8677 19 20.0003V26.0003Z" fill="url(#paint0_linear_houseline)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_houseline" x1="16" y1="3" x2="16" y2="28.0003" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_houseline">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const BuildingApartment = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_building)">
            <path d="M30 26H29V9C29 8.73478 28.8946 8.48043 28.7071 8.29289C28.5196 8.10536 28.2652 8 28 8H23V5C23 4.73478 22.8946 4.48043 22.7071 4.29289C22.5196 4.10536 22.2652 4 22 4H10C9.73478 4 9.48043 4.10536 9.29289 4.29289C9.10536 4.48043 9 4.73478 9 5V12H4C3.73478 12 3.48043 12.1054 3.29289 12.2929C3.10536 12.4804 3 12.7348 3 13V26H2C1.73478 26 1.48043 26.1054 1.29289 26.2929C1.10536 26.4804 1 26.7348 1 27C1 27.2652 1.10536 27.5196 1.29289 27.7071C1.48043 27.8946 1.73478 28 2 28H30C30.2652 28 30.5196 27.8946 30.7071 27.7071C30.8946 27.5196 31 27.2652 31 27C31 26.7348 30.8946 26.4804 30.7071 26.2929C30.5196 26.1054 30.2652 26 30 26ZM10 22H8C7.73478 22 7.48043 21.8946 7.29289 21.7071C7.10536 21.5196 7 21.2652 7 21C7 20.7348 7.10536 20.4804 7.29289 20.2929C7.48043 20.1054 7.73478 20 8 20H10C10.2652 20 10.5196 20.1054 10.7071 20.2929C10.8946 20.4804 11 20.7348 11 21C11 21.2652 10.8946 21.5196 10.7071 21.7071C10.5196 21.8946 10.2652 22 10 22ZM10 18H8C7.73478 18 7.48043 17.8946 7.29289 17.7071C7.10536 17.5196 7 17.2652 7 17C7 16.7348 7.10536 16.4804 7.29289 16.2929C7.48043 16.1054 7.73478 16 8 16H10C10.2652 16 10.5196 16.1054 10.7071 16.2929C10.8946 16.4804 11 16.7348 11 17C11 17.2652 10.8946 17.5196 10.7071 17.7071C10.5196 17.8946 10.2652 18 10 18ZM18 26H14V21H18V26ZM17 18H15C14.7348 18 14.4804 17.8946 14.2929 17.7071C14.1054 17.5196 14 17.2652 14 17C14 16.7348 14.1054 16.4804 14.2929 16.2929C14.4804 16.1054 14.7348 16 15 16H17C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18ZM17 14H15C14.7348 14 14.4804 13.8946 14.2929 13.7071C14.1054 13.5196 14 13.2652 14 13C14 12.7348 14.1054 12.4804 14.2929 12.2929C14.4804 12.1054 14.7348 12 15 12H17C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14ZM17 10H15C14.7348 10 14.4804 9.89464 14.2929 9.70711C14.1054 9.51957 14 9.26522 14 9C14 8.73478 14.1054 8.48043 14.2929 8.29289C14.4804 8.10536 14.7348 8 15 8H17C17.2652 8 17.5196 8.10536 17.7071 8.29289C17.8946 8.48043 18 8.73478 18 9C18 9.26522 17.8946 9.51957 17.7071 9.70711C17.5196 9.89464 17.2652 10 17 10ZM24 22H22C21.7348 22 21.4804 21.8946 21.2929 21.7071C21.1054 21.5196 21 21.2652 21 21C21 20.7348 21.1054 20.4804 21.2929 20.2929C21.4804 20.1054 21.7348 20 22 20H24C24.2652 20 24.5196 20.1054 24.7071 20.2929C24.8946 20.4804 25 20.7348 25 21C25 21.2652 24.8946 21.5196 24.7071 21.7071C24.5196 21.8946 24.2652 22 24 22ZM24 18H22C21.7348 18 21.4804 17.8946 21.2929 17.7071C21.1054 17.5196 21 17.2652 21 17C21 16.7348 21.1054 16.4804 21.2929 16.2929C21.4804 16.1054 21.7348 16 22 16H24C24.2652 16 24.5196 16.1054 24.7071 16.2929C24.8946 16.4804 25 16.7348 25 17C25 17.2652 24.8946 17.5196 24.7071 17.7071C24.5196 17.8946 24.2652 18 24 18ZM24 14H22C21.7348 14 21.4804 13.8946 21.2929 13.7071C21.1054 13.5196 21 13.2652 21 13C21 12.7348 21.1054 12.4804 21.2929 12.2929C21.4804 12.1054 21.7348 12 22 12H24C24.2652 12 24.5196 12.1054 24.7071 12.2929C24.8946 12.4804 25 12.7348 25 13C25 13.2652 24.8946 13.5196 24.7071 13.7071C24.5196 13.8946 24.2652 14 24 14Z" fill="url(#paint0_linear_building)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_building" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_building">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// FURNITURE & INTERIOR ICONS
// ============================================

export const Armchair = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_armchair)">
            <path d="M30 16.5C29.9999 17.3416 29.6966 18.1549 29.1456 18.7911C28.5947 19.4272 27.8329 19.8435 27 19.9638V25C27 25.5304 26.7893 26.0391 26.4142 26.4142C26.0391 26.7893 25.5304 27 25 27H7C6.46957 27 5.96086 26.7893 5.58579 26.4142C5.21071 26.0391 5 25.5304 5 25V19.9638C4.33598 19.8679 3.7135 19.5832 3.20669 19.1436C2.69987 18.7041 2.33008 18.1281 2.14134 17.4842C1.95261 16.8404 1.95289 16.156 2.14215 15.5123C2.33141 14.8687 2.70167 14.293 3.20885 13.8538C3.71602 13.4146 4.33873 13.1304 5.00283 13.0351C5.66692 12.9398 6.34442 13.0374 6.95463 13.3162C7.56484 13.5951 8.08206 14.0434 8.44468 14.6079C8.80731 15.1723 9.00007 15.8291 9 16.5V21C9 21.2652 9.10536 21.5196 9.29289 21.7071C9.48043 21.8946 9.73478 22 10 22C10.2652 22 10.5196 21.8946 10.7071 21.7071C10.8946 21.5196 11 21.2652 11 21V18H21V21C21 21.2652 21.1054 21.5196 21.2929 21.7071C21.4804 21.8946 21.7348 22 22 22C22.2652 22 22.5196 21.8946 22.7071 21.7071C22.8946 21.5196 23 21.2652 23 21V16.5C23 15.5717 23.3687 14.6815 24.0251 14.0251C24.6815 13.3687 25.5717 13 26.5 13C27.4283 13 28.3185 13.3687 28.9749 14.0251C29.6313 14.6815 30 15.5717 30 16.5ZM5.5 11C6.87147 11.0019 8.19288 11.5155 9.2057 12.4403C10.2185 13.365 10.8499 14.6344 10.9762 16H21.0238C21.1501 14.6344 21.7815 13.365 22.7943 12.4403C23.8071 11.5155 25.1285 11.0019 26.5 11C26.6326 11 26.7598 10.9473 26.8536 10.8536C26.9473 10.7598 27 10.6326 27 10.5V9C27 7.67392 26.4732 6.40215 25.5355 5.46447C24.5979 4.52678 23.3261 4 22 4H10C8.67392 4 7.40215 4.52678 6.46447 5.46447C5.52678 6.40215 5 7.67392 5 9V10.5C5 10.6326 5.05268 10.7598 5.14645 10.8536C5.24021 10.9473 5.36739 11 5.5 11Z" fill="url(#paint0_linear_armchair)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_armchair" x1="16" y1="4" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_armchair">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Bed = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_bed)">
            <path d="M27 9H4V6C4 5.73478 3.89464 5.48043 3.70711 5.29289C3.51957 5.10536 3.26522 5 3 5C2.73478 5 2.48043 5.10536 2.29289 5.29289C2.10536 5.48043 2 5.73478 2 6V26C2 26.2652 2.10536 26.5196 2.29289 26.7071C2.48043 26.8946 2.73478 27 3 27C3.26522 27 3.51957 26.8946 3.70711 26.7071C3.89464 26.5196 4 26.2652 4 26V22H30V26C30 26.2652 30.1054 26.5196 30.2929 26.7071C30.4804 26.8946 30.7348 27 31 27C31.2652 27 31.5196 26.8946 31.7071 26.7071C31.8946 26.5196 32 26.2652 32 26V14C32 12.6739 31.4732 11.4021 30.5355 10.4645C29.5979 9.52678 28.3261 9 27 9ZM4 11H13V20H4V11Z" fill="url(#paint0_linear_bed)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_bed" x1="17" y1="5" x2="17" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_bed">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// UTILITIES & APPLIANCES ICONS
// ============================================

export const Wrench = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M28 8L24 4L20 8L24 12L28 8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 20L4 28L8 32L16 24L12 20Z" fill="url(#paint0_linear_wrench)"/>
        <defs>
            <linearGradient id="paint0_linear_wrench" x1="10" y1="20" x2="10" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Lightbulb = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 2C12.6863 2 10 4.68629 10 8C10 10.5 11.5 12.5 13 14V18C13 19.1046 13.8954 20 15 20H17C18.1046 20 19 19.1046 19 18V14C20.5 12.5 22 10.5 22 8C22 4.68629 19.3137 2 16 2Z" fill="url(#paint0_linear_bulb)"/>
        <path d="M12 24H20V26H12V24Z" fill="white"/>
        <path d="M14 28H18V30H14V28Z" fill="white"/>
        <defs>
            <linearGradient id="paint0_linear_bulb" x1="16" y1="2" x2="16" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const WaterDrop = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 4C16 4 22 10 22 18C22 22.4183 18.4183 26 14 26C9.58172 26 6 22.4183 6 18C6 10 12 4 16 4Z" fill="url(#paint0_linear_water)"/>
        <defs>
            <linearGradient id="paint0_linear_water" x1="14" y1="4" x2="14" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Shield = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 2L4 6V14C4 20.5 8 26 16 30C24 26 28 20.5 28 14V6L16 2Z" fill="url(#paint0_linear_shield)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_shield" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const CheckCircle = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="14" fill="url(#paint0_linear_check)" stroke="white" strokeWidth="2"/>
        <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_check" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Phone = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M22 2H10C8.89543 2 8 2.89543 8 4V28C8 29.1046 8.89543 30 10 30H22C23.1046 30 24 29.1046 24 28V4C24 2.89543 23.1046 2 22 2Z" fill="url(#paint0_linear_phone)" stroke="white" strokeWidth="2"/>
        <path d="M16 24H16.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_phone" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Mail = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M4 8L16 16L28 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 8H28V24H4V8Z" fill="url(#paint0_linear_mail)" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_mail" x1="16" y1="8" x2="16" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Calendar = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="4" y="6" width="24" height="22" rx="2" fill="url(#paint0_linear_calendar)" stroke="white" strokeWidth="2"/>
        <path d="M4 12H28" stroke="white" strokeWidth="2"/>
        <path d="M10 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M22 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_calendar" x1="16" y1="6" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const User = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="10" r="6" fill="url(#paint0_linear_user)" stroke="white" strokeWidth="2"/>
        <path d="M4 28C4 24 8 20 16 20C24 20 28 24 28 28" fill="url(#paint1_linear_user)" stroke="white" strokeWidth="2"/>
        <defs>
            <linearGradient id="paint0_linear_user" x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <linearGradient id="paint1_linear_user" x1="16" y1="20" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Settings = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="16" cy="16" r="3" fill="url(#paint0_linear_settings)" stroke="white" strokeWidth="2"/>
        <path d="M16 2V6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 26V30" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 16H26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 16H2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25.66 6.34L23.17 8.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.83 23.17L6.34 25.66" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25.66 25.66L23.17 23.17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8.83 8.83L6.34 6.34" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_settings" x1="13" y1="13" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

export const Search = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="14" cy="14" r="10" fill="none" stroke="white" strokeWidth="2"/>
        <path d="M20 20L28 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export const Star = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M16 2L19.5 11.5L29 12L21.5 18.5L24 28L16 22.5L8 28L10.5 18.5L3 12L12.5 11.5L16 2Z" fill="url(#paint0_linear_star)"/>
        <defs>
            <linearGradient id="paint0_linear_star" x1="16" y1="2" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
        </defs>
    </svg>
);

// New Icons from moreicons.jsx
export const Oven = ({ className = "", width = 36, height = 36 }) => (
    <svg width={width} height={height} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_oven)">
            <path d="M29.25 4.5H6.75C6.15326 4.5 5.58097 4.73705 5.15901 5.15901C4.73705 5.58097 4.5 6.15326 4.5 6.75V29.25C4.5 29.8467 4.73705 30.419 5.15901 30.841C5.58097 31.2629 6.15326 31.5 6.75 31.5H29.25C29.8467 31.5 30.419 31.2629 30.841 30.841C31.2629 30.419 31.5 29.8467 31.5 29.25V6.75C31.5 6.15326 31.2629 5.58097 30.841 5.15901C30.419 4.73705 29.8467 4.5 29.25 4.5ZM24.1875 7.875C24.5213 7.875 24.8475 7.97397 25.125 8.1594C25.4025 8.34482 25.6188 8.60837 25.7465 8.91672C25.8743 9.22507 25.9077 9.56437 25.8426 9.89172C25.7775 10.2191 25.6167 10.5197 25.3807 10.7557C25.1447 10.9917 24.8441 11.1525 24.5167 11.2176C24.1894 11.2827 23.8501 11.2493 23.5417 11.1215C23.2334 10.9938 22.9698 10.7775 22.7844 10.5C22.599 10.2225 22.5 9.89626 22.5 9.5625C22.5 9.11495 22.6778 8.68572 22.9943 8.36926C23.3107 8.05279 23.7399 7.875 24.1875 7.875ZM18 7.875C18.3338 7.875 18.66 7.97397 18.9375 8.1594C19.215 8.34482 19.4313 8.60837 19.559 8.91672C19.6868 9.22507 19.7202 9.56437 19.6551 9.89172C19.59 10.2191 19.4292 10.5197 19.1932 10.7557C18.9572 10.9917 18.6566 11.1525 18.3292 11.2176C18.0019 11.2827 17.6626 11.2493 17.3542 11.1215C17.0459 10.9938 16.7823 10.7775 16.5969 10.5C16.4115 10.2225 16.3125 9.89626 16.3125 9.5625C16.3125 9.11495 16.4903 8.68572 16.8068 8.36926C17.1232 8.05279 17.5524 7.875 18 7.875ZM11.8125 7.875C12.1463 7.875 12.4725 7.97397 12.75 8.1594C13.0275 8.34482 13.2438 8.60837 13.3715 8.91672C13.4993 9.22507 13.5327 9.56437 13.4676 9.89172C13.4025 10.2191 13.2417 10.5197 13.0057 10.7557C12.7697 10.9917 12.4691 11.1525 12.1417 11.2176C11.8144 11.2827 11.4751 11.2493 11.1667 11.1215C10.8584 10.9938 10.5948 10.7775 10.4094 10.5C10.224 10.2225 10.125 9.89626 10.125 9.5625C10.125 9.11495 10.3028 8.68572 10.6193 8.36926C10.9357 8.05279 11.3649 7.875 11.8125 7.875ZM27 27H9V14.625H27V27Z" fill="url(#paint0_linear_oven)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_oven" x1="18" y1="4.5" x2="18" y2="31.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_oven">
                <rect width="36" height="36" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const SecurityCamera = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_security)">
            <path d="M31 16.9997C30.7348 16.9997 30.4804 17.1051 30.2929 17.2926C30.1053 17.4801 30 17.7345 30 17.9997V19.9997H24.4137L22.125 17.7072L28.4175 11.4134C28.7923 11.0384 29.0028 10.5299 29.0028 9.9997C29.0028 9.46949 28.7923 8.96098 28.4175 8.58595L23.7075 3.8747L21.4137 1.58595C21.228 1.40018 21.0075 1.25282 20.7648 1.15228C20.5221 1.05175 20.262 1 19.9994 1C19.7367 1 19.4766 1.05175 19.2339 1.15228C18.9912 1.25282 18.7707 1.40018 18.585 1.58595L0.36498 19.8672C0.190571 20.0422 0.071914 20.2649 0.0239907 20.5072C-0.0239325 20.7496 0.00102749 21.0007 0.095719 21.2288C0.19041 21.457 0.350587 21.652 0.556023 21.7892C0.761459 21.9264 1.00294 21.9996 1.24998 21.9997H6.17123L10.5862 26.4134C10.9613 26.7882 11.4698 26.9988 12 26.9988C12.5302 26.9988 13.0387 26.7882 13.4137 26.4134L20.7075 19.1247L23 21.4134C23.185 21.6 23.4053 21.7479 23.648 21.8485C23.8907 21.9491 24.151 22.0005 24.4137 21.9997H30V23.9997C30 24.2649 30.1053 24.5193 30.2929 24.7068C30.4804 24.8943 30.7348 24.9997 31 24.9997C31.2652 24.9997 31.5196 24.8943 31.7071 24.7068C31.8946 24.5193 32 24.2649 32 23.9997V17.9997C32 17.7345 31.8946 17.4801 31.7071 17.2926C31.5196 17.1051 31.2652 16.9997 31 16.9997ZM20 2.9997L21.5862 4.58595L6.17123 19.9997H3.05748L20 2.9997Z" fill="url(#paint0_linear_security)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_security" x1="16.0001" y1="1" x2="16.0001" y2="26.9988" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_security">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Desk = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_desk)">
            <path d="M31 8H1C0.734784 8 0.48043 8.10536 0.292893 8.29289C0.105357 8.48043 0 8.73478 0 9C0 9.26522 0.105357 9.51957 0.292893 9.70711C0.48043 9.89464 0.734784 10 1 10H2V24C2 24.2652 2.10536 24.5196 2.29289 24.7071C2.48043 24.8946 2.73478 25 3 25C3.26522 25 3.51957 24.8946 3.70711 24.7071C3.89464 24.5196 4 24.2652 4 24V18H28V24C28 24.2652 28.1054 24.5196 28.2929 24.7071C28.4804 24.8946 28.7348 25 29 25C29.2652 25 29.5196 24.8946 29.7071 24.7071C29.8946 24.5196 30 24.2652 30 24V10H31C31.2652 10 31.5196 9.89464 31.7071 9.70711C31.8946 9.51957 32 9.26522 32 9C32 8.73478 31.8946 8.48043 31.7071 8.29289C31.5196 8.10536 31.2652 8 31 8ZM10 14H7C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12H10C10.2652 12 10.5196 12.1054 10.7071 12.2929C10.8946 12.4804 11 12.7348 11 13C11 13.2652 10.8946 13.5196 10.7071 13.7071C10.5196 13.8946 10.2652 14 10 14ZM17 15C17 15.2652 16.8946 15.5196 16.7071 15.7071C16.5196 15.8946 16.2652 16 16 16C15.7348 16 15.4804 15.8946 15.2929 15.7071C15.1054 15.5196 15 15.2652 15 15V11C15 10.7348 15.1054 10.4804 15.2929 10.2929C15.4804 10.1054 15.7348 10 16 10C16.2652 10 16.5196 10.1054 16.7071 10.2929C16.8946 10.4804 17 10.7348 17 11V15ZM25 14H22C21.7348 14 21.4804 13.8946 21.2929 13.7071C21.1054 13.5196 21 13.2652 21 13C21 12.7348 21.1054 12.4804 21.2929 12.2929C21.4804 12.1054 21.7348 12 22 12H25C25.2652 12 25.5196 12.1054 25.7071 12.2929C25.8946 12.4804 26 12.7348 26 13C26 13.2652 25.8946 13.5196 25.7071 13.7071C25.5196 13.8946 25.2652 14 25 14Z" fill="url(#paint0_linear_desk)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_desk" x1="16" y1="8" x2="16" y2="25" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_desk">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const PintGlass = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_pint)">
            <path d="M25.75 3.33625C25.6559 3.23027 25.5404 3.14548 25.4111 3.08751C25.2818 3.02954 25.1417 2.99971 25 3H6.99998C6.85807 2.99995 6.71778 3.03011 6.58843 3.08846C6.45908 3.14681 6.34363 3.23202 6.24975 3.33844C6.15587 3.44485 6.08571 3.57002 6.04394 3.70564C6.00217 3.84126 5.98974 3.98421 6.00748 4.125L8.90123 28.25C8.96216 28.7336 9.19763 29.1784 9.56339 29.5006C9.92915 29.8229 10.4 30.0005 10.8875 30H21.1125C21.6017 30.0001 22.0739 29.821 22.4399 29.4964C22.806 29.1719 23.0403 28.7244 23.0987 28.2388L25.9925 4.125C26.0105 3.98385 25.9982 3.84047 25.9564 3.70445C25.9146 3.56843 25.8442 3.4429 25.75 3.33625ZM23.875 5L23.5125 8H8.48748L8.12498 5H23.875Z" fill="url(#paint0_linear_pint)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_pint" x1="16.0001" y1="3" x2="16.0001" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_pint">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const BugBeetle = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_bug)">
            <path d="M28 14.9996H26V12.9996H28C28.2652 12.9996 28.5196 13.1049 28.7071 13.2925C28.8946 13.48 29 13.7344 29 13.9996C29 14.2648 28.8946 14.5191 28.7071 14.7067C28.5196 14.8942 28.2652 14.9996 28 14.9996ZM4 12.9996C3.73478 12.9996 3.48043 13.1049 3.29289 13.2925C3.10536 13.48 3 13.7344 3 13.9996C3 14.2648 3.10536 14.5191 3.29289 14.7067C3.48043 14.8942 3.73478 14.9996 4 14.9996H6V12.9996H4ZM26 19.9996C26 20.3371 25.9825 20.6708 25.95 20.9996H28C28.2652 20.9996 28.5196 21.1049 28.7071 21.2925C28.8946 21.48 29 21.7344 29 21.9996C29 22.2648 28.8946 22.5192 28.7071 22.7067C28.5196 22.8942 28.2652 22.9996 28 22.9996H25.54C24.9019 25.03 23.6327 26.8039 21.9169 28.0632C20.2011 29.3225 18.1283 30.0015 16 30.0015C13.8717 30.0015 11.7989 29.3225 10.0831 28.0632C8.36733 26.8039 7.09808 25.03 6.46 22.9996H4C3.73478 22.9996 3.48043 22.8942 3.29289 22.7067C3.10536 22.5192 3 22.2648 3 21.9996C3 21.7344 3.10536 21.48 3.29289 21.2925C3.48043 21.1049 3.73478 20.9996 4 20.9996H6.05C6.0175 20.6708 6 20.3371 6 19.9996V18.9996H4C3.73478 18.9996 3.48043 18.8942 3.29289 18.7067C3.10536 18.5192 3 18.2648 3 17.9996C3 17.7344 3.10536 17.48 3.29289 17.2925C3.48043 17.1049 3.73478 16.9996 4 16.9996H6V14.9996H26V16.9996H28C28.2652 16.9996 28.5196 17.1049 28.7071 17.2925C28.8946 17.48 29 17.7344 29 17.9996C29 18.2648 28.8946 18.5192 28.7071 18.7067C28.5196 18.8942 28.2652 18.9996 28 18.9996H26V19.9996ZM17 17.9996C17 17.7344 16.8946 17.48 16.7071 17.2925C16.5196 17.1049 16.2652 16.9996 16 16.9996C15.7348 16.9996 15.4804 17.1049 15.2929 17.2925C15.1054 17.48 15 17.7344 15 17.9996V25.9996C15 26.2648 15.1054 26.5192 15.2929 26.7067C15.4804 26.8942 15.7348 26.9996 16 26.9996C16.2652 26.9996 16.5196 26.8942 16.7071 26.7067C16.8946 26.5192 17 26.2648 17 25.9996V17.9996ZM8.73 7.14333C7.21341 8.74518 6.27088 10.8048 6.05 12.9996H25.95C25.7291 10.8048 24.7866 8.74518 23.27 7.14333L25.7075 4.70708C25.8951 4.51944 26.0006 4.26494 26.0006 3.99958C26.0006 3.73422 25.8951 3.47972 25.7075 3.29208C25.5199 3.10444 25.2654 2.99902 25 2.99902C24.7346 2.99902 24.4801 3.10444 24.2925 3.29208L21.7563 5.82958C20.073 4.63885 18.0619 3.99944 16 3.99944C13.9381 3.99944 11.927 4.63885 10.2437 5.82958L7.7075 3.29208C7.51986 3.10444 7.26536 2.99902 7 2.99902C6.73464 2.99902 6.48014 3.10444 6.2925 3.29208C6.10486 3.47972 5.99944 3.73422 5.99944 3.99958C5.99944 4.26494 6.10486 4.51944 6.2925 4.70708L8.73 7.14333Z" fill="url(#paint0_linear_bug)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_bug" x1="16" y1="2.99902" x2="16" y2="30.0015" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_bug">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Drop = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_drop)">
            <path d="M21.75 5.96847C20.206 4.18526 18.4682 2.57954 16.5688 1.18097C16.4006 1.06318 16.2003 1 15.995 1C15.7897 1 15.5894 1.06318 15.4213 1.18097C13.5253 2.58012 11.7909 4.18583 10.25 5.96847C6.81375 9.91472 5 14.0747 5 17.9997C5 20.9171 6.15893 23.715 8.22183 25.7779C10.2847 27.8408 13.0826 28.9997 16 28.9997C18.9174 28.9997 21.7153 27.8408 23.7782 25.7779C25.8411 23.715 27 20.9171 27 17.9997C27 14.0747 25.1863 9.91472 21.75 5.96847ZM22.9813 19.1672C22.7219 20.6156 22.0251 21.9498 20.9846 22.9901C19.944 24.0304 18.6097 24.727 17.1612 24.986C17.1079 24.9945 17.054 24.9991 17 24.9997C16.7492 24.9997 16.5075 24.9053 16.323 24.7354C16.1384 24.5655 16.0245 24.3325 16.0037 24.0825C15.9829 23.8325 16.0569 23.5839 16.2108 23.3859C16.3648 23.1878 16.5876 23.0549 16.835 23.0135C18.9062 22.6647 20.6637 20.9072 21.015 18.8322C21.0594 18.5707 21.2059 18.3374 21.4223 18.1839C21.6387 18.0303 21.9072 17.969 22.1688 18.0135C22.4303 18.0579 22.6635 18.2044 22.8171 18.4208C22.9706 18.6371 23.0319 18.9056 22.9875 19.1672H22.9813Z" fill="url(#paint0_linear_drop)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_drop" x1="16" y1="1" x2="16" y2="28.9997" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_drop">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const SquaresFour = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_squares)">
            <path d="M15 7V13C15 13.5304 14.7893 14.0391 14.4142 14.4142C14.0391 14.7893 13.5304 15 13 15H7C6.46957 15 5.96086 14.7893 5.58579 14.4142C5.21071 14.0391 5 13.5304 5 13V7C5 6.46957 5.21071 5.96086 5.58579 5.58579C5.96086 5.21071 6.46957 5 7 5H13C13.5304 5 14.0391 5.21071 14.4142 5.58579C14.7893 5.96086 15 6.46957 15 7ZM25 5H19C18.4696 5 17.9609 5.21071 17.5858 5.58579C17.2107 5.96086 17 6.46957 17 7V13C17 13.5304 17.2107 14.0391 17.5858 14.4142C17.9609 14.7893 18.4696 15 19 15H25C25.5304 15 26.0391 14.7893 26.4142 14.4142C26.7893 14.0391 27 13.5304 27 13V7C27 6.46957 26.7893 5.96086 26.4142 5.58579C26.0391 5.21071 25.5304 5 25 5ZM13 17H7C6.46957 17 5.96086 17.2107 5.58579 17.5858C5.21071 17.9609 5 18.4696 5 19V25C5 25.5304 5.21071 26.0391 5.58579 26.4142C5.96086 26.7893 6.46957 27 7 27H13C13.5304 27 14.0391 26.7893 14.4142 26.4142C14.7893 26.0391 15 25.5304 15 25V19C15 18.4696 14.7893 17.9609 14.4142 17.5858C14.0391 17.2107 13.5304 17 13 17ZM25 17H19C18.4696 17 17.9609 17.2107 17.5858 17.5858C17.2107 17.9609 17 18.4696 17 19V25C17 25.5304 17.2107 26.0391 17.5858 26.4142C17.9609 26.7893 18.4696 27 19 27H25C25.5304 27 26.0391 26.7893 26.4142 26.4142C26.7893 26.0391 27 25.5304 27 25V19C27 18.4696 26.7893 17.9609 26.4142 17.5858C26.0391 17.2107 25.5304 17 25 17Z" fill="url(#paint0_linear_squares)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_squares" x1="16" y1="5" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_squares">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const SpeakerNone = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_speaker)">
            <path d="M8 10.5002V21.5002C8 21.6329 7.94732 21.76 7.85355 21.8538C7.75979 21.9476 7.63261 22.0002 7.5 22.0002H4C3.46957 22.0002 2.96086 21.7895 2.58579 21.4145C2.21071 21.0394 2 20.5307 2 20.0002V12.0002C2 11.4698 2.21071 10.9611 2.58579 10.586C2.96086 10.211 3.46957 10.0002 4 10.0002H7.5C7.63261 10.0002 7.75979 10.0529 7.85355 10.1467C7.94732 10.2405 8 10.3676 8 10.5002ZM19.6437 3.23149C19.4687 3.08663 19.2495 3.00572 19.0223 3.00208C18.795 2.99845 18.5734 3.0723 18.3937 3.21149L10.1975 9.58649C10.1367 9.63269 10.0873 9.69219 10.0531 9.76045C10.0188 9.8287 10.0007 9.90389 10 9.98024V22.0202C10.0002 22.0963 10.0178 22.1713 10.0514 22.2395C10.0849 22.3077 10.1336 22.3674 10.1938 22.414L18.39 28.789C18.5487 28.9124 18.741 28.9851 18.9417 28.9976C19.1424 29.0101 19.3422 28.9618 19.515 28.859C19.6671 28.7644 19.792 28.632 19.8777 28.4747C19.9634 28.3174 20.0068 28.1406 20.0037 27.9615V4.03149C20.0056 3.87961 19.974 3.72918 19.9111 3.59091C19.8482 3.45264 19.7557 3.32993 19.64 3.23149H19.6437Z" fill="url(#paint0_linear_speaker)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_speaker" x1="11.0019" y1="3.00195" x2="11.0019" y2="28.9995" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_speaker">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// TRANSPORTATION & VEHICLES
// ============================================

export const Bus = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_bus)">
            <path d="M31 10V13C31 13.2652 30.8946 13.5196 30.7071 13.7071C30.5196 13.8946 30.2652 14 30 14C29.7348 14 29.4804 13.8946 29.2929 13.7071C29.1054 13.5196 29 13.2652 29 13V10C29 9.73478 29.1054 9.48043 29.2929 9.29289C29.4804 9.10536 29.7348 9 30 9C30.2652 9 30.5196 9.10536 30.7071 9.29289C30.8946 9.48043 31 9.73478 31 10ZM2 9C1.73478 9 1.48043 9.10536 1.29289 9.29289C1.10536 9.48043 1 9.73478 1 10V13C1 13.2652 1.10536 13.5196 1.29289 13.7071C1.48043 13.8946 1.73478 14 2 14C2.26522 14 2.51957 13.8946 2.70711 13.7071C2.89464 13.5196 3 13.2652 3 13V10C3 9.73478 2.89464 9.48043 2.70711 9.29289C2.51957 9.10536 2.26522 9 2 9ZM27 8V26C27 26.5304 26.7893 27.0391 26.4142 27.4142C26.0391 27.7893 25.5304 28 25 28H23C22.4696 28 21.9609 27.7893 21.5858 27.4142C21.2107 27.0391 21 26.5304 21 26V25H11V26C11 26.5304 10.7893 27.0391 10.4142 27.4142C10.0391 27.7893 9.53043 28 9 28H7C6.46957 28 5.96086 27.7893 5.58579 27.4142C5.21071 27.0391 5 26.5304 5 26V8C5 6.93913 5.42143 5.92172 6.17157 5.17157C6.92172 4.42143 7.93913 4 9 4H23C24.0609 4 25.0783 4.42143 25.8284 5.17157C26.5786 5.92172 27 6.93913 27 8ZM13 18.5C13 18.2033 12.912 17.9133 12.7472 17.6666C12.5824 17.42 12.3481 17.2277 12.074 17.1142C11.7999 17.0007 11.4983 16.9709 11.2074 17.0288C10.9164 17.0867 10.6491 17.2296 10.4393 17.4393C10.2296 17.6491 10.0867 17.9164 10.0288 18.2074C9.97094 18.4983 10.0006 18.7999 10.1142 19.074C10.2277 19.3481 10.42 19.5824 10.6666 19.7472C10.9133 19.912 11.2033 20 11.5 20C11.8978 20 12.2794 19.842 12.5607 19.5607C12.842 19.2794 13 18.8978 13 18.5ZM22 18.5C22 18.2033 21.912 17.9133 21.7472 17.6666C21.5824 17.42 21.3481 17.2277 21.074 17.1142C20.7999 17.0007 20.4983 16.9709 20.2074 17.0288C19.9164 17.0867 19.6491 17.2296 19.4393 17.4393C19.2296 17.6491 19.0867 17.9164 19.0288 18.2074C18.9709 18.4983 19.0007 18.7999 19.1142 19.074C19.2277 19.3481 19.42 19.5824 19.6666 19.7472C19.9133 19.912 20.2033 20 20.5 20C20.8978 20 21.2794 19.842 21.5607 19.5607C21.842 19.2794 22 18.8978 22 18.5ZM25 9H7V14H25V9Z" fill="url(#paint0_linear_bus)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_bus" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_bus">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// NATURE & OUTDOOR ICONS
// ============================================

export const PottedPlant = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_potted)">
            <path d="M25 17.9996H15.4125L18.2138 15.1984C19.2265 15.7084 20.3424 15.9803 21.4763 15.9934C22.6175 15.9964 23.7375 15.6841 24.7125 15.0909C27.6775 13.2959 29.2663 9.14086 28.9625 3.97586C28.9482 3.73122 28.8446 3.50034 28.6713 3.32705C28.498 3.15377 28.2672 3.05015 28.0225 3.03586C22.8575 2.73211 18.7025 4.32086 16.9063 7.28586C15.7375 9.21711 15.7075 11.5496 16.7988 13.7859L15 15.5846L13.4738 14.0584C14.2238 12.4021 14.17 10.6834 13.3 9.24836C11.9413 6.99961 8.82626 5.80086 4.96626 6.02711C4.72204 6.04166 4.49163 6.14524 4.31863 6.31823C4.14564 6.49123 4.04206 6.72164 4.02751 6.96586C3.80001 10.8246 5.00001 13.9396 7.25001 15.2996C8.00275 15.7592 8.86804 16.0015 9.75001 15.9996C10.5501 15.9917 11.3394 15.8131 12.065 15.4759L13.5863 16.9996L12.5863 17.9996H7.00001C6.73479 17.9996 6.48044 18.105 6.2929 18.2925C6.10537 18.48 6.00001 18.7344 6.00001 18.9996C6.00001 19.2648 6.10537 19.5192 6.2929 19.7067C6.48044 19.8943 6.73479 19.9996 7.00001 19.9996H8.19876L9.85001 27.4334C9.94637 27.8788 10.193 28.2776 10.5485 28.5627C10.904 28.8479 11.3468 29.0022 11.8025 28.9996H20.1988C20.6544 29.0017 21.0969 28.8473 21.4523 28.5622C21.8077 28.2771 22.0545 27.8786 22.1513 27.4334L23.8025 19.9996H25C25.2652 19.9996 25.5196 19.8943 25.7071 19.7067C25.8947 19.5192 26 19.2648 26 18.9996C26 18.7344 25.8947 18.48 25.7071 18.2925C25.5196 18.105 25.2652 17.9996 25 17.9996Z" fill="url(#paint0_linear_potted)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_potted" x1="16.4997" y1="2.99902" x2="16.4997" y2="28.9996" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_potted">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const SwimmingPool = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_pool)">
            <path d="M3 21C3 20.7348 3.10536 20.4804 3.29289 20.2929C3.48043 20.1054 3.73478 20 4 20C5.8025 20 6.77375 20.6475 7.555 21.1675C8.25 21.6325 8.8025 22 10 22C11.1975 22 11.75 21.6325 12.445 21.1675C13.225 20.6475 14.195 20 15.9987 20C17.8025 20 18.7737 20.6475 19.5537 21.1675C20.2512 21.6325 20.8037 22 22 22C23.1963 22 23.75 21.6325 24.445 21.1675C25.2262 20.6475 26.195 20 28 20C28.2652 20 28.5196 20.1054 28.7071 20.2929C28.8946 20.4804 29 20.7348 29 21C29 21.2652 28.8946 21.5196 28.7071 21.7071C28.5196 21.8946 28.2652 22 28 22C26.8025 22 26.25 22.3675 25.555 22.8325C24.7738 23.3525 23.805 24 22 24C20.195 24 19.225 23.3525 18.445 22.8325C17.75 22.3675 17.1962 22 16 22C14.8038 22 14.25 22.3675 13.555 22.8325C12.775 23.3525 11.805 24 10.0013 24C8.1975 24 7.2275 23.3525 6.44625 22.8325C5.75 22.3675 5.1975 22 4 22C3.73478 22 3.48043 21.8946 3.29289 21.7071C3.10536 21.5196 3 21.2652 3 21ZM28 25C26.1975 25 25.2262 25.6475 24.445 26.1675C23.75 26.6325 23.1975 27 22 27C20.8025 27 20.25 26.6325 19.5537 26.1675C18.7737 25.6475 17.8038 25 15.9987 25C14.1937 25 13.225 25.6475 12.445 26.1675C11.75 26.6325 11.1962 27 10 27C8.80375 27 8.25 26.6325 7.555 26.1675C6.77375 25.6475 5.8025 25 4 25C3.73478 25 3.48043 25.1054 3.29289 25.2929C3.10536 25.4804 3 25.7348 3 26C3 26.2652 3.10536 26.5196 3.29289 26.7071C3.48043 26.8946 3.73478 27 4 27C5.1975 27 5.75 27.3675 6.445 27.8325C7.22625 28.3525 8.195 29 10 29C11.805 29 12.7738 28.3525 13.5538 27.8325C14.2513 27.3675 14.8038 27 15.9987 27C17.1937 27 17.7487 27.3675 18.445 27.8325C19.225 28.3525 20.195 29 22 29C23.805 29 24.7738 28.3525 25.555 27.8325C26.2513 27.3675 26.805 27 28 27C28.2652 27 28.5196 26.8946 28.7071 26.7071C28.8946 26.5196 29 26.2652 29 26C29 25.7348 28.8946 25.4804 28.7071 25.2929C28.5196 25.1054 28.2652 25 28 25ZM10 17.6737V4C10 3.73478 10.1054 3.48043 10.2929 3.29289C10.4804 3.10536 10.7348 3 11 3C11.2652 3 11.5196 3.10536 11.7071 3.29289C11.8946 3.48043 12 3.73478 12 4V5H20V4C20 3.73478 20.1054 3.48043 20.2929 3.29289C20.4804 3.10536 20.7348 3 21 3C21.2652 3 21.5196 3.10536 21.7071 3.29289C21.8946 3.48043 22 3.73478 22 4V17.9112C22 18.1765 21.8946 18.4308 21.7071 18.6184C21.5196 18.8059 21.2652 18.9112 21 18.9112C20.7348 18.9112 20.4804 18.8059 20.2929 18.6184C20.1054 18.4308 20 18.1765 20 17.9112V17H12V17.6737C12 17.939 11.8946 18.1933 11.7071 18.3809C11.5196 18.5684 11.2652 18.6737 11 18.6737C10.7348 18.6737 10.4804 18.5684 10.2929 18.3809C10.1054 18.1933 10 17.939 10 17.6737ZM12 9C12 9.26522 12.1054 9.51957 12.2929 9.70711C12.4804 9.89464 12.7348 10 13 10H19C19.2652 10 19.5196 9.89464 19.7071 9.70711C19.8946 9.51957 20 9.26522 20 9C20 8.73478 19.8946 8.48043 19.7071 8.29289C19.5196 8.10536 19.2652 8 19 8H13C12.7348 8 12.4804 8.10536 12.2929 8.29289C12.1054 8.48043 12 8.73478 12 9ZM12 13C12 13.2652 12.1054 13.5196 12.2929 13.7071C12.4804 13.8946 12.7348 14 13 14H19C19.2652 14 19.5196 13.8946 19.7071 13.7071C19.8946 13.5196 20 13.2652 20 13C20 12.7348 19.8946 12.4804 19.7071 12.2929C19.5196 12.1054 19.2652 12 19 12H13C12.7348 12 12.4804 12.1054 12.2929 12.2929C12.1054 12.4804 12 12.7348 12 13Z" fill="url(#paint0_linear_pool)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_pool" x1="16" y1="3" x2="16" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_pool">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Plant = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_plant)">
            <path d="M25.6762 19.8842C24.4774 20.6129 23.1005 20.9962 21.6975 20.9917C20.5221 20.9823 19.3601 20.7419 18.2775 20.2842C17.4431 21.462 16.9966 22.8707 17 24.3142V28.0004C17.0003 28.1375 16.9724 28.2732 16.9181 28.399C16.8637 28.5249 16.7841 28.6382 16.6841 28.732C16.5841 28.8258 16.4659 28.898 16.3368 28.9442C16.2077 28.9903 16.0705 29.0095 15.9337 29.0004C15.6767 28.978 15.4376 28.8593 15.2644 28.6681C15.0913 28.4768 14.9968 28.2271 15 27.9692V26.4142L10.1725 21.5867C9.45486 21.8544 8.6959 21.9944 7.92999 22.0004C6.87557 22.003 5.84091 21.7145 4.93999 21.1667C2.21624 19.5117 0.749985 15.7029 1.03374 10.9742C1.04802 10.7295 1.15164 10.4986 1.32493 10.3253C1.49821 10.1521 1.72909 10.0484 1.97374 10.0342C6.70249 9.7554 10.5112 11.2167 12.1612 13.9404C12.8095 15.008 13.0925 16.2577 12.9675 17.5004C12.9597 17.5967 12.9242 17.6887 12.8653 17.7652C12.8064 17.8417 12.7265 17.8996 12.6354 17.9317C12.5443 17.9638 12.4459 17.9689 12.3519 17.9462C12.258 17.9236 12.1727 17.8743 12.1062 17.8042L9.70624 15.2917C9.51717 15.112 9.26542 15.0134 9.00466 15.0167C8.7439 15.0201 8.49476 15.1251 8.31036 15.3095C8.12596 15.4939 8.02088 15.7431 8.01755 16.0038C8.01421 16.2646 8.11286 16.5163 8.29248 16.7054L15.0275 23.6117C15.035 23.5142 15.0437 23.4167 15.0537 23.3204C15.2724 21.4663 16.0905 19.7344 17.3837 18.3879L23.7075 11.7054C23.8951 11.5179 24.0006 11.2636 24.0007 10.9983C24.0008 10.7331 23.8956 10.4787 23.7081 10.291C23.5206 10.1034 23.2663 9.99791 23.0011 9.99779C22.7358 9.99767 22.4814 10.1029 22.2937 10.2904L16.1687 16.7679C16.1074 16.8328 16.0298 16.8802 15.944 16.905C15.8583 16.9298 15.7674 16.9312 15.6809 16.909C15.5944 16.8868 15.5154 16.8418 15.4521 16.7787C15.3889 16.7157 15.3437 16.6368 15.3212 16.5504C14.7287 14.3654 14.99 12.1904 16.1212 10.3229C18.3537 6.6379 23.5487 4.6654 30.0187 5.0454C30.2634 5.05969 30.4943 5.16331 30.6675 5.33659C30.8408 5.50988 30.9444 5.74076 30.9587 5.9854C31.3337 12.4567 29.3612 17.6517 25.6762 19.8842Z" fill="url(#paint0_linear_plant)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_plant" x1="16.0015" y1="4.99902" x2="16.0015" y2="29.0026" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_plant">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ==============================================================
// ENVIRONMENT & ENERGY ICONS
// ==============================================================

export const Wind = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_wind)">
            <path d="M15 13H3C2.86291 13.0003 2.72723 12.9724 2.60137 12.9181C2.47552 12.8637 2.36218 12.7841 2.2684 12.6841C2.17462 12.5841 2.1024 12.4659 2.05623 12.3368C2.01006 12.2077 1.99092 12.0705 2 11.9337C2.02212 11.6762 2.14111 11.4366 2.33296 11.2633C2.52481 11.09 2.77525 10.9959 3.03375 11H14C14.1371 11.0003 14.2728 10.9724 14.3986 10.9181C14.5245 10.8637 14.6378 10.7841 14.7316 10.6841C14.8254 10.5841 14.8976 10.4659 14.9438 10.3368C14.9899 10.2077 15.0091 10.0705 15 9.93375C14.9779 9.67616 14.8589 9.43655 14.667 9.26326C14.4752 9.08997 14.2247 8.99588 13.9663 9H11.5363C11.464 9.00076 11.3925 8.98586 11.3266 8.95633C11.2606 8.9268 11.2019 8.88334 11.1544 8.82893C11.1069 8.77452 11.0717 8.71046 11.0513 8.64116C11.0309 8.57186 11.0258 8.49897 11.0363 8.4275C11.146 7.66892 11.4713 6.95783 11.9735 6.37886C12.4758 5.79988 13.1338 5.3774 13.8693 5.16168C14.6048 4.94597 15.3868 4.94611 16.1222 5.16208C16.8576 5.37806 17.5155 5.80078 18.0175 6.37993C18.5196 6.95909 18.8447 7.67029 18.9541 8.42891C19.0635 9.18752 18.9527 9.96161 18.6348 10.659C18.3169 11.3565 17.8053 11.9479 17.1609 12.3629C16.5165 12.7779 15.7665 12.9991 15 13ZM29.99 12.7137C29.9196 11.7296 29.488 10.8063 28.7781 10.1211C28.0682 9.43588 27.1301 9.03723 26.1441 9.00172C25.1582 8.96622 24.1938 9.29636 23.4365 9.92871C22.6792 10.5611 22.1822 11.451 22.0413 12.4275C22.0308 12.499 22.0359 12.5719 22.0563 12.6412C22.0767 12.7105 22.1119 12.7745 22.1594 12.8289C22.2069 12.8833 22.2656 12.9268 22.3316 12.9563C22.3975 12.9859 22.469 13.0008 22.5413 13H24.9713C25.2293 12.9965 25.4791 13.0909 25.6705 13.2641C25.8618 13.4374 25.9804 13.6766 26.0025 13.9337C26.0116 14.0705 25.9924 14.2077 25.9463 14.3368C25.9001 14.4659 25.8279 14.5841 25.7341 14.6841C25.6403 14.7841 25.527 14.8637 25.4011 14.9181C25.2753 14.9724 25.1396 15.0003 25.0025 15H4.03375C3.77525 14.9959 3.52481 15.09 3.33296 15.2633C3.14111 15.4366 3.02212 15.6762 3 15.9337C2.99092 16.0705 3.01006 16.2077 3.05623 16.3368C3.1024 16.4659 3.17462 16.5841 3.2684 16.6841C3.36218 16.7841 3.47552 16.8637 3.60137 16.9181C3.72723 16.9724 3.86291 17.0003 4 17H26C26.5494 17 27.093 16.8869 27.5967 16.6676C28.1005 16.4483 28.5537 16.1276 28.9281 15.7254C29.3024 15.3233 29.5899 14.8483 29.7726 14.3302C29.9553 13.812 30.0293 13.2618 29.99 12.7137ZM19 19H5.03375C4.77525 18.9959 4.52481 19.09 4.33296 19.2633C4.14111 19.4366 4.02212 19.6762 4 19.9337C3.99092 20.0705 4.01006 20.2077 4.05623 20.3368C4.1024 20.4659 4.17462 20.5841 4.2684 20.6841C4.36218 20.7841 4.47552 20.8637 4.60137 20.9181C4.72723 20.9724 4.86291 21.0003 5 21H17.9662C18.2243 20.9965 18.4741 21.0909 18.6655 21.2641C18.8568 21.4374 18.9754 21.6766 18.9975 21.9337C19.0066 22.0705 18.9874 22.2077 18.9413 22.3368C18.8951 22.4659 18.8229 22.5841 18.7291 22.6841C18.6353 22.7841 18.522 22.8637 18.3961 22.9181C18.2703 22.9724 18.1346 23.0003 17.9975 23H15.5363C15.464 22.9992 15.3925 23.0141 15.3266 23.0437C15.2606 23.0732 15.2019 23.1167 15.1544 23.1711C15.1069 23.2255 15.0717 23.2895 15.0513 23.3588C15.0309 23.4281 15.0258 23.501 15.0363 23.5725C15.146 24.3311 15.4713 25.0422 15.9735 25.6211C16.4758 26.2001 17.1338 26.6226 17.8693 26.8383C18.6048 27.054 19.3868 27.0539 20.1222 26.8379C20.8576 26.6219 21.5155 26.1992 22.0175 25.6201C22.5196 25.0409 22.8447 24.3297 22.9541 23.5711C23.0635 22.8125 22.9527 22.0384 22.6348 21.341C22.3169 20.6435 21.8053 20.0521 21.1609 19.6371C20.5165 19.2221 19.7665 19.0009 19 19Z" fill="url(#paint0_linear_wind)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_wind" x1="15.999" y1="5" x2="15.999" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_wind">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Windmill = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_windmill)">
            <path d="M29.8213 10.167C29.0894 8.42895 28.035 6.84521 26.7138 5.49953C26.6227 5.40216 26.5131 5.32399 26.3914 5.26961C26.2696 5.21522 26.1383 5.18573 26.005 5.18285C25.8717 5.17997 25.7392 5.20378 25.6152 5.25286C25.4913 5.30195 25.3784 5.37532 25.2832 5.46867C25.188 5.56201 25.1125 5.67345 25.061 5.79642C25.0095 5.91939 24.9831 6.05142 24.9834 6.18473C24.9837 6.31805 25.0106 6.44996 25.0626 6.57272C25.1147 6.69547 25.1907 6.80658 25.2863 6.89953C27.6697 9.32782 29.005 12.5945 29.005 15.997C29.005 19.3996 27.6697 22.6662 25.2863 25.0945C25.194 25.1883 25.1211 25.2992 25.0718 25.4211C25.0224 25.543 24.9975 25.6735 24.9986 25.805C24.9996 25.9365 25.0265 26.0665 25.0778 26.1876C25.1291 26.3087 25.2038 26.4185 25.2975 26.5108C25.3912 26.603 25.5022 26.6759 25.6241 26.7253C25.746 26.7746 25.8764 26.7995 26.008 26.7985C26.1395 26.7974 26.2695 26.7705 26.3906 26.7192C26.5117 26.6679 26.6215 26.5933 26.7138 26.4995C28.784 24.3854 30.1835 21.7066 30.7364 18.7997C31.2892 15.8928 30.9709 12.8873 29.8213 10.1608V10.167Z" fill="url(#paint0_linear_windmill)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_windmill" x1="27.4999" y1="5.17969" x2="27.4999" y2="26.7995" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_windmill">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// TECHNOLOGY & COMMUNICATION ICONS
// ============================================

export const Broadcast = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_broadcast)">
            <path d="M21 15.9995C21 16.9884 20.7068 17.9551 20.1574 18.7774C19.6079 19.5996 18.8271 20.2405 17.9134 20.6189C16.9998 20.9974 15.9945 21.0964 15.0246 20.9035C14.0546 20.7105 13.1637 20.2343 12.4645 19.5351C11.7652 18.8358 11.289 17.9449 11.0961 16.975C10.9032 16.0051 11.0022 14.9997 11.3806 14.0861C11.759 13.1725 12.3999 12.3916 13.2222 11.8422C14.0444 11.2928 15.0111 10.9995 16 10.9995C17.3261 10.9995 18.5979 11.5263 19.5355 12.464C20.4732 13.4017 21 14.6734 21 15.9995ZM26 15.9995C26.003 13.5394 25.0961 11.165 23.4538 9.33328C23.3669 9.23304 23.2609 9.15109 23.142 9.09221C23.0231 9.03333 22.8937 8.99869 22.7613 8.9903C22.6289 8.98192 22.4962 8.99997 22.3709 9.04339C22.2455 9.08681 22.13 9.15473 22.0312 9.24321C21.9323 9.33169 21.8521 9.43895 21.7951 9.55875C21.7381 9.67855 21.7055 9.80848 21.6993 9.941C21.693 10.0735 21.7132 10.2059 21.7586 10.3306C21.804 10.4552 21.8737 10.5696 21.9638 10.667C23.2755 12.1337 24.0007 14.0324 24.0007 16.0002C24.0007 17.9679 23.2755 19.8666 21.9638 21.3333C21.7918 21.5316 21.7048 21.7896 21.7214 22.0515C21.7379 22.3134 21.8568 22.5583 22.0524 22.7334C22.248 22.9085 22.5045 22.9996 22.7667 22.9872C23.0288 22.9748 23.2756 22.8598 23.4538 22.667C25.0959 20.8347 26.0027 18.46 26 15.9995ZM10.0363 10.667C10.1263 10.5696 10.196 10.4552 10.2415 10.3306C10.2869 10.2059 10.307 10.0735 10.3007 9.941C10.2945 9.80848 10.2619 9.67855 10.2049 9.55875C10.1479 9.43895 10.0677 9.33169 9.96882 9.24321C9.86997 9.15473 9.75451 9.08681 9.62916 9.04339C9.50381 8.99997 9.37107 8.98192 9.23867 8.9903C9.10628 8.99869 8.97688 9.03333 8.858 9.09221C8.73912 9.15109 8.63315 9.23304 8.54626 9.33328C6.90475 11.166 5.99706 13.5398 5.99706 16.0002C5.99706 18.4605 6.90475 20.8343 8.54626 22.667C8.7244 22.8598 8.97117 22.9748 9.23334 22.9872C9.49551 22.9996 9.75205 22.9085 9.94761 22.7334C10.1432 22.5583 10.2621 22.3134 10.2787 22.0515C10.2952 21.7896 10.2082 21.5316 10.0363 21.3333C8.72321 19.8672 7.99715 17.9683 7.99715 16.0002C7.99715 14.032 8.72321 12.1331 10.0363 10.667Z" fill="url(#paint0_linear_broadcast)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_broadcast" x1="16" y1="8.98633" x2="16" y2="23.0002" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_broadcast">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Elevator = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_elevator)">
            <path d="M26 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V26C4 26.5304 4.21071 27.0391 4.58579 27.4142C4.96086 27.7893 5.46957 28 6 28H26C26.5304 28 27.0391 27.7893 27.4142 27.4142C27.7893 27.0391 28 26.5304 28 26V6C28 5.46957 27.7893 4.96086 27.4142 4.58579C27.0391 4.21071 26.5304 4 26 4ZM14 7H18C18.2652 7 18.5196 7.10536 18.7071 7.29289C18.8946 7.48043 19 7.73478 19 8C19 8.26522 18.8946 8.51957 18.7071 8.70711C18.5196 8.89464 18.2652 9 18 9H14C13.7348 9 13.4804 8.89464 13.2929 8.70711C13.1054 8.51957 13 8.26522 13 8C13 7.73478 13.1054 7.48043 13.2929 7.29289C13.4804 7.10536 13.7348 7 14 7ZM15 26H8V12H15V26ZM24 26H17V12H24V26Z" fill="url(#paint0_linear_elevator)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_elevator" x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_elevator">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Suitcase = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_suitcase)">
            <path d="M27 7H22V6C22 5.20435 21.6839 4.44129 21.1213 3.87868C20.5587 3.31607 19.7956 3 19 3H13C12.2044 3 11.4413 3.31607 10.8787 3.87868C10.3161 4.44129 10 5.20435 10 6V7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V9C29 8.46957 28.7893 7.96086 28.4142 7.58579C28.0391 7.21071 27.5304 7 27 7ZM12 9H20V25H12V9ZM12 6C12 5.73478 12.1054 5.48043 12.2929 5.29289C12.4804 5.10536 12.7348 5 13 5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V7H12V6Z" fill="url(#paint0_linear_suitcase)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_suitcase" x1="16" y1="3" x2="16" y2="27" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_suitcase">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const DeviceMobileSpeaker = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_mobile)">
            <path d="M22 2H10C9.20435 2 8.44129 2.31607 7.87868 2.87868C7.31607 3.44129 7 4.20435 7 5V27C7 27.7956 7.31607 28.5587 7.87868 29.1213C8.44129 29.6839 9.20435 30 10 30H22C22.7956 30 23.5587 29.6839 24.1213 29.1213C24.6839 28.5587 25 27.7956 25 27V5C25 4.20435 24.6839 3.44129 24.1213 2.87868C23.5587 2.31607 22.7956 2 22 2ZM20 8H12C11.7348 8 11.4804 7.89464 11.2929 7.70711C11.1054 7.51957 11 7.26522 11 7C11 6.73478 11.1054 6.48043 11.2929 6.29289C11.4804 6.10536 11.7348 6 12 6H20C20.2652 6 20.5196 6.10536 20.7071 6.29289C20.8946 6.48043 21 6.73478 21 7C21 7.26522 20.8946 7.51957 20.7071 7.70711C20.5196 7.89464 20.2652 8 20 8Z" fill="url(#paint0_linear_mobile)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_mobile" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_mobile">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const CalendarDots = ({ className = "", width = 32, height = 32 }) => (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clipPath="url(#clip0_caldots)">
            <path d="M26 4H23V3C23 2.73478 22.8946 2.48043 22.7071 2.29289C22.5196 2.10536 22.2652 2 22 2C21.7348 2 21.4804 2.10536 21.2929 2.29289C21.1054 2.48043 21 2.73478 21 3V4H11V3C11 2.73478 10.8946 2.48043 10.7071 2.29289C10.5196 2.10536 10.2652 2 10 2C9.73478 2 9.48043 2.10536 9.29289 2.29289C9.10536 2.48043 9 2.73478 9 3V4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V26C4 26.5304 4.21071 27.0391 4.58579 27.4142C4.96086 27.7893 5.46957 28 6 28H26C26.5304 28 27.0391 27.7893 27.4142 27.4142C27.7893 27.0391 28 26.5304 28 26V6C28 5.46957 27.7893 4.96086 27.4142 4.58579C27.0391 4.21071 26.5304 4 26 4ZM10.5 23C10.2033 23 9.91332 22.912 9.66665 22.7472C9.41997 22.5824 9.22771 22.3481 9.11418 22.074C9.00065 21.7999 8.97094 21.4983 9.02882 21.2074C9.0867 20.9164 9.22956 20.6491 9.43934 20.4393C9.64912 20.2296 9.91639 20.0867 10.2074 20.0288C10.4983 19.9709 10.7999 20.0007 11.074 20.1142C11.3481 20.2277 11.5824 20.42 11.7472 20.6666C11.912 20.9133 12 21.2033 12 21.5C12 21.8978 11.842 22.2794 11.5607 22.5607C11.2794 22.842 10.8978 23 10.5 23ZM16 23C15.7033 23 15.4133 22.912 15.1666 22.7472C14.92 22.5824 14.7277 22.3481 14.6142 22.074C14.5006 21.7999 14.4709 21.4983 14.5288 21.2074C14.5867 20.9164 14.7296 20.6491 14.9393 20.4393C15.1491 20.2296 15.4164 20.0867 15.7074 20.0288C15.9983 19.9709 16.2999 20.0007 16.574 20.1142C16.8481 20.2277 17.0824 20.42 17.2472 20.6666C17.412 20.9133 17.5 21.2033 17.5 21.5C17.5 21.8978 17.342 22.2794 17.0607 22.5607C16.7794 22.842 16.3978 23 16 23ZM16 18C15.7033 18 15.4133 17.912 15.1666 17.7472C14.92 17.5824 14.7277 17.3481 14.6142 17.074C14.5006 16.7999 14.4709 16.4983 14.5288 16.2074C14.5867 15.9164 14.7296 15.6491 14.9393 15.4393C15.1491 15.2296 15.4164 15.0867 15.7074 15.0288C15.9983 14.9709 16.2999 15.0006 16.574 15.1142C16.8481 15.2277 17.0824 15.42 17.2472 15.6666C17.412 15.9133 17.5 16.2033 17.5 16.5C17.5 16.8978 17.342 17.2794 17.0607 17.5607C16.7794 17.842 16.3978 18 16 18ZM21.5 23C21.2033 23 20.9133 22.912 20.6666 22.7472C20.42 22.5824 20.2277 22.3481 20.1142 22.074C20.0007 21.7999 19.9709 21.4983 20.0288 21.2074C20.0867 20.9164 20.2296 20.6491 20.4393 20.4393C20.6491 20.2296 20.9164 20.0867 21.2074 20.0288C21.4983 19.9709 21.7999 20.0007 22.074 20.1142C22.3481 20.2277 22.5824 20.42 22.7472 20.6666C22.912 20.9133 23 21.2033 23 21.5C23 21.8978 22.842 22.2794 22.5607 22.5607C22.2794 22.842 21.8978 23 21.5 23ZM21.5 18C21.2033 18 20.9133 17.912 20.6666 17.7472C20.42 17.5824 20.2277 17.3481 20.1142 17.074C20.0007 16.7999 19.9709 16.4983 20.0288 16.2074C20.0867 15.9164 20.2296 15.6491 20.4393 15.4393C20.6491 15.2296 20.9164 15.0867 21.2074 15.0288C21.4983 14.9709 21.7999 15.0006 22.074 15.1142C22.3481 15.2277 22.5824 15.42 22.7472 15.6666C22.912 15.9133 23 16.2033 23 16.5C23 16.8978 22.842 17.2794 22.5607 17.5607C22.2794 17.842 21.8978 18 21.5 18ZM26 10H6V6H9V7C9 7.26522 9.10536 7.51957 9.29289 7.70711C9.48043 7.89464 9.73478 8 10 8C10.2652 8 10.5196 7.89464 10.7071 7.70711C10.8946 7.51957 11 7.26522 11 7V6H21V7C21 7.26522 21.1054 7.51957 21.2929 7.70711C21.4804 7.89464 21.7348 8 22 8C22.2652 8 22.5196 7.89464 22.7071 7.70711C22.8946 7.51957 23 7.26522 23 7V6H26V10Z" fill="url(#paint0_linear_caldots)"/>
        </g>
        <defs>
            <linearGradient id="paint0_linear_caldots" x1="16" y1="2" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="white"/>
                <stop offset="1" stopColor="#999999"/>
            </linearGradient>
            <clipPath id="clip0_caldots">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

// ============================================
// ICON LIBRARY - ORGANIZED BY CATEGORY
// ============================================

const IconLibrary = {
    // Navigation
    ArrowRight,
    
    // Home & Property Maintenance
    Fan,
    HeadCircuit,
    PaintBucket,
    Hammer,
    CardsThree,
    GridFour,
    Tools,
    Wrench,
    
    // Home & Building
    Home,
    HouseLine,
    BuildingApartment,
    
    // Furniture & Interior
    Armchair,
    Bed,
    Desk,
    
    // Utilities & Appliances
    Lightbulb,
    WaterDrop,
    Drop,
    Oven,
    SecurityCamera,
    PintGlass,
    
    // Nature & Outdoor
    PottedPlant,
    SwimmingPool,
    Plant,
    
    // Environment & Energy
    Wind,
    Windmill,
    
    // Technology & Communication
    Broadcast,
    Elevator,
    Suitcase,
    DeviceMobileSpeaker,
    Calendar,
    CalendarDots,
    Phone,
    Mail,
    Settings,
    
    // General UI
    Shield,
    CheckCircle,
    Star,
    Search,
    User,
    SquaresFour,
    SpeakerNone,
    BugBeetle,
    
    // Transportation
    Bus,
};

// Default export - use like: import Icons from '@/components/icons'
export default IconLibrary;
