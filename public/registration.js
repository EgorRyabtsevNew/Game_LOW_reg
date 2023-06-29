window.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector('form');
  const popup = document.getElementById('popup');
  const popupMessage = document.getElementById('popup-message');
  const closeBtn = document.getElementById('close');

  form.addEventListener('submit', async event => {
    event.preventDefault();
  
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const password = form.elements.password.value;
    const confirm_password = form.elements.confirm_password.value;
  
    if (!validatePassword(password)) {
      showPopup('Password must be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.');
      return;
    }
  
    if (password !== confirm_password) {
      showPopup('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
  
      if (response.ok) {
        window.location.href = '/main.html';
      } else {
        const data = await response.json();
        showPopup(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  });  

  function validatePassword(password) {
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    return pattern.test(password);
  }

  function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
  }

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});
