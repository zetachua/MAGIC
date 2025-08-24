// rag.js
import fs from 'fs/promises';
import path from 'path';
import { PDFExtract } from 'pdf.js-extract';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

// Path to PDF
const pdfPath = path.resolve('./data/mentor_book.pdf'); // adjust to actual path

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY});

// Placeholder embeddings: simple TF-IDF style for local use
class SimpleEmbeddings {
  async embedDocuments(documents) {
    // For each chunk, return a dummy embedding
    return documents.map((doc) => Array(384).fill(Math.random()));
  }

  async embedQuery(query) {
    return Array(384).fill(Math.random());
  }
}

const embeddings = new SimpleEmbeddings();

// Vector store
let vectorStore = null;

// Initialize RAG: parse PDF, split text, store embeddings
export async function initializeRAG() {
  try {
    const pdfExtract = new PDFExtract();
    const data = await pdfExtract.extract(pdfPath);
    const text = data.pages
      .map(page => page.content.map(item => item.str).join(' '))
      .join('\n')
      .replace(/\s+/g, ' ')
      .trim();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([text]);
    vectorStore = await FaissStore.fromDocuments(docs, embeddings);
    console.log('✅ RAG initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing RAG:', error);
    throw error;
  }
}

// Query RAG
export async function queryRAG(question, chatHistory = []) {
  if (!vectorStore) throw new Error('RAG not initialized');

  try {
    const retriever = vectorStore.asRetriever({ k: 3 });
    const relevantDocs = await retriever.getRelevantDocuments(question);
    const context = relevantDocs.map((doc) => doc.pageContent).join('\n\n');

  const systemPrompt = `
    You are Cindy Tan, answering as your digital twin based on your book "Career MAGIC: Finding Your Own Spark". Speak in the first person, using "I" and avoiding any third-person references such as "she" or "Cindy". 
    Your tone should be warm, encouraging, ambitious enthusiasm and insightful, reflecting the way you write in the book. 
    Use the following context to guide your answers, and respond authentically in your voice:

    ${context}

    If the context does not fully cover the question, answer in a way that is consistent with your philosophy and style in the book. 
    Share personal insights, examples, and guidance as if you are speaking directly to the reader.
    Answer in a concise manner, ideally within 200 words.
    `;

    const validChatHistory = Array.isArray(chatHistory) ? chatHistory : [];

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...validChatHistory,
        { role: 'user', content: question },
      ],
      model: 'Deepseek-R1-Distill-Llama-70b',
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('❌ Error querying RAG:', error);
    throw error;
  }
}
