const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

// Mock PrismaClient
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        $queryRaw: jest.fn(),
        post: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('Backend API Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /health', () => {
        it('should return status ok', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ status: 'ok' });
        });
    });

    describe('GET /posts', () => {
        it('should return a list of posts', async () => {
            const mockPosts = [
                {
                    id: 1,
                    title: 'Test Post',
                    image: 'test.jpg',
                    createdAt: new Date().toISOString(),
                },
            ];
            prisma.$queryRaw.mockResolvedValue(mockPosts);

            const res = await request(app).get('/posts');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body[0].title).toEqual('Test Post');
            expect(prisma.$queryRaw).toHaveBeenCalled();
        });
    });

    describe('GET /posts/:id', () => {
        it('should return a single post by id', async () => {
            const mockPost = {
                id: 1,
                title: 'Test Post',
                image: 'test.jpg',
                createdAt: new Date().toISOString(),
            };
            prisma.post.findUnique.mockResolvedValue(mockPost);

            const res = await request(app).get('/posts/1');
            expect(res.statusCode).toEqual(200);
            expect(res.body.title).toEqual('Test Post');
            expect(prisma.post.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should return 404 if post not found', async () => {
            prisma.post.findUnique.mockResolvedValue(null);

            const res = await request(app).get('/posts/999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('POST /posts', () => {
        it('should create a new post', async () => {
            const newPostData = {
                title: 'New Post',
                fullContent: 'Content',
            };
            const createdPost = { ...newPostData, id: 2 };
            prisma.post.create.mockResolvedValue(createdPost);

            const res = await request(app).post('/posts').send(newPostData);
            expect(res.statusCode).toEqual(201);
            expect(res.body.title).toEqual('New Post');
            expect(prisma.post.create).toHaveBeenCalled();
        });

        it('should return 400 if title is missing', async () => {
            const res = await request(app).post('/posts').send({ fullContent: 'Content' });
            expect(res.statusCode).toEqual(400);
        });
    });
});
