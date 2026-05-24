const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

// Configure multer storage: PDFs em /pdfs, anexos suplementares em /files, imagens em /images
const pdfsDir = path.join(__dirname, '../public/pdfs');
const filesDir = path.join(__dirname, '../public/files');
const imagesDir = path.join(__dirname, '../public/images');
for (const dir of [pdfsDir, filesDir, imagesDir]) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const destinationFor = (fieldname) => {
    if (fieldname === 'pdf') return pdfsDir;
    if (fieldname === 'image' || fieldname === 'avatar') return imagesDir;
    return filesDir;
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destinationFor(file.fieldname));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
    fileFilter: (req, file, cb) => {
        // PDF principal exige application/pdf; imagens aceitam apenas image/*; demais aceitam qualquer tipo
        if (file.fieldname === 'pdf' && file.mimetype !== 'application/pdf') {
            return cb(new Error('O arquivo principal deve ser um PDF'));
        }
        if ((file.fieldname === 'image' || file.fieldname === 'avatar') && !file.mimetype.startsWith('image/')) {
            return cb(new Error('O arquivo deve ser uma imagem'));
        }
        cb(null, true);
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

// FORMAT POST HELPER
const formatPost = (post, req) => {
    const base = `${req.protocol}://${req.get('host')}`;
    return {
        ...post,
        time: getTimeAgo(post.createdAt),
        image: post.image.startsWith('http') ? post.image : `${base}/images/${post.image}`,
        pdfUrl: post.pdfFilename ? `${base}/pdfs/${post.pdfFilename}` : null,
        supplementaryUrl: post.supplementaryFilename ? `${base}/files/${post.supplementaryFilename}` : null,
    };
};

// Normaliza keywords: aceita array ou string separada por vírgulas
const parseKeywords = (raw) => {
    if (Array.isArray(raw)) return raw.map(k => String(k).trim()).filter(Boolean);
    if (typeof raw === 'string') return raw.split(',').map(k => k.trim()).filter(Boolean);
    return [];
};

// POST /register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: 'aluno',
                profilePic: `https://placehold.co/40x40/3b82f6/ffffff?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
                avatarUrl: `https://placehold.co/200x200/3b82f6/ffffff?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`,
            }
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePic: user.profilePic,
            avatarUrl: user.avatarUrl,
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            profilePic: user.profilePic,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            institution: user.institution,
            field: user.field,
            verified: user.verified,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            postsCount: user.postsCount,
            quizPoints: user.quizPoints,
            quizzesCompleted: user.quizzesCompleted,
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serializa o usuário sem expor passwordHash
const publicUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    profilePic: user.profilePic,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    institution: user.institution,
    field: user.field,
    verified: user.verified,
    followersCount: user.followersCount,
    followingCount: user.followingCount,
    postsCount: user.postsCount,
    quizPoints: user.quizPoints,
    quizzesCompleted: user.quizzesCompleted,
});

