const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /posts
router.get('/posts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        // Random ordering using PostgreSQL RANDOM()
        // Note: For large datasets, this can be slow. 
        // Alternatives include sampling IDs or using a random column.
        const posts = await prisma.$queryRaw`
      SELECT * FROM "Post"
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

        // Transform posts to match frontend expectations
        const formattedPosts = posts.map(post => ({
            ...post,
            time: getTimeAgo(post.createdAt),
            // Ensure image URLs are absolute if they are local
            image: post.image.startsWith('http') ? post.image : `${req.protocol}://${req.get('host')}/images/${post.image}`
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /posts/:id
router.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: parseInt(id) }
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const formattedPost = {
            ...post,
            time: getTimeAgo(post.createdAt),
            image: post.image.startsWith('http') ? post.image : `${req.protocol}://${req.get('host')}/images/${post.image}`
        };

        res.json(formattedPost);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /posts
router.post('/posts', async (req, res) => {
    try {
        const { title, fullContent, simplifiedSnippet, author, profilePic, image } = req.body;

        if (!title || (!fullContent && !simplifiedSnippet)) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                fullContent: fullContent || '',
                simplifiedSnippet,
                author: author || 'Anonymous',
                profilePic: profilePic || 'https://placehold.co/40x40/cccccc/ffffff?text=User',
                image: image || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image',
                likes: 0,
                comments: 0,
                isSimplifying: false
            }
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to calculate "time ago"
function getTimeAgo(date) {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
}

module.exports = router;
