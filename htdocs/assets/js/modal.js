document.addEventListener('DOMContentLoaded', () => {
  const answerRandomQuestionButton = document.getElementById('answerRandomQuestionButton');
  const answerRandomQuestionContainer = document.getElementById('answerRandomQuestionContainer');

  answerRandomQuestionButton.onclick = function() {
    answerRandomQuestionContainer.style.display = 'block';
    sendMessageContainer.style.display = 'none';
    askQuestionContainer.style.display = 'none';
  };

  const sendMessageButton = document.getElementById('sendMessageButton');
  const sendMessageContainer = document.getElementById('sendMessageContainer');

  sendMessageButton.onclick = function() {
    answerRandomQuestionContainer.style.display = 'none';
    sendMessageContainer.style.display = 'block';
    askQuestionContainer.style.display = 'none';
  };

  const askQuestionButton = document.getElementById('askQuestionButton');
  const askQuestionContainer = document.getElementById('askQuestionContainer');

  askQuestionButton.onclick = function() {
    answerRandomQuestionContainer.style.display = 'none';
    sendMessageContainer.style.display = 'none';
    askQuestionContainer.style.display = 'block';
  };
});