// PATCH /users/:id — edição de perfil
router.patch('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'ID de usuário inválido' });
        }

        const { name, bio, institution, field, avatarUrl, profilePic } = req.body;
        const data = {};
        if (name !== undefined) data.name = name;
        if (bio !== undefined) data.bio = bio;
        if (institution !== undefined) data.institution = institution;
        if (field !== undefined) data.field = field;
        if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;
        if (profilePic !== undefined) data.profilePic = profilePic;

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar' });
        }

        const user = await prisma.user.update({ where: { id: userId }, data });
        res.json(publicUser(user));
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /users/:id/avatar — upload de foto de perfil
router.post('/users/:id/avatar', (req, res) => {
    upload.single('avatar')(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const userId = parseInt(req.params.id);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'ID de usuário inválido' });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Arquivo de imagem obrigatório' });
            }

            const base = `${req.protocol}://${req.get('host')}`;
            const url = `${base}/images/${req.file.filename}`;

            const user = await prisma.user.update({
                where: { id: userId },
                data: { profilePic: url, avatarUrl: url },
            });

            // Atualiza profilePic dos posts existentes do autor para refletir nova foto
            await prisma.post.updateMany({
                where: { authorId: userId },
                data: { profilePic: url },
            });

            res.json(publicUser(user));
        } catch (error) {
            if (error.code === 'P2025') {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            console.error('Error uploading avatar:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// POST /posts/:id/save — salva um post para o usuário
router.post('/posts/:id/save', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = parseInt(req.body.userId);
        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }

        await prisma.savedPost.upsert({
            where: { userId_postId: { userId, postId } },
            update: {},
            create: { userId, postId },
        });
        res.json({ saved: true });
    } catch (error) {
        console.error('Error saving post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /posts/:id/save — remove um post salvo
router.delete('/posts/:id/save', async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = parseInt(req.body.userId);
        if (isNaN(postId) || isNaN(userId)) {
            return res.status(400).json({ error: 'IDs inválidos' });
        }

        await prisma.savedPost.deleteMany({ where: { userId, postId } });
        res.json({ saved: false });
    } catch (error) {
        console.error('Error unsaving post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /users/:id/saved — posts salvos pelo usuário
router.get('/users/:id/saved', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'ID de usuário inválido' });
        }

        const saved = await prisma.savedPost.findMany({
            where: { userId },
            include: { post: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(saved.map(s => formatPost(s.post, req)));
    } catch (error) {
        console.error('Error fetching saved posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /posts/by-category
router.get('/posts/by-category', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: {
                category: { not: null }
            }
        });

        const formattedPosts = posts.map(post => formatPost(post, req));

        const grouped = {};
        for (const post of formattedPosts) {
            if (!grouped[post.category]) {
                grouped[post.category] = {};
            }
            const sub = post.subcategory || 'geral';
            if (!grouped[post.category][sub]) {
                grouped[post.category][sub] = [];
            }
            grouped[post.category][sub].push(post);
        }

        res.json(grouped);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /posts
router.get('/posts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const posts = await prisma.$queryRaw`
            SELECT * FROM "Post"
            ORDER BY "createdAt" DESC
            LIMIT ${limit}
        `;
        const formattedPosts = posts.map(post => formatPost(post, req));
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

        res.json(formatPost(post, req));
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /posts (Legacy no-file)
router.post('/posts', async (req, res) => {
    try {
        const { title, fullContent, simplifiedSnippet, author, profilePic, image, category, subcategory } = req.body;

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
                category,
                subcategory,
                comments: 0,
                isSimplifying: false
            }
        });

        res.status(201).json(formatPost(newPost, req));
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /users/:id/posts — posts publicados por um usuário
router.get('/users/:id/posts', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({ error: 'ID de usuário inválido' });
        }

        const posts = await prisma.post.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
        });

        res.json(posts.map(post => formatPost(post, req)));
    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /posts/upload — cria post científico com PDF principal e anexo suplementar opcionais
const uploadFields = upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'supplementary', maxCount: 1 },
]);

router.post('/posts/upload', (req, res) => {
    uploadFields(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {
            const {
                title, fullContent, simplifiedSnippet, author, profilePic, image,
                category, subcategory, abstract, keywords, doi, references, authorId,
            } = req.body;

            if (!title || !fullContent) {
                return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
            }

            const pdfFile = req.files?.pdf?.[0] || null;
            const suppFile = req.files?.supplementary?.[0] || null;

            const parsedAuthorId = authorId ? parseInt(authorId) : null;
            let authorName = author || 'Anônimo';
            let authorPic = profilePic || 'https://placehold.co/40x40/cccccc/ffffff?text=User';

            // Se authorId foi enviado, deriva nome/avatar do usuário real
            if (parsedAuthorId && !isNaN(parsedAuthorId)) {
                const authorUser = await prisma.user.findUnique({ where: { id: parsedAuthorId } });
                if (authorUser) {
                    authorName = authorUser.name;
                    authorPic = authorUser.profilePic || authorUser.avatarUrl || authorPic;
                }
            }

            const newPost = await prisma.post.create({
                data: {
                    title,
                    fullContent: fullContent || '',
                    simplifiedSnippet: simplifiedSnippet || null,
                    abstract: abstract || null,
                    keywords: parseKeywords(keywords),
                    doi: doi || null,
                    references: references || null,
                    author: authorName,
                    authorId: parsedAuthorId && !isNaN(parsedAuthorId) ? parsedAuthorId : null,
                    profilePic: authorPic,
                    image: image || 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image',
                    category: category || null,
                    subcategory: subcategory || null,
                    pdfFilename: pdfFile?.filename || null,
                    pdfOriginalName: pdfFile?.originalname || null,
                    supplementaryFilename: suppFile?.filename || null,
                    supplementaryOriginalName: suppFile?.originalname || null,
                    comments: 0,
                    isSimplifying: false,
                },
            });

            // Mantém o contador denormalizado do autor em dia
            if (newPost.authorId) {
                await prisma.user.update({
                    where: { id: newPost.authorId },
                    data: { postsCount: { increment: 1 } },
                });
            }

            res.status(201).json(formatPost(newPost, req));
        } catch (error) {
            console.error('Error creating post with manual upload:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// PATCH /posts/:id — edita publicação (somente o autor pode editar)
const editFields = upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'supplementary', maxCount: 1 },
    { name: 'image', maxCount: 1 },
]);

router.patch('/posts/:id', (req, res) => {
    editFields(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        try {
            const postId = parseInt(req.params.id);
            if (isNaN(postId)) {
                return res.status(400).json({ error: 'ID de post inválido' });
            }

            const existing = await prisma.post.findUnique({ where: { id: postId } });
            if (!existing) {
                return res.status(404).json({ error: 'Publicação não encontrada' });
            }

            const userId = parseInt(req.body.userId);
            if (isNaN(userId) || existing.authorId !== userId) {
                return res.status(403).json({ error: 'Somente o autor pode editar esta publicação' });
            }

            const {
                title, fullContent, simplifiedSnippet, abstract, keywords,
                doi, references, category, subcategory, image,
            } = req.body;

            const data = {};
            if (title !== undefined) data.title = title;
            if (fullContent !== undefined) data.fullContent = fullContent;
            if (simplifiedSnippet !== undefined) data.simplifiedSnippet = simplifiedSnippet || null;
            if (abstract !== undefined) data.abstract = abstract || null;
            if (keywords !== undefined) data.keywords = parseKeywords(keywords);
            if (doi !== undefined) data.doi = doi || null;
            if (references !== undefined) data.references = references || null;
            if (category !== undefined) data.category = category || null;
            if (subcategory !== undefined) data.subcategory = subcategory || null;

            const pdfFile = req.files?.pdf?.[0] || null;
            const suppFile = req.files?.supplementary?.[0] || null;
            const imageFile = req.files?.image?.[0] || null;

            if (pdfFile) {
                data.pdfFilename = pdfFile.filename;
                data.pdfOriginalName = pdfFile.originalname;
            }
            if (suppFile) {
                data.supplementaryFilename = suppFile.filename;
                data.supplementaryOriginalName = suppFile.originalname;
            }
            if (imageFile) {
                data.image = imageFile.filename;
            } else if (image !== undefined) {
                data.image = image;
            }

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ error: 'Nenhum campo para atualizar' });
            }

            const updated = await prisma.post.update({ where: { id: postId }, data });
            res.json(formatPost(updated, req));
        } catch (error) {
            console.error('Error updating post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

module.exports = router;
