'use client';
import React, { memo } from 'react'

const Hero_background = memo(() => {
  return (
    <div 
      className="absolute inset-0 w-screen h-full overflow-hidden -z-10 top-0 "
      style={{
        willChange: 'opacity',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint',
        isolation: 'isolate'
      }}
    >
      {/* First SVG */}
      <svg 
        className="absolute w-full min-w-full"
        style={{
          animation: 'fadeInOut1 8s ease-in-out infinite',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        viewBox="0 0 1502 1076" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid slice"
      >
        <g filter="url(#filter0_d_2011_2132)">
          <g clipPath="url(#clip0_2011_2132)">
            <rect x="14" y="10" width="1474" height="1048" fill="black"/>
            <g filter="url(#filter1_f_2011_2132)">
              <path d="M751.737 31.2413L810.198 323.596C836.015 452.706 903.584 569.738 1002.49 656.651L1226.44 853.457L751.737 692.851L277.031 853.457L500.988 656.651C599.891 569.738 667.46 452.706 693.277 323.596L751.737 31.2413Z" fill="#2388FF"/>
            </g>
            <g opacity="0.4" filter="url(#filter2_f_2011_2132)">
              <path d="M928.319 -16L1004.29 363.946C1030.11 493.055 1097.68 610.087 1196.58 697L1487.64 952.77L928.319 763.537L369 952.77L660.055 697C758.958 610.087 826.527 493.055 852.344 363.946L928.319 -16Z" fill="#2388FF"/>
            </g>
            <g opacity="0.4" filter="url(#filter3_f_2011_2132)">
              <path d="M600.319 -42L676.295 337.946C702.112 467.055 769.681 584.087 868.584 671L1159.64 926.77L600.319 737.537L41 926.77L332.055 671C430.958 584.087 498.527 467.055 524.344 337.946L600.319 -42Z" fill="#2388FF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter4_f_2011_2132)">
              <ellipse cx="751.737" cy="789.559" rx="267.912" ry="189.309" fill="#4A3AFF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter5_f_2011_2132)">
              <path d="M751.649 661.644C1027.49 661.644 1266.9 700.419 1386.43 757.233C1259.73 704.051 1022.9 668.27 751.649 668.27C480.395 668.27 243.565 704.051 116.865 757.233C236.4 700.419 475.804 661.644 751.649 661.644Z" fill="#2388FF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter6_f_2011_2132)">
              <path d="M1386.44 757.236C1259.75 704.052 1022.91 668.27 751.649 668.27C480.388 668.27 243.552 704.052 116.855 757.236C236.386 700.42 475.796 645.678 751.649 645.678C1027.5 645.678 1266.91 700.42 1386.44 757.236Z" fill="#4A3AFF"/>
            </g>
            <path d="M1484.45 846.177C1484.45 901.076 1604.75 1039.11 1443.76 1071.74C1316.62 1097.51 890.565 1071.74 711.98 1071.74C551.317 1071.74 210.114 1081.66 89.3347 1060.38C-94.1327 1028.04 14.3745 913.341 18.8495 846.177C18.8495 747.922 346.935 668.27 751.649 668.27C1156.36 668.27 1484.45 747.922 1484.45 846.177Z" fill="black"/>
            <path d="M598.921 738.51H909.869M108.471 197.976L108.471 849.529M149.931 197.976L149.931 849.529M191.391 197.976L191.391 849.529M232.85 197.976L232.85 849.529M274.31 197.976L274.31 849.529M315.77 197.976L315.77 849.529M357.23 197.976L357.23 849.529M398.689 197.976L398.689 849.529M440.149 197.976L440.149 849.529M108 823.594H1393.25M481.609 197.976L481.609 849.529M108 783.554H1393.25M523.069 197.976L523.069 849.529M108 743.515H1393.25M564.528 197.976L564.528 849.529M108 703.475H1393.25M605.988 197.976L605.988 849.529M108 663.436H1393.25M647.448 197.976L647.448 849.529M108 623.396H1393.25M688.908 197.976L688.907 849.529M108 583.357H1393.25M730.367 197.976L730.367 849.529M108 543.317H1393.25M771.827 197.976L771.827 849.529M108 503.277H1393.25M813.287 197.976L813.287 849.529M108 463.238H1393.25M854.747 197.976L854.746 849.529M108 423.198H1393.25M896.206 197.976L896.206 849.529M108 383.159H1393.25M937.666 197.976L937.666 849.529M108 343.119H1393.25M979.126 197.976L979.126 849.529M108 303.08H1393.25M1020.59 197.976L1020.59 849.529M108 263.04H1393.25M1062.05 197.976L1062.05 849.529M108 223H1393.25M1103.5 197.976V849.529M108 182.961L1393.25 182.961M1144.96 197.976V849.529M1186.42 197.976V849.529M1227.88 197.976V849.529M1269.34 197.976V849.529M1310.8 197.976V849.529M1352.26 197.976V849.529M1393.72 197.976V849.529" stroke="url(#paint0_radial_2011_2132)" strokeWidth="0.888544"/>
          </g>
          <rect x="14.5" y="10.5" width="1473" height="1047" stroke="black" strokeOpacity="0.75"/>
        </g>
        <defs>
          <filter id="filter0_d_2011_2132" x="0" y="0" width="1502" height="1076" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="7"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2011_2132"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2011_2132" result="shape"/>
          </filter>
          <filter id="filter1_f_2011_2132" x="77.031" y="-168.759" width="1349.41" height="1222.22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <filter id="filter2_f_2011_2132" x="169" y="-216" width="1518.64" height="1368.77" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <filter id="filter3_f_2011_2132" x="-159" y="-242" width="1518.64" height="1368.77" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <filter id="filter4_f_2011_2132" x="253.125" y="369.55" width="997.224" height="840.018" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="115.35" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <filter id="filter5_f_2011_2132" x="108.565" y="653.344" width="1286.17" height="112.189" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="4.15" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <filter id="filter6_f_2011_2132" x="52.4547" y="581.278" width="1398.39" height="240.358" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="32.2" result="effect1_foregroundBlur_2011_2132"/>
          </filter>
          <radialGradient id="paint0_radial_2011_2132" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(750.862 476.687) rotate(90) scale(372.841 719.163)">
            <stop stopColor="white" stopOpacity="0.12"/>
            <stop offset="0.6" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="clip0_2011_2132">
            <rect x="14" y="10" width="1474" height="1048" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      
      {/* Second SVG */}
      <svg 
        className="absolute w-full h-auto min-w-full"
        style={{
          animation: 'fadeInOut2 8s ease-in-out infinite',
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        viewBox="0 0 1502 1076" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid slice"
      >
        <g filter="url(#filter0_d_2003_2084)">
          <g clipPath="url(#clip0_2003_2084)">
            <rect x="14" y="10" width="1474" height="1048" fill="black"/>
            <g filter="url(#filter1_f_2003_2084)">
              <path d="M377 10L455.838 404.477C481.636 533.556 549.165 650.569 648.019 737.487L950 1003L377 809.034L-196 1003L105.981 737.487C204.835 650.569 272.364 533.556 298.162 404.477L377 10Z" fill="#2388FF"/>
            </g>
            <g opacity="0.4" filter="url(#filter2_f_2003_2084)">
              <path d="M752.319 -274.23L858.885 258.888C884.689 387.977 952.231 504.998 1051.1 591.913L1459.32 950.77L752.319 711.486L45.3193 950.77L453.536 591.913C552.407 504.998 619.949 387.978 645.753 258.889L752.319 -274.23Z" fill="#2388FF"/>
            </g>
            <g opacity="0.4" filter="url(#filter3_f_2003_2084)">
              <path d="M1131.5 -74L1252.65 532.024C1278.46 661.119 1346.01 778.143 1444.89 865.058L1909 1273L1131.5 1009.89L354 1273L818.107 865.058C916.988 778.143 984.539 661.119 1010.35 532.024L1131.5 -74Z" fill="#2388FF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter4_f_2003_2084)">
              <ellipse cx="751.737" cy="789.559" rx="267.912" ry="189.309" fill="#4A3AFF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter5_f_2003_2084)">
              <path d="M751.649 661.644C1027.49 661.644 1266.9 700.419 1386.43 757.233C1259.73 704.051 1022.9 668.27 751.649 668.27C480.395 668.27 243.565 704.051 116.865 757.233C236.4 700.419 475.804 661.644 751.649 661.644Z" fill="#2388FF"/>
            </g>
            <g style={{mixBlendMode: 'plus-lighter'}} filter="url(#filter6_f_2003_2084)">
              <path d="M1386.44 757.236C1259.75 704.052 1022.91 668.27 751.649 668.27C480.388 668.27 243.552 704.052 116.855 757.236C236.386 700.42 475.796 645.678 751.649 645.678C1027.5 645.678 1266.91 700.42 1386.44 757.236Z" fill="#4A3AFF"/>
            </g>
            <path d="M1484.45 846.177C1484.45 901.076 1604.75 1039.11 1443.76 1071.74C1316.62 1097.51 890.565 1071.74 711.98 1071.74C551.317 1071.74 210.114 1081.66 89.3346 1060.38C-94.1329 1028.04 14.3744 913.341 18.8494 846.177C18.8494 747.922 346.935 668.27 751.649 668.27C1156.36 668.27 1484.45 747.922 1484.45 846.177Z" fill="black"/>
            <path d="M598.921 738.51H909.869M108.471 197.976L108.471 849.529M149.931 197.976L149.931 849.529M191.391 197.976L191.391 849.529M232.85 197.976L232.85 849.529M274.31 197.976L274.31 849.529M315.77 197.976L315.77 849.529M357.23 197.976L357.23 849.529M398.689 197.976L398.689 849.529M440.149 197.976L440.149 849.529M108 823.594H1393.25M481.609 197.976L481.609 849.529M108 783.554H1393.25M523.069 197.976L523.069 849.529M108 743.515H1393.25M564.528 197.976L564.528 849.529M108 703.475H1393.25M605.988 197.976L605.988 849.529M108 663.436H1393.25M647.448 197.976L647.448 849.529M108 623.396H1393.25M688.908 197.976L688.907 849.529M108 583.357H1393.25M730.367 197.976L730.367 849.529M108 543.317H1393.25M771.827 197.976L771.827 849.529M108 503.277H1393.25M813.287 197.976L813.287 849.529M108 463.238H1393.25M854.747 197.976L854.746 849.529M108 423.198H1393.25M896.206 197.976L896.206 849.529M108 383.159H1393.25M937.666 197.976L937.666 849.529M108 343.119H1393.25M979.126 197.976L979.126 849.529M108 303.08H1393.25M1020.59 197.976L1020.59 849.529M108 263.04H1393.25M1062.05 197.976L1062.05 849.529M108 223H1393.25M1103.5 197.976V849.529M108 182.961L1393.25 182.961M1144.96 197.976V849.529M1186.42 197.976V849.529M1227.88 197.976V849.529M1269.34 197.976V849.529M1310.8 197.976V849.529M1352.26 197.976V849.529M1393.72 197.976V849.529" stroke="url(#paint0_radial_2003_2084)" strokeWidth="0.888544"/>
          </g>
          <rect x="14.5" y="10.5" width="1473" height="1047" stroke="black" strokeOpacity="0.75"/>
        </g>
        <defs>
          <filter id="filter0_d_2003_2084" x="0" y="0" width="1502" height="1076" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="7"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2003_2084"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2003_2084" result="shape"/>
          </filter>
          <filter id="filter1_f_2003_2084" x="-396" y="-190" width="1546" height="1393" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <filter id="filter2_f_2003_2084" x="-154.681" y="-474.23" width="1814" height="1625" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <filter id="filter3_f_2003_2084" x="154" y="-274" width="1955" height="1747" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <filter id="filter4_f_2003_2084" x="253.125" y="369.55" width="997.224" height="840.018" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="115.35" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <filter id="filter5_f_2003_2084" x="108.565" y="653.344" width="1286.17" height="112.189" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="4.15" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <filter id="filter6_f_2003_2084" x="52.4547" y="581.278" width="1398.39" height="240.358" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="32.2" result="effect1_foregroundBlur_2003_2084"/>
          </filter>
          <radialGradient id="paint0_radial_2003_2084" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(750.862 476.687) rotate(90) scale(372.841 719.163)">
            <stop stopColor="white" stopOpacity="0.12"/>
            <stop offset="0.6" stopColor="white" stopOpacity="0"/>
          </radialGradient>
          <clipPath id="clip0_2003_2084">
            <rect x="14" y="10" width="1474" height="1048" fill="white"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  )
});

Hero_background.displayName = 'Hero_background';

export default Hero_background
