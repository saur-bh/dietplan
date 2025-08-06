import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map(item => item.str).join(' ');
      fullText += textItems + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

export const extractTextFromMarkdown = async (file) => {
  try {
    const text = await file.text();
    // Basic markdown cleanup - remove common markdown syntax
    return text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\*{1,2}(.*?)\*{1,2}/g, '$1') // Remove bold/italic
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
      .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s/gm, '') // Remove numbered list markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .trim();
  } catch (error) {
    console.error('Error extracting text from Markdown:', error);
    throw new Error('Failed to extract text from Markdown');
  }
};

export const processUploadedFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPDF(file);
  } else if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
    return await extractTextFromMarkdown(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await file.text();
  } else {
    throw new Error('Unsupported file type. Please upload PDF, Markdown (.md), or text files.');
  }
};