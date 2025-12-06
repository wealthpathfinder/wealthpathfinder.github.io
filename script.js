// ===== WEALTHPATHFINDER - MAIN JAVASCRIPT =====
// Enhanced functionality for better user experience and AdSense optimization

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU FUNCTIONALITY =====
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle menu visibility
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            // Update aria attributes for accessibility
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.setAttribute('aria-hidden', isExpanded);
            
            // Animate hamburger icon
            const spans = this.querySelectorAll('span');
            spans[0].style.transform = isExpanded ? 'rotate(0)' : 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = isExpanded ? '1' : '0';
            spans[2].style.transform = isExpanded ? 'rotate(0)' : 'rotate(-45deg) translate(6px, -6px)';
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mainNav.setAttribute('aria-hidden', 'true');
                
                // Reset hamburger icon
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'rotate(0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0)';
            });
        });
    }
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== NEWSLETTER FORM HANDLING =====
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            if (!emailInput || !submitBtn) return;
            
            const email = emailInput.value.trim();
            
            // Basic email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            // In a real application, you would send this to your server
            setTimeout(() => {
                // Success simulation
                showNotification('🎉 Welcome! Check your email to confirm subscription.', 'success');
                emailInput.value = '';
                
                // Track conversion for analytics
                trackNewsletterConversion();
                
                // Reset button
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 1500);
        });
    });
    
    // ===== TRUST INDICATORS ANIMATION =====
    const trustIndicators = document.querySelector('.trust-indicators');
    
    if (trustIndicators) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTrustNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(trustIndicators);
    }
    
    // ===== LAZY LOADING FOR IMAGES =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // ===== AD PLACEHOLDER INTERACTIONS =====
    const adPlaceholders = document.querySelectorAll('.ad-placeholder');
    
    adPlaceholders.forEach(placeholder => {
        // Add click tracking for ad placeholders (for analytics)
        placeholder.addEventListener('click', function() {
            trackAdClick(this.closest('.ad-unit').classList[1]); // Get ad position from class
        });
        
        // Simulate ad loading delay
        setTimeout(() => {
            placeholder.classList.add('loaded');
        }, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
    });
    
    // ===== STICKY SIDEBAR BEHAVIOR =====
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar && window.innerWidth > 1024) {
        const stickyOffset = 100;
        
        window.addEventListener('scroll', () => {
            const sidebarRect = sidebar.getBoundingClientRect();
            const contentRect = mainContent.getBoundingClientRect();
            
            if (window.scrollY > stickyOffset && 
                sidebarRect.bottom < contentRect.bottom) {
                sidebar.style.position = 'sticky';
                sidebar.style.top = '100px';
            } else {
                sidebar.style.position = 'static';
            }
        });
    }
    
    // ===== ARTICLE CARD INTERACTIONS =====
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Track article clicks for analytics
        card.addEventListener('click', function() {
            const articleLink = this.querySelector('a');
            if (articleLink) {
                trackArticleClick(articleLink.getAttribute('href'));
            }
        });
    });
    
    // ===== READING TIME CALCULATION =====
    function calculateReadingTime() {
        const articleContents = document.querySelectorAll('.article-content');
        
        articleContents.forEach(content => {
            const text = content.textContent || '';
            const wordCount = text.split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
            
            const readTimeElement = content.querySelector('.read-time');
            if (readTimeElement) {
                readTimeElement.textContent = `${readingTime} min read`;
            }
        });
    }
    
    // Calculate reading times after page load
    setTimeout(calculateReadingTime, 1000);
    
    // ===== SCROLL PROGRESS INDICATOR =====
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-blue), var(--emerald-green));
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    createScrollProgress();
    
    // ===== DARK MODE TOGGLE (BONUS FEATURE) =====
    function initDarkModeToggle() {
        const darkModeToggle = document.createElement('button');
        darkModeToggle.className = 'dark-mode-toggle';
        darkModeToggle.innerHTML = '🌙';
        darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
        darkModeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-blue);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2rem;
            z-index: 1000;
            box-shadow: var(--shadow-lg);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(darkModeToggle);
        
        // Check for saved theme preference or respect OS preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme');
        
        if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '☀';
        }
        
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            darkModeToggle.innerHTML = isDark ? '☀' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Initialize dark mode toggle
    initDarkModeToggle();
    
    // ===== ANALYTICS AND TRACKING FUNCTIONS =====
    function trackNewsletterConversion() {
        // Simulate analytics tracking
        console.log('Newsletter conversion tracked');
        
        // In a real implementation, you would use:
        // gtag('event', 'conversion', {'send_to': 'AW-YOUR_CONVERSION_ID'});
        // fbq('track', 'Lead');
    }
    
    function trackAdClick(adPosition) {
        console.log(`Ad clicked at position: ${adPosition}`);
        
        // In a real implementation:
        // gtag('event', 'click', {
        //     'event_category': 'Ad Interaction',
        //     'event_label': adPosition
        // });
    }
    
    function trackArticleClick(articleUrl) {
        console.log(`Article clicked: ${articleUrl}`);
        
        // In a real implementation:
        // gtag('event', 'click', {
        //     'event_category': 'Article Navigation',
        //     'event_label': articleUrl
        // });
    }
    
    // ===== HELPER FUNCTIONS =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1002;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
    
    function animateTrustNumbers() {
        const trustNumbers = document.querySelectorAll('.trust-number');
        
        trustNumbers.forEach(numberElement => {
            const targetNumber = parseInt(numberElement.textContent);
            let currentNumber = 0;
            const increment = targetNumber / 30; // Adjust speed here
            const duration = 1500; // ms
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(timer);
                }
                numberElement.textContent = Math.floor(currentNumber).toLocaleString();
            }, duration / 30);
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Debounce scroll events
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
    
    // Throttle resize events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Optimized scroll handler
    window.addEventListener('scroll', throttle(() => {
        // Any scroll-based calculations go here
    }, 100));
    
    // ===== ERROR HANDLING =====
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // In production, you might want to send this to an error tracking service
    });
    
    // ===== PWA READINESS (BONUS) =====
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // In a real implementation, you would register your service worker
            // navigator.serviceWorker.register('/sw.js');
        });
    }
    
    // ===== ADDITIONAL ENHANCEMENTS =====
    
    // Add loading state to images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.classList.add('error');
            console.warn('Image failed to load:', this.src);
        });
    });
    
    // Print functionality
    const printButton = document.createElement('button');
    printButton.textContent = '🖨 Print';
    printButton.className = 'print-btn';
    printButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        padding: 10px 15px;
        background: var(--gray-600);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        z-index: 1000;
        box-shadow: var(--shadow-md);
    `;
    printButton.addEventListener('click', () => window.print());
    document.body.appendChild(printButton);
    
    // ===== INITIALIZATION COMPLETE =====
    console.log('WealthPathfinder website initialized successfully!');
    
    // Dispatch custom event for any additional scripts
    window.dispatchEvent(new CustomEvent('wealthPathfinderReady'));
});

// ===== ADDITIONAL GLOBAL FUNCTIONS =====

// Utility function to format currency
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Utility function to calculate compound interest
function calculateCompoundInterest(principal, rate, time, compoundFrequency = 12) {
    const r = rate / 100;
    const n = compoundFrequency;
    const amount = principal * Math.pow(1 + r / n, n * time);
    return {
        total: amount,
        interest: amount - principal
    };
}

// Export functions for global use (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatCurrency, calculateCompoundInterest };
}
// ===== CALCULATOR FUNCTIONS =====

// Compound Interest Calculator
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const years = parseInt(document.getElementById('years').value);
    const compoundFrequency = parseInt(document.getElementById('compoundFrequency').value);

    if (!principal || !annualRate || !years) {
        alert('Please fill in all required fields.');
        return;
    }

    const ratePerPeriod = annualRate / 100 / compoundFrequency;
    const totalPeriods = years * compoundFrequency;
    
    // Calculate future value with compound interest
    let futureValue = principal * Math.pow(1 + ratePerPeriod, totalPeriods);
    
    // Add monthly contributions
    if (monthlyContribution > 0) {
        const monthlyRate = annualRate / 100 / 12;
        const months = years * 12;
        futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    const totalContributions = principal + (monthlyContribution * years * 12);
    const interestEarned = futureValue - totalContributions;

    // Display results
    document.getElementById('futureValue').textContent = formatCurrency(futureValue);
    document.getElementById('totalContributions').textContent = formatCurrency(totalContributions);
    document.getElementById('interestEarned').textContent = formatCurrency(interestEarned);

    // Generate chart data
    generateCompoundInterestChart(principal, monthlyContribution, annualRate, years, compoundFrequency);
}

// Debt Payoff Calculator
function calculateDebtPayoff() {
    const debts = [];
    let totalDebt = 0;
    
    // Get debt inputs
    const debtInputs = document.querySelectorAll('.debt-item');
    debtInputs.forEach(input => {
        const balance = parseFloat(input.querySelector('.debt-balance').value) || 0;
        const interest = parseFloat(input.querySelector('.debt-interest').value) || 0;
        const minPayment = parseFloat(input.querySelector('.debt-min-payment').value) || 0;
        
        if (balance > 0) {
            debts.push({
                balance: balance,
                interest: interest,
                minPayment: minPayment,
                name: input.querySelector('.debt-name').value || 'Debt'
            });
            totalDebt += balance;
        }
    });

    if (debts.length === 0) {
        alert('Please enter at least one debt.');
        return;
    }

    const extraPayment = parseFloat(document.getElementById('extraPayment').value) || 0;
    const method = document.querySelector('input[name="payoffMethod"]:checked').value;

    // Sort debts based on method
    if (method === 'snowball') {
        debts.sort((a, b) => a.balance - b.balance); // Smallest balance first
    } else {
        debts.sort((a, b) => b.interest - a.interest); // Highest interest first
    }

    const results = simulateDebtPayoff(debts, extraPayment, method);
    displayDebtResults(results, totalDebt);
}

function simulateDebtPayoff(debts, extraPayment, method) {
    let months = 0;
    let totalInterest = 0;
    const monthlyResults = [];
    const currentDebts = JSON.parse(JSON.stringify(debts)); // Deep copy

    while (currentDebts.length > 0) {
        months++;
        let availableExtra = extraPayment;
        
        // Pay minimums on all debts
        currentDebts.forEach(debt => {
            if (debt.balance > 0) {
                const monthlyInterest = debt.balance * (debt.interest / 100 / 12);
                let payment = Math.min(debt.balance + monthlyInterest, debt.minPayment);
                
                if (payment > debt.minPayment) {
                    availableExtra += (payment - debt.minPayment);
                    payment = debt.minPayment;
                }
                
                debt.balance = debt.balance + monthlyInterest - payment;
                totalInterest += monthlyInterest;
            }
        });

        // Apply extra payment to target debt
        const targetDebt = currentDebts.find(debt => debt.balance > 0);
        if (targetDebt && availableExtra > 0) {
            targetDebt.balance = Math.max(0, targetDebt.balance - availableExtra);
        }

        // Remove paid-off debts
        for (let i = currentDebts.length - 1; i >= 0; i--) {
            if (currentDebts[i].balance <= 0) {
                currentDebts.splice(i, 1);
            }
        }

        // Store monthly result for chart
        if (months % 3 === 0 || months === 1 || currentDebts.length === 0) {
            const remainingDebt = currentDebts.reduce((sum, debt) => sum + debt.balance, 0);
            monthlyResults.push({
                month: months,
                remaining: remainingDebt
            });
        }

        // Safety break
        if (months > 600) break; // 50 years max
    }

    return {
        months: months,
        totalInterest: totalInterest,
        monthlyResults: monthlyResults
    };
}

// Budget Calculator
function calculateBudget() {
    const income = parseFloat(document.getElementById('monthlyIncome').value) || 0;
    const housing = parseFloat(document.getElementById('housing').value) || 0;
    const transportation = parseFloat(document.getElementById('transportation').value) || 0;
    const food = parseFloat(document.getElementById('food').value) || 0;
    const utilities = parseFloat(document.getElementById('utilities').value) || 0;
    const healthcare = parseFloat(document.getElementById('healthcare').value) || 0;
    const debtPayments = parseFloat(document.getElementById('debtPayments').value) || 0;
    const entertainment = parseFloat(document.getElementById('entertainment').value) || 0;
    const savings = parseFloat(document.getElementById('savings').value) || 0;
    const other = parseFloat(document.getElementById('other').value) || 0;

    const totalExpenses = housing + transportation + food + utilities + healthcare + 
                         debtPayments + entertainment + savings + other;
    const remaining = income - totalExpenses;

    // Calculate percentages
    const expenses = [
        { name: 'Housing', amount: housing, percentage: (housing / income) * 100 },
        { name: 'Transportation', amount: transportation, percentage: (transportation / income) * 100 },
        { name: 'Food', amount: food, percentage: (food / income) * 100 },
        { name: 'Utilities', amount: utilities, percentage: (utilities / income) * 100 },
        { name: 'Healthcare', amount: healthcare, percentage: (healthcare / income) * 100 },
        { name: 'Debt Payments', amount: debtPayments, percentage: (debtPayments / income) * 100 },
        { name: 'Entertainment', amount: entertainment, percentage: (entertainment / income) * 100 },
        { name: 'Savings', amount: savings, percentage: (savings / income) * 100 },
        { name: 'Other', amount: other, percentage: (other / income) * 100 }
    ];

    displayBudgetResults(income, totalExpenses, remaining, expenses);
}

// Emergency Fund Calculator
function calculateEmergencyFund() {
    const monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value) || 0;
    const monthsCoverage = parseInt(document.getElementById('monthsCoverage').value) || 3;
    const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;

    const targetAmount = monthlyExpenses * monthsCoverage;
    const neededAmount = Math.max(0, targetAmount - currentSavings);
    const monthsToSave = Math.ceil(neededAmount / (monthlyExpenses * 0.1)); // Assuming 10% savings rate

    displayEmergencyFundResults(targetAmount, neededAmount, monthsToSave, monthlyExpenses, monthsCoverage);
}

// Retirement Calculator
function calculateRetirement() {
    const currentAge = parseInt(document.getElementById('currentAge').value);
    const retirementAge = parseInt(document.getElementById('retirementAge').value);
    const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
    const annualContribution = parseFloat(document.getElementById('annualContribution').value) || 0;
    const currentIncome = parseFloat(document.getElementById('currentIncome').value);
    const replacementRate = parseFloat(document.getElementById('replacementRate').value) || 80;
    const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 7;
    const inflation = parseFloat(document.getElementById('inflation').value) || 2.5;

    const yearsToRetirement = retirementAge - currentAge;
    const annualNeeded = currentIncome * (replacementRate / 100);
    const realReturn = (1 + expectedReturn/100) / (1 + inflation/100) - 1;

    // Calculate future value of current savings
    let futureValue = currentSavings * Math.pow(1 + realReturn, yearsToRetirement);
    
    // Add future contributions
    futureValue += annualContribution * ((Math.pow(1 + realReturn, yearsToRetirement) - 1) / realReturn);

    const neededAtRetirement = annualNeeded * 25; // 4% rule
    const shortfall = Math.max(0, neededAtRetirement - futureValue);

    displayRetirementResults(futureValue, neededAtRetirement, shortfall, yearsToRetirement, annualNeeded);
}

// ===== DISPLAY FUNCTIONS =====

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatPercent(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(amount / 100);
}

function displayDebtResults(results, totalDebt) {
    const years = Math.floor(results.months / 12);
    const months = results.months % 12;
    
    document.getElementById('payoffTime').textContent = `${years} years, ${months} months`;
    document.getElementById('totalInterestPaid').textContent = formatCurrency(results.totalInterest);
    document.getElementById('totalCost').textContent = formatCurrency(totalDebt + results.totalInterest);
    
    generateDebtPayoffChart(results.monthlyResults, totalDebt);
}

function displayBudgetResults(income, totalExpenses, remaining, expenses) {
    document.getElementById('totalIncome').textContent = formatCurrency(income);
    document.getElementById('totalExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('remainingBalance').textContent = formatCurrency(remaining);
    
    const statusElement = document.getElementById('budgetStatus');
    if (remaining >= 0) {
        statusElement.textContent = 'On Track!';
        statusElement.className = 'status-positive';
    } else {
        statusElement.textContent = 'Over Budget';
        statusElement.className = 'status-negative';
    }
    
    generateBudgetChart(expenses);
}

function displayEmergencyFundResults(targetAmount, neededAmount, monthsToSave, monthlyExpenses, monthsCoverage) {
    document.getElementById('targetAmount').textContent = formatCurrency(targetAmount);
    document.getElementById('neededAmount').textContent = formatCurrency(neededAmount);
    document.getElementById('monthsToSave').textContent = monthsToSave;
    document.getElementById('coverageDescription').textContent = 
        `This will cover ${monthsCoverage} months of essential expenses (${formatCurrency(monthlyExpenses)} per month).`;
}

function displayRetirementResults(futureValue, neededAtRetirement, shortfall, yearsToRetirement, annualNeeded) {
    document.getElementById('projectedSavings').textContent = formatCurrency(futureValue);
    document.getElementById('neededAtRetirement').textContent = formatCurrency(neededAtRetirement);
    document.getElementById('shortfall').textContent = formatCurrency(shortfall);
    document.getElementById('yearsToRetirement').textContent = yearsToRetirement;
    document.getElementById('annualNeeded').textContent = formatCurrency(annualNeeded);
    
    const statusElement = document.getElementById('retirementStatus');
    if (shortfall <= 0) {
        statusElement.textContent = 'On Track for Retirement!';
        statusElement.className = 'status-positive';
    } else {
        statusElement.textContent = 'Additional Savings Needed';
        statusElement.className = 'status-warning';
    }
}

// ===== CHART FUNCTIONS =====

function generateCompoundInterestChart(principal, monthlyContribution, annualRate, years, compoundFrequency) {
    const ctx = document.getElementById('compoundInterestChart').getContext('2d');
    
    const data = [];
    const labels = [];
    let balance = principal;
    
    for (let year = 0; year <= years; year++) {
        labels.push(`Year ${year}`);
        
        if (year > 0) {
            // Calculate balance at end of year
            for (let i = 0; i < compoundFrequency; i++) {
                balance = balance * (1 + annualRate/100/compoundFrequency);
            }
            balance += monthlyContribution * 12;
        }
        
        data.push(balance);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Investment Growth',
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Investment Growth Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function generateDebtPayoffChart(monthlyResults, totalDebt) {
    const ctx = document.getElementById('debtPayoffChart').getContext('2d');
    
    const data = monthlyResults.map(result => result.remaining);
    const labels = monthlyResults.map(result => `Month ${result.month}`);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Remaining Debt',
                data: data,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Debt Payoff Progress'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function generateBudgetChart(expenses) {
    const ctx = document.getElementById('budgetChart').getContext('2d');
    
    const data = expenses.filter(exp => exp.amount > 0).map(exp => exp.amount);
    const labels = expenses.filter(exp => exp.amount > 0).map(exp => exp.name);
    const backgroundColors = [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Expense Distribution'
                }
            }
        }
    });
}

// ===== UTILITY FUNCTIONS =====

function addDebtRow() {
    const debtsContainer = document.getElementById('debtsContainer');
    const debtCount = debtsContainer.children.length + 1;
    
    const debtHtml = `
        <div class="debt-item">
            <div class="form-group">
                <label>Debt Name</label>
                <input type="text" class="debt-name" placeholder="Credit Card, Student Loan, etc." value="Debt ${debtCount}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Balance</label>
                    <input type="number" class="debt-balance" placeholder="0.00" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Interest Rate (%)</label>
                    <input type="number" class="debt-interest" placeholder="0.0" min="0" step="0.1">
                </div>
                <div class="form-group">
                    <label>Minimum Payment</label>
                    <input type="number" class="debt-min-payment" placeholder="0.00" min="0" step="0.01">
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline remove-debt" onclick="removeDebtRow(this)">Remove</button>
        </div>
    `;
    
    debtsContainer.insertAdjacentHTML('beforeend', debtHtml);
}

function removeDebtRow(button) {
    const debtItem = button.closest('.debt-item');
    debtItem.remove();
}

function resetCalculator(calculatorId) {
    const form = document.getElementById(calculatorId);
    if (form) {
        form.reset();
    }
    
    // Clear results
    const resultSections = document.querySelectorAll('.calculator-results');
    resultSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Clear charts
    const chartCanvases = document.querySelectorAll('canvas');
    chartCanvases.forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) {
            chart.destroy();
        }
    });
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calculators
    initializeCalculators();
    
    // Add event listeners
    const calculateButtons = document.querySelectorAll('.calculate-btn');
    calculateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calculatorType = this.dataset.calculator;
            if (calculatorType === 'compound-interest') {
                calculateCompoundInterest();
            } else if (calculatorType === 'debt-payoff') {
                calculateDebtPayoff();
            } else if (calculatorType === 'budget') {
                calculateBudget();
            } else if (calculatorType === 'emergency-fund') {
                calculateEmergencyFund();
            } else if (calculatorType === 'retirement') {
                calculateRetirement();
            }
            
            // Show results section
            const resultsSection = this.closest('.calculator').querySelector('.calculator-results');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // Add initial debt row
    if (document.getElementById('debtsContainer')) {
        addDebtRow();
    }
});

function initializeCalculators() {
    // Set default values for better UX
    const defaultValues = {
        'annualRate': 5,
        'years': 10,
        'compoundFrequency': 12,
        'monthsCoverage': 6,
        'replacementRate': 80,
        'expectedReturn': 7,
        'inflation': 2.5
    };
    
    Object.keys(defaultValues).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = defaultValues[id];
        }
    });
}

// Export functions for global access
window.calculateCompoundInterest = calculateCompoundInterest;
window.calculateDebtPayoff = calculateDebtPayoff;
window.calculateBudget = calculateBudget;
window.calculateEmergencyFund = calculateEmergencyFund;
window.calculateRetirement = calculateRetirement;
window.addDebtRow = addDebtRow;
window.removeDebtRow = removeDebtRow;
window.resetCalculator = resetCalculator;

// script.js - Main JavaScript for WealthPathfinder

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Social Sharing Buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.classList[1]; // Assumes class like 'facebook', 'twitter'
            shareArticle(platform);
        });
    });
    
    // Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                // In a real application, you would send this to a server
                alert('Thank you for subscribing! Check your email for confirmation.');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    });
    
    // Table of Contents - Auto-highlight current section
    const sections = document.querySelectorAll('section[id], .hustle-category');
    const navLinks = document.querySelectorAll('.table-of-contents a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === #${current}) {
                link.classList.add('active');
            }
        });
    });
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Social sharing function
function shareArticle(platform) {
    const url = window.location.href;
    const title = document.title;
    
    let shareUrl;
    switch (platform) {
        case 'facebook':
            shareUrl = https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)};
            break;
        case 'twitter':
            shareUrl = https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)};
            break;
        case 'linkedin':
            shareUrl = https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)};
            break;
        case 'pinterest':
            const image = document.querySelector('meta[property="og:image"]')?.content || '';
            shareUrl = https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)};
            break;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

// Toggle FAQ answers
function toggleFAQ(faqId) {
    const answer = document.getElementById(faq-answer-${faqId});
    if (answer) {
        answer.classList.toggle('active');
    }
}