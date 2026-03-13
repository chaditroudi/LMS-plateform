-- PostgreSQL initialization for LMS Platform

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT true,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(255),
    course_id INTEGER,
    lesson_id INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics(user_id);

-- Seed data
INSERT INTO courses (title, description, instructor_id, category, price, is_free, thumbnail_url) VALUES
('Introduction to Python', 'Learn Python programming from scratch with hands-on exercises.', 'instructor_1', 'Programming', 0.00, true, '/images/python.jpg'),
('Web Development with React', 'Master React.js and build modern web applications.', 'instructor_1', 'Web Development', 29.99, false, '/images/react.jpg'),
('Data Science Fundamentals', 'Explore data analysis, visualization, and machine learning basics.', 'instructor_2', 'Data Science', 49.99, false, '/images/datascience.jpg'),
('DevOps & Cloud Computing', 'Learn Docker, Kubernetes, CI/CD, and cloud deployment.', 'instructor_2', 'DevOps', 39.99, false, '/images/devops.jpg'),
('Machine Learning A-Z', 'Comprehensive guide to machine learning algorithms and applications.', 'instructor_3', 'AI/ML', 59.99, false, '/images/ml.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO lessons (course_id, title, content, order_index, duration_minutes) VALUES
(1, 'Getting Started with Python', 'In this lesson, we will set up Python and write our first program.', 1, 15),
(1, 'Variables and Data Types', 'Learn about Python variables, strings, numbers, and booleans.', 2, 20),
(1, 'Control Flow', 'Master if/else statements, loops, and conditional logic.', 3, 25),
(1, 'Functions', 'Learn how to define and use functions in Python.', 4, 20),
(2, 'React Fundamentals', 'Introduction to React components, JSX, and props.', 1, 30),
(2, 'State Management', 'Learn useState, useEffect, and React state patterns.', 2, 35),
(2, 'Building a Full App', 'Put it all together and build a complete React application.', 3, 45),
(3, 'Introduction to Data Science', 'Overview of data science tools and methodologies.', 1, 20),
(3, 'Pandas & NumPy', 'Data manipulation with Pandas and numerical computing with NumPy.', 2, 40),
(3, 'Data Visualization', 'Create compelling visualizations with Matplotlib and Seaborn.', 3, 35)
ON CONFLICT DO NOTHING;
