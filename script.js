let questionsData;
let currentQuestions = [];
let currentIndex = 0;

const subjectSelect = document.getElementById('subject');
const topicSelect = document.getElementById('topic');
const subtopicSelect = document.getElementById('subtopic');
const startBtn = document.getElementById('start-btn');

const quizDiv = document.getElementById('quiz');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questionsData = data;
    populateSelect(subjectSelect, Object.keys(data));
  });

function populateSelect(select, options) {
  select.innerHTML = '';
  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.textContent = opt;
    select.appendChild(option);
  });
}

subjectSelect.addEventListener('change', () => {
  const topics = Object.keys(questionsData[subjectSelect.value]);
  populateSelect(topicSelect, topics);
  topicSelect.dispatchEvent(new Event('change'));
});

topicSelect.addEventListener('change', () => {
  const subtopics = Object.keys(questionsData[subjectSelect.value][topicSelect.value]);
  populateSelect(subtopicSelect, subtopics);
});

startBtn.addEventListener('click', () => {
  const subtopicQuestions = questionsData[subjectSelect.value][topicSelect.value][subtopicSelect.value];
  currentQuestions = shuffle(subtopicQuestions);
  currentIndex = 0;
  document.getElementById('selection').classList.add('hidden');
  quizDiv.classList.remove('hidden');
  showQuestion();
});

function showQuestion() {
  const q = currentQuestions[currentIndex];
  questionText.textContent = q.question;
  optionsDiv.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => checkAnswer(opt));
    optionsDiv.appendChild(btn);
  });
  nextBtn.disabled = true;
}

function checkAnswer(selected) {
  const correct = currentQuestions[currentIndex].answer;
  if (selected === correct) {
    alert('Correct!');
  } else {
    alert(`Wrong! Correct answer: ${correct}`);
  }
  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < currentQuestions.length) {
    showQuestion();
  } else {
    alert('Quiz finished!');
    location.reload();
  }
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
