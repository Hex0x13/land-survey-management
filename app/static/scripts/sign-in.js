document.addEventListener('DOMContentLoaded', function () {
  function handleClicks(event) {
    const target = event.target;
    
    const nextBtn = target.closest('.next-btn');
    if (nextBtn) {
      const formSlide = nextBtn.closest('.form-slide');
      showFormSlide(+formSlide.getAttribute('data-slide-number') + 1);
    }

    const backBtn = target.closest('.back-btn');
    if (backBtn) {
      const formSlide = backBtn.closest('.form-slide');
      showFormSlide(+formSlide.getAttribute('data-slide-number') - 1);
    }
  }

  function showFormSlide(number) {
    const formSlides = document.querySelectorAll('.form-slide');
    formSlides.forEach(slide => {
      slide.classList.remove('show');
      if (number === +slide.getAttribute('data-slide-number')) {
        slide.classList.add('show');
      }
    });
  }

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

  document.addEventListener('click', handleClicks);
});