---
layout: default
title: "All Articles - Investing Education for Teens"
description: "Browse all investing articles. Filter by difficulty level to find content perfect for your learning journey."
permalink: /articles/
---

<section class="page-header">
  <div class="container">
    <h1>📚 All Articles</h1>
    <p class="lead">Daily investing education for smart teens. New articles every day!</p>
  </div>
</section>

<section class="articles-content">
  <div class="container">
    <div class="articles-grid">
      
<div class="articles-sidebar">
<div class="filters-card">
<h3>Filter Articles</h3>

<div class="filter-buttons">
 <button class="filter-btn active" data-filter="all" onclick="filterArticles('all')">All Articles</button>
 <button class="filter-btn" data-filter="beginner" onclick="filterArticles('beginner')">Beginner</button>
 <button class="filter-btn" data-filter="intermediate" onclick="filterArticles('intermediate')">Intermediate</button>
 <button class="filter-btn" data-filter="advanced" onclick="filterArticles('advanced')">Advanced</button>
</div>

<div class="results-info">
<p id="results-count">Showing all articles</p>
</div>
</div>

<div class="daily-update-card">
<h3>🔄 Daily Updates</h3>
<p>New articles are automatically generated every day at 10:17 AM UTC. Check back tomorrow for fresh content!</p>
</div>
</div>
      
      <div class="articles-list" id="articles-list">
        {% for article in site.articles reversed %}
          {% include article-card.html article=article %}
        {% else %}
          <div class="no-articles">
            <h3>No articles yet</h3>
            <p>Articles are generated automatically each day. Check back soon!</p>
          </div>
        {% endfor %}
      </div>
      
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-box">
      <h2>Want to Learn Faster?</h2>
      <p>Try our interactive screeners to practice finding stocks like legendary investors.</p>
      <a href="/screeners" class="btn btn-primary btn-large">Try Screeners</a>
    </div>
  </div>
</section>

<style>
.page-header {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
  padding: var(--spacing-3xl) 0;
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.lead {
  font-size: 1.25rem;
  color: var(--text-secondary);
}

.articles-content {
  padding: var(--spacing-3xl) 0;
}

.articles-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-2xl);
}

.articles-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.filters-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.filters-card h3 {
  margin-bottom: var(--spacing-lg);
  font-size: 1.25rem;
}

.filter-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.filter-btn {
  padding: 0.75rem 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-family: var(--font-sans);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--text-on-primary);
}

.filter-btn.active:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.results-info {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.results-info p {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.daily-update-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.daily-update-card h3 {
  color: #92400e;
  margin-bottom: var(--spacing-sm);
  font-size: 1.125rem;
}

.daily-update-card p {
  color: #78350f;
  font-size: 0.875rem;
  margin: 0;
}

.articles-list {
  display: grid;
  gap: var(--spacing-lg);
}

.no-articles {
  text-align: center;
  padding: var(--spacing-3xl);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
}

.no-articles h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
}

.no-articles p {
  color: var(--text-muted);
}

.cta-section {
  padding: var(--spacing-3xl) 0;
  background: var(--bg-secondary);
}

.cta-box {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-box h2 {
  margin-bottom: var(--spacing-sm);
}

.cta-box p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .articles-sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>

<script>
// Client-side filtering by difficulty level
function filterArticles(filter) {
  const resultsCount = document.getElementById('results-count');
  const buttons = document.querySelectorAll('.filter-btn');
  const articles = document.querySelectorAll('.article-card');
  
  // Update active button
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });
  
  // Filter articles
  let visibleCount = 0;
  articles.forEach(article => {
    const articleDifficulty = article.dataset.difficulty;
    
    if (filter === 'all' || articleDifficulty === filter) {
      article.style.display = '';
      visibleCount++;
    } else {
      article.style.display = 'none';
    }
  });
  
  // Update results count
  if (filter === 'all') {
    resultsCount.textContent = `Showing all ${visibleCount} articles`;
  } else {
    const filterLabel = filter.charAt(0).toUpperCase() + filter.slice(1);
    resultsCount.textContent = `Showing ${visibleCount} ${filterLabel} articles`;
  }
}
</script>
