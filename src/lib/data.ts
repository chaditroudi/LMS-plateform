export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz" | "reading";
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  rating: number;
  students: number;
  duration: string;
  thumbnail: string;
  curriculum: Section[];
  tags: string[];
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects and become a full-stack developer.",
    instructor: "Sarah Johnson",
    instructorBio: "Senior Full Stack Developer with 10+ years of experience at top tech companies.",
    instructorAvatar: "https://picsum.photos/seed/instructor1/100/100",
    category: "Web Development",
    level: "Beginner",
    price: 89.99,
    rating: 4.8,
    students: 45230,
    duration: "52 hours",
    thumbnail: "https://picsum.photos/seed/course1/600/400",
    tags: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
    curriculum: [
      {
        id: "s1",
        title: "Introduction to Web Development",
        lessons: [
          { id: "l1", title: "Course Overview", duration: "5:00", type: "video" },
          { id: "l2", title: "Setting Up Your Environment", duration: "12:00", type: "video" },
          { id: "l3", title: "How the Web Works", duration: "8:00", type: "reading" },
        ],
      },
      {
        id: "s2",
        title: "HTML Fundamentals",
        lessons: [
          { id: "l4", title: "HTML Structure", duration: "15:00", type: "video" },
          { id: "l5", title: "Semantic HTML", duration: "10:00", type: "video" },
          { id: "l6", title: "HTML Quiz", duration: "10:00", type: "quiz" },
        ],
      },
      {
        id: "s3",
        title: "CSS Styling",
        lessons: [
          { id: "l7", title: "CSS Selectors", duration: "18:00", type: "video" },
          { id: "l8", title: "Flexbox & Grid", duration: "22:00", type: "video" },
          { id: "l9", title: "Responsive Design", duration: "20:00", type: "video" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Python for Data Science & Machine Learning",
    description: "Master Python programming for data analysis, visualization, and machine learning with hands-on projects.",
    instructor: "Dr. Michael Chen",
    instructorBio: "Data Scientist and AI researcher with PhD in Computer Science from MIT.",
    instructorAvatar: "https://picsum.photos/seed/instructor2/100/100",
    category: "Data Science",
    level: "Intermediate",
    price: 99.99,
    rating: 4.9,
    students: 38750,
    duration: "68 hours",
    thumbnail: "https://picsum.photos/seed/course2/600/400",
    tags: ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow"],
    curriculum: [
      {
        id: "s1",
        title: "Python Refresher",
        lessons: [
          { id: "l1", title: "Python Basics", duration: "20:00", type: "video" },
          { id: "l2", title: "Data Structures", duration: "25:00", type: "video" },
        ],
      },
      {
        id: "s2",
        title: "Data Analysis with Pandas",
        lessons: [
          { id: "l3", title: "Introduction to Pandas", duration: "30:00", type: "video" },
          { id: "l4", title: "Data Cleaning", duration: "35:00", type: "video" },
          { id: "l5", title: "Data Analysis Quiz", duration: "15:00", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    description: "Learn user interface and user experience design from scratch. Master Figma, design principles, and prototyping.",
    instructor: "Emma Williams",
    instructorBio: "Lead UX Designer at a Fortune 500 company with 8 years of design experience.",
    instructorAvatar: "https://picsum.photos/seed/instructor3/100/100",
    category: "Design",
    level: "Beginner",
    price: 79.99,
    rating: 4.7,
    students: 22100,
    duration: "40 hours",
    thumbnail: "https://picsum.photos/seed/course3/600/400",
    tags: ["Figma", "UI Design", "UX Research", "Prototyping"],
    curriculum: [
      {
        id: "s1",
        title: "Design Fundamentals",
        lessons: [
          { id: "l1", title: "Color Theory", duration: "18:00", type: "video" },
          { id: "l2", title: "Typography Basics", duration: "15:00", type: "video" },
          { id: "l3", title: "Design Principles Quiz", duration: "10:00", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Digital Marketing Strategy",
    description: "Complete digital marketing course covering SEO, social media, email marketing, and paid advertising.",
    instructor: "James Miller",
    instructorBio: "Digital Marketing Expert with 12+ years helping brands grow their online presence.",
    instructorAvatar: "https://picsum.photos/seed/instructor4/100/100",
    category: "Marketing",
    level: "Beginner",
    price: 69.99,
    rating: 4.6,
    students: 31500,
    duration: "35 hours",
    thumbnail: "https://picsum.photos/seed/course4/600/400",
    tags: ["SEO", "Social Media", "Email Marketing", "Google Ads"],
    curriculum: [
      {
        id: "s1",
        title: "Marketing Fundamentals",
        lessons: [
          { id: "l1", title: "Introduction to Digital Marketing", duration: "12:00", type: "video" },
          { id: "l2", title: "Understanding Your Audience", duration: "15:00", type: "video" },
        ],
      },
    ],
  },
  {
    id: "5",
    title: "React & Next.js Advanced Patterns",
    description: "Deep dive into advanced React patterns, Next.js App Router, server components, and performance optimization.",
    instructor: "Alex Thompson",
    instructorBio: "Senior React Engineer and open source contributor with expertise in modern web architecture.",
    instructorAvatar: "https://picsum.photos/seed/instructor5/100/100",
    category: "Web Development",
    level: "Advanced",
    price: 109.99,
    rating: 4.9,
    students: 15800,
    duration: "45 hours",
    thumbnail: "https://picsum.photos/seed/course5/600/400",
    tags: ["React", "Next.js", "TypeScript", "Performance"],
    curriculum: [
      {
        id: "s1",
        title: "Advanced React Patterns",
        lessons: [
          { id: "l1", title: "Compound Components", duration: "25:00", type: "video" },
          { id: "l2", title: "Render Props & HOCs", duration: "20:00", type: "video" },
          { id: "l3", title: "Custom Hooks Deep Dive", duration: "30:00", type: "video" },
        ],
      },
    ],
  },
  {
    id: "6",
    title: "Business Strategy & Leadership",
    description: "Develop essential business strategy skills, leadership capabilities, and entrepreneurial mindset.",
    instructor: "Dr. Patricia Davis",
    instructorBio: "Business professor at Harvard Business School and management consultant.",
    instructorAvatar: "https://picsum.photos/seed/instructor6/100/100",
    category: "Business",
    level: "Intermediate",
    price: 94.99,
    rating: 4.7,
    students: 28900,
    duration: "30 hours",
    thumbnail: "https://picsum.photos/seed/course6/600/400",
    tags: ["Strategy", "Leadership", "Management", "Entrepreneurship"],
    curriculum: [
      {
        id: "s1",
        title: "Strategic Thinking",
        lessons: [
          { id: "l1", title: "Business Model Canvas", duration: "20:00", type: "video" },
          { id: "l2", title: "Competitive Analysis", duration: "22:00", type: "video" },
        ],
      },
    ],
  },
  {
    id: "7",
    title: "Machine Learning with TensorFlow",
    description: "Build and deploy machine learning models using TensorFlow and Keras. Cover neural networks, CNNs, and NLP.",
    instructor: "Dr. Robert Kim",
    instructorBio: "AI Engineer at Google with expertise in deep learning and neural networks.",
    instructorAvatar: "https://picsum.photos/seed/instructor7/100/100",
    category: "Data Science",
    level: "Advanced",
    price: 119.99,
    rating: 4.8,
    students: 19200,
    duration: "72 hours",
    thumbnail: "https://picsum.photos/seed/course7/600/400",
    tags: ["TensorFlow", "Keras", "CNN", "NLP", "Deep Learning"],
    curriculum: [
      {
        id: "s1",
        title: "Neural Network Foundations",
        lessons: [
          { id: "l1", title: "Perceptrons & Activation Functions", duration: "28:00", type: "video" },
          { id: "l2", title: "Backpropagation", duration: "32:00", type: "video" },
          { id: "l3", title: "Neural Network Quiz", duration: "20:00", type: "quiz" },
        ],
      },
    ],
  },
  {
    id: "8",
    title: "Graphic Design with Adobe Creative Suite",
    description: "Master Photoshop, Illustrator, and InDesign to create stunning visual designs for print and digital media.",
    instructor: "Sophie Martinez",
    instructorBio: "Award-winning graphic designer and Adobe Certified Expert with 15 years of experience.",
    instructorAvatar: "https://picsum.photos/seed/instructor8/100/100",
    category: "Design",
    level: "Intermediate",
    price: 84.99,
    rating: 4.6,
    students: 24600,
    duration: "55 hours",
    thumbnail: "https://picsum.photos/seed/course8/600/400",
    tags: ["Photoshop", "Illustrator", "InDesign", "Adobe"],
    curriculum: [
      {
        id: "s1",
        title: "Photoshop Essentials",
        lessons: [
          { id: "l1", title: "Interface Overview", duration: "15:00", type: "video" },
          { id: "l2", title: "Layers & Masks", duration: "25:00", type: "video" },
          { id: "l3", title: "Photo Retouching", duration: "30:00", type: "video" },
        ],
      },
    ],
  },
];

export const categories = ["All", "Web Development", "Data Science", "Design", "Business", "Marketing"];

export const testimonials = [
  {
    id: "1",
    name: "John Peterson",
    role: "Software Engineer",
    avatar: "https://picsum.photos/seed/testimonial1/80/80",
    content: "This platform completely transformed my career. The courses are well-structured and the instructors are world-class.",
    rating: 5,
    course: "Complete Web Development Bootcamp",
  },
  {
    id: "2",
    name: "Maria Rodriguez",
    role: "Data Analyst",
    avatar: "https://picsum.photos/seed/testimonial2/80/80",
    content: "I landed my dream job after completing the Data Science course. The hands-on projects were incredibly valuable.",
    rating: 5,
    course: "Python for Data Science",
  },
  {
    id: "3",
    name: "David Lee",
    role: "UX Designer",
    avatar: "https://picsum.photos/seed/testimonial3/80/80",
    content: "The UI/UX Design course is comprehensive and up-to-date. I now have a portfolio that impresses clients.",
    rating: 5,
    course: "UI/UX Design Masterclass",
  },
];

export const enrolledCourses = [
  { courseId: "1", progress: 65, lastAccessed: "2024-01-15" },
  { courseId: "2", progress: 30, lastAccessed: "2024-01-14" },
  { courseId: "3", progress: 90, lastAccessed: "2024-01-13" },
];

export const recentActivity = [
  { action: "Completed lesson", detail: "CSS Selectors", course: "Complete Web Development Bootcamp", time: "2 hours ago" },
  { action: "Started section", detail: "Data Analysis with Pandas", course: "Python for Data Science", time: "1 day ago" },
  { action: "Completed quiz", detail: "Design Principles Quiz", course: "UI/UX Design Masterclass", time: "2 days ago" },
  { action: "Earned certificate", detail: "HTML Fundamentals", course: "Complete Web Development Bootcamp", time: "3 days ago" },
];
