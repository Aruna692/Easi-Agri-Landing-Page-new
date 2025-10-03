// Mobile Menu Toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Header Scroll Effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .hero-content a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
        
        const targetId = this.getAttribute('href');
        
        // Handle "Discover AI Solutions" button
        if (targetId === '#ai-features') {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Calculate the position to scroll to (accounting for fixed header)
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            return;
        }
        
        // Handle other navigation links
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate the position to scroll to (accounting for fixed header)
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// AI Chat Assistant
const aiAssistant = document.querySelector('.ai-assistant');
const aiChatContainer = document.querySelector('.ai-chat-container');
const aiChatClose = document.querySelector('.ai-chat-close');
const aiChatInput = document.querySelector('.ai-chat-input input');
const aiChatMessages = document.querySelector('.ai-chat-messages');
const aiChatSend = document.querySelector('.ai-chat-input button');

// Conversation state management
let conversationState = {
    currentStep: 'welcome',
    userData: {
        cropType: '',
        farmSize: '',
        location: '',
        irrigationType: '',
        problemType: ''
    }
};

// Agriculture knowledge base
const agricultureData = {
    crops: {
        'wheat': {
            waterRequirements: '500-600mm per season',
            bestSeason: 'Rabi (winter) season',
            commonIssues: ['Rust diseases', 'Aphids', 'Nutrient deficiency'],
            solutions: ['Use resistant varieties', 'Proper crop rotation', 'Balanced fertilization']
        },
        'rice': {
            waterRequirements: '1200-1500mm per season',
            bestSeason: 'Kharif (monsoon) season',
            commonIssues: ['Blast disease', 'Stem borer', 'Water management'],
            solutions: ['Proper water management', 'Use certified seeds', 'Integrated pest management']
        },
        'corn': {
            waterRequirements: '500-800mm per season',
            bestSeason: 'Both Kharif and Rabi',
            commonIssues: ['Fall armyworm', 'Leaf blight', 'Drought stress'],
            solutions: ['Timely sowing', 'Drip irrigation', 'Pest monitoring']
        },
        'cotton': {
            waterRequirements: '700-1300mm per season',
            bestSeason: 'Kharif season',
            commonIssues: ['Bollworm', 'Whitefly', 'Leaf curl virus'],
            solutions: ['Bt cotton varieties', 'Biological control', 'Proper spacing']
        }
    },
    
    irrigation: {
        'drip': {
            efficiency: '85-90%',
            benefits: ['Water saving', 'Fertilizer efficiency', 'Weed control'],
            cost: 'Medium to high initial investment'
        },
        'sprinkler': {
            efficiency: '70-80%',
            benefits: ['Uniform water distribution', 'Frost protection', 'Labor saving'],
            cost: 'Medium investment'
        },
        'flood': {
            efficiency: '40-50%',
            benefits: ['Low cost', 'Simple operation'],
            cost: 'Low investment'
        }
    },
    
    solutions: {
        'pest': [
            'Use integrated pest management (IPM)',
            'Introduce biological controls like ladybugs',
            'Practice crop rotation',
            'Use pheromone traps'
        ],
        'disease': [
            'Use disease-resistant varieties',
            'Practice proper sanitation',
            'Apply organic fungicides',
            'Ensure proper spacing for air circulation'
        ],
        'water': [
            'Implement drip irrigation',
            'Use mulching to retain soil moisture',
            'Practice rainwater harvesting',
            'Monitor soil moisture regularly'
        ],
        'soil': [
            'Conduct soil testing',
            'Use organic compost',
            'Practice green manuring',
            'Maintain proper pH levels'
        ]
    }
};

aiAssistant.addEventListener('click', function() {
    aiChatContainer.classList.toggle('active');
    // Start conversation when chat opens
    if (aiChatContainer.classList.contains('active') && conversationState.currentStep === 'welcome') {
        setTimeout(() => {
            addMessage("Hello! I'm your Agriculture Assistant. I can help you with:\n• Crop recommendations\n• Pest and disease management\n• Irrigation advice\n• Soil health tips\n\nWhat would you like to discuss today?");
        }, 500);
    }
});

