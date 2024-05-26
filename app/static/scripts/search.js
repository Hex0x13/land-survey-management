document.addEventListener('DOMContentLoaded', () => {
  const searchbox = document.getElementById('searchbox');
  searchbox.addEventListener('input', async event => {
    const query = searchbox.value;
    const response = await fetch(`/search?query=${query}`);
    const data = await response.text();
    document.getElementById('query-results').innerHTML = data;
  });

  searchbox.addEventListener('focusout', event => {
    setTimeout(() => {
      document.getElementById('query-results').innerHTML = '';
    }, 100);
  });
});