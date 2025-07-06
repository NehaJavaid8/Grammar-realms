// Level Generator for Grammar Realms
// This script generates all 50 levels dynamically

class LevelGenerator {
  constructor() {
    this.currentLevel = this.getCurrentLevel();
    this.levelData = this.loadLevelData();
    this.init();
  }

  getCurrentLevel() {
    const path = window.location.pathname;
    const match = path.match(/level(\d+)\.html/);
    return match ? parseInt(match[1]) : 1;
  }

  loadLevelData() {
    // Level data is defined in levelData.js
    return window.levelData || {};
  }

  init() {
    this.setupPage();
    this.setupDragAndDrop();
    this.setupNavigation();
    this.updateProgress();
  }

  setupPage() {
    const level = this.levelData[this.currentLevel];
    if (!level) return;

    // Update page title
    document.title = `Level ${this.currentLevel} - ${level.title}`;
    
    // Update main heading
    const h1 = document.querySelector('h1');
    if (h1) {
      h1.innerHTML = `Level ${this.currentLevel}: ${level.title}`;
    }

    // Update sentence
    const sentenceDiv = document.getElementById('sentence');
    if (sentenceDiv) {
      sentenceDiv.innerHTML = level.sentence;
    }

    // Update word bank
    const wordBank = document.querySelector('.word-bank');
    if (wordBank) {
      wordBank.innerHTML = '';
      level.options.forEach(option => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.draggable = true;
        wordDiv.textContent = option;
        wordBank.appendChild(wordDiv);
      });
    }

    // Add explanation section
    this.addExplanationSection(level);
  }

  addExplanationSection(level) {
    const container = document.querySelector('.container') || document.body;
    
    // Remove existing explanation if any
    const existingExplanation = document.getElementById('explanation');
    if (existingExplanation) {
      existingExplanation.remove();
    }

    const explanationDiv = document.createElement('div');
    explanationDiv.id = 'explanation';
    explanationDiv.className = 'explanation-box';
    explanationDiv.innerHTML = `
      <h3>💡 Grammar Tip</h3>
      <p><strong>Topic:</strong> ${level.topic}</p>
      <p>${level.explanation}</p>
    `;
    
    // Insert after the sentence
    const sentenceDiv = document.getElementById('sentence');
    if (sentenceDiv && sentenceDiv.parentNode) {
      sentenceDiv.parentNode.insertBefore(explanationDiv, sentenceDiv.nextSibling);
    }
  }

  setupDragAndDrop() {
    const dropZone = document.getElementById('drop1');
    const words = document.querySelectorAll('.word');

    if (!dropZone) return;

    // Clear existing content
    dropZone.textContent = '';

    words.forEach(word => {
      word.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text', e.target.textContent);
        e.target.style.opacity = '0.5';
      });

      word.addEventListener('dragend', e => {
        e.target.style.opacity = '1';
      });
    });

    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.backgroundColor = 'rgba(255, 221, 193, 0.3)';
    });

    dropZone.addEventListener('dragleave', e => {
      dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });

    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      const word = e.dataTransfer.getData('text');
      dropZone.textContent = word;
      dropZone.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
  }

  setupNavigation() {
    const checkButton = document.querySelector('button[onclick="checkAnswer()"]');
    if (checkButton) {
      checkButton.onclick = () => this.checkAnswer();
    }
  }

  checkAnswer() {
    const level = this.levelData[this.currentLevel];
    const dropZone = document.getElementById('drop1');
    const feedback = document.getElementById('feedback');
    
    if (!level || !dropZone || !feedback) return;

    const answer = dropZone.textContent.trim();
    
    if (!answer) {
      feedback.textContent = "⚠️ Please choose a word.";
      feedback.style.color = "orange";
      return;
    }

    if (answer === level.correctAnswer) {
      feedback.textContent = "✅ Correct! Well done!";
      feedback.style.color = "lightgreen";
      
      // Play sound if available
      if (typeof playSound === 'function') {
        playSound("correct");
      }

      // Update score
      this.updateScore();

      // Show success modal
      setTimeout(() => {
        this.showSuccessModal();
      }, 1500);
    } else {
      feedback.textContent = "❌ Try again. Think about the grammar rule!";
      feedback.style.color = "red";
      
      if (typeof playSound === 'function') {
        playSound("wrong");
      }
    }
  }

  updateScore() {
    const currentScore = parseInt(localStorage.getItem('score') || '0');
    const newScore = currentScore + 10;
    localStorage.setItem('score', newScore.toString());
    
    // Update badge level
    const badgeLevel = Math.floor(newScore / 100) + 1;
    localStorage.setItem('badgeLevel', badgeLevel.toString());
  }

  showSuccessModal() {
    const level = this.levelData[this.currentLevel];
    const nextLevel = this.currentLevel + 1;
    
    const modal = document.getElementById('nextModal');
    const modalContent = document.getElementById('nextModalContent');
    
    if (modal && modalContent) {
      modalContent.innerHTML = `
        <h2>🎉 Excellent Work!</h2>
        <p>You completed Level ${this.currentLevel}: ${level.title}</p>
        <p><strong>Score:</strong> ${localStorage.getItem('score') || '0'} points</p>
        <p><strong>Badge Level:</strong> ${localStorage.getItem('badgeLevel') || '1'}</p>
        ${nextLevel <= 50 ? `<button id="nextBtn">Continue to Level ${nextLevel}</button>` : ''}
        <button id="homeBtn">🏠 Back to Home</button>
      `;
      
      modal.style.display = 'flex';
      
      // Setup button handlers
      const nextBtn = document.getElementById('nextBtn');
      const homeBtn = document.getElementById('homeBtn');
      
      if (nextBtn) {
        nextBtn.onclick = () => {
          window.location.href = `level${nextLevel}.html`;
        };
      }
      
      if (homeBtn) {
        homeBtn.onclick = () => {
          window.location.href = '../index.html';
        };
      }
    }
  }

  updateProgress() {
    // Add progress indicator
    const container = document.querySelector('.container') || document.body;
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress-bar';
    progressDiv.innerHTML = `
      <div class="progress-info">
        <span>Level ${this.currentLevel} of 50</span>
        <span>Score: ${localStorage.getItem('score') || '0'}</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${(this.currentLevel / 50) * 100}%"></div>
      </div>
    `;
    
    // Insert at the top
    const firstChild = container.firstChild;
    container.insertBefore(progressDiv, firstChild);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new LevelGenerator();
});

// Make checkAnswer globally available
window.checkAnswer = function() {
  if (window.levelGenerator) {
    window.levelGenerator.checkAnswer();
  }
}; 