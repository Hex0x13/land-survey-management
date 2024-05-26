function closeModal(modalID) {
  document.querySelector(modalID).classList.remove('show');
  document.querySelector(modalID).style.display = 'none';
  document.querySelector('body').classList.remove('modal-open');
  document.querySelector('.modal-backdrop').remove();
}

document.addEventListener('DOMContentLoaded', function() {
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

    const view = event.target.closest('.trigger-view');
    if (view) {
      const id = view.getAttribute('data-id');
      getProject(id).then(displayProjectDetails);
    }

    const deleteProjectBtn = event.target.closest('[data-bs-target="#deleteProjectModal"]');
    if (deleteProjectBtn) {
      const deleteModal = deleteProjectBtn.getAttribute('data-bs-target')
      const modal = document.querySelector(deleteModal);
      modal.querySelector('#projectInfo').textContent = deleteProjectBtn.getAttribute('data-name');
      const id = deleteProjectBtn.getAttribute('data-id');
      modal.setAttribute('data-project-id', id);
      displayProjects();
    }
  }

  const menu = document.querySelector('.toggle-menu');
  menu.addEventListener('click', () => {
    const body = document.querySelector('.body');
    body.classList.toggle('active');
  });

  document.addEventListener('click', handleClicks);
});