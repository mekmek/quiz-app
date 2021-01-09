'use strict';

const API_URL = 'https://opentdb.com/api.php?amount=10';
const title = document.getElementById('title');
const msgWindow = document.getElementById('msg-window');
const quizInfo = document.getElementById('quiz-info');
const janre = document.getElementById('janre');
const difficulty = document.getElementById('difficulty');
const choices = document.getElementById('choices');
const restart = document.getElementById('restart');
let quizData = '';
let correctCnt = 0;   // 正解数 
let i = 0;            // クイズデータ配列のインデックス

document.getElementById('start').addEventListener('click', function() {
  title.textContent = '取得中';
  msgWindow.textContent = '少々お待ちください';
  document.getElementById('start').classList.add('hidden');
  
  fetch(API_URL)
    .then(response => {
      if (!response.ok) throw new Error('データの取得に失敗しました');
      return response.json();
    })
    .then(data => {
      quizData = data.results;
      createQuiz(i);
    })
    .catch(e => {
      title.textContent = 'エラー';
      msgWindow.textContent = e.message;
    });
});

restart.addEventListener('click', function() {
  location.reload();
});

function createQuiz(num) {
  const quiz = quizData[num];
  const choicesArr = createChoicesArr(quiz);
  
  title.textContent = `問題${num + 1}`
  janre.textContent = `[ジャンル] ${quiz.category}`
  difficulty.textContent = `[難易度] ${quiz.difficulty}`
  quizInfo.classList.remove('hidden');
  msgWindow.innerHTML = quiz.question;
  choicesArr.forEach(val => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = val;
    btn.addEventListener('click', (e) => {
      choices.textContent = null;
      if (e.target.textContent === quiz.correct_answer) correctCnt++;
      i++;
      if (i < quizData.length) {
        createQuiz(i);
      } else {
        showResults();
      }
    });
    li.appendChild(btn);
    choices.appendChild(li);
  });
}

function createChoicesArr(quiz) {
  quiz.incorrect_answers.push(quiz.correct_answer);
  const choices = quiz.incorrect_answers; 
  for (let j = choices.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    [choices[j], choices[k]] = [choices[k], choices[j]];
  }
  return choices;
}

function showResults() {
  title.textContent = `あなたの正答数は${correctCnt}です！！`;
  quizInfo.classList.add('hidden');
  msgWindow.textContent = '再度チャレンジしたい場合は以下をクリック！！';
  restart.classList.remove('hidden');
}