document.addEventListener("DOMContentLoaded", function() {
  // Function to extract query parameter from URL
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to remove query parameter from URL
  function removeQueryParam(name) {
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.replaceState({}, document.title, url);
  }

  // Get error message from URL parameter
  const errorMessage = getQueryParam('error');

  // If there's an error message, display it and remove it from URL
  if (errorMessage) {
    const errorMessageContainer = document.getElementById('error-message');
    errorMessageContainer.innerText = errorMessage;
    errorMessageContainer.style.display = 'block';
    removeQueryParam('error');
  }
});