aiChatClose.addEventListener('click', function() {
    aiChatContainer.classList.remove('active');
    // Reset conversation when chat closes
    conversationState = {
        currentStep: 'welcome',
        userData: {
            cropType: '',
            farmSize: '',
            location: '',
            irrigationType: '',
            problemType: ''
        }
    };
});

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'user' : 'bot'}`;
    
    // Handle line breaks in bot messages
    if (!isUser) {
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
    } else {
        messageDiv.textContent = text;
    }
    
    aiChatMessages.appendChild(messageDiv);
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

function processUserInput(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    switch(conversationState.currentStep) {
        case 'welcome':
            handleWelcomeResponse(message);
            break;
        case 'asking_crop':
            handleCropResponse(message);
            break;
        case 'asking_problem':
            handleProblemResponse(message);
            break;
        case 'asking_location':
            handleLocationResponse(message);
            break;
        case 'asking_farm_size':
            handleFarmSizeResponse(message);
            break;
        case 'providing_solution':
            handleFollowUpResponse(message);
            break;
        default:
            handleDefaultResponse(message);
    }
}

function handleWelcomeResponse(message) {
    if (message.includes('crop') || message.includes('plant') || message.includes('grow')) {
        conversationState.currentStep = 'asking_crop';
        addMessage("Great! Let's start with what crop you're interested in. What crop are you currently growing or planning to grow? (e.g., wheat, rice, corn, cotton)");
    }
    else if (message.includes('pest') || message.includes('disease') || message.includes('problem')) {
        conversationState.currentStep = 'asking_problem';
        addMessage("I can help with agricultural problems. Please tell me:\n1. What crop is affected?\n2. What specific problem are you facing? (pests, diseases, etc.)");
    }
    else if (message.includes('water') || message.includes('irrigation')) {
        conversationState.currentStep = 'asking_crop';
        addMessage("I can provide irrigation advice. What crop are you growing?");
    }
    else if (message.includes('soil') || message.includes('fertilizer')) {
        addMessage("For soil health and fertilization:\n• Conduct soil testing first\n• Use organic compost\n• Maintain proper pH levels (6.0-7.0 for most crops)\n• Consider green manuring with legumes\n\nWhat specific soil issue are you facing?");
        conversationState.currentStep = 'asking_problem';
    }
    else {
        addMessage("I'm here to help with your agricultural needs! You can ask me about:\n• Crop selection and management\n• Pest and disease control\n• Irrigation systems\n• Soil health\n• Farming best practices\n\nWhat would you like to know?");
    }
}

function handleCropResponse(message) {
    const crop = Object.keys(agricultureData.crops).find(c => message.includes(c));
    
    if (crop) {
        conversationState.userData.cropType = crop;
        const cropInfo = agricultureData.crops[crop];
        
        addMessage(`Excellent choice with ${crop}! Here's some basic info:\n• Water requirements: ${cropInfo.waterRequirements}\n• Best season: ${cropInfo.bestSeason}\n• Common issues: ${cropInfo.commonIssues.join(', ')}`);
        
        conversationState.currentStep = 'asking_problem';
        setTimeout(() => {
            addMessage(`Are you facing any specific issues with your ${crop} crop? (pests, diseases, water management, etc.)`);
        }, 1000);
    } else {
        addMessage("I'm not familiar with that crop. I have detailed information for wheat, rice, corn, and cotton. Which of these are you interested in?");
    }
}

function handleProblemResponse(message) {
    if (message.includes('pest') || message.includes('insect') || message.includes('bug')) {
        conversationState.userData.problemType = 'pest';
        provideSolution('pest');
    }
    else if (message.includes('disease') || message.includes('fungus') || message.includes('blight')) {
        conversationState.userData.problemType = 'disease';
        provideSolution('disease');
    }
    else if (message.includes('water') || message.includes('irrigation') || message.includes('drought')) {
        conversationState.userData.problemType = 'water';
        provideSolution('water');
    }
    else if (message.includes('soil') || message.includes('nutrient') || message.includes('fertilizer')) {
        conversationState.userData.problemType = 'soil';
        provideSolution('soil');
    }
    else {
        addMessage("I understand you're facing issues. Could you be more specific? Is it related to:\n• Pests and insects\n• Plant diseases\n• Water management\n• Soil problems\n\nPlease describe what you're seeing.");
    }
}

function handleLocationResponse(message) {
    conversationState.userData.location = message;
    conversationState.currentStep = 'asking_farm_size';
    addMessage(`Thanks! Now, could you tell me approximately how large your farm is in acres/hectares?`);
}

function handleFarmSizeResponse(message) {
    conversationState.userData.farmSize = message;
    conversationState.currentStep = 'providing_solution';
    
    addMessage(`Thank you for the information! Based on:\n• Location: ${conversationState.userData.location}\n• Farm size: ${conversationState.userData.farmSize}\n• Crop: ${conversationState.userData.cropType}`);
    
    setTimeout(() => {
        addMessage("I recommend:\n• Soil testing every 6 months\n• Implementing integrated pest management\n• Considering drip irrigation for water efficiency\n• Regular crop rotation practices\n\nWould you like more specific advice about any of these?");
    }, 1000);
}

function handleFollowUpResponse(message) {
    if (message.includes('yes') || message.includes('more') || message.includes('detail')) {
        addMessage("Great! Here are some additional resources:\n• Contact local agricultural extension office\n• Consider soil testing services\n• Explore government subsidy programs\n• Join farmer community groups\n\nIs there anything else I can help you with today?");
    } else {
        addMessage("Thank you for chatting! Remember to:\n• Monitor your crops regularly\n• Keep records of inputs and yields\n• Stay updated on weather forecasts\n• Connect with local farming communities\n\nFeel free to ask if you have more questions!");
        conversationState.currentStep = 'welcome';
    }
}

function handleDefaultResponse(message) {
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        addMessage("Hello again! How can I assist you with your farming today?");
        conversationState.currentStep = 'welcome';
    }
    else if (message.includes('thank') || message.includes('thanks')) {
        addMessage("You're welcome! I'm happy to help. Is there anything else you'd like to know about agriculture?");
    }
    else if (message.includes('bye') || message.includes('exit') || message.includes('quit')) {
        addMessage("Goodbye! Wishing you a successful harvest. Feel free to come back with any questions!");
    }
    else {
        addMessage("I'm not sure I understand. I can help with crop management, pest control, irrigation systems, and soil health. What specific agricultural topic would you like to discuss?");
        conversationState.currentStep = 'welcome';
    }
}

function provideSolution(problemType) {
    const solutions = agricultureData.solutions[problemType];
    const crop = conversationState.userData.cropType;
    
    let response = `For ${problemType} issues in ${crop}:\n`;
    solutions.forEach((solution, index) => {
        response += `• ${solution}\n`;
    });
    
    response += `\nWould you like to know more about implementing these solutions?`;
    
    addMessage(response);
    conversationState.currentStep = 'providing_solution';
}

aiChatSend.addEventListener('click', function() {
    if (aiChatInput.value.trim() !== '') {
        const userMessage = aiChatInput.value;
        addMessage(userMessage, true);
        
        setTimeout(function() {
            processUserInput(userMessage);
        }, 1000);
        
        aiChatInput.value = '';
    }
});

aiChatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        aiChatSend.click();
    }
});

// Add initial welcome message when chat opens
aiChatContainer.addEventListener('click', function(e) {
    if (e.target === aiChatContainer && aiChatMessages.children.length === 0) {
        setTimeout(() => {
            addMessage("Welcome! I'm your Agriculture Assistant. I can help you with:\n• Crop recommendations\n• Pest and disease management\n• Irrigation advice\n• Soil health tips\n\nWhat would you like to discuss today?");
        }, 500);
    }
});

// Interactive Demo
const cropType = document.getElementById('crop-type');
const fieldSize = document.getElementById('field-size');
const fieldSizeValue = document.getElementById('field-size-value');
const soilType = document.getElementById('soil-type');

const waterUsage = document.getElementById('water-usage');
const expectedYield = document.getElementById('expected-yield');
const costSavings = document.getElementById('cost-savings');
const riskLevel = document.getElementById('risk-level');

function updateDemo() {
    const size = parseInt(fieldSize.value);
    const crop = cropType.value;
    const soil = soilType.value;
    
    fieldSizeValue.textContent = `${size} acres`;
    
    // Simulate AI calculations
    let waterValue, yieldValue, savingsValue, riskValue;
    
    // Water usage calculation
    if (crop === 'wheat') waterValue = size * 500;
    else if (crop === 'corn') waterValue = size * 700;
    else if (crop === 'soybean') waterValue = size * 400;
    else waterValue = size * 900;
    
    // Adjust for soil type
    if (soil === 'sandy') waterValue *= 1.2;
    else if (soil === 'clay') waterValue *= 0.9;
    
    waterUsage.textContent = `${Math.round(waterValue).toLocaleString()} gal`;
    
    // Yield calculation
    if (crop === 'wheat') yieldValue = size * 0.42;
    else if (crop === 'corn') yieldValue = size * 0.65;
    else if (crop === 'soybean') yieldValue = size * 0.35;
    else yieldValue = size * 0.55;
    
    expectedYield.textContent = `${yieldValue.toFixed(1)} tons`;
    
    // Cost savings (randomized for demo)
    savingsValue = 15 + Math.floor(Math.random() * 10);
    costSavings.textContent = `${savingsValue}%`;
    
    // Risk level
    const riskFactors = ['Low', 'Medium', 'High'];
    riskValue = riskFactors[Math.floor(Math.random() * riskFactors.length)];
    riskLevel.textContent = riskValue;
}

// Initialize demo
updateDemo();

// Update demo when inputs change
cropType.addEventListener('change', updateDemo);
fieldSize.addEventListener('input', updateDemo);
soilType.addEventListener('change', updateDemo);

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});