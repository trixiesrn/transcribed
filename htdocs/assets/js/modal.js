document.addEventListener('DOMContentLoaded', () => {
  const modalButton = document.getElementById('addMessageButton');
  const modal = document.getElementById('addMessageContainer');
  const closeButtons = modal.querySelectorAll('.c-modal__close-button');

  modalButton.onclick = function() {
    modal.style.display = 'block';
  };

  closeButtons.forEach(button => {
    button.onclick = function() {
      modal.style.display = 'none';
    };
  });

  // Optional: Close modal if user clicks outside the modal content
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
});
