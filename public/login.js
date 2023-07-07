document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const form = e.target;
    const name = form.elements.name.value;
    const password = form.elements.password.value;
  
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });
  
      const responseData = await response.text();
      console.log(responseData); 
  
      if (response.ok) {
        try {
          const data = JSON.parse(responseData);
          const username = data.username;
          localStorage.setItem('username', username);
  
          window.location.href = '/main.html';
        } catch (error) {
          console.error('Error parsing JSON:', error);
          showPopup('An error occurred. Please try again.');
        }
      } else {
        showPopup('Invalid name or password');
      }
    } catch (error) {
      console.error('Error:', error);
      showPopup('An error occurred. Please try again.');
    }
  });
  
  function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
  
    popupMessage.textContent = message;
    popup.style.display = 'block';
  }
  
  document.getElementById('close').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
  });
  