// Unkie The Stock Junkie - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });
  }
  
  // Dark Mode Toggle
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }
  
  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Search Functionality
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function(e) {
      const query = e.target.value.toLowerCase();
      if (query.length < 2) {
        if (searchResults) searchResults.innerHTML = '';
        return;
      }
      
      // This would be replaced with actual search functionality
      console.log('Searching for:', query);
    }, 300));
  }
  
  // Article Card Animations
  const articleCards = document.querySelectorAll('.article-card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  articleCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });
  
  // Calculator Functions
  window.calculateCompoundInterest = function(principal, rate, years, monthly) {
    const r = rate / 100;
    const n = 12; // Monthly compounding
    const t = years;
    
    let amount;
    if (monthly) {
      const monthlyRate = r / n;
      amount = principal * Math.pow(1 + monthlyRate, n * t);
      for (let i = 0; i < n * t; i++) {
        amount += monthly * Math.pow(1 + monthlyRate, n * t - i);
      }
    } else {
      amount = principal * Math.pow(1 + r, t);
    }
    
    return amount;
  };
  
  // Utility: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Utility: Format Currency
  window.formatCurrency = function(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Utility: Format Percentage
  window.formatPercent = function(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  // Console Welcome Message
  console.log('%c👋 Hey there!', 'font-size: 24px; font-weight: bold; color: #6366f1;');
  console.log('%cWelcome to Unkie The Stock Junkie!', 'font-size: 16px; color: #475569;');
  console.log('%cRemember: This is for educational purposes only. Not financial advice!', 'font-size: 12px; color: #f59e0b; font-style: italic;');
});

// Service Worker Registration (for PWA capabilities)
// Commented out until sw.js is implemented
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', function() {
//     navigator.serviceWorker.register('/sw.js')
//     .then(function(registration) {
//       console.log('ServiceWorker registration successful:', registration.scope);
//     })
//     .catch(function(error) {
//       console.log('ServiceWorker registration failed:', error);
//     });
//   });
// }