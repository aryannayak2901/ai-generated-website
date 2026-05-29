export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  readTime: string;
  externalLink?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "cji-legacy-constitutional-analysis",
    title: "The 47 Chief Justices of India (1950-2021): A Jurimetric and Constitutional Legacy",
    summary: "The Constitution of India 1950 mandated as by the Supreme Court of India (SCI) when it came into force on 26th January, 1950. The inaugural sitting took...",
    content: "The Constitution of India 1950 mandated as by the Supreme Court of India (SCI) when it came into force on 26th January, 1950. The inaugural sitting took place on 28th January, 1950. Over the last seven decades, the office of the Chief Justice of India (CJI) has been the cornerstone of the Indian judicial system. This article provides a comprehensive jurimetric analysis of the 47 Chief Justices who have served from 1950 to 2021.\n\nFrom Justice H.J. Kania to Justice N.V. Ramana, each CJI has left an indelible mark on the constitutional fabric of the nation. We examine their backgrounds, tenures, and landmark judgments that shaped the 'Basic Structure Doctrine' and the evolution of Public Interest Litigation (PIL). The study reveals patterns in judicial appointments, the impact of seniority, and the critical role of the CJI in the Collegium system.\n\nUnderstanding this legacy is essential for any legal professional or student of Indian constitutional law, as it reflects the changing dynamics between the judiciary, the executive, and the legislature in the world's largest democracy.",
    category: "General Legal",
    date: "January 15, 2024",
    image: "/blog/cji-legacy.jpg",
    author: "Jeet Bhatt",
    readTime: "12 min read",
  },
  {
    id: "2",
    slug: "emergency-50-constitution-courts",
    title: "Fifty Years of The Emergency: The Constitution, The Courts, And The Battle For...",
    summary: "This article examines the constitutional crisis during the 1975-77 Emergency in India, focusing on judicial responses, executive overreach, and legislative...",
    content: "This article examines the constitutional crisis during the 1975-77 Emergency in India, focusing on judicial responses, executive overreach, and legislative shifts. The declaration of Internal Emergency on June 25, 1975, remains the darkest chapter in Indian democracy. We delve into the suspension of fundamental rights under Article 359 and the infamous ADM Jabalpur v. Shivkant Shukla case, also known as the Habeas Corpus case.\n\nThe analysis highlights how the judiciary initially struggled against a dominant executive but eventually paved the way for a more resilient constitutional framework through the 44th Amendment Act, 1978. We also discuss the role of the press, the suppression of dissent, and the long-term impact of the Emergency on the Indian political psyche.\n\nFifty years later, the lessons from the Emergency continue to inform our understanding of civil liberties and the importance of an independent judiciary as the guardian of the Constitution.",
    category: "General Legal",
    date: "February 10, 2024",
    image: "/blog/emergency-50.jpg",
    author: "Jeet Bhatt",
    readTime: "15 min read",
  },
  {
    id: "3",
    slug: "indian-judiciary-interesting-facts",
    title: "Interesting Facts About Indian Judiciary",
    summary: "The Supreme Court of India (SCI) is considered one of the most powerful courts in the world. The unit jurisdiction of the SCI remains sedentary, extending to...",
    content: "The Supreme Court of India (SCI) is considered one of the most powerful courts in the world. The unit jurisdiction of the SCI remains sedentary, extending to the entire territory of India. Did you know that the SCI initially had only 8 judges, including the CJI? Today, that number has grown to 34 to handle the increasing volume of litigation.\n\nOther fascinating facts include the history of the Supreme Court building, which is designed in the shape of a pair of scales of justice. We also explore the unique system of 'Senior Advocates', the significance of the 'Seal of the Supreme Court', and the traditional robes worn by judges. \n\nFrom the shortest tenure of a CJI (only 17 days) to the first woman judge appointed to the Supreme Court (Justice M. Fathima Beevi), this article uncovers the lesser-known aspects of the institution that stands as the final arbiter of law in India.",
    category: "General Legal",
    date: "March 05, 2024",
    image: "/blog/judiciary-facts.jpg",
    author: "Jeet Bhatt",
    readTime: "10 min read",
  },
  {
    id: "4",
    slug: "culpable-homicide-vs-murder-analysis",
    title: "QUALITATIVE ANALYSIS OF CULPABLE HOMICIDE AMOUNTING TO VERSUS...",
    summary: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Quantitative Analysis of Culpable Homicide Amounting to vs. Murder: An Analyzing To...",
    content: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Quantitative Analysis of Culpable Homicide Amounting to vs. Murder: An Analyzing To... This research provides a deep qualitative dive into the thin line separating Section 299 and Section 300 of the Indian Penal Code (IPC). The distinction between 'culpable homicide not amounting to murder' and 'murder' is often a subject of intense legal debate.\n\nWe analyze several landmark judgments, including Reg. v. Govinda and State of Andhra Pradesh v. Rayavarapu Punnayya, to understand the application of the 'degree of probability' test. The article explores the nuances of 'intention' versus 'knowledge' and how courts interpret the phrase 'likely to cause death' in various factual contexts.\n\nThis analysis is crucial for criminal law practitioners to build effective defense strategies or for prosecutors to establish the higher degree of mens rea required for a murder conviction.",
    category: "Criminal Defense",
    date: "April 20, 2024",
    image: "/blog/homicide-analysis.jpg",
    author: "Jeet Bhatt",
    readTime: "18 min read",
  },
  {
    id: "5",
    slug: "economic-analysis-homicide-murder-manslaughter",
    title: "Economic Analysis of Culpable Homicide - Murder vs Manslaughter: An Empirical Study",
    summary: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Economic Analysis of Culpable Homicide - Murder vs Manslaughter: An Empirical Study...",
    content: "Hruthumna Thakur, Shau, J. J. Gunnamathan, M. & Yavav, A. (2022). Economic Analysis of Culpable Homicide - Murder vs Manslaughter: An Empirical Study... This empirical study applies law and economics principles to the classification of homicide. We explore how different sentencing frameworks act as deterrents and the socio-economic factors that correlate with violent crimes.\n\nThe research uses data from various National Crime Records Bureau (NCRB) reports to identify trends in homicide rates and the efficiency of the criminal justice system in processing these cases. We discuss the concept of 'optimal punishment' and the societal costs associated with long-drawn-out criminal trials.\n\nBy viewing criminal law through an economic lens, we gain fresh insights into how legal structures can be optimized to reduce crime and improve judicial outcomes.",
    category: "Criminal Defense",
    date: "May 12, 2024",
    image: "/blog/economic-homicide.jpg",
    author: "Jeet Bhatt",
    readTime: "20 min read",
  },
  {
    id: "6",
    slug: "tale-of-two-enclaves-dadra-nagar-haveli",
    title: "Tale of Two Enclaves (Dadra & Nagar Haveli)",
    summary: "Exploring the unique legal and historical status of the enclaves and the subsequent legal framework governing them.",
    content: "Exploring the unique legal and historical status of the enclaves and the subsequent legal framework governing them. The history of Dadra & Nagar Haveli is a fascinating saga of liberation from Portuguese rule and its eventual integration into the Indian Union. \n\nWe examine the 'Right of Passage' case before the International Court of Justice (ICJ), which was a significant milestone in international law. The article also discusses the transitional legal period where the enclaves were governed by a local administration before becoming a Union Territory. \n\nThis 'Tale of Two Enclaves' provides a unique perspective on sovereignty, decolonization, and the application of Indian law to newly integrated territories.",
    category: "General Legal",
    date: "June 08, 2024",
    image: "/blog/enclaves-tale.jpg",
    author: "Jeet Bhatt",
    readTime: "14 min read",
  },
  {
    id: "7",
    slug: "kesavananda-bharati-case-facts",
    title: "50 Interesting Facts In And Around Kesavananda Bharati Case",
    summary: "A deep dive into the landmark case that established the Basic Structure Doctrine of the Indian Constitution.",
    content: "A deep dive into the landmark case that established the Basic Structure Doctrine of the Indian Constitution. Kesavananda Bharati v. State of Kerala (1973) is arguably the most important judgment in Indian legal history. \n\nDid you know the case was heard by a 13-judge bench, the largest in SCI history? The hearings lasted for 68 days, and the judgment itself is over 700 pages long. We explore the 'invisible' influence of the German 'Basic Law' on the judges' thinking and the political climate of the time.\n\nFrom the narrow 7-6 majority to the subsequent attempt by the government to review the judgment, these 50 facts provide a behind-the-scenes look at the battle for the soul of the Indian Constitution.",
    category: "Corporate Law",
    date: "July 25, 2024",
    image: "/blog/kesavananda-facts.jpg",
    author: "Jeet Bhatt",
    readTime: "25 min read",
  },
  {
    id: "8",
    slug: "proving-contradiction-during-trial",
    title: "Proving a contradiction during a Trial",
    summary: "Strategic insights into the cross-examination techniques and the legal provisions under the Evidence Act for proving contradictions.",
    content: "Strategic insights into the cross-examination techniques and the legal provisions under the Evidence Act for proving contradictions. Under Section 145 of the Indian Evidence Act, a witness may be cross-examined as to previous statements made by him in writing. \n\nThis article outlines the procedural steps for 'marking a contradiction'—from drawing the witness's attention to the specific statement to confronting them with their previous deposition. We discuss the importance of the 'Police Diary' (Section 161 statements) and how to use it effectively to impeach the credit of a witness.\n\nMastering this technique is a core skill for any trial lawyer, as it can often turn the tide of a case by exposing inconsistencies in the prosecution's or the defense's narrative.",
    category: "General Legal",
    date: "August 14, 2024",
    image: "/blog/trial-contradiction.jpg",
    author: "Jeet Bhatt",
    readTime: "12 min read",
  },
];

