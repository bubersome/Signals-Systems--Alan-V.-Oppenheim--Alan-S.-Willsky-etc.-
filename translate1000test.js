// 使用 import 语法代替 require
import fs from 'fs';
import path from 'path';
// 需要检查 @vitalets/google-translate-api 库是否支持 ESM 导入
// 如果库不支持直接导入，可能需要使用动态导入（import()）或查找替代方案
import { translate } from '@vitalets/google-translate-api';

const codeAndFormulaPattern = /(```.*?```|\$.*?\$)/gs;

async function translateText(text, targetLang = 'zh-cn') {
  try {
    const response = await translate(text, { to: targetLang });
    return response.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // 返回原文本以防翻译失败
  }
}

async function translateMarkdownContent(mdContent) {
  let translatedContent = '';
  const lines = mdContent.split('\n').slice(0, 1000);
  const limitedContent = lines.join('\n');
  const parts = limitedContent.split(codeAndFormulaPattern);

  for (const part of parts) {
    if (part.match(codeAndFormulaPattern)) {
      translatedContent += part;
    } else {
      const translatedPart = await translateText(part);
      translatedContent += translatedPart;
    }
  }

  return translatedContent;
}

async function processMarkdownFiles(folderPath) {
  const files = fs.readdirSync(folderPath);
  let allTranslatedContent = '';

  for (const filename of files) {
    if (filename.endsWith('.md')) {
      const filePath = path.join(folderPath, filename);
      const mdContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
      const translatedContent = await translateMarkdownContent(mdContent);
      allTranslatedContent += translatedContent + '\n\n';
    }
  }

  const newMdFilePath = path.join(folderPath, 'translated_md_file.md');
  fs.writeFileSync(newMdFilePath, allTranslatedContent, { encoding: 'utf-8' });
}

const folderPath = process.cwd(); // 获取当前工作目录
processMarkdownFiles(folderPath).then(() => console.log('Markdown files have been processed.'));
