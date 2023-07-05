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
  
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, confirm_password })
      });
  
      if (response.ok) {
        window.location.href = '/main.html';
        const username = form.elements.name.value;
        localStorage.setItem('username', username);
      } else {
        const data = await response.json();
        showPopup(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  });  

  function showPopup(message) {
    popupMessage.textContent = message;
    popup.style.display = 'block';
  }

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});
