#!/usr/bin/env node
/**
 * Unkie The Stock Junkie - Article Generator
 * 
 * Generates educational investing articles using NVIDIA's free Llama 3.1 70B API
 * and creates custom illustrations using NVIDIA's FLUX.1-schnell image generation.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const TOPICS_FILE = path.join(__dirname, '..', 'topics.json');
const GENERATED_TOPICS_FILE = path.join(__dirname, '..', 'generated-topics.json');
const ARTICLES_DIR = path.join(__dirname, '..', '_articles');
const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images', 'articles');
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

// Ensure directories exist
if (!fs.existsSync(ARTICLES_DIR)) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Utility: Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility: Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Utility: Format date for filename
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Utility: Load topics
function loadTopics() {
  try {
    const data = fs.readFileSync(TOPICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading topics:', error.message);
    process.exit(1);
  }
}

// Utility: Load generated topics tracking
function loadGeneratedTopics() {
  try {
    const data = fs.readFileSync(GENERATED_TOPICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { generated: [], lastReset: new Date().toISOString() };
  }
}

// Utility: Save generated topics tracking
function saveGeneratedTopics(data) {
  fs.writeFileSync(GENERATED_TOPICS_FILE, JSON.stringify(data, null, 2));
}

// Utility: Check if article already exists
function articleExists(topic) {
  const slug = generateSlug(topic.title);
  const files = fs.readdirSync(ARTICLES_DIR);
  return files.some(file => file.includes(slug));
}

// Utility: Select unused topic
function selectUnusedTopic(topics, generated) {
  // Filter out topics already in tracking AND topics with existing files
  const unused = topics.filter(topic => {
    const inTracking = !generated.includes(topic.title);
    const fileExists = articleExists(topic);
    return inTracking && !fileExists;
  });

  if (unused.length === 0) {
    console.log('⚠️ All topics have been generated. Resetting tracking file...');
    return { topic: topics[0], reset: true };
  }

  // Random selection
  const randomIndex = Math.floor(Math.random() * unused.length);
  return { topic: unused[randomIndex], reset: false };
}

// Utility: Generate image using NVIDIA FLUX.1-schnell with fallback to dev
async function generateImage(topic) {
  if (!NVIDIA_API_KEY) {
    console.log('⚠️ No NVIDIA_API_KEY found. Skipping image generation.');
    return null;
  }

  const imagePrompt = generateImagePrompt(topic);
  
  // Try FLUX.1-schnell first (faster, 4 steps)
  try {
    console.log('🎨 Generating illustration with FLUX.1-schnell...');
    
    const response = await axios.post(
      'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-schnell',
      {
        prompt: imagePrompt,
        width: 1024,
        height: 1024,
        seed: Math.floor(Math.random() * 1000000),
        steps: 4
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 60000
      }
    );

    let imageData = extractImageData(response.data);
    if (imageData) {
      return saveImage(imageData, topic);
    }
    
    console.log('⚠️ Schnell returned no image, trying dev variant...');
  } catch (error) {
    console.log('⚠️ Schnell failed, trying dev variant...');
    console.log('  Error:', error.message);
  }
  
  // Fallback to FLUX.1-dev (higher quality, 28 steps)
  try {
    console.log('🎨 Trying FLUX.1-dev...');
    
    const response = await axios.post(
      'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev',
      {
        prompt: imagePrompt,
        width: 1024,
        height: 1024,
        seed: Math.floor(Math.random() * 1000000),
        steps: 28
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 120000 // Longer timeout for dev variant
      }
    );

    let imageData = extractImageData(response.data);
    if (imageData) {
      console.log('✅ Image generated with dev variant');
      return saveImage(imageData, topic);
    }
  } catch (error) {
    console.error('❌ Both schnell and dev failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }

  return null;
}

// Helper: Extract image data from various API response formats
function extractImageData(data) {
  if (data && data.image) {
    return data.image;
  } else if (data && data.artifacts && data.artifacts.length > 0) {
    // FLUX API returns artifacts array with base64 images
    return data.artifacts[0].base64 || data.artifacts[0];
  }
  return null;
}

// Helper: Save image to disk
function saveImage(imageData, topic) {
  const imageBuffer = Buffer.from(imageData, 'base64');
  const imageFileName = `${generateSlug(topic.title)}-${Date.now()}.jpg`;
  const imagePath = path.join(IMAGES_DIR, imageFileName);

  fs.writeFileSync(imagePath, imageBuffer);
  console.log(`✅ Image generated: ${imageFileName}`);

  return `/assets/images/articles/${imageFileName}`;
}

// Utility: Generate image prompt
function generateImagePrompt(topic) {
  const basePrompt = "Modern minimalist editorial illustration, flat design style, vibrant gradient background with blues and purples, clean geometric shapes, abstract financial concept visualization, professional stock market theme, flat vector art style, no text, high quality, suitable for educational blog header";
  
  const topicSpecific = {
    'warren-buffett': ' wise elderly investor silhouette, Berkshire Hathaway, value investing concept',
    'benjamin-graham': ' open book, margin of safety, security analysis',
    'peter-lynch': ' growth chart, upward trend, magnifying glass',
    'carl-icahn': ' activist investor, chess piece strategy, corporate shakeup',
    'stocks': ' stock chart, upward trend, financial growth',
    'dividends': ' money flowing, passive income, wealth building',
    'compound-interest': ' exponential growth curve, time and money concept',
    'risk': ' balanced scale, risk vs reward visualization',
    'diversification': ' pie chart, portfolio balance, multiple assets',
    'market-crash': ' market dip, recovery, resilience concept'
  };
  
  // Find matching keyword in tags
  let specific = '';
  for (const [keyword, description] of Object.entries(topicSpecific)) {
    if (topic.tags.includes(keyword)) {
      specific = description;
      break;
    }
  }
  
  return `${basePrompt}${specific}`;
}

// Utility: Generate article content using NVIDIA Llama 3.1 70B
async function generateArticleContent(topic) {
  if (!NVIDIA_API_KEY) {
    console.error('❌ NVIDIA_API_KEY not set!');
    console.error('Get a free API key at https://build.nvidia.com/');
    process.exit(1);
  }

  const prompt = generateArticlePrompt(topic);
  
  try {
    console.log('📝 Generating article content...');
    
    const response = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an expert financial educator writing for teenagers aged 13-18. Your tone is friendly, encouraging, and educational. You explain complex investing concepts in simple terms with real-world examples. You emphasize that investing involves risk and this is educational content only, not financial advice."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 4096,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 120000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Unexpected response format from NVIDIA API');
    }
  } catch (error) {
    console.error('❌ Error generating content:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Utility: Generate article prompt
function generateArticlePrompt(topic) {
  const difficultyNote = {
    'beginner': 'Keep it simple with basic concepts and definitions. Use analogies teens can relate to.',
    'intermediate': 'Build on basic knowledge with more detail and real-world examples.',
    'advanced': 'Go deeper with technical concepts, metrics, and sophisticated strategies.'
  }[topic.difficulty] || 'Use appropriate level of detail.';

  const investorContext = topic.tags.includes('warren-buffett') 
    ? ' Include Warren Buffett\'s perspective and examples from his investment philosophy.'
    : topic.tags.includes('benjamin-graham')
    ? ' Include Benjamin Graham\'s teachings and margin of safety principles.'
    : topic.tags.includes('peter-lynch')
    ? ' Include Peter Lynch\'s growth investing approach and "invest in what you know" philosophy.'
    : topic.tags.includes('carl-icahn')
    ? ' Include Carl Icahn\'s activist investing strategies.'
    : '';

  return `Write a comprehensive educational article about: "${topic.title}"

Target audience: Teenagers aged 13-18 who are learning about investing.
Difficulty level: ${topic.difficulty}
${difficultyNote}${investorContext}

Structure the article with these sections:
1. Introduction - Hook the reader and explain why this matters
2. What Is It? - Clear definition and explanation
3. Why Should Teens Care? - Connect to their life and future
4. Key Concepts - Break down the main ideas with examples
5. Real-World Examples - Actual companies, situations, or scenarios
6. Try It Yourself - A hands-on activity or exercise
7. Key Takeaways - Bullet points summarizing the main lessons
8. Further Reading - 3-5 resources for learning more

Important guidelines:
- Use friendly, encouraging tone like a cool uncle explaining things
- Include at least one teen-relatable analogy or example
- Emphasize that investing involves risk
- Add "Not financial advice" disclaimer
- Include "difficulty: ${topic.difficulty}" in front matter
- Include these tags: ${topic.tags.join(', ')}
- Write 800-1200 words
- Use markdown formatting with headers
- Keep paragraphs short (2-4 sentences)`;
}

// Utility: Parse AI response into structured article
function parseArticleContent(content, topic) {
  // Extract sections
  const sections = {
    introduction: '',
    whatIsIt: '',
    whyCare: '',
    keyConcepts: '',
    realWorld: '',
    tryIt: '',
    takeaways: [],
    furtherReading: []
  };

  // Simple parsing - you may need to adjust based on actual AI output
  const lines = content.split('\n');
  let currentSection = 'introduction';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed.match(/^(#{1,3}\s*)?(What Is|What is)/i)) {
      currentSection = 'whatIsIt';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Why|Why Should|Why do)/i)) {
      currentSection = 'whyCare';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Key|Concepts|Main|Understanding)/i)) {
      currentSection = 'keyConcepts';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Real[- ]?World|Examples|Case)/i)) {
      currentSection = 'realWorld';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Try|Activity|Exercise|Hands)/i)) {
      currentSection = 'tryIt';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Takeaway|Summary|Key Points)/i)) {
      currentSection = 'takeaways';
      continue;
    }
    if (trimmed.match(/^(#{1,3}\s*)?(Further|Resources|Read|Learn)/i)) {
      currentSection = 'furtherReading';
      continue;
    }
    
    if (trimmed) {
      if (currentSection === 'takeaways' && trimmed.startsWith('-')) {
        sections.takeaways.push(trimmed.replace(/^-\s*/, ''));
      } else if (currentSection === 'furtherReading' && trimmed.startsWith('-')) {
        sections.furtherReading.push(trimmed.replace(/^-\s*/, ''));
      } else {
        sections[currentSection] += line + '\n';
      }
    }
  }

  return sections;
}

// Utility: Generate markdown file
function generateMarkdownFile(topic, content, imagePath, date) {
  const sections = parseArticleContent(content, topic);
  const slug = generateSlug(topic.title);
  const formattedDate = formatDate(date);
  
  // Build markdown content
  let markdown = `---
layout: article
title: "${topic.title}"
description: "${topic.description}"
date: ${formattedDate}
difficulty: ${topic.difficulty}
tags: [${topic.tags.map(t => `"${t}"`).join(', ')}]
`;

  if (imagePath) {
    markdown += `image: "${imagePath}"
image_credit: "Generated by NVIDIA FLUX.1-schnell"
image_credit_url: "https://build.nvidia.com/black-forest-labs/flux_1-schnell"
`;
  }

  markdown += `---

`;

  // Build content
  markdown += content;

  return markdown;
}

// Main function
async function main() {
  console.log('🚀 Unkie The Stock Junkie - Article Generator');
  console.log('=============================================\n');

  // Check API key
  if (!NVIDIA_API_KEY) {
    console.error('❌ Error: NVIDIA_API_KEY environment variable not set!');
    console.error('\nTo get a free API key:');
    console.error('1. Visit https://build.nvidia.com/');
    console.error('2. Sign in or create a free account');
    console.error('3. Navigate to "meta/llama-3.1-70b-instruct"');
    console.error('4. Click "Get API Key" and copy it');
    console.error('\nThen run: export NVIDIA_API_KEY=your-key-here');
    process.exit(1);
  }

  // Load data
  console.log('📚 Loading topics...');
  const topics = loadTopics();
  const generatedData = loadGeneratedTopics();
  
  // Select topic
  console.log('🎲 Selecting topic...');
  const { topic, reset } = selectUnusedTopic(topics, generatedData.generated);
  
  if (reset) {
    generatedData.generated = [];
    generatedData.lastReset = new Date().toISOString();
  }
  
  console.log(`✅ Selected: "${topic.title}" (${topic.difficulty})`);
  console.log(`   Tags: ${topic.tags.join(', ')}\n`);

  // Generate image
  const imagePath = await generateImage(topic);
  
  // Wait a bit to respect rate limits
  await delay(2000);
  
  // Generate article
  const content = await generateArticleContent(topic);
  
  // Create markdown
  const date = new Date();
  const markdown = generateMarkdownFile(topic, content, imagePath, date);
  
  // Save file
  const slug = generateSlug(topic.title);
  const filename = `${formatDate(date)}-${slug}.md`;
  const filepath = path.join(ARTICLES_DIR, filename);
  
  fs.writeFileSync(filepath, markdown);
  console.log(`\n✅ Article saved: ${filename}`);
  
  // Update tracking
  generatedData.generated.push(topic.title);
  saveGeneratedTopics(generatedData);
  
  console.log('\n🎉 Article generation complete!');
  console.log(`📄 File: ${filepath}`);
  if (imagePath) {
    console.log(`🎨 Image: ${imagePath}`);
  }
  console.log(`\nNext steps:`);
  console.log(`1. Review the generated article`);
  console.log(`2. Make any manual edits if needed`);
  console.log(`3. Commit and push to trigger GitHub Pages deployment`);
}

// Run main
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});