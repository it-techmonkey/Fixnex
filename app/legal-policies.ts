export type PolicySection = {
  title: string;
  body?: string[];
  bullets?: string[];
};

export type LegalPolicy = {
  slug: string;
  title: string;
  effectiveDate: string;
  description: string;
  sections: PolicySection[];
};

const contactSection: PolicySection = {
  title: "Contact Information",
  body: [
    "For questions, requests, complaints, cancellations, refunds, delivery, or shipping-related concerns, please contact FixNex.",
    "FixNex, Office 904, Abraj Center, Dubai, United Arab Emirates. Email: info@fixnex.ae. Phone: +971 58 515 0800.",
  ],
};

export const legalPolicies = {
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    effectiveDate: "19 May 2026",
    description:
      "Terms governing access to and use of the FixNex website, platform, AI tools, bookings, subscriptions, and maintenance services.",
    sections: [
      {
        title: "Introduction",
        body: [
          "These Terms & Conditions govern your access to and use of FixNex's website, platform, and services. By using FixNex, you agree to be bound by these Terms. If you do not agree, you must not use our services.",
          "FixNex provides AI-powered property maintenance services, including booking, monitoring, diagnostics, and on-demand technical support for apartments, villas, offices, and buildings.",
        ],
      },
      {
        title: "Definitions",
        bullets: [
          '"FixNex" refers to the company operating the platform.',
          '"User" or "you" refers to any individual or entity using the services.',
          '"Services" include maintenance, repair, AI diagnostics, subscriptions, and related offerings.',
          '"Platform" refers to the website, AI tools including Nex AI, and booking systems.',
        ],
      },
      {
        title: "Eligibility",
        body: [
          "You must be at least 18 years old to use FixNex services. By using the platform, you confirm that you have the legal capacity to enter into a binding agreement.",
        ],
      },
      {
        title: "Account Registration",
        body: [
          "To access certain features, you may be required to create an account. You agree to provide accurate and complete information, maintain the confidentiality of your login credentials, and notify us immediately of any unauthorized access.",
          "FixNex reserves the right to suspend or terminate accounts that provide false or misleading information.",
        ],
      },
      {
        title: "Services & Bookings",
        bullets: [
          "Services can be booked through the platform without the need for manual confirmation.",
          "You are responsible for providing accurate service details and access to the property.",
          "FixNex will assign technicians or service providers based on availability and service type.",
          "Service timelines are estimates and may vary based on complexity and external factors.",
        ],
      },
      {
        title: "AI-Based Services",
        body: [
          "FixNex uses AI, including Nex AI, to recommend services, predict maintenance issues, and optimize scheduling. AI outputs are recommendations and should not be considered guaranteed outcomes. Final service decisions may involve human oversight.",
        ],
      },
      {
        title: "Pricing & Payments",
        bullets: [
          "Prices are displayed transparently on the platform and are shown in AED (United Arab Emirates Dirham).",
          "Payments must be completed at the time of booking unless otherwise stated.",
          "Subscription plans are billed monthly as per the selected plan.",
          "Payments are processed through secure third-party providers.",
          "Accepted payment methods may include Visa, Mastercard, Apple Pay, and other methods displayed at checkout.",
          "FixNex reserves the right to update pricing at any time with prior notice.",
        ],
      },
      {
        title: "Cancellations & Refunds",
        bullets: [
          "Users may cancel services within the allowed cancellation window specified at booking.",
          "Refund eligibility depends on service status and timing of cancellation.",
          "Completed services are generally non-refundable unless there is a verified service issue.",
        ],
      },
      {
        title: "Service Warranty & Liability",
        body: [
          "FixNex aims to deliver high-quality services but does not guarantee uninterrupted or error-free service, or that all issues can be predicted or prevented by AI systems.",
          "To the maximum extent permitted by law, FixNex is not liable for indirect, incidental, or consequential damages, and liability is limited to the amount paid for the specific service.",
        ],
      },
      {
        title: "User Responsibilities",
        bullets: [
          "Provide safe and lawful access to your property.",
          "Ensure accurate information is provided.",
          "Do not misuse the platform or services.",
          "Comply with applicable laws and regulations.",
        ],
      },
      {
        title: "Prohibited Use",
        bullets: [
          "Use of the platform for fraudulent or illegal purposes is prohibited.",
          "You may not interfere with system security or operations.",
          "You may not attempt to reverse engineer AI systems or software.",
          "You may not misrepresent service requirements.",
        ],
      },
      {
        title: "Intellectual Property",
        body: [
          "All content, branding, AI systems, and technology on the platform are owned by FixNex or its licensors. You may not copy, reproduce, or distribute any material without prior written consent.",
        ],
      },
      {
        title: "Privacy",
        body: [
          "Your use of FixNex is also governed by our Privacy Policy, which explains how we collect and process personal data in compliance with UAE PDPL and GDPR principles.",
        ],
      },
      {
        title: "Third-Party Services",
        body: [
          "FixNex may use third-party providers for payments, analytics, and service delivery. We are not responsible for the actions or policies of these third parties.",
        ],
      },
      {
        title: "Service Availability",
        body: [
          "Services may not be available in all locations or at all times. FixNex reserves the right to modify or discontinue services without prior notice.",
        ],
      },
      {
        title: "Termination",
        body: [
          "We may suspend or terminate your access to the platform if you violate these Terms, engage in fraudulent or abusive behavior, or fail to make required payments.",
        ],
      },
      {
        title: "Indemnification",
        body: [
          "You agree to indemnify and hold FixNex harmless from any claims, damages, or losses arising from your misuse of the platform, violation of these Terms, or breach of applicable laws.",
        ],
      },
      {
        title: "Governing Law & Jurisdiction",
        body: [
          "These Terms are governed by the laws of the United Arab Emirates. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dubai, UAE.",
        ],
      },
      {
        title: "Changes to Terms",
        body: [
          "FixNex reserves the right to update these Terms at any time. Updated versions will be posted on the platform with a revised effective date. Continued use of the services constitutes acceptance of the updated Terms.",
        ],
      },
      contactSection,
    ],
  },
  "service-delivery-parts-delivery-policy": {
    slug: "service-delivery-parts-delivery-policy",
    title: "Service Delivery & Parts Delivery Policy",
    effectiveDate: "19 May 2026",
    description:
      "How FixNex delivers on-site maintenance services, parts, equipment, tracking updates, failed deliveries, and replacements.",
    sections: [
      {
        title: "Introduction",
        body: [
          "This Service Delivery & Parts Delivery Policy outlines how FixNex handles the delivery of services and any physical products associated with our platform. By booking a service or purchasing from FixNex, you agree to the terms outlined below.",
          "FixNex primarily provides on-site maintenance services, but may also deliver parts, equipment, or products as part of a service or standalone purchase.",
        ],
      },
      {
        title: "Service Delivery (On-Site Services)",
        bullets: [
          "Services are delivered at the address provided during booking.",
          "You are responsible for ensuring accurate address details and access to the property.",
          "Service appointments are scheduled based on availability and selected plan: FixLite, FixPro, or FixMax.",
          "Estimated arrival times may vary due to traffic, complexity, or unforeseen circumstances.",
          "FixNex will make reasonable efforts to notify you of any delays.",
        ],
      },
      {
        title: "Digital Service Confirmation",
        bullets: [
          "All bookings are confirmed digitally via the platform, email, or SMS.",
          "No physical shipping is required for service confirmations.",
          "You will receive updates regarding technician assignment and service status.",
        ],
      },
      {
        title: "Delivery of Parts & Equipment",
        body: [
          "Where a service requires replacement parts, tools, or equipment, items may be delivered by technicians during the service visit or shipped separately to your registered address.",
        ],
        bullets: [
          "Standard delivery: 1-3 business days within the UAE, subject to availability.",
          "Urgent or emergency services: same-day or next-day delivery where applicable.",
          "Delivery timelines are estimates and not guaranteed.",
        ],
      },
      {
        title: "Shipping Charges",
        bullets: [
          "Shipping or delivery costs, if applicable, will be clearly displayed at checkout or included in the service fee.",
          "Some subscription plans may include free or priority delivery of parts.",
        ],
      },
      {
        title: "Order Tracking",
        bullets: [
          "For shipped items, tracking details will be shared via email or SMS.",
          "You may track delivery status through the platform or logistics partner.",
        ],
      },
      {
        title: "Failed Deliveries",
        body: [
          "A delivery may be considered failed if the address provided is incorrect or incomplete, access to the property is not granted, or the recipient is unavailable.",
          "In such cases, re-delivery may be rescheduled and additional charges may apply.",
        ],
      },
      {
        title: "Risk & Ownership",
        bullets: [
          "Ownership of delivered items transfers to you upon successful delivery.",
          "Risk of loss or damage passes to you once items are delivered to the specified address.",
        ],
      },
      {
        title: "Damaged or Missing Items",
        body: [
          "If you receive damaged, defective, or missing items, notify us within 48 hours of delivery and provide supporting details such as photos and a description. We will assess and, where applicable, arrange replacement or resolution.",
        ],
      },
      {
        title: "Returns & Replacements",
        bullets: [
          "Returns are only accepted for defective or incorrect items.",
          "Items must be unused and in original condition where applicable.",
          "Replacement timelines will depend on product availability.",
          "Service-related parts installed during a job may not be eligible for return unless faulty.",
        ],
      },
      {
        title: "Service Delays & Force Majeure",
        body: [
          "FixNex is not liable for delays caused by circumstances beyond our control, including weather conditions, government restrictions, supply chain disruptions, or technical failures. We will make reasonable efforts to minimize delays and keep you informed.",
        ],
      },
      {
        title: "Geographic Coverage",
        bullets: [
          "Services and deliveries are currently available within the United Arab Emirates.",
          "Availability may vary by location.",
        ],
      },
      contactSection,
    ],
  },
  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    effectiveDate: "19 May 2026",
    description:
      "How FixNex collects, uses, shares, secures, and retains personal data under UAE PDPL and, where applicable, GDPR principles.",
    sections: [
      {
        title: "Introduction",
        body: [
          "FixNex is committed to protecting your personal data in accordance with applicable data protection laws, including the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL) and, where applicable, the General Data Protection Regulation (GDPR).",
          "This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you use our website, services, and AI-powered maintenance platform.",
          "By using our services, you agree to the collection and use of your information in accordance with this policy.",
        ],
      },
      {
        title: "Data Controller",
        body: [
          "FixNex is the data controller responsible for your personal data. Registered address: Office 904, Abraj Center, Dubai, United Arab Emirates. Contact: info@fixnex.ae or +971 58 515 0800.",
        ],
      },
      {
        title: "Personal Data We Collect",
        bullets: [
          "Information you provide: full name, email address, phone number, property address, location details, account login credentials, and payment details handled via secure third-party providers.",
          "Service data: booking details, service history, maintenance records, technician notes, and customer support communications.",
          "Technical data: IP address, browser type, device identifiers, log data, usage analytics, cookies, and similar tracking technologies.",
          "AI and smart monitoring data: IoT sensor data, system performance metrics, AI-generated diagnostics, predictions, and recommendations.",
          "Payment data: transactions are processed securely through approved third-party payment gateway and service providers. FixNex does not store, sell, share, rent, or lease customer credit/debit card details on its systems.",
        ],
      },
      {
        title: "Legal Basis for Processing",
        bullets: [
          "Contractual necessity: to provide booked services.",
          "Legitimate interests: to improve services, prevent fraud, and ensure system security.",
          "Consent: for marketing communications and optional data collection.",
          "Legal obligation: to comply with applicable laws and regulations.",
        ],
      },
      {
        title: "How We Use Your Data",
        bullets: [
          "Deliver and manage maintenance services.",
          "Enable AI-driven diagnostics and predictive maintenance.",
          "Process transactions and manage subscriptions.",
          "Communicate service updates, confirmations, and support.",
          "Improve system performance and user experience.",
          "Send promotional communications with consent.",
          "Detect, prevent, and investigate fraud or misuse.",
        ],
      },
      {
        title: "Automated Decision-Making & AI",
        body: [
          "FixNex uses AI systems to provide predictive maintenance insights and service recommendations. These systems may process data automatically to detect potential issues, recommend services, and optimize scheduling.",
          "No decisions producing legal or similarly significant effects are made solely by automated means without human oversight.",
        ],
      },
      {
        title: "Data Sharing & Disclosure",
        body: ["We do not sell your personal data. We may share your data with:"],
        bullets: [
          "Authorized technicians and service personnel.",
          "Payment processors and financial institutions.",
          "Cloud hosting, analytics, and AI technology providers.",
          "Regulatory authorities where required by law.",
          "All third parties are contractually obligated to maintain data confidentiality and security.",
        ],
      },
      {
        title: "International Data Transfers",
        body: [
          "Your data may be transferred and processed outside your country of residence, including within the UAE. Where required, we implement safeguards such as standard contractual clauses, data protection agreements, and transfers to jurisdictions with adequate data protection laws.",
        ],
      },
      {
        title: "Data Retention",
        body: [
          "We retain personal data only for as long as necessary to fulfill service obligations, comply with legal and regulatory requirements, resolve disputes, and enforce agreements.",
        ],
      },
      {
        title: "Data Security",
        body: [
          "We implement appropriate technical and organizational measures, including encryption of data in transit, secure cloud infrastructure, and access control and authentication protocols. Despite these measures, no system can guarantee absolute security.",
        ],
      },
      {
        title: "Your Rights (PDPL & GDPR)",
        bullets: [
          "Access your personal data.",
          "Request correction or rectification.",
          "Request deletion, also known as the right to be forgotten.",
          "Restrict or object to processing.",
          "Withdraw consent at any time.",
          "Request data portability.",
          "Lodge a complaint with a relevant data protection authority.",
          "To exercise your rights, contact info@fixnex.ae.",
        ],
      },
      {
        title: "Cookies & Tracking Technologies",
        body: [
          "We use cookies and similar technologies to ensure website functionality, analyze performance and usage, and personalize content and services. You can manage cookie preferences through your browser settings.",
        ],
      },
      {
        title: "Third-Party Services",
        body: [
          "Our platform may include links or integrations with third-party services. We are not responsible for their privacy practices, and users are encouraged to review their policies separately.",
        ],
      },
      {
        title: "Children's Privacy",
        body: [
          "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal data from children.",
        ],
      },
      {
        title: "Marketing Communications",
        body: [
          "You may receive marketing communications if you have opted in. You can unsubscribe at any time using the link provided in emails or by contacting us directly.",
        ],
      },
      {
        title: "Updates to This Privacy Policy",
        body: [
          "We may update this Privacy Policy periodically to reflect changes in legal, technical, or business developments. The updated version will be published with a revised effective date.",
        ],
      },
      contactSection,
    ],
  },
  "refund-policy": {
    slug: "refund-policy",
    title: "Refund & Cancellation Policy",
    effectiveDate: "19 May 2026",
    description:
      "Cancellation windows, subscription cancellation, refund eligibility, service quality concerns, product returns, and refund processing timelines.",
    sections: [
      {
        title: "Introduction",
        body: [
          "This Refund & Cancellation Policy outlines the terms under which FixNex allows cancellations, refunds, and service modifications. This policy applies to all services, subscriptions, and product-related transactions made through the FixNex platform.",
          "By booking a service or purchasing a plan, you agree to this policy.",
        ],
      },
      {
        title: "Service Cancellations",
        bullets: [
          "Free cancellation is available up to 2 hours before technician dispatch. After dispatch, an inspection or call-out fee may apply.",
          "Services may be cancelled within the cancellation window specified at the time of booking.",
          "Cancellations made before technician dispatch are generally eligible for a full refund.",
          "Cancellations made after technician dispatch or arrival may incur a cancellation fee.",
          "No-shows or denied access to the property may be treated as completed bookings.",
          "Users may request to reschedule services subject to availability.",
          "Rescheduling requests should be made within the allowed timeframe to avoid charges.",
        ],
      },
      {
        title: "Subscription Plans (FixLite, FixPro, FixMax)",
        bullets: [
          "Subscriptions may be cancelled at any time.",
          "Cancellation will take effect at the end of the current billing cycle.",
          "No partial refunds will be issued for unused time within a billing cycle.",
          "Monthly subscription plans renew automatically unless cancelled before the next billing date.",
          "Plan changes may be applied in the next billing cycle or immediately, depending on the request.",
          "Pricing adjustments will be communicated clearly before confirmation.",
        ],
      },
      {
        title: "Refund Eligibility",
        body: ["Refunds may be issued under the following circumstances:"],
        bullets: [
          "Service cancelled within the eligible cancellation window.",
          "Duplicate or incorrect payment.",
          "Service not delivered due to fault attributable to FixNex.",
          "Verified service quality issues or incomplete work.",
          "Refunds will not be issued for services successfully completed as per scope.",
          "Refunds will not be issued for delays caused by user unavailability or incorrect information.",
          "Refunds will not be issued for change of mind after service delivery.",
          "Refunds will not be issued for minor variations that do not materially impact service outcome.",
        ],
      },
      {
        title: "Service Quality Concerns",
        body: [
          "If you are dissatisfied with a service, you must notify FixNex within 48 hours of service completion. We may investigate and, where appropriate, offer a re-service, provide a partial or full refund, or offer service credits.",
          "All resolutions are at the reasonable discretion of FixNex based on review.",
        ],
      },
      {
        title: "Refund Process",
        bullets: [
          "Approved refunds will be processed through the original payment method.",
          "Refund timelines may vary but typically range between 10-45 business days.",
          "Processing times may depend on your payment provider or bank.",
        ],
      },
      {
        title: "Product & Parts Refunds",
        bullets: [
          "Only defective, damaged, or incorrect items are eligible for return or refund.",
          "Requests must be made within 48 hours of delivery.",
          "Items must be unused and in original condition where applicable.",
          "Parts installed during service are non-refundable unless proven defective.",
        ],
      },
      {
        title: "Cancellation by FixNex",
        body: [
          "FixNex reserves the right to cancel or reschedule services due to technician unavailability, safety concerns, force majeure events, or incorrect or incomplete booking details.",
          "In such cases, you will be offered rescheduling or a full refund where applicable.",
        ],
      },
      {
        title: "Force Majeure",
        body: [
          "FixNex shall not be liable for delays, cancellations, or inability to fulfill services due to events beyond reasonable control, including but not limited to natural disasters, government restrictions, or supply chain disruptions.",
        ],
      },
      {
        title: "Abuse of Policy",
        body: [
          "FixNex reserves the right to deny refunds or limit account access in cases of repeated cancellations or misuse, fraudulent claims, or abuse of refund or complaint processes.",
        ],
      },
      contactSection,
    ],
  },
} satisfies Record<string, LegalPolicy>;

export type LegalPolicySlug = keyof typeof legalPolicies;
