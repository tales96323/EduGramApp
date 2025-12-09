const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const posts = [
    {
        author: 'Dr. Ana Silva',
        profilePic: 'https://placehold.co/40x40/a78bfa/ffffff?text=AS',
        title: 'Desvendando a Física Quântica',
        image: 'fisica-quantica.jpg',
        fullContent: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia. Este artigo explora conceitos como superposição, entrelaçamento e o princípio da incerteza de Heisenberg, explicando como esses fenómenos bizarros moldam a realidade a nível subatómico e as suas implicações para tecnologias futuras, como a computação quântica. Para entender a física quântica, é essencial mergulhar nas suas raízes históricas, desde as primeiras teorias de Max Planck e Albert Einstein até o desenvolvimento da mecânica matricial e da mecânica ondulatória por Werner Heisenberg e Erwin Schrödinger, respetivamente. A superposição, um dos conceitos mais contraintuitivos, descreve a capacidade de uma partícula existir em múltiplos estados simultaneamente até que seja observada. O entrelaçamento, por sua vez, liga o destino de duas ou mais partículas, independentemente da distância que as separa, de modo que a medição do estado de uma afeta instantaneamente o estado da outra. Estes conceitos não são apenas curiosidades teóricas; eles são a base para o desenvolvimento de tecnologias revolucionárias, como computadores quânticos, que prometem resolver problemas complexos que estão além das capacidades dos computadores clássicos, e novas formas de criptografia inquebrável, conhecida como criptografia quântica. Além disso, a física quântica desempenha um papel crucial na compreensão de fenómenos em diversas áreas da ciência, desde a estrutura atómica e molecular até o comportamento de materiais em temperaturas extremamente baixas, e a forma como a luz interage com a matéria.',
        simplifiedSnippet: 'Uma introdução aos princípios fundamentais da mecânica quântica e suas aplicações no dia a dia. Este artigo explora conceitos como superposição, entrelaçamento e o princípio da incerteza de Heisenberg, explicando como esses fenómenos bizarros moldam a realidade a nível subatómico e as suas implicações para tecnologias futuras, como a computação quântica.',
        likes: 1224,
        comments: 132,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
        isSimplifying: false,
    },
    {
        author: 'Revista BioTech',
        profilePic: 'https://placehold.co/40x40/fcd34d/ffffff?text=RB',
        title: 'Engenharia Genética: O Futuro da Medicina',
        image: 'engenharia-genetica.jpg',
        fullContent: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas. A tecnologia CRISPR-Cas9, em particular, abriu portas para a correção de mutações genéticas e a criação de terapias inovadoras para condições como a fibrose cística e a anemia falciforme, prometendo um futuro onde doenças hereditárias podem ser curadas na sua origem. A edição genética, especialmente com a ferramenta CRISPR-Cas9, tem o potencial de transformar radicalmente a medicina. Esta técnica permite aos cientistas editar com precisão o ADN, removendo, adicionando ou alterando sequências genéticas específicas. Isso significa que podemos, em teoria, corrigir mutações genéticas que causam doenças hereditárias graves. Além das aplicações em doenças genéticas, a engenharia genética está a ser explorada para desenvolver novas terapias contra o cancro, criar culturas mais resistentes a pragas e doenças, e até mesmo para a produção de biocombustíveis. No entanto, o rápido avanço desta tecnologia levanta importantes questões éticas e sociais sobre a sua aplicação, a segurança e as implicações a longo prazo para a humanidade e o meio ambiente.',
        simplifiedSnippet: 'Avanços recentes na edição de genes e como eles estão revolucionando o tratamento de doenças genéticas. A tecnologia CRISPR-Cas9, em particular, abriu portas para a correção de mutações genéticas e a criação de terapias inovadoras para condições como a fibrose cística e a anemia falciforme, prometendo um futuro onde doenças hereditárias podem ser curadas na sua origem.',
        likes: 2819,
        comments: 178,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5h ago
        isSimplifying: false,
    },
    {
        author: 'Prof. Carlos Mendes',
        profilePic: 'https://placehold.co/40x40/4ade80/ffffff?text=CM',
        title: 'A Importância da Sustentabilidade Ambiental',
        image: 'sustentabilidade.jpg',
        fullContent: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável. Este artigo aborda a crise climática, a perda de biodiversidade e a poluição, destacando a necessidade urgente de transição para energias renováveis, economia circular e práticas agrícolas sustentáveis para proteger o nosso planeta para as futuras gerações. A sustentabilidade ambiental é um pilar fundamental para o bem-estar do planeta e das futuras gerações. Enfrentamos desafios prementes como as alterações climáticas, impulsionadas pela emissão de gases de efeito estufa, a rápida perda de biodiversidade devido à destruição de habitats e a poluição do ar, da água e do solo. Para combater esses problemas, é crucial adotar soluções como a transição energética para fontes renováveis (solar, eólica), a implementação de uma economia circular que minimize o desperdício, e a promoção de práticas agrícolas que preservem os ecossistemas e a fertilidade do solo. A educação ambiental e o engajamento da comunidade também desempenham um papel vital na construção de um futuro mais equilibrado e resiliente, onde o desenvolvimento humano coexista harmoniosamente com a natureza.',
        simplifiedSnippet: 'Explorando os desafios ambientais atuais e soluções inovadoras para um futuro mais sustentável. Este artigo aborda a crise climática, a perda de biodiversidade e a poluição, destacando a necessidade urgente de transição para energias renováveis, economia circular e práticas agrícolas sustentáveis para proteger o nosso planeta para as futuras gerações.',
        likes: 980,
        comments: 115,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isSimplifying: false,
    },
    {
        author: 'Instituto Astronomia BR',
        profilePic: 'https://placehold.co/40x40/60a5fa/ffffff?text=AB',
        title: 'Explorando os Segredos dos Buracos Negros',
        image: 'astronomia-br.jpg',
        fullContent: 'Buracos negros são uma das entidades mais misteriosas do universo. Este artigo explora como eles se formam, sua relação com a relatividade geral, e como estão ligados à evolução galáctica. Também abordamos as descobertas recentes do telescópio Event Horizon e as implicações para a física teórica.',
        simplifiedSnippet: 'Buracos negros são entidades misteriosas que desafiam a física moderna. Descubra como se formam e por que são tão importantes para a compreensão do universo.',
        likes: 1560,
        comments: 89,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
        isSimplifying: false,
    },
    {
        author: 'Dra. Luiza Torres',
        profilePic: 'https://placehold.co/40x40/f472b6/ffffff?text=LT',
        title: 'Inteligência Artificial na Medicina Moderna',
        image: 'medicina-ia.jpg',
        fullContent: 'A inteligência artificial está a transformar diagnósticos, terapias personalizadas e a gestão hospitalar. Este artigo analisa aplicações práticas, desafios éticos e o futuro promissor da IA na medicina.',
        simplifiedSnippet: 'A IA está revolucionando a medicina com diagnósticos mais precisos e tratamentos personalizados. Saiba como essa tecnologia está sendo aplicada nos hospitais.',
        likes: 2143,
        comments: 142,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8h ago
        isSimplifying: false,
    },
    {
        author: 'Ecologia Global',
        profilePic: 'https://placehold.co/40x40/34d399/ffffff?text=EG',
        title: 'Oceanos em Risco: A Realidade da Poluição Marinha',
        image: 'oceanos-risco.jpg',
        fullContent: 'Os oceanos enfrentam uma crise sem precedentes com toneladas de plástico, derrames de petróleo e mudanças climáticas afetando ecossistemas frágeis. Este artigo examina as principais causas e propõe ações urgentes para reverter esse cenário.',
        simplifiedSnippet: 'A poluição marinha ameaça a vida nos oceanos. Entenda as causas e o que podemos fazer para proteger esse ecossistema vital.',
        likes: 1875,
        comments: 99,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12h ago
        isSimplifying: false,
    },
    {
        author: 'NeuroLab Brasil',
        profilePic: 'https://placehold.co/40x40/818cf8/ffffff?text=NB',
        title: 'O Cérebro Humano e a Consciência',
        image: 'conciencia.jpg',
        fullContent: 'Pesquisas em neurociência estão desvendando os mecanismos por trás da consciência humana. Este artigo explora as regiões cerebrais envolvidas, as teorias contemporâneas e os experimentos mais avançados da área.',
        simplifiedSnippet: 'Como a consciência surge no cérebro? Veja as descobertas mais recentes da neurociência sobre esse grande mistério.',
        likes: 1624,
        comments: 78,
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14h ago
        isSimplifying: false,
    },
    {
        author: 'Revista Pesquisa FAPESP',
        profilePic: 'https://placehold.co/40x40/f87171/ffffff?text=CF',
        title: 'Mudanças Climáticas: Impactos Visíveis',
        image: 'sustentabilidade.jpg',
        fullContent: 'As mudanças climáticas não são mais uma previsão futura — já estão afetando nosso dia a dia. De eventos extremos à elevação dos mares, este artigo analisa dados científicos e as implicações para políticas públicas.',
        simplifiedSnippet: 'As mudanças climáticas estão em curso. Conheça os sinais visíveis e o que a ciência propõe para enfrentá-las.',
        likes: 2093,
        comments: 123,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isSimplifying: false,
    },
    {
        author: 'Dra. Marina Farias',
        profilePic: 'https://placehold.co/40x40/38bdf8/ffffff?text=MF',
        title: 'A Física das Partículas Subatômicas',
        image: 'subatomico.jpg',
        fullContent: 'Este artigo oferece uma visão geral das partículas fundamentais, como quarks, léptons e bósons. Também discute o papel do Grande Colisor de Hádrons (LHC) e as descobertas recentes que desafiam o Modelo Padrão.',
        simplifiedSnippet: 'Quarks, léptons e o LHC: entenda como a física de partículas está revolucionando nosso entendimento do universo.',
        likes: 1345,
        comments: 66,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        isSimplifying: false,
    },
    {
        author: 'Revista Ciência e Sociedade',
        profilePic: 'https://placehold.co/40x40/c084fc/ffffff?text=CS',
        title: 'Tecnologia e Ética: Dilemas do Século XXI',
        image: 'tec-etica.jpg',
        fullContent: 'Com o avanço acelerado da tecnologia, surgem dilemas éticos sobre privacidade, vigilância, automação e bioética. Este artigo discute os principais debates e a importância de uma abordagem responsável.',
        simplifiedSnippet: 'Avanços tecnológicos trazem grandes benefícios — e dilemas éticos. Veja como a sociedade está lidando com questões como privacidade e IA.',
        likes: 1980,
        comments: 101,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        isSimplifying: false,
    }
];

async function main() {
    console.log('Start seeding ...');
    for (const post of posts) {
        const createdPost = await prisma.post.create({
            data: post,
        });
        console.log(`Created post with id: ${createdPost.id}`);
    }
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
