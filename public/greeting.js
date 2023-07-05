const storedUsername = localStorage.getItem('username');

if (storedUsername) {
  const greetingElement = document.getElementById('username-greeting');
  greetingElement.textContent = 'Hello, ' + storedUsername;
}
