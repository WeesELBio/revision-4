let questions = {};
let currentQuestions = [];
let currentIndex = 0;

const subjectSelect = document.getElementById('subject');
const topicSelect = document.getElementById('topic');
const subtopicSelect = document.getElementById('subtopic');
const difficultySelect = document.getElementById('difficulty');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const feedbackDiv = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');

// Load questions from JSON
fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    populateSubjects();
  });

function populateSubjects() {
  subjectSelect.innerHTML = '<option value="">Select Subject</option>';
  Object.keys(questions).forEach(sub => {
    let opt = document.createElement('option');
    opt.value = sub;
    opt.innerText = sub;
    subjectSelect.appendChild(opt);
  });
}

function populateTopics() {
  topicSelect.innerHTML = '<option value="">Select Topic</option>';
  subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
  feedbackDiv.innerText = '';
  if(!subjectSelect.value) return;
  Object.keys(questions[subjectSelect.value]).forEach(topic => {
    let opt = document.createElement('option');
    opt.value = topic;
    opt.innerText = topic;
    topicSelect.appendChild(opt);
  });
}

function populateSubtopics() {
  subtopicSelect.innerHTML = '<option value="">Select Subtopic</option>';
  feedbackDiv.innerText = '';
  if(!topicSelect.value) return;
  Object.keys(questions[subjectSelect.value][topicSelect.value]).forEach(sub => {
    let opt = document.createElement('option');
    opt.value = sub;
    opt.innerText = sub;
    subtopicSelect.appendChild(opt);
  });
}

function loadQuestions() {
  if(!subtopicSelect.value) return;
  currentQuestions = questions[subjectSelect.value][topicSelect.value][subtopicSelect.value];
  currentIndex = 0;
  showQuestion();
}

function showQuestion() {
  if(currentIndex >= currentQuestions.length){
    questionText.innerText = "No more questions!";
    optionsDiv.innerHTML = '';
    feedbackDiv.innerText = '';
    return;
  }

  const q = currentQuestions[currentIndex];
  questionText.innerText = q.question;
  optionsDiv.innerHTML = '';

  if(difficultySelect.value === 'normal') {
    q.options.forEach(opt => {
      let btn = document.createElement('button');
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(opt);
      optionsDiv.appendChild(btn);
    });
  } else { // hard
    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type your answer';
    optionsDiv.appendChild(input);
    let submit = document.createElement('button');
    submit.innerText = 'Submit';
    submit.onclick = () => checkAnswer(input.value);
    optionsDiv.appendChild(submit);
  }

  feedbackDiv.innerText = '';
}

function checkAnswer(ans) {
  const correct = currentQuestions[currentIndex].answer;
  if(ans.trim().toLowerCase() === correct.trim().toLowerCase()) {
    feedbackDiv.innerText = 'Correct!';
    feedbackDiv.style.color = 'green';
  } else {
    feedbackDiv.innerText = `Wrong! Correct answer: ${correct}`;
    feedbackDiv.style.color = 'red';
  }
}

nextButton.onclick = () => {
  currentIndex++;
  showQuestion();
}

// Event listeners
subjectSelect.onchange = populateTopics;
topicSelect.onchange = populateSubtopics;
subtopicSelect.onchange = loadQuestions;
difficultySelect.onchange = showQuestion;
