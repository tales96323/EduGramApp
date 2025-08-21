const { Pool } = require('pg');

// Configuração do banco PostgreSQL local
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = pool;


// Função para buscar dados da árvore do conhecimento
async function fetchKnowledgeTree() {
  try {
    // Buscar todos os nós
    const nodesResult = await pool.query(`
      SELECT id, slug, label, color, icon, parent_id, order_index 
      FROM knowledge_nodes 
      ORDER BY order_index
    `);
    
    // Buscar todos os artigos
    const articlesResult = await pool.query(`
      SELECT id, slug, node_id, title, snippet 
      FROM articles 
      ORDER BY id
    `);
    
    const nodes = nodesResult.rows;
    const articles = articlesResult.rows;
    
    // Criar mapa de ID para nó
    const idToNode = new Map();
    nodes.forEach(node => {
      idToNode.set(node.id, {
        id: node.slug,
        label: node.label,
        color: node.color,
        icon: node.icon,
        children: [],
        articles: []
      });
    });
    
    // Adicionar artigos aos nós
    articles.forEach(article => {
      const node = idToNode.get(article.node_id);
      if (node) {
        node.articles.push({
          id: article.slug || article.id.toString(),
          title: article.title,
          snippet: article.snippet
        });
      }
    });
    
    // Construir hierarquia
    const roots = [];
    nodes.forEach(node => {
      const nodeObj = idToNode.get(node.id);
      
      if (node.parent_id) {
        const parent = idToNode.get(node.parent_id);
        if (parent) {
          parent.children.push(nodeObj);
        }
      } else {
        roots.push(nodeObj);
      }
    });
    
    // Remover arrays vazios para manter compatibilidade
    const cleanEmptyArrays = (node) => {
      if (node.children && node.children.length === 0) {
        delete node.children;
      } else if (node.children) {
        node.children.forEach(cleanEmptyArrays);
      }
    };
    
    roots.forEach(cleanEmptyArrays);
    
    return roots;
  } catch (error) {
    console.error('Erro ao buscar dados do banco:', error);
    throw error;
  }
}

// Função para buscar um nó específico
async function fetchNodeBySlug(slug) {
  try {
    const result = await pool.query(
      'SELECT * FROM knowledge_nodes WHERE slug = $1',
      [slug]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao buscar nó:', error);
    throw error;
  }
}

// Função para buscar artigos de um nó
async function fetchArticlesByNodeId(nodeId) {
  try {
    const result = await pool.query(
      'SELECT * FROM articles WHERE node_id = $1',
      [nodeId]
    );
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    throw error;
  }
}

module.exports = {
  pool,
  fetchKnowledgeTree,
  fetchNodeBySlug,
  fetchArticlesByNodeId
};