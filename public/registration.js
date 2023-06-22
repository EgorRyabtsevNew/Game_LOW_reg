const form = document.querySelector('form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = form.elements.name.value;
  const email = form.elements.email.value;
  const password = form.elements.password.value;
  const confirm_password = form.elements.confirm_password.value;

  if (!validatePassword(password)) {
    alert('Password must be between 8 to 15 characters and contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character.');
    return;
  }

  if (password !== confirm_password) {
    alert('Passwords do not match.');
    return;
  }

  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
});

function validatePassword(password) {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  return pattern.test(password);
}
