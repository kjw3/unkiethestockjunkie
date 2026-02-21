# 🎯 Unkie The Stock Junkie

> Investing education for smart teens. Learn from the legends.

[![Built with Jekyll](https://img.shields.io/badge/Built%20with-Jekyll-CC0000.svg)](https://jekyllrb.com/)
[![Powered by NVIDIA](https://img.shields.io/badge/Powered%20by-NVIDIA-76B900.svg)](https://build.nvidia.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📚 What is This?

Unkie The Stock Junkie is an educational website that teaches teenagers about investing through:

- **Automated Daily Content**: New articles every day powered by AI
- **Legendary Investor Strategies**: Learn from Buffett, Graham, Lynch, and Icahn
- **Interactive Screeners**: Practice finding stocks using famous investor criteria
- **Teen-Friendly Explanations**: Complex concepts made simple

Built with the same technology as [forexample.ai](https://github.com/kjw3/forexample.ai) - a Jekyll site with automated content generation using NVIDIA's free AI APIs.

## 🚀 Live Site

Visit: **https://unkiethestockjunkie.com** (configure your domain)

## ✨ Features

### Content
- 📰 **100+ Curated Topics** covering investing basics to advanced strategies
- 🤖 **AI-Powered Articles** generated daily using NVIDIA Llama 3.1 70B
- 🎨 **Custom Illustrations** created with NVIDIA FLUX.1-schnell
- 📚 **Four Difficulty Levels** from beginner to advanced
- 🔗 **Cross-Referenced Content** related articles automatically linked

### Screeners
- 🎯 **Buffett Screener** - Wonderful companies at fair prices
- 📖 **Graham Screener** - Bargains with margin of safety
- 🚀 **Lynch Screener** - Growth at reasonable prices
- ⚡ **Icahn Screener** - Undervalued assets with potential

### Design
- 🎨 **Modern, Teen-Friendly Design** with dark/light mode
- 📱 **Fully Responsive** works on all devices
- ⚡ **Fast Performance** static site generation
- 🔍 **Search & Filter** find articles by difficulty or topic
- 🌙 **Dark Mode** easy on the eyes

## 🛠️ Technology Stack

- **Framework**: Jekyll (static site generator)
- **Hosting**: GitHub Pages (free)
- **Automation**: GitHub Actions
- **AI Content**: NVIDIA Llama 3.1 70B (free API)
- **AI Images**: NVIDIA FLUX.1-schnell (free API)
- **Styling**: Custom CSS with CSS variables
- **Deployment**: Automated via GitHub Actions

## 🏁 Quick Start

### Prerequisites

- Node.js 20 or higher
- Ruby (for Jekyll)
- A GitHub account
- Free NVIDIA API key ([get one here](https://build.nvidia.com/))

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/unkiethestockjunkie.git
cd unkiethestockjunkie
```

2. **Install Node.js dependencies**
```bash
npm install
```

3. **Install Jekyll** (for local preview)
```bash
gem install bundler jekyll
bundle install
```

4. **Set up your API key**
```bash
export NVIDIA_API_KEY='your-nvidia-api-key-here'
```

5. **Generate an article locally** (optional)
```bash
npm run generate
```

6. **Run Jekyll locally**
```bash
npm run dev
```

Visit `http://localhost:4000` to preview the site.

### GitHub Setup

1. **Create a new repository** on GitHub

2. **Add your NVIDIA API key as a secret**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NVIDIA_API_KEY`
   - Value: Your free NVIDIA API key from build.nvidia.com

3. **Push your code**
```bash
git remote add origin https://github.com/yourusername/unkiethestockjunkie.git
git branch -M main
git push -u origin main
```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `root`
   - Click Save

5. **Wait for deployment**
   - The first workflow run will generate a new article
   - GitHub Pages will build and deploy your site

### Custom Domain (Optional)

1. **Add a CNAME file**
```bash
echo "unkiethestockjunkie.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

2. **Configure DNS**
   - Add a CNAME record pointing to `yourusername.github.io`
   - Or add A records pointing to GitHub Pages IPs
   - See [GitHub's documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

3. **Update `_config.yml`**
```yaml
url: "https://unkiethestockjunkie.com"
```

## 📖 Project Structure

```
unkiethestockjunkie/
├── .github/workflows/
│   └── generate-content.yml    # GitHub Actions automation
├── _layouts/
│   ├── default.html            # Base template
│   ├── home.html               # Homepage layout
│   ├── article.html            # Article page layout
│   └── guide.html              # Guide page layout
├── _includes/
│   ├── header.html             # Site header
│   ├── footer.html             # Site footer
│   └── article-card.html       # Article preview component
├── _articles/                    # Auto-generated articles
├── _guides/                      # Static educational guides
├── screeners/                    # Investor screener pages
│   ├── index.html              # Screeners overview
│   ├── buffett.html            # Buffett screener
│   ├── graham.html             # Graham screener
│   ├── lynch.html              # Lynch screener
│   └── icahn.html              # Icahn screener
├── assets/
│   ├── css/
│   │   └── main.css            # Site styling
│   ├── js/
│   │   └── main.js             # Interactive features
│   └── images/
│       └── articles/           # AI-generated images
├── scripts/
│   ├── generate-article.js     # Article generation script
│   ├── add-topic.js            # Add new topics tool
│   ├── show-tags.js            # Show tag statistics
│   └── check-links.js          # Link validation
├── topics.json                 # 100+ investing topics
├── generated-topics.json       # Tracking generated content
├── _config.yml                 # Jekyll configuration
├── package.json                # Node.js dependencies
└── Gemfile                     # Ruby dependencies
```

## 🎯 Available Commands

```bash
# Generate a new article manually
npm run generate

# Add a new topic interactively
npm run add-topic

# Show most used tags
npm run show-tags

# Check all guides for broken links
npm run check-links

# Run Jekyll locally with live reload
npm run dev

# Build the site
npm run build
```

## 🎨 Customization

### Adding Topics

**Interactive method (recommended):**
```bash
npm run add-topic
```

**Manual method:**
Edit `topics.json` directly:
```json
{
  "title": "Your Topic Title",
  "difficulty": "beginner|intermediate|advanced",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "Brief description of the topic"
}
```

### Modifying Screeners

Edit the screener pages in the `screeners/` directory to:
- Change criteria
- Update example stocks
- Add new sections

### Changing Colors

Edit CSS variables in `assets/css/main.css`:
```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #10b981;
  /* ... */
}
```

## 📊 Content Strategy

### Difficulty Levels
- **Beginner**: Ages 13-15, basic concepts, simple analogies
- **Intermediate**: Ages 16-18, deeper analysis, real-world examples
- **Advanced**: College+, complex strategies, technical analysis

### Content Mix
- **40%** Fundamentals (what is a stock, compound interest, etc.)
- **30%** Investor Profiles (Buffett, Graham, Lynch, Icahn)
- **20%** Strategy Deep-Dives (value investing, growth, etc.)
- **10%** Current Events (explained for teens)

## 🔒 Important Disclaimers

- **Not Financial Advice**: This site is for educational purposes only
- **Investment Risk**: You can lose money investing
- **AI-Generated Content**: Articles are created by AI - verify before acting
- **Delayed Data**: Screeners use educational data, not real-time prices
- **No Guarantees**: Past performance doesn't predict future results

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ways to Contribute
- Add new topics to `topics.json`
- Improve the design and layout
- Enhance content generation prompts
- Add new screener features
- Translate content
- Fix bugs

## 📝 License

MIT License - feel free to use this for your own educational sites!

## 🙏 Acknowledgments

- Built with [Jekyll](https://jekyllrb.com/)
- Powered by [NVIDIA AI](https://build.nvidia.com/) - free text and image generation
- Based on [forexample.ai](https://github.com/kjw3/forexample.ai)
- Hosted on [GitHub Pages](https://pages.github.com/)
- Design inspired by Instructables and modern educational sites

## 📞 Contact

- Website: [unkiethestockjunkie.com](https://unkiethestockjunkie.com)
- Email: [hello@unkiethestockjunkie.com](mailto:hello@unkiethestockjunkie.com)
- GitHub: [github.com/kjw3/unkiethestockjunkie](https://github.com/kjw3/unkiethestockjunkie)

---

**Remember**: *Invest in yourself first. Knowledge is the best investment.*

Happy learning! 📈