document.addEventListener('DOMContentLoaded', function() {

  const menu = document.querySelector('.toggle-menu');
  menu.addEventListener('click', () => {
    const body = document.querySelector('.body');
    body.classList.toggle('active');
  });


  function handleClicks(event) {
    const navBtn = event.target.closest('.nav-bar .nav-btn');
    if (navBtn) {
      const navBtns = document.querySelectorAll('.nav-bar .nav-btn');
      const contents = document.querySelector('.main-contents').children;

      for (let i = 0; i < navBtns.length; ++i) {
        const btn = navBtns[i];
        const content = contents[i];
        btn.classList.remove('active');
        content.classList.remove('show');
      }
      
      const contentID = navBtn.getAttribute('data-target-content');
      navBtn.classList.add('active');
      document.querySelector(contentID).classList.add('show');
    }
  }

  document.addEventListener('click', handleClicks);
});