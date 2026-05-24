const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = 'password';

const users = [
    {
        email: 'ana@example.com',
        name: 'Dra. Ana Silva',
        role: 'professor',
        bio: 'Pesquisadora em física teórica com foco em mecânica quântica e teoria de campos.',
        institution: 'USP — Instituto de Física',
        field: 'physics',
        verified: true,
        avatarUrl: 'https://placehold.co/200x200/a78bfa/ffffff?text=AS',
        profilePic: 'https://placehold.co/40x40/a78bfa/ffffff?text=AS',
    },
    {
        email: 'carlos@example.com',
        name: 'Prof. Carlos Mendes',
        role: 'professor',
        bio: 'Professor de biologia, especialista em ecologia e sustentabilidade ambiental.',
        institution: 'UFRJ — Departamento de Ecologia',
        field: 'biology',
        verified: true,
        avatarUrl: 'https://placehold.co/200x200/4ade80/ffffff?text=CM',
        profilePic: 'https://placehold.co/40x40/4ade80/ffffff?text=CM',
    },
    {
        email: 'revista@example.com',
        name: 'Revista BioTech',
        role: 'revista',
        bio: 'Publicação científica focada em biotecnologia e engenharia genética.',
        institution: 'BioTech Publicações',
        field: 'biology',
        verified: true,
        avatarUrl: 'https://placehold.co/200x200/fcd34d/ffffff?text=RB',
        profilePic: 'https://placehold.co/40x40/fcd34d/ffffff?text=RB',
    },
    {
        email: 'aluno1@example.com',
        name: 'Bruno Costa',
        role: 'aluno',
        bio: 'Estudante de graduação em física, interessado em divulgação científica.',
        institution: 'UNICAMP',
        field: 'physics',
        verified: false,
        avatarUrl: 'https://placehold.co/200x200/3b82f6/ffffff?text=BC',
        profilePic: 'https://placehold.co/40x40/3b82f6/ffffff?text=BC',
    },
    {
        email: 'aluno2@example.com',
        name: 'Marina Lopes',
        role: 'aluno',
        bio: 'Estudante de biotecnologia. Curiosa por edição gênica e bioética.',
        institution: 'UFMG',
        field: 'biology',
        verified: false,
        avatarUrl: 'https://placehold.co/200x200/3b82f6/ffffff?text=ML',
        profilePic: 'https://placehold.co/40x40/3b82f6/ffffff?text=ML',
    },
    {
        email: 'test@example.com',
        name: 'Usuário Teste',
        role: 'aluno',
        bio: 'Conta para testes manuais.',
        institution: null,
        field: null,
        verified: false,
        avatarUrl: 'https://placehold.co/200x200/3b82f6/ffffff?text=UT',
        profilePic: 'https://placehold.co/40x40/3b82f6/ffffff?text=UT',
    },
];

const postsData = [
    {
        authorEmail: 'ana@example.com',
        title: 'Desvendando a Física Quântica',
        image: 'fisica-quantica.jpg',
        abstract: 'Este artigo apresenta uma introdução acessível aos princípios fundamentais da mecânica quântica, abordando superposição, entrelaçamento e o princípio da incerteza de Heisenberg, além de discutir implicações para a computação quântica.',
        fullContent: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia. Este artigo explora conceitos como superposição, entrelaçamento e o princípio da incerteza de Heisenberg, explicando como esses fenómenos bizarros moldam a realidade a nível subatómico e as suas implicações para tecnologias futuras, como a computação quântica.',
        simplifiedSnippet: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia.',
        keywords: ['mecânica quântica', 'superposição', 'entrelaçamento', 'incerteza', 'computação quântica'],
        doi: '10.5281/edugram.2026.0001',
        references: 'HEISENBERG, W. Physics and Philosophy. 1958.\nGRIFFITHS, D. J. Introduction to Quantum Mechanics. 3rd ed. 2018.\nNIELSEN, M. A.; CHUANG, I. L. Quantum Computation and Quantum Information. 2010.',
        category: 'physics',
        subcategory: 'quantum_mechanics',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        authorEmail: 'revista@example.com',
        title: 'Engenharia Genética: O Futuro da Medicina',
        image: 'engenharia-genetica.jpg',
        abstract: 'Revisão sobre os avanços recentes em edição genética, com foco na tecnologia CRISPR-Cas9 e suas aplicações no tratamento de doenças genéticas como fibrose cística e anemia falciforme.',
        fullContent: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas. A tecnologia CRISPR-Cas9, em particular, abriu portas para a correção de mutações genéticas e a criação de terapias inovadoras para condições como a fibrose cística e a anemia falciforme.',
        simplifiedSnippet: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas.',
        keywords: ['CRISPR-Cas9', 'edição gênica', 'terapia genética', 'medicina', 'biotecnologia'],
        doi: '10.5281/edugram.2026.0002',
        references: 'DOUDNA, J. A.; CHARPENTIER, E. The new frontier of genome engineering with CRISPR-Cas9. Science, 2014.\nJINEK, M. et al. A programmable dual-RNA-guided DNA endonuclease. Science, 2012.',
        category: 'biology',
        subcategory: 'genetics',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        authorEmail: 'carlos@example.com',
        title: 'A Importância da Sustentabilidade Ambiental',
        image: 'sustentabilidade.jpg',
        abstract: 'Análise dos principais desafios ambientais contemporâneos — crise climática, perda de biodiversidade e poluição — e discussão de soluções inovadoras para um futuro mais sustentável.',
        fullContent: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável. Este artigo aborda a crise climática, a perda de biodiversidade e a poluição.',
        simplifiedSnippet: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável.',
        keywords: ['sustentabilidade', 'mudança climática', 'biodiversidade', 'poluição', 'conservação'],
        doi: '10.5281/edugram.2026.0003',
        references: 'IPCC. Climate Change 2023: Synthesis Report. 2023.\nROCKSTRÖM, J. et al. A safe operating space for humanity. Nature, 2009.',
        category: 'biology',
        subcategory: 'ecology',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        authorEmail: 'ana@example.com',
        title: 'A Física das Partículas Subatômicas',
        image: 'subatomico.jpg',
        abstract: 'Visão geral das partículas fundamentais — quarks, léptons e bósons — e do papel do Grande Colisor de Hádrons (LHC) na investigação da estrutura da matéria.',
        fullContent: 'Este artigo oferece uma visão geral das partículas fundamentais, como quarks, léptons e bósons. Também discute o papel do Grande Colisor de Hádrons (LHC).',
        simplifiedSnippet: 'Qual o papel do Grande Colisor de Hádrons (LHC) e as partículas fundamentais.',
        keywords: ['partículas subatômicas', 'quarks', 'léptons', 'bósons', 'LHC', 'modelo padrão'],
        doi: '10.5281/edugram.2026.0004',
        references: 'GRIFFITHS, D. Introduction to Elementary Particles. 2nd ed. 2008.\nATLAS Collaboration. Observation of a new particle. Physics Letters B, 2012.',
        category: 'physics',
        subcategory: 'quantum_mechanics',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
];

// alunos seguem professores/revista; um professor segue outro
const followsData = [
    { follower: 'aluno1@example.com', following: 'ana@example.com' },
    { follower: 'aluno1@example.com', following: 'carlos@example.com' },
    { follower: 'aluno2@example.com', following: 'carlos@example.com' },
    { follower: 'aluno2@example.com', following: 'revista@example.com' },
    { follower: 'carlos@example.com', following: 'ana@example.com' },
];

// test@example.com tem centralidade total: segue todo mundo e é seguido por todos.
const TEST_EMAIL = 'test@example.com';
for (const u of users) {
    if (u.email === TEST_EMAIL) continue;
    followsData.push({ follower: TEST_EMAIL, following: u.email });
    followsData.push({ follower: u.email, following: TEST_EMAIL });
}

// (email, titlePrefix) — match por prefixo de título já existente
const likesData = [
    { user: 'aluno1@example.com', titlePrefix: 'Desvendando' },
    { user: 'aluno1@example.com', titlePrefix: 'A Física das Partículas' },
    { user: 'aluno2@example.com', titlePrefix: 'Engenharia Genética' },
    { user: 'aluno2@example.com', titlePrefix: 'A Importância' },
    { user: 'test@example.com', titlePrefix: 'Desvendando' },
    { user: 'carlos@example.com', titlePrefix: 'Desvendando' },
];

const quizAttemptsData = [
    {
        user: 'aluno1@example.com',
        quizSlug: 'physics-basics',
        score: 8,
        totalQuestions: 10,
        finishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        user: 'aluno1@example.com',
        quizSlug: 'quantum-intro',
        score: 7,
        totalQuestions: 10,
        finishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    },
    {
        user: 'aluno2@example.com',
        quizSlug: 'genetics-intro',
        score: 9,
        totalQuestions: 10,
        finishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
];

async function seedUsers() {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    for (const u of users) {
        await prisma.user.upsert({
            where: { email: u.email },
            update: {
                name: u.name,
                role: u.role,
                bio: u.bio,
                avatarUrl: u.avatarUrl,
                profilePic: u.profilePic,
                institution: u.institution,
                field: u.field,
                verified: u.verified,
            },
            create: {
                email: u.email,
                passwordHash,
                name: u.name,
                role: u.role,
                bio: u.bio,
                avatarUrl: u.avatarUrl,
                profilePic: u.profilePic,
                institution: u.institution,
                field: u.field,
                verified: u.verified,
            },
        });
        console.log(`✓ user: ${u.email}`);
    }
}

async function seedPosts() {
    for (const p of postsData) {
        const author = await prisma.user.findUniqueOrThrow({ where: { email: p.authorEmail } });

        // posts não têm unique natural; busca por (authorId, title) para idempotência
        const existing = await prisma.post.findFirst({
            where: { authorId: author.id, title: p.title },
        });

        const data = {
            authorId: author.id,
            author: author.name,
            profilePic: author.profilePic || '',
            title: p.title,
            image: p.image,
            abstract: p.abstract,
            fullContent: p.fullContent,
            simplifiedSnippet: p.simplifiedSnippet,
            keywords: p.keywords || [],
            doi: p.doi,
            references: p.references,
            category: p.category,
            subcategory: p.subcategory,
            createdAt: p.createdAt,
        };

        if (existing) {
            await prisma.post.update({ where: { id: existing.id }, data });
            console.log(`✓ post (updated): ${p.title}`);
        } else {
            await prisma.post.create({ data });
            console.log(`✓ post (created): ${p.title}`);
        }
    }
}

async function seedFollows() {
    for (const f of followsData) {
        const follower = await prisma.user.findUniqueOrThrow({ where: { email: f.follower } });
        const following = await prisma.user.findUniqueOrThrow({ where: { email: f.following } });
        await prisma.follow.upsert({
            where: {
                followerId_followingId: { followerId: follower.id, followingId: following.id },
            },
            update: {},
            create: { followerId: follower.id, followingId: following.id },
        });
    }
    console.log(`✓ follows: ${followsData.length}`);
}

async function seedLikes() {
    for (const l of likesData) {
        const user = await prisma.user.findUniqueOrThrow({ where: { email: l.user } });
        const post = await prisma.post.findFirst({
            where: { title: { startsWith: l.titlePrefix } },
        });
        if (!post) {
            console.warn(`! post not found for prefix: ${l.titlePrefix}`);
            continue;
        }
        await prisma.postLike.upsert({
            where: { postId_userId: { postId: post.id, userId: user.id } },
            update: {},
            create: { postId: post.id, userId: user.id },
        });
    }
    console.log(`✓ likes: ${likesData.length}`);
}

async function seedQuizAttempts() {
    for (const q of quizAttemptsData) {
        const user = await prisma.user.findUniqueOrThrow({ where: { email: q.user } });
        // idempotência: 1 attempt por (user, quizSlug, finishedAt)
        const existing = await prisma.quizAttempt.findFirst({
            where: { userId: user.id, quizSlug: q.quizSlug, finishedAt: q.finishedAt },
        });
        if (existing) continue;
        await prisma.quizAttempt.create({
            data: {
                userId: user.id,
                quizSlug: q.quizSlug,
                score: q.score,
                totalQuestions: q.totalQuestions,
                finishedAt: q.finishedAt,
            },
        });
    }
    console.log(`✓ quiz attempts: ${quizAttemptsData.length}`);
}

async function recalcCounters() {
    const allUsers = await prisma.user.findMany();
    for (const user of allUsers) {
        const [followersCount, followingCount, postsCount, attempts] = await Promise.all([
            prisma.follow.count({ where: { followingId: user.id } }),
            prisma.follow.count({ where: { followerId: user.id } }),
            prisma.post.count({ where: { authorId: user.id } }),
            prisma.quizAttempt.findMany({
                where: { userId: user.id, finishedAt: { not: null } },
                select: { score: true, quizSlug: true },
            }),
        ]);
        const quizPoints = attempts.reduce((sum, a) => sum + a.score, 0);
        const quizzesCompleted = new Set(attempts.map((a) => a.quizSlug)).size;

        await prisma.user.update({
            where: { id: user.id },
            data: { followersCount, followingCount, postsCount, quizPoints, quizzesCompleted },
        });
    }

    const allPosts = await prisma.post.findMany({ select: { id: true } });
    for (const post of allPosts) {
        const likesCount = await prisma.postLike.count({ where: { postId: post.id } });
        await prisma.post.update({ where: { id: post.id }, data: { likesCount } });
    }
    console.log(`✓ counters recalculated (users: ${allUsers.length}, posts: ${allPosts.length})`);
}

async function main() {
    console.log('Start seeding ...');
    await seedUsers();
    await seedPosts();
    await seedFollows();
    await seedLikes();
    await seedQuizAttempts();
    await recalcCounters();
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
