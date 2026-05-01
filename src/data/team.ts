export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  subtitle: string;
  stats: {
    experience: string;
    cases: string;
    publications: string;
    clients: string;
  };
  image: string;
  bio: string[];
  overview: {
    expertise: string[];
    clients: string[];
    cases: string[];
  };
  experience: {
    title: string;
    organization: string;
    period: string;
    responsibilities: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    specialization?: string;
  }[];
  awards: {
    title: string;
    year: string;
    description: string;
  }[];
  publications: {
    title: string;
    publisher: string;
    year: string;
    link?: string;
  }[];
}

export const teamData: Record<string, TeamMember> = {
  "jeet-bhatt": {
    id: "jeet-bhatt",
    name: "Jeet Jayant Bhatt",
    designation: "Advocate, High Court of Gujarat & Senior Partner",
    subtitle:
      "Leading Legal Expert in International Commercial Law & Arbitration",
    stats: {
      experience: "15+",
      cases: "2000+",
      publications: "10+",
      clients: "6+",
    },
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
    bio: [
      "Jeet J. Bhatt is a seasoned Advocate with over 15 years of distinguished legal practice before the High Court of Gujarat and various forums across India. Known for his strategic litigation skills, persuasive advocacy, and deep knowledge of constitutional and commercial law, he has built a reputation as one of the most reliable and result-driven counsels in the region.",
      "Jeet began his legal career in 2009, quickly earning recognition for his meticulous preparation, clarity of thought, and court craft. Over the years, he has successfully handled more than 2000 cases, ranging from complex constitutional challenges to high-value commercial disputes, criminal trials, arbitration proceedings, and public interest litigations (PILs).",
      "Beyond litigation, Jeet serves as a Panel Advocate for several government authorities, public sector undertakings, and corporate entities, providing both advisory and litigation services. His deep understanding of procedural law, coupled with his commitment to upholding constitutional values, has resulted in multiple landmark judgments impacting governance, education, and administrative reforms in Gujarat.",
      "A respected voice in the legal fraternity, Jeet regularly contributes to legal journals, panel discussions, and conferences. He is the author of 'The 51 Chief Justices of India: Juristic & Constitutional Legacy', an in-depth study of the Indian judiciary's evolution and its leadership. His thought leadership is reflected in his published articles on due process in administrative law, arbitration law reforms, and judicial accountability.",
      "Known for his client-first approach, Jeet personally strategizes and supervises each matter entrusted to him, ensuring clear communication, transparency, and unwavering professional ethics. His ability to blend legal acumen with practical strategy has earned him the trust of a diverse clientele — from individual litigants to large corporate houses.",
    ],
    overview: {
      expertise: [
        "International Commercial Arbitration",
        "Corporate Law",
        "Banking & Finance",
        "Real Estate Law",
        "Employment Law",
        "Criminal Defense",
        "International Commercial Law",
        "Insolvency & Bankruptcy (IBC)",
      ],
      clients: [
        "Gujarat Urja Vikas Nigam Ltd (GUVNL)",
        "Rajkot Nagarik Sahakari Bank Ltd",
        "Tata Services Ltd & Tata Group Companies",
        "Saurashtra Gramin Bank",
        "Western Railways",
        "Official Liquidator, High Court of Gujarat",
      ],
      cases: [
        "Represented GUVNL in multiple High Court and NCLT proceedings.",
        "Successfully handled complex arbitration matters for Western Railways.",
        "Landmark litigation proceedings before Gujarat High Court.",
        "International commercial disputes for multinational corporations.",
        "Complex banking and finance litigation for Dena Bank (now Bank of Baroda).",
        "Corporate restructuring cases for Tata Group companies.",
      ],
    },
    experience: [
      {
        title: "Senior Partner & Advocate",
        organization: "Chambers of Jeet Bhatt",
        period: "2015 - Present",
        responsibilities: [
          "Leading a team of dedicated lawyers and professionals.",
          "Providing strategic counsel on complex corporate, constitutional, and civil litigation matters.",
          "Representing high-net-worth individuals and corporate entities before the High Court of Gujarat and the Supreme Court of India.",
        ],
      },
      {
        title: "Panel Advocate",
        organization: "Rajkot Nagarik Sahakari Bank Ltd",
        period: "2018 - Present",
        responsibilities: [
          "Representing the bank in high-stakes recovery proceedings, SARFAESI matters, and IBC cases.",
          "Advising on compliance, debt restructuring, and secured transactions.",
        ],
      },
      {
        title: "Standing Counsel",
        organization: "Official Liquidator, High Court of Gujarat",
        period: "2016 - 2021",
        responsibilities: [
          "Represented the Official Liquidator in complex winding-up proceedings, asset liquidation, and adjudication of claims.",
          "Ensured legal compliance with the Companies Act during corporate dissolution.",
        ],
      },
      {
        title: "Junior Counsel",
        organization: "Chambers of Senior Advocate",
        period: "2009 - 2015",
        responsibilities: [
          "Assisted in drafting, research, and court appearances in matters concerning constitutional law, civil, and criminal litigation.",
          "Gained extensive foundational experience in trial and appellate advocacy.",
        ],
      },
    ],
    education: [
      {
        degree: "LLM in International Commercial and Corporate Law",
        institution: "Queen Mary University of London",
        period: "2010 - 2011",
        specialization:
          "International Commercial Arbitration, Legal Aspects of International Finance, International Banking Law",
      },
      {
        degree: "B.A, LL.B (Hons.)",
        institution: "Gujarat National Law University (GNLU)",
        period: "2004 - 2009",
        specialization: "Constitutional Law, Corporate Law",
      },
    ],
    awards: [
      {
        title: "Ministerial Recognition",
        year: "2022",
        description:
          "Felicitated by Hon'ble Minister of Law and Justice Shri Kiren Rijiju for remarkable achievement in Law.",
      },
      {
        title: "Queen Mary Alumni Achievers Award",
        year: "2022",
        description:
          "Recognized for excellence in the field of Law by Queen Mary University of London, India Alumni Chapter.",
      },
      {
        title: "Elected Committee Member",
        year: "2019 - 2024",
        description:
          "Elected as Committee Member & Convenor of Education Committee, Gujarat High Court Advocates Association.",
      },
    ],
    publications: [
      {
        title: "Proving a Contradiction during Trial",
        publisher: "SCC Online",
        year: "12.09.2020",
        link: "#",
      },
      {
        title:
          "The 51 Chief Justices of India (1950–2025): A Juristic & Constitutional Legacy",
        publisher: "Book",
        year: "2023",
        link: "#",
      },
      {
        title:
          "Qualitative Analysis of Culpable Homicide Amounting to vs Not Amounting to Murder",
        publisher: "Indian Journal of Criminology",
        year: "2021",
        link: "#",
      },
      {
        title:
          "Economic Analysis of Culpable Homicide – Murder or Manslaughter",
        publisher: "GNLU Journal of Law Development and Politics",
        year: "2022-2023",
        link: "#",
      },
    ],
  },
  "jayant-bhatt": {
    id: "jayant-bhatt",
    name: "Jayant P. Bhatt",
    designation: "Senior Advocate, High Court of Gujarat",
    subtitle:
      "Distinguished legal luminary with decades of appellate advocacy.",
    stats: {
      experience: "40+",
      cases: "5000+",
      publications: "20+",
      clients: "50+",
    },
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=500",
    bio: [
      "Jayant P. Bhatt is a Senior Advocate at the High Court of Gujarat with deeply respected expertise spanning over 40 years of profound legal practice.",
    ],
    overview: {
      expertise: [
        "Appellate Advocacy",
        "Constitutional Law",
        "Civil Litigation",
      ],
      clients: [],
      cases: [],
    },
    experience: [
      {
        title: "Senior Advocate",
        organization: "High Court of Gujarat",
        period: "1980 - Present",
        responsibilities: ["Handling complex appellate litigation."],
      },
    ],
    education: [],
    awards: [],
    publications: [],
  },
  "chetan-pandya": {
    id: "chetan-pandya",
    name: "Chetan P. Pandya",
    designation: "Advocate, Gujarat High Court",
    subtitle: "Expert in varied facets of litigation and dispute resolution.",
    stats: {
      experience: "26+",
      cases: "3000+",
      publications: "5+",
      clients: "20+",
    },
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    bio: [
      "Chetan P. Pandya brings over 26 years of dedicated legal practice, offering strategic counsel and robust representation to clients in the Gujarat High Court.",
    ],
    overview: {
      expertise: ["Civil Litigation", "Commercial Law"],
      clients: [],
      cases: [],
    },
    experience: [],
    education: [],
    awards: [],
    publications: [],
  },
  "tarun-rajput": {
    id: "tarun-rajput",
    name: "Tarun S. Rajput",
    designation: "Advocate, Gujarat High Court",
    subtitle: "Dynamic litigator focusing on corporate and civil mandates.",
    stats: {
      experience: "2+",
      cases: "100+",
      publications: "0+",
      clients: "5+",
    },
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500",
    bio: [
      "Tarun S. Rajput is a dedicated advocate at the Gujarat High Court, passionately representing clients in varied civil and corporate matters.",
    ],
    overview: {
      expertise: ["Civil Litigation", "Corporate Law"],
      clients: [],
      cases: [],
    },
    experience: [],
    education: [],
    awards: [],
    publications: [],
  },
  "aman-kadri": {
    id: "aman-kadri",
    name: "Aman Kadri",
    designation: "Advocate, Gujarat High Court | LLM Penn State",
    subtitle:
      "Internationally trained legal professional with a focus on global commercial practices.",
    stats: {
      experience: "1+",
      cases: "50+",
      publications: "2+",
      clients: "5+",
    },
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=500",
    bio: [
      "With a Master of Laws from Penn State, Aman Kadri brings a global perspective to domestic litigation and advisory.",
    ],
    overview: {
      expertise: ["Commercial Law", "International Law"],
      clients: [],
      cases: [],
    },
    experience: [],
    education: [
      {
        degree: "LLM",
        institution: "Penn State University",
        period: "Recent",
        specialization: "Commercial Law",
      },
    ],
    awards: [],
    publications: [],
  },
  "haresh-shah": {
    id: "haresh-shah",
    name: "Haresh Shah",
    designation: "Senior Associate",
    subtitle:
      "Steadfast legal associate driving comprehensive case preparation.",
    stats: {
      experience: "5+",
      cases: "200+",
      publications: "0+",
      clients: "10+",
    },
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=500",
    bio: [
      "Associated with the chambers since 2018, Haresh Shah ensures meticulous research and robust case operations.",
    ],
    overview: {
      expertise: ["Legal Research", "Trial Preparation"],
      clients: [],
      cases: [],
    },
    experience: [],
    education: [],
    awards: [],
    publications: [],
  },
};
