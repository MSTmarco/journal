// ========== MOTIVATIONAL IMAGES MODULE ==========
// Displays inspirational figures to motivate the user

const MotivationalImages = {
    figures: [
        {
            name: 'Charlie Munger',
            title: 'Investor & Philosopher',
            quote: 'In my whole life, I have known no wise people who didn\'t read all the time.',
            image: 'images/charliemunger.png'
        },
        {
            name: 'Richard Branson',
            title: 'Entrepreneur',
            quote: 'If somebody offers you an amazing opportunity but you are not sure you can do it, say yes – then learn how to do it later!',
            image: 'images/richardbranson.png'
        },
        {
            name: 'Larry Page',
            title: 'Google Co-founder',
            quote: 'Always work hard on something uncomfortably exciting.',
            image: 'images/larrypage.png'
        },
        {
            name: 'Elon Musk',
            title: 'Innovator',
            quote: 'When something is important enough, you do it even if the odds are not in your favor.',
            image: 'images/elonmusk.png'
        },
        {
            name: 'Steve Jobs',
            title: 'Apple Founder',
            quote: 'The only way to do great work is to love what you do.',
            image: 'images/stevejobs.png'
        },
        {
            name: 'Warren Buffett',
            title: 'Investor',
            quote: 'The more you learn, the more you earn.',
            image: 'images/warrenbuffett.png'
        },
        {
            name: 'Bill Gates',
            title: 'Microsoft Founder',
            quote: 'Success is a lousy teacher. It seduces smart people into thinking they can\'t lose.',
            image: 'images/billgates.png'
        },
        {
            name: 'Jeff Bezos',
            title: 'Amazon Founder',
            quote: 'If you never want to be criticized, don\'t do anything new.',
            image: 'images/jeffbezos.png'
        },
        {
            name: 'Mark Zuckerberg',
            title: 'Facebook Founder',
            quote: 'Ideas don\'t come out fully formed. They only become clear as you work on them.',
            image: 'images/markzuckerberg.png'
        },
        {
            name: 'Oprah Winfrey',
            title: 'Media Mogul',
            quote: 'Think like a queen. A queen is not afraid to fail.',
            image: 'images/oprahwinfrey.png'
        }
    ],

    currentIndex: 0,

    // ========== INITIALIZATION ==========

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.displayRandomFigure();
    },

    setupElements() {
        this.container = document.getElementById('motivationalSection');
        this.imageElement = document.getElementById('motivationalImage');
        this.nameElement = document.getElementById('figureName');
        this.titleElement = document.getElementById('figureTitle');
        this.quoteElement = document.getElementById('figureQuote');
    },

    // ========== EVENT LISTENERS ==========

    setupEventListeners() {
        const nextBtn = document.getElementById('nextFigure');
        const prevBtn = document.getElementById('prevFigure');
        const randomBtn = document.getElementById('randomFigure');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.showNext());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.showPrevious());
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.displayRandomFigure());
        }
    },

    // ========== DISPLAY FUNCTIONS ==========

    displayFigure(index) {
        const figure = this.figures[index];
        if (!figure) return;

        this.currentIndex = index;

        if (this.imageElement) {
            // Try PNG first, then JPG
            let imagePath = figure.image;
            this.imageElement.src = imagePath;
            this.imageElement.alt = figure.name;
            
            // Add error handler for missing images
            this.imageElement.onerror = () => {
                // Try .jpg if .png fails
                if (imagePath.endsWith('.png')) {
                    imagePath = imagePath.replace('.png', '.jpg');
                    this.imageElement.src = imagePath;
                    this.imageElement.onerror = () => this.createInitialsFallback(index, figure);
                } else {
                    this.createInitialsFallback(index, figure);
                }
            };
        }

        if (this.nameElement) {
            this.nameElement.textContent = figure.name;
        }

        if (this.titleElement) {
            this.titleElement.textContent = figure.title;
        }

        if (this.quoteElement) {
            this.quoteElement.textContent = figure.quote;
        }

        // Add fade-in animation
        if (this.container) {
            this.container.classList.remove('fade-in');
            setTimeout(() => {
                this.container.classList.add('fade-in');
            }, 10);
        }
    },

    createInitialsFallback(index, figure) {
        // Fallback to a colored square with initials
        const initials = figure.name.split(' ').map(n => n[0]).join('');
        const colors = [
            'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
            'linear-gradient(135deg, #a8a29e 0%, #78716c 100%)',
            'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
            'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
        ];
        const gradient = colors[index % colors.length];
        
        // Create a canvas with initials
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Create gradient
        const grd = ctx.createLinearGradient(0, 0, 400, 400);
        // Parse the gradient colors (simplified - using solid color)
        ctx.fillStyle = ['#6b7280', '#94a3b8', '#a8a29e', '#9ca3af', '#cbd5e1', '#d1d5db'][index % 6];
        ctx.fillRect(0, 0, 400, 400);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 120px Georgia';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, 200, 200);
        
        this.imageElement.src = canvas.toDataURL();
    },

    displayRandomFigure() {
        const randomIndex = Math.floor(Math.random() * this.figures.length);
        this.displayFigure(randomIndex);
    },

    showNext() {
        const nextIndex = (this.currentIndex + 1) % this.figures.length;
        this.displayFigure(nextIndex);
    },

    showPrevious() {
        const prevIndex = (this.currentIndex - 1 + this.figures.length) % this.figures.length;
        this.displayFigure(prevIndex);
    }
};

// Make MotivationalImages available globally
window.MotivationalImages = MotivationalImages;
