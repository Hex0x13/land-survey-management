document.addEventListener('DOMContentLoaded', function() {
  
  const form = document.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fData = new FormData(form);
    fetch('/api/test', {
      method: 'POST',
      body: fData,
    })
    .then(response => {
      return response.json();
    })
    .then(data => {
      document.body.innerHTML = '';
      document.body.textContent = data.email;
    });
  });
});