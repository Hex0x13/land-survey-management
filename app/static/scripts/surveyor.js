async function getAllSurveyor() {
  const response = await fetch('/api/get-surveyors');
  const data = await response.json();
  return data;
}

async function getSurveyor(id) {
  const response = await fetch('/api/get-surveyor?id='+id);
  const data = await response.json();
  return data;
}

async function insertSurveyor(form) {
  try {
    const formData = new FormData(form);
    const response = await fetch('/api/add-surveyor', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    }
  } catch(error) {
    alert(error);
  }
}

async function deleteSurveyor(id) {
  try {
    const response = await fetch('/api/delete-surveyor?id='+id, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    }
  } catch(error) {
    alert(error);
  }
}

async function updateSurveyor(id, form) {
  try {
    const formData = new FormData(form);
    formData.append('id', id);
    const response = await fetch('/api/update-surveyor', {
      method: 'PATCH',
      body: formData
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    }
  } catch (error) {
    alert(error);
  }
}

async function displaySurveyors() {
  const surveyors = await getAllSurveyor();
  const tbody = document.querySelector('#surveyor .data>table>tbody');
  document.querySelector('#dashboard .surveyor.number').textContent = surveyors.length;
  tbody.innerHTML = '';
  surveyors.forEach(surveyor => {
    const tr = document.createElement('tr');
    tr.setAttribute('scope', 'row');
    tr.setAttribute('data-surveyor-id', surveyor[0]);
    tr.setAttribute('data-surveyor-email', surveyor[2]);
    Object.values(surveyor).forEach(col => {
      const td = document.createElement('td');
      td.textContent = col;
      td.classList.add('text-center')
      tr.appendChild(td);
    });
    const tdAction = document.createElement('td');

    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('i');
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add('delete-btn', 'bg-transparent', 'border-0');
    deleteIcon.classList.add('icon', 'trash-fill', 'bg-transparent');
    deleteBtn.setAttribute('data-bs-toggle', 'modal');
    deleteBtn.setAttribute('data-bs-target', '#deleteSurveyorModal');

    const editBtn = document.createElement('button');
    const editIcon = document.createElement('i');
    editBtn.appendChild(editIcon);
    editBtn.classList.add('edit-btn', 'bg-transparent', 'border-0');
    editIcon.classList.add('icon', 'pencil-box', 'bg-transparent');
    editBtn.setAttribute('data-bs-toggle', 'modal');
    editBtn.setAttribute('data-bs-target', '#surveyorModal');

    tdAction.classList.add('text-center')
    tdAction.appendChild(deleteBtn);
    tdAction.appendChild(editBtn);
    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });
  populatesurveyorSelect();
}

function loadSurveyorListener() {
  const surveyorModal = document.querySelector('#surveyorModal');
  const form = document.querySelector('#surveyorModal form');
  const submit = document.querySelector('#surveyorModal [type="submit"]');

  submit.addEventListener('click', function(event) {
    event.preventDefault();
    const operationType = form.getAttribute('data-operation-type');
    if (operationType === 'add') {
      insertSurveyor(form).then(() => {
        displaySurveyors();
      });
    } else {
      updateSurveyor(form.getAttribute('data-id'), form).then(() => {
        displaySurveyors();
        form.removeAttribute('data-id');
      })
    }
    closeModal('#surveyorModal');
  });

  surveyorModal.addEventListener('show.bs.modal', function(event) {
    if (event.relatedTarget.classList.contains('add-button')) {
      const label = document.getElementById('surveyorModalLabel');
      label.textContent = 'Add Surveyor';
      const form = document.querySelector('#surveyorModal form');
      form.setAttribute('data-operation-type', 'add');
    }

    if (event.relatedTarget.classList.contains('edit-btn')) {
      const label = document.getElementById('surveyorModalLabel');
      label.textContent = 'Edit Surveyor';
      const form = document.querySelector('#surveyorModal form');
      form.setAttribute('data-operation-type', 'edit');
      const row = event.relatedTarget.closest('[data-surveyor-id]');
      const id = row.getAttribute('data-surveyor-id');
      form.setAttribute('data-id', id);
      
      getSurveyor(id).then(data => {
        form.querySelector('#surveyor-firstname').value = data['first_name'];
        form.querySelector('#surveyor-lastname').value = data['last_name'];
        form.querySelector('#surveyor-middlename').value = data['middle_name'];
        form.querySelector('#surveyor-extension').value = data['name_extension'];
        form.querySelector('#surveyor-email').value = data['email'];
        form.querySelector('#surveyor-title').value = data['title'];
        form.querySelector('#surveyor-contact').value = data['contact_number'];
      });
    }
  });
  
  surveyorModal.addEventListener('hidden.bs.modal', function() {
      const form = document.querySelector('#surveyorModal form');
      form.reset();
  });


  const deleteSurveyorModal = document.querySelector('#deleteSurveyorModal');
  const submitDeleteForm = document.querySelector('#deleteSurveyorModal [type="submit"]');

  deleteSurveyorModal.addEventListener('show.bs.modal', event => {
    const row = event.relatedTarget.closest('tr');
    const email = row.getAttribute('data-surveyor-email');
    const id = row.getAttribute('data-surveyor-id');
    deleteSurveyorModal.querySelector('#surveyorInfo').textContent = email;
    submitDeleteForm.setAttribute('data-surveyor-id', id);
  });

  submitDeleteForm.addEventListener('click', event => {
    event.preventDefault();
    const id = submitDeleteForm.getAttribute('data-surveyor-id');
    deleteSurveyor(id).then(displaySurveyors);
    closeModal('#deleteSurveyorModal');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSurveyorListener();
  displaySurveyors();
});