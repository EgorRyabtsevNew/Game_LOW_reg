const form = document.querySelector('form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = form.elements.name.value;
  const email = form.elements.email.value;
  const password = form.elements.password.value;

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
