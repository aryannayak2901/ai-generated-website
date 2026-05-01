import {
  Building2,
  Users,
  Scale,
  Shield,
  Lightbulb,
  Briefcase,
  Home,
  Landmark,
  FileText,
  TrendingDown,
  Map,
  Gavel,
  Building,
  MessageSquare,
} from "lucide-react";

export const practiceAreas = [
  {
    id: "corporate-law",
    title: "Corporate Law",
    description:
      "Comprehensive corporate legal services including business formation, mergers & acquisitions, compliance, and corporate governance.",
    icon: Building2,
    services: [
      "Business Formation & Structuring",
      "Mergers & Acquisitions",
      "Corporate Compliance",
      "Contract Drafting & Review",
      "Corporate Governance",
    ],
  },
  {
    id: "family-law",
    title: "Family Law",
    description:
      "Sensitive handling of family matters with expertise in divorce, child custody, adoption, and domestic relations.",
    icon: Users,
    services: [
      "Divorce & Separation",
      "Child Custody & Support",
      "Adoption Proceedings",
      "Domestic Violence Cases",
      "Property Settlement",
    ],
  },
  {
    id: "civil-litigation",
    title: "Civil Litigation",
    description:
      "Experienced representation in civil disputes, commercial litigation, and alternative dispute resolution.",
    icon: Scale,
    services: [
      "Commercial Disputes",
      "Contract Disputes",
      "Property Disputes",
      "Tort Claims",
      "Arbitration & Mediation",
    ],
  },
  {
    id: "criminal-defense",
    title: "Criminal Defense",
    description:
      "Aggressive defense representation for criminal charges with a focus on protecting your rights and freedom.",
    icon: Shield,
    services: [
      "White Collar Crimes",
      "Drug Offenses",
      "Assault & Battery",
      "Theft & Fraud",
      "Appeals",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    description:
      "Protection and enforcement of intellectual property rights including patents, trademarks, and copyrights.",
    icon: Lightbulb,
    services: [
      "Patent Applications",
      "Trademark Registration",
      "Copyright Protection",
      "IP Litigation",
      "Licensing Agreements",
    ],
  },
  {
    id: "employment-law",
    title: "Employment Law",
    description:
      "Comprehensive employment law services for both employers and employees in workplace matters.",
    icon: Briefcase,
    services: [
      "Employment Contracts",
      "Workplace Discrimination",
      "Wrongful Termination",
      "Labor Relations",
      "Compliance Issues",
    ],
  },
  {
    id: "real-estate-law",
    title: "Real Estate Law",
    description:
      "Full-service real estate legal support for residential and commercial property transactions.",
    icon: Home,
    services: [
      "Property Transactions",
      "Title Examination",
      "Zoning Issues",
      "Landlord-Tenant Disputes",
      "Real Estate Litigation",
    ],
  },
  {
    id: "banking-finance",
    title: "Banking & Finance",
    description:
      "Expert legal counsel in banking, finance, and securities matters for individuals and institutions.",
    icon: Landmark,
    services: [
      "Loan Documentation",
      "Securities Compliance",
      "Banking Regulations",
      "Financial Disputes",
      "Debt Recovery",
    ],
  },
  {
    id: "constitutional-service-law",
    title: "Constitutional & Service Law",
    description:
      "Expertise in constitutional matters, writ petitions, and government service disputes.",
    icon: FileText,
    services: [
      "Writ Petitions (Article 226/32)",
      "Service Law & Government Employee Matters",
    ],
  },
  {
    id: "insolvency-bankruptcy",
    title: "Insolvency & Bankruptcy (IBC)",
    description:
      "Advising on Insolvency & Bankruptcy Code cases, restructuring, and resolution proceedings.",
    icon: TrendingDown,
    services: [
      "Corporate Insolvency Resolution Process (CIRP)",
      "NCLT / NCLAT Applications",
      "Debt Recovery & Liquidation",
    ],
  },
  {
    id: "property-land-real-estate",
    title: "Property, Land & Real Estate",
    description:
      "Handling matters related to real estate disputes, land acquisition, RERA and property rights.",
    icon: Map,
    services: [
      "RERA Claims & Compliance",
      "Land Acquisition & Title Disputes",
      "Landlord–Tenant Litigation",
    ],
  },
  {
    id: "civil-commercial-litigation",
    title: "Civil & Commercial Litigation",
    description:
      "Representing in commercial litigation, contract disputes, tort claims and civil suits.",
    icon: Gavel,
    services: [
      "Commercial Contracts & Disputes",
      "Debt Recovery (DRT / courts)",
      "Civil Tort & Property Disputes",
    ],
  },
  {
    id: "company-commercial-law",
    title: "Company & Commercial Law",
    description:
      "Advising on business law, company formations, regulatory compliance and documentation.",
    icon: Building,
    services: [
      "Company Incorporation & Structuring",
      "Commercial Agreements & Documentation",
      "Corporate Compliance and Regulatory Counsel",
    ],
  },
  {
    id: "arbitration",
    title: "Arbitration",
    description:
      "Expert advocacy in both domestic and international arbitration proceedings under major institutional and ad-hoc rules.",
    icon: MessageSquare,
    services: [
      "Drafting & Negotiating Arbitration Agreements",
      "Representation in ICC, LCIA, SIAC, UNCITRAL Arbitrations",
      "Emergency Interim Relief (Section 9 IBC / Arbitral Rules)",
      "Contractual & Statutory Dispute Resolution",
      "Enforcement & Setting-aside of Awards",
    ],
  },
];
