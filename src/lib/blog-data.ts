export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  image: string;
  author: string;
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "The 47 Chief Justices of India (1950-2021): A Jurimetric and Constitutional Legacy",
    summary: "The Constitution of India 1950 mandated as by the Supreme Court of India (SCI) when it came into force on 26th January, 1950. The inaugural sitting took...",
    category: "General Legal",
    date: "January 15, 2024",
    image: "/blog/cji-legacy.jpg",
    author: "Jeet Bhatt",
    readTime: "12 min read",
  },
  {
    id: "2",
    title: "Fifty Years of The Emergency: The Constitution, The Courts, And The Battle For...",
    summary: "This article examines the constitutional crisis during the 1975-77 Emergency in India, focusing on judicial responses, executive overreach, and legislative...",
    category: "General Legal",
    date: "February 10, 2024",
    image: "/blog/emergency-50.jpg",
    author: "Jeet Bhatt",
    readTime: "15 min read",
  },
  {
    id: "3",
    title: "Interesting Facts About Indian Judiciary",
    summary: "The Supreme Court of India (SCI) is considered one of the most powerful courts in the world. The unit jurisdiction of the SCI remains sedentary, extending to...",
    category: "General Legal",
    date: "March 05, 2024",
    image: "/blog/judiciary-facts.jpg",
    author: "Jeet Bhatt",
    readTime: "10 min read",
  },
  {
    id: "4",
    title: "QUALITATIVE ANALYSIS OF CULPABLE HOMICIDE AMOUNTING TO VERSUS...",
    summary: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Quantitative Analysis of Culpable Homicide Amounting to vs. Murder: An Analyzing To...",
    category: "Criminal Defense",
    date: "April 20, 2024",
    image: "/blog/homicide-analysis.jpg",
    author: "Jeet Bhatt",
    readTime: "18 min read",
  },
  {
    id: "5",
    title: "Economic Analysis of Culpable Homicide - Murder vs Manslaughter: An Empirical Study",
    summary: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Economic Analysis of Culpable Homicide - Murder vs Manslaughter: An Empirical Study...",
    category: "Criminal Defense",
    date: "May 12, 2024",
    image: "/blog/economic-homicide.jpg",
    author: "Jeet Bhatt",
    readTime: "20 min read",
  },
  {
    id: "6",
    title: "Tale of Two Enclaves (Dadra & Nagar Haveli)",
    summary: "Exploring the unique legal and historical status of the enclaves and the subsequent legal framework governing them.",
    category: "General Legal",
    date: "June 08, 2024",
    image: "/blog/enclaves-tale.jpg",
    author: "Jeet Bhatt",
    readTime: "14 min read",
  },
  {
    id: "7",
    title: "50 Interesting Facts In And Around Kesavananda Bharati Case",
    summary: "A deep dive into the landmark case that established the Basic Structure Doctrine of the Indian Constitution.",
    category: "Corporate Law",
    date: "July 25, 2024",
    image: "/blog/kesavananda-facts.jpg",
    author: "Jeet Bhatt",
    readTime: "25 min read",
  },
  {
    id: "8",
    title: "Proving a contradiction during a Trial",
    summary: "Strategic insights into the cross-examination techniques and the legal provisions under the Evidence Act for proving contradictions.",
    category: "General Legal",
    date: "August 14, 2024",
    image: "/blog/trial-contradiction.jpg",
    author: "Jeet Bhatt",
    readTime: "12 min read",
  },
];
