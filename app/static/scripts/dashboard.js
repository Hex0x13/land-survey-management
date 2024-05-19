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

    const deleteSurveyorBtn = event.target.closest('#surveyor .delete-btn');
    if (deleteSurveyorBtn) {
      const elemID = 'data-surveyor-id';
      const row = deleteSurveyorBtn.closest(`[${elemID}]`);
      const id = row.getAttribute(elemID);
      deleteSurveyor(id).then(() => displaySurveyors());
    }

    const deleteClientBtn = event.target.closest('#clients .delete-btn');
    if (deleteClientBtn) {
      const elemID = 'data-client-id';
      const row = deleteClientBtn.closest(`[${elemID}]`);
      const id = row.getAttribute(elemID);
      deleteClient(id).then(() => displayClients());
    }

  }

  const menu = document.querySelector('.toggle-menu');
  menu.addEventListener('click', () => {
    const body = document.querySelector('.body');
    body.classList.toggle('active');
  });

  document.addEventListener('click', handleClicks);
});