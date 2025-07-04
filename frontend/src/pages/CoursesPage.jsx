function CoursesPage() {
    // Sample course data
    const courses = [
        {
            id: 1,
            title: "React Fundamentals",
            description: "Learn the basics of React development",
            duration: "3 days",
            instructor: "John Doe",
            level: "Beginner",
            enrollments: 25
        },
        {
            id: 2,
            title: "Laravel API Development",
            description: "Master backend development with Laravel",
            duration: "5 days",
            instructor: "Jane Smith",
            level: "Intermediate",
            enrollments: 18
        },
        {
            id: 3,
            title: "Database Design",
            description: "Learn how to design efficient databases",
            duration: "2 days",
            instructor: "Bob Wilson",
            level: "Advanced",
            enrollments: 12
        }
    ]

    return (
        <div>
            <h1>Training Courses</h1>
            <p>Browse all available training courses and enroll in the ones that interest you.</p>

            <div style={{ margin: '20px 0' }}>
                {courses.map(course => (
                    <div
                        key={course.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '20px',
                            margin: '15px 0',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <h3 style={{ color: '#1E40AF', marginBottom: '10px' }}>{course.title}</h3>
                        <p style={{ marginBottom: '10px' }}>{course.description}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', margin: '10px 0' }}>
                            <p><strong>Duration:</strong> {course.duration}</p>
                            <p><strong>Instructor:</strong> {course.instructor}</p>
                            <p><strong>Level:</strong> {course.level}</p>
                            <p><strong>Enrollments:</strong> {course.enrollments}</p>
                        </div>

                        <button style={{
                            backgroundColor: '#1E40AF',
                            color: 'white',
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}>
                            Enroll Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CoursesPage
