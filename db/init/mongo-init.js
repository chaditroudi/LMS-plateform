// MongoDB initialization for LMS Platform - User Service

db = db.getSiblingDB('lms_users');

// Create users collection with schema validation
db.createCollection('users', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['email', 'password', 'name', 'role'],
            properties: {
                email: {
                    bsonType: 'string',
                    description: 'User email address'
                },
                password: {
                    bsonType: 'string',
                    description: 'Hashed password'
                },
                name: {
                    bsonType: 'string',
                    description: 'User full name'
                },
                role: {
                    enum: ['student', 'instructor', 'admin'],
                    description: 'User role'
                },
                avatar_url: {
                    bsonType: 'string'
                },
                bio: {
                    bsonType: 'string'
                },
                created_at: {
                    bsonType: 'date'
                },
                updated_at: {
                    bsonType: 'date'
                }
            }
        }
    }
});

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });

// Create feedback collection
db.createCollection('feedback');
db.feedback.createIndex({ user_id: 1 });
db.feedback.createIndex({ course_id: 1 });
db.feedback.createIndex({ created_at: -1 });

print('MongoDB initialization complete');
