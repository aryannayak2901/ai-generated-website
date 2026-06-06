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
  phone?: string;
  email?: string;
  bio: string[] | any;
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
    subtitle: "Leading Legal Expert in International Commercial Law & Arbitration",
    stats: {
      experience: "15+",
      cases: "2000+",
      publications: "10+",
      clients: "6+",
    },
    image: "/HeroPictures/image1.jpeg",
    phone: "+91 9913714675",
    email: "jeetbhatt@gmail.com",
    bio: [
      "Jeet J. Bhatt is a seasoned Advocate with over 16 years of distinguished legal practice before the High Court of Gujarat and various forums across India. Known for his strategic litigation skills, persuasive advocacy, and deep knowledge of constitutional and commercial law, he has built a reputation as one of the most reliable and result-driven counsels in the region.",
      "Jeet began his legal career in 2009, quickly earning recognition for his meticulous preparation, clarity of thought, and court craft. Over the years, he has successfully handled more than 2000 cases, ranging from complex constitutional challenges to high-value commercial disputes, criminal trials, arbitration proceedings, and public interest litigations (PILs).",
      "Beyond litigation, Jeet serves as a Panel Advocate for several government authorities, public sector undertakings, and corporate entities, providing both advisory and litigation services. His deep understanding of procedural law, coupled with his commitment to upholding constitutional values, has resulted in multiple landmark judgments impacting governance, education, and administrative reforms in Gujarat.",
      "A respected voice in the legal fraternity, Jeet regularly contributes to legal journals, panel discussions, and conferences. He is the author of \"The 51 Chief Justices of India: Jurimetric & Constitutional Legacy\", an in-depth study of the Indian judiciary’s evolution and its leadership. His thought leadership is reflected in his published articles on due process in administrative law, arbitration law reforms, and judicial accountability.",
      "Known for his client-first approach, Jeet personally strategizes and supervises each matter entrusted to him, ensuring clear communication, transparency, and unwavering professional ethics. His ability to blend legal acumen with practical strategy has earned him the trust of a diverse clientele — from individual litigants to large corporate houses."
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
        "Insolvency & Bankruptcy",
      ],
      clients: [
        "Gujarat Urja Vikas Nigam Ltd (GUVNL)",
        "Export-Import Bank of India (EXIM Bank)",
        "Tata Services Ltd & Tata Group Companies",
        "Tourism Corporation of Gujarat Ltd (TCGL)",
        "Western Railways",
        "Official Liquidator, High Court of Gujarat",
      ],
      cases: [
        "Represented GUVNL in multiple High Court and NCLT proceedings",
        "Successfully handled complex arbitration matters for Western Railways",
        "Landmark liquidation proceedings before Gujarat High Court",
        "International commercial disputes for multinational corporations",
        "Complex banking and finance litigation for EXIM Bank",
        "Corporate restructuring cases for Tata Group companies",
      ],
    },
    experience: [
      {
        title: "Senior Partner & Advocate",
        organization: "Jayant Bhatt & Associates",
        period: "June 2013 - Present",
        responsibilities: [
          "Leading legal practice specializing in international commercial arbitration, corporate law, and high-stakes litigation before Gujarat High Court and Supreme Court of India"
        ],
      },
      {
        title: "Panel Advocate",
        organization: "Gujarat Urja Vikas Nigam Ltd (GUVNL)",
        period: "2022 - Present",
        responsibilities: [
          "Representing GUVNL and its subsidiary companies before the High Court and NCLT in energy sector disputes and regulatory matters"
        ],
      },
      {
        title: "Panel Advocate",
        organization: "Export-Import Bank of India (EXIM Bank)",
        period: "April 2023 - Present",
        responsibilities: [
          "Representing EXIM Bank before High Court and NCLT in banking, finance, and commercial disputes"
        ],
      },
      {
        title: "Panel Counsel",
        organization: "Tata Services Ltd.",
        period: "June 2020 - Present",
        responsibilities: [
          "Representing Tata Group of Companies in various courts and tribunals across Gujarat, providing comprehensive legal services"
        ],
      },
      {
        title: "Panel Advocate",
        organization: "Tourism Corporation of Gujarat Ltd (TCGL)",
        period: "April 2022 - April 2024",
        responsibilities: [
          "Rendering legal opinions, drafting agreements, and representing TCGL before various judicial forums in Gujarat"
        ],
      },
      {
        title: "Standing Counsel",
        organization: "Official Liquidator, High Court of Gujarat",
        period: "January 2018 - May 2022",
        responsibilities: [
          "Represented Official Liquidator in liquidation proceedings and company law matters before High Court and NCLT"
        ],
      },
      {
        title: "Standing Counsel",
        organization: "Western Railways",
        period: "January 2018 - Present",
        responsibilities: [
          "Representing Western Railway in land acquisition cases, arbitration matters before district courts and arbitration centers"
        ],
      },
      {
        title: "Associate",
        organization: "Jani Advocates",
        period: "June 2009 - June 2013",
        responsibilities: [
          "Full-service law firm practice in litigation, arbitration, and non-litigation matters, gaining expertise in commercial law, banking, and corporate law"
        ],
      },
      {
        title: "Panel Advocate",
        organization: "High Court Legal Services Committee",
        period: "2014 - Present",
        responsibilities: [
          "Providing free legal services to economically disadvantaged sections, including jail consultations and urgent court appearances"
        ],
      },
      {
        title: "Visiting Faculty",
        organization: "Gujarat National Law University, Nirma University, United World School of Law",
        period: "Ongoing",
        responsibilities: [
          "Conducting lectures on International and Domestic Arbitration, Contract Management, and Insolvency & Bankruptcy Laws"
        ],
      },
    ],
    education: [
      {
        degree: "LLM in International Commercial and Corporate Law",
        institution: "Queen Mary University of London",
        period: "2010-2011",
        specialization: "International Commercial Arbitration, Legal Aspects of International Finance, International Banking Law",
      },
      {
        degree: "B.A, LL.B (Hons.)",
        institution: "Gujarat National Law University",
        period: "2004-2009",
        specialization: "Constitutional Law, Corporate Law",
      },
    ],
    awards: [
      {
        title: "Ministerial Recognition",
        year: "2022",
        description: "Felicitated by Hon'ble Minister of Law and Justice Shri Kiren Rijiju for remarkable achievement in Law",
      },
      {
        title: "Queen Mary Alumni Achievers Award",
        year: "2022",
        description: "Excellence in the field of Law by Queen Mary University of London, India Alumni Chapter",
      },
      {
        title: "Committee Leadership",
        year: "2013-2014",
        description: "Elected Committee Member & Convener of Education Committee, Gujarat High Court Advocates Association",
      },
      {
        title: "Academic Contribution",
        year: "Ongoing",
        description: "Visiting Faculty at Gujarat National Law University, Nirma University, United World School of Law",
      },
    ],
    publications: [
      {
        title: "Proving a Contradiction during Trial, SCC Online published on 12.09.2020",
        publisher: "Live Law",
        year: "2020",
        link: "https://www.scconline.com/blog/post/2020/09/12/proving-a-contradiction-during-a-trial/#comments",
      },
      {
        title: "The 51 Chief Justices of India (1950–2025): A Jurimetric and Constitutional Legacy",
        publisher: "Live Law",
        year: "2025",
        link: "https://www.livelaw.in/articles/51-chief-justices-india-jurimetric-constitutional-legacy-296501",
      },
      {
        title: "QUALITATIVE ANALYSIS OF CULPABLE HOMICIDE AMOUNTING TO VERSUS NOT AMOUNTING TO MURDER",
        publisher: "Indian Journal of Criminology",
        year: "2023",
        link: "https://www.researchgate.net/publication/378519245_QUALITATIVE_ANALYSIS_OF_CULPABLE_HOMICIDE_AMOUNTING_TO_VERSUS_NOT_AMOUNTING_TO_MURDER_LAW_AND_ECONOMICS_APPROACH_OF_CRIMINAL_TRIAL_COURT_Indian_Journal_of_Criminology_51_1_2023?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6Il9kaXJlY3QiLCJwYWdlIjoicHJvZmlsZSIsInByZXZpb3VzUGFnZSI6ImhvbWUiLCJwb3NpdGlvbiI6InBhZ2VDb250ZW50In19",
      },
      {
        title: "Economic Analysis of Culpable Homicide - Murder or Manslaughter",
        publisher: "Journal of National Law University Delhi",
        year: "2022-2023",
        link: "https://www.researchgate.net/publication/372192249_Economic_Analysis_of_Culpable_Homicide_-_Murder_or_Manslaughter_An_Empirical_Analysis_Journal_of_National_Law_University_Delhi_Volume_9_Issue_12_2022-2023_ISSN_2277-4017?_tp=eyJjb250ZXh0Ijp7ImZpcnN0UGFnZSI6Il9kaXJlY3QiLCJwYWdlIjoicHJvZmlsZSIsInByZXZpb3VzUGFnZSI6ImhvbWUiLCJwb3NpdGlvbiI6InBhZ2VDb250ZW50In19",
      },
      {
        title: "Interesting Facts about Indian Judiciary, SCC Online published on 05.01.2023,",
        publisher: "SCC Online",
        year: "2023",
        link: "https://www.scconline.com/blog/post/2023/01/05/interesting-facts-about-indian-judiciary/#search/divya.molugu%40ebcpublishing.in/_blank",
      },
      {
        title: "Tale of Two Enclaves",
        publisher: "SCC Online",
        year: "2022",
        link: "https://www.scconline.com/blog/post/2022/12/08/tale-of-two-enclaves-dadra-nagar-haveli/#search/divya.molugu%40ebcpublishing.in/_blank",
      },
      {
        title: "Cheque Bounce Cases Against Company Undergoing Moratorium under IBC, 2016",
        publisher: "Thomson Reuters",
        year: "2022",
        link: "https://www.linkedin.com/posts/jeet-bhatt-09aa9644_supremecourt-ibc-activity-6938039911203643392-99pg/?originalSubdomain=gt",
      },
    ],
  },
  "jayant-p-bhatt": {
    id: "jayant-p-bhatt",
    name: "Jayant P. Bhatt",
    designation: "Senior Advocate, High Court of Gujarat",
    subtitle: "Pillar of Legal Excellence with Four Decades of Experience",
    stats: {
      experience: "43+",
      cases: "2000+",
      publications: "0",
      clients: "20+",
    },
    image: "/HeroPictures/JPBhatt.png",
    phone: "+91 9825031305",
    email: "jayantpbhatt13@gmail.com",
    bio: [
      "Jayant P. Bhatt is a Senior Advocate of the High Court of Gujarat with an illustrious legal career spanning over four decades. Enrolled in 1982 (Enrolment No. G/608/1982), he is widely respected for his courtroom finesse, deep doctrinal knowledge, and steady stewardship of complex and high-stake litigation matters before the Hon’ble High Court of Gujarat and the Supreme Court of India.",
      "Adv. Bhatt has served as trusted counsel and Standing Counsel for a broad range of governmental, public sector, and corporate clients, advising on and litigating matters involving municipal law, administrative governance, infrastructure contracts, and public employment.",
      "Appointments, Clients & Institutional Associations:",
      "• Government & Public Sector Bodies – Ahmedabad, Rajkot, and Jamnagar Municipal Corporations; Gujarat Maritime Board; Gujarat Water Supply and Sewerage Board; Gujarat Housing Board; Commissioner, Kendriya Vidyalaya Sangathan; and various electricity distribution companies including GETCO, PGVCL, MGVCL, UGVCL, and DGVCL.",
      "• Leading Corporates & Institutions – Tata Chemicals Ltd., Reliance Industries Ltd., Digjam Ltd., Indian Rayon Ltd., Birla AT&T Communications, Torrent Power Ltd., Britannia Industries Ltd., and Stovec Electronics.",
      "• Academic & Research Bodies – Gujarat National Law University, Gujarat Vidyapith, Plasma Research Institute.",
      "Arbitration & Tribunal Expertise:",
      "• Arbitration & Public Contract Disputes – Adv. Bhatt has decades of experience in arbitration and related public contract disputes. He was appointed since 1990 as Advocate before the Water Resources Department Arbitration Panel, Government of Gujarat, and was designated as Senior Advocate in 2010 by the State Legal Department for matters before the Gujarat Public Works Contracts Disputes Arbitration Tribunal. He has also been appointed as Sole Arbitrator in several high-value disputes by Gujarat Narmada Valley Fertilizers & Chemicals Ltd.",
      "Notable Contributions & Landmark Cases:",
      "Adv. Bhatt’s advocacy has produced numerous reported judgments in premier law journals such as GLR, GLH, and LawSuit (Guj), shaping jurisprudence in municipal law, administrative law, constitutional rights, public employment, cooperative law, and infrastructure disputes.",
      "• Kumari Manju Singh v. Dean, B.J. Medical College, 1986 GLH 483.",
      "• Gujarat Dalit Civil & Constitutional Rights Samiti v. Union of India, 1988 (1) GLH 204.",
      "• Ahmedabad Municipal Corporation v. Manish Enterprise Ltd., 1992 (2) GLH 176.",
      "• Gandhinagar Saher Jagrut Nagrik Parishad v. State of Gujarat, 2010 (1) GLR 1.",
      "• Monikaben Ghanshyambhai Patel v. State of Gujarat, 2018 (3) GLR 1922.",
      "• Apurva Jagdishbhai Dave v. Prapti Apurva Dave, 2020 (1) GLH 211.",
      "Academic Engagement & Public Service:",
      "• A committed academic, Adv. Bhatt served as Visiting Faculty at Sidharth Law College and U.M. Arts & Nathiba Commerce College, Gandhinagar, mentoring generations of law students.",
      "• He was appointed by the State Legal Department to assist Shri B. J. Jadeja Inquiry Commission (Mangrol Commission) under the Commission of Inquiries Act, 1952.",
      "Known for integrity, measured advocacy, and an unwavering commitment to the rule of law, Adv. Jayant P. Bhatt’s practice combines doctrinal clarity with practical strategy, making him a sought-after counsel for both public bodies and private enterprises.",
      "\"Justice is not a matter of convenience but of commitment.\""
    ],
    overview: {
      expertise: [
        "Municipal Law",
        "Administrative Law",
        "Constitutional Rights",
        "Public Employment Law",
        "Cooperative Law",
        "Infrastructure Disputes",
        "International Commercial Arbitration",
        "Public Contracts Arbitration",
      ],
      clients: [
        "Ahmedabad Municipal Corporation",
        "Rajkot Municipal Corporation",
        "Jamnagar Municipal Corporation",
        "Gujarat Maritime Board",
        "Gujarat Water Supply and Sewerage Board",
        "Gujarat Housing Board",
        "Kendriya Vidyalaya Sangathan",
        "GETCO",
        "PGVCL",
        "MGVCL",
        "UGVCL",
        "DGVCL",
        "Tata Chemicals Ltd.",
        "Reliance Industries Ltd.",
        "Digjam Ltd.",
        "Indian Rayon Ltd.",
        "Birla AT&T Communications",
        "Torrent Power Ltd.",
        "Britannia Industries Ltd.",
        "Stovec Electronics",
        "Gujarat National Law University",
        "Gujarat Vidyapith",
        "Plasma Research Institute",
      ],
      cases: [
        "Kumari Manju Singh v. Dean, B.J. Medical College, 1986 GLH 483",
        "Gujarat Dalit Civil & Constitutional Rights Samiti v. Union of India, 1988 (1) GLH 204",
        "Ahmedabad Municipal Corporation v. Manish Enterprise Ltd., 1992 (2) GLH 176",
        "Gandhinagar Saher Jagrut Nagrik Parishad v. State of Gujarat, 2010 (1) GLR 1",
        "Monikaben Ghanshyambhai Patel v. State of Gujarat, 2018 (3) GLR 1922",
        "Apurva Jagdishbhai Dave v. Prapti Apurva Dave, 2020 (1) GLH 211",
      ],
    },
    experience: [
      {
        title: "Senior Advocate",
        organization: "High Court of Gujarat",
        period: "1982 - Present",
        responsibilities: [
          "Over four decades of distinguished legal practice specializing in municipal law, administrative law, constitutional rights, and public employment matters"
        ],
      },
      {
        title: "Advocate",
        organization: "Water Resources Department Arbitration Panel, Government of Gujarat",
        period: "1990 - Present",
        responsibilities: [
          "Appointed as advocate for arbitration matters in water resources and public works contracts disputes"
        ],
      },
      {
        title: "Senior Advocate",
        organization: "Gujarat Public Works Contracts Disputes Arbitration Tribunal",
        period: "2010 - Present",
        responsibilities: [
          "Designated by State Legal Department for complex public works contract disputes and arbitration proceedings"
        ],
      },
      {
        title: "Sole Arbitrator",
        organization: "Gujarat Narmada Valley Fertilizers & Chemicals Ltd",
        period: "Various Appointments",
        responsibilities: [
          "Appointed as sole arbitrator in multiple high-value commercial disputes and contractual matters"
        ],
      },
      {
        title: "Standing Counsel",
        organization: "Multiple Government & Corporate Entities",
        period: "1985 - Present",
        responsibilities: [
          "Serving as trusted counsel for municipal corporations, public sector entities, and major corporate clients across diverse industries"
        ],
      },
      {
        title: "Visiting Faculty",
        organization: "Sidharth Law College & U.M. Arts & Nathiba Commerce College",
        period: "2005 - 2020",
        responsibilities: [
          "Academic engagement teaching municipal law, administrative law, and constitutional principles to law students"
        ],
      },
      {
        title: "Commission Counsel",
        organization: "Mangrol Commission (B. J. Jadeja Inquiry Commission)",
        period: "1982 - 1983",
        responsibilities: [
          "Appointed by State Legal Department to assist the inquiry commission under the Commission of Inquiries Act, 1952"
        ],
      },
    ],
    education: [
      {
        degree: "B.Sc., LL.B",
        institution: "Enrolled 1982",
        period: "1982",
        specialization: "",
      },
    ],
    awards: [
      {
        title: "Standing Counsel Appointments",
        year: "1990 – Present",
        description: "Advocate before the Water Resources Department Arbitration Panel since 1990 and Senior Advocate in Gujarat Public Works Contracts Disputes Tribunal since 2010",
      },
      {
        title: "Sole Arbitrator Appointments",
        year: "Various",
        description: "Appointed sole arbitrator in multiple high-value disputes by Gujarat Narmada Valley Fertilizers & Chemicals Ltd.",
      },
      {
        title: "Visiting Faculty",
        year: "2005 – 2020",
        description: "Taught at Sidharth Law College and U.M. Arts & Nathiba Commerce College, Gandhinagar for over 15 years",
      },
      {
        title: "Inquiry Commission Member",
        year: "1982 – 1983",
        description: "Assisted the Mangrol Commission under the Commission of Inquiries Act, 1952",
      },
    ],
    publications: [],
  },
  "chetan-p-pandya": {
    id: "chetan-p-pandya",
    name: "Chetan P. Pandya",
    designation: "Advocate, Gujarat High Court",
    subtitle: "Experienced Counsel in DRT/DRAT/NCLT and Banking & Commercial Matters",
    stats: {
      experience: "26+",
      cases: "3000+",
      publications: "5",
      clients: "20+",
    },
    image: "/HeroPictures/CP.jpg",
    phone: "+91 98256 99309",
    bio: [
      "Chetan P. Pandya is a distinguished advocate with a standing of more than 26 years at the Bar, having extensive experience appearing before the Gujarat High Court and various commercial law forums.",
      "Mr. Pandya has been part of several leading chambers of Gujarat, including the chambers of Yogesh Lakhani (Senior Advocate, Gujarat High Court) and Jani Advocates led by Adv. Bharat Jani and the late Adv. Utkarsh Jani.",
      "He specialises in matters and laws pertaining to DRT, DRAT and NCLT. His practice includes significant work on Corporate, Commercial and SARFAESI-allied laws.",
      "Mr. Pandya’s distinguished clientele includes several banks, NBFCs and financial institutions, and his empanelment has included leading banks such as Dena Bank (now merged into Bank of Baroda) and IDBI Bank.",
      "His focused and specialised experience in banking, recovery and insolvency-related forums makes him a recognised practitioner in these subject areas."
    ],
    overview: {
      expertise: [
        "DRT (Debt Recovery Tribunal)",
        "DRAT (Debt Recovery Appellate Tribunal)",
        "NCLT (National Company Law Tribunal)",
        "Corporate Law",
        "Commercial Law",
        "SARFAESI & allied laws",
        "Banking & Financial Institutions representation",
      ],
      clients: [
        "Dena Bank (now merged into Bank of Baroda)",
        "IDBI Bank",
        "Various Banks & NBFCs",
      ],
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
    designation: "Advocate - Gujarat High Court & Subordinate Judiciary",
    subtitle: "Pursuing LL.M. (Criminology) | Specialist in Civil & Criminal Litigation",
    stats: {
      experience: "2+",
      cases: "50+",
      publications: "1",
      clients: "4",
    },
    image: "/HeroPictures/Tarun_S_Rajput.jpeg",
    phone: "+91 75679 79513",
    bio: [
      "Tarun S. Rajput is a dedicated advocate practicing before the Hon'ble Gujarat High Court and various subordinate courts across Gujarat. Currently pursuing LL.M. in Criminology, he brings fresh perspectives to contemporary criminal jurisprudence. His practice philosophy is rooted in the belief that 'an advocate is a bridge between the law and justice—a custodian of both rights and responsibilities.' Guided by the legal maxim 'Fiat Justitia Ruat Caelum'—Let justice be done though the heavens fall."
    ],
    overview: {
      expertise: [
        "Civil and Criminal Litigation",
        "Matrimonial Disputes & Family Law",
        "Land and Property Disputes",
        "Municipal and Revenue Proceedings",
        "Constitutional Writs",
        "Criminal Jurisprudence",
        "Penology and Procedural Law",
      ],
      clients: [
        "Individual Criminal Defense Clients",
        "Family Law Clients",
        "Property Dispute Clients",
        "Municipal Proceeding Clients",
      ],
      cases: [
        "Successfully handled complex matrimonial disputes",
        "Represented clients in constitutional writ petitions",
        "Managed intricate land and property disputes",
        "Effective advocacy in criminal litigation matters",
        "Strategic representation in municipal proceedings",
      ],
    },
    experience: [
      {
        title: "Legal Intern",
        organization: "Rajan J. Patel, Advocate",
        period: "May 2023 - January 2024",
        responsibilities: [
          "Comprehensive legal training in civil and criminal matters"
        ],
      },
      {
        title: "Intern",
        organization: "Bhatt & Joshi Associates",
        period: "May 2022 - September 2022",
        responsibilities: [
          "Foundation training in legal practice and client representation"
        ],
      },
    ],
    education: [
      {
        degree: "LL.M. (Criminology)",
        institution: "Pursuing - Focus on Criminal Jurisprudence & Penology",
        period: "2024-Present",
        specialization: "Contemporary Criminal Jurisprudence, Penology, and Procedural Law",
      },
      {
        degree: "Integrated B.A. LL.B.",
        institution: "GLS University",
        period: "2020-2025",
        specialization: "Law with focus on Civil and Criminal Practice",
      },
    ],
    awards: [
      {
        title: "Academic Excellence",
        year: "2024-Present",
        description: "Pursuing advanced studies in Criminology while maintaining active legal practice",
      },
      {
        title: "Comprehensive Legal Training",
        year: "2022-2024",
        description: "Extensive internship experience across multiple legal domains",
      },
    ],
    publications: [
      {
        title: "Contemporary Issues in Criminal Jurisprudence",
        publisher: "Legal Research Publication",
        year: "2024",
      },
    ],
  },
  "aman-kadri": {
    id: "aman-kadri",
    name: "Aman Kadri",
    designation: "Advocate, Gujarat High Court | LLM Graduate Penn State Law",
    subtitle: "International Commercial Law Expert | Moot Court Champion",
    stats: {
      experience: "1+",
      cases: "25+",
      publications: "3",
      clients: "4",
    },
    image: "/HeroPictures/AmanKadri.png",
    phone: "+91 81607 75183",
    bio: [
      "Advocate Aman Kadri combines rigorous academic training with focused courtroom experience at Chambers of Jeet Jayant Bhatt. A graduate of the Institute of Law, Nirma University (B.Com., LL.B. Hons.) and an LL.M. alumnus of Penn State Law where he specialised in International Commercial & Investment Arbitration, Comparative Constitutional Law, and Comparative Commercial Law. Aman brings a broad comparative perspective and meticulous attention to every brief.",
      "His practice before the Gujarat High Court centres on civil, commercial, arbitration, and service law matters. Clients appreciate his clear analysis, precise drafting, and steady advocacy, whether the issue concerns complex shareholder disputes or enforcement of arbitral awards. Aman’s excellence in advocacy was recognised early through victories at the NALSAR CCI Antitrust Moot and the Justice B.R. Sawhney Memorial Moot; he now shares that experience by conducting workshops on written submissions and oral argument and by mentoring young advocates within the chambers.",
      "Aman has assisted senior counsel in highstakes commercial litigation and contributed research to publications on antitrust and investment arbitration. Away from the courtroom, he pursues cricket and literature pastimes that sharpen his discipline and reinforce his clarity of thought. His presence strengthens our commitment to delivering precise, forwardlooking legal solutions."
    ],
    overview: {
      expertise: [
        "International Commercial & Investment Arbitration",
        "Comparative Commercial Laws",
        "International Law",
        "Constitutional Law",
        "Competition Law",
        "Legal Writing & Research",
      ],
      clients: [
        "International Commercial Entities",
        "Arbitration Clients",
        "Constitutional Law Clients",
        "Competition Law Matters",
      ],
      cases: [
        "International commercial arbitration matters",
        "Complex constitutional law petitions",
        "Competition law compliance issues",
        "Cross-border commercial disputes",
        "Investment arbitration proceedings",
      ],
    },
    experience: [
      {
        title: "Advocate",
        organization: "High Court of Gujarat",
        period: "February 2025 - Present",
        responsibilities: [
          "Active legal practice in commercial and constitutional matters"
        ],
      },
      {
        title: "Legal Intern",
        organization: "Chambers of Senior Advocate Percy M. Kavina (Gujarat High Court)",
        period: "June 2024 - July 2024",
        responsibilities: [
          "Advanced training in high court practice and procedure"
        ],
      },
      {
        title: "Chairperson",
        organization: "Moot Court Committee (Organizing) ILNU",
        period: "August 2022 - September 2023",
        responsibilities: [
          "Leadership role in organizing national moot court competitions"
        ],
      },
      {
        title: "Intern",
        organization: "Trilegal",
        period: "August 2023",
        responsibilities: [
          "Corporate law practice at premier law firm"
        ],
      },
      {
        title: "Legal Intern",
        organization: "Chambers of Senior Advocate Prashanto Chandra Sen (Supreme Court of India)",
        period: "June 2023 - July 2023",
        responsibilities: [
          "Supreme Court practice experience in constitutional matters"
        ],
      },
      {
        title: "Legal Intern",
        organization: "Khaitan & Co",
        period: "January 2023",
        responsibilities: [
          "Corporate and commercial law practice"
        ],
      },
      {
        title: "Judicial Law Clerk",
        organization: "High Court of Gujarat (Chambers of Justice Vipul M. Pancholi)",
        period: "January 2022 - February 2022",
        responsibilities: [
          "Direct judicial experience and court procedure training"
        ],
      },
    ],
    education: [
      {
        degree: "Master of Laws (LL.M.)",
        institution: "Penn State Law",
        period: "January 2024 - January 2025",
        specialization: "International Commercial & Investment Arbitration, Comparative Commercial Laws and International Law",
      },
      {
        degree: "B.Com. LL.B. (Hons.)",
        institution: "Institute of Law, Nirma University",
        period: "July 2019 - June 2024",
        specialization: "Commercial Law with Legal Honors",
      },
      {
        degree: "High School",
        institution: "M.K. Secondary and Higher Secondary School",
        period: "June 2015 - March 2019",
        specialization: "Business/Commerce, General",
      },
    ],
    awards: [
      {
        title: "1st NALSAR CCI Antitrust Moot Court Competition",
        year: "2022",
        description: "Winners - Demonstrated excellence in competition law and advocacy",
      },
      {
        title: "14th Justice B.R. Sawhny Memorial Moot Court Competition",
        year: "2021",
        description: "Winners - Outstanding performance in constitutional law moot",
      },
      {
        title: "King's College London Herbert Smith Freehills Competition Law Moot",
        year: "2021",
        description: "International recognition in competition law advocacy",
      },
      {
        title: "Lex Bonafide Memorial Drafting Competition",
        year: "2020",
        description: "Winners - Excellence in legal drafting and writing",
      },
      {
        title: "2nd National Case Comment Writing Competition",
        year: "2020",
        description: "National recognition for legal writing and analysis",
      },
    ],
    publications: [
      {
        title: "International Commercial Arbitration: Contemporary Challenges",
        publisher: "Penn State Law Review",
        year: "2024",
      },
      {
        title: "Competition Law in Digital Markets",
        publisher: "Commercial Law Quarterly",
        year: "2023",
      },
      {
        title: "Constitutional Perspectives on Commercial Regulation",
        publisher: "Constitutional Law Review",
        year: "2022",
      },
    ],
  },
  "haresh-shah": {
    id: "haresh-shah",
    name: "Haresh Shah",
    designation: "Senior Associate – Chambers of Jeet Bhatt",
    subtitle: "Steadfast legal associate driving comprehensive case preparation.",
    stats: {
      experience: "8",
      cases: "100+",
      publications: "0",
      clients: "10+",
    },
    image: "/HeroPictures/HShah.jpg",
    bio: [
      "Advocate Haresh Shah has been an integral part of the Chambers of Jeet Bhatt since 2018, bringing with him a wealth of experience, unwavering dedication, and an exceptional work ethic. Practicing primarily in the District Courts of Gandhinagar and Ahmedabad, he has successfully handled hundreds of matters spanning civil, criminal, commercial, and procedural law.",
      "Over the years, Haresh has become a trusted litigator known for his meticulous preparation, sharp procedural knowledge, and persuasive courtroom presence. His practice covers a wide range of disputes, including property matters, contractual claims, recovery suits, criminal trials, and injunction proceedings.",
      "In addition to his independent district court work, Haresh plays a key role in high-stakes arbitration proceedings, assisting Adv. Jeet J. Bhatt in matters involving multi-crore commercial disputes and complex contractual issues. He regularly supports the Chambers in drafting pleadings, conducting cross-examinations, preparing legal submissions, and managing evidence in arbitration, High Court, and tribunal proceedings.",
      "Haresh’s hard-working approach, combined with his ability to adapt to the complexities of different forums, makes him an invaluable asset to the Chambers. His deep understanding of procedural law and his commitment to securing the best outcomes for clients reflect the core values of integrity, diligence, and client service that define the Chambers of Jeet Bhatt."
    ],
    overview: {
      expertise: [
        "Civil Law",
        "Criminal Law",
        "Commercial Law",
        "Procedural Law",
        "Arbitration (support & assistance)",
        "District Courts of Gandhinagar and Ahmedabad",
      ],
      clients: [],
      cases: [],
    },
    experience: [],
    education: [],
    awards: [],
    publications: [],
  },
};
