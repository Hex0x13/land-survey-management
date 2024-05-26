async function getAllClient() {
  const response = await fetch('/api/get-clients');
  const data = await response.json();
  return data;
}

async function getClient(id) {
  const response = await fetch('/api/get-client?id=' + id);
  const data = await response.json();
  return data;
}

async function insertClient(form) {
  try {
    const formData = new FormData(form);
    const response = await fetch('/api/add-client', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    }
  } catch (error) {
    alert(error);
  }
}

async function deleteClient(id) {
  try {
    const response = await fetch('/api/delete-client?id=' + id, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error)
    }
  } catch (error) {
    alert(error);
  }
}

async function updateClient(id, form) {
  try {
    const formData = new FormData(form);
    formData.append('id', id);
    const response = await fetch('/api/update-client', {
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

async function displayClients() {
  const clients = await getAllClient();
  const tbody = document.querySelector('#clients .data>table>tbody');
  document.querySelector('#dashboard .client.number').textContent = clients.length;
  tbody.innerHTML = '';
  clients.forEach(client => {
    const tr = document.createElement('tr');
    tr.setAttribute('scope', 'row');
    tr.setAttribute('data-client-id', client[0]);
    tr.setAttribute('data-client-email', client[2]);
    Object.values(client).forEach(col => {
      const td = document.createElement('td');
      td.textContent = col;
      td.classList.add('text-center');
      tr.appendChild(td);
    });
    const tdAction = document.createElement('td');
    
    const deleteBtn = document.createElement('button');
    const deleteIcon = document.createElement('i');
    deleteBtn.appendChild(deleteIcon);
    deleteBtn.classList.add('delete-btn', 'bg-transparent', 'border-0');
    deleteIcon.classList.add('icon', 'trash-fill', 'bg-transparent');
    deleteBtn.setAttribute('data-bs-toggle', 'modal');
    deleteBtn.setAttribute('data-bs-target', '#deleteClientModal');

    const editBtn = document.createElement('button');
    const editIcon = document.createElement('i');
    editBtn.appendChild(editIcon);
    editBtn.classList.add('edit-btn', 'bg-transparent', 'border-0');
    editIcon.classList.add('icon', 'pencil-box', 'bg-transparent');
    editBtn.setAttribute('data-bs-toggle', 'modal');
    editBtn.setAttribute('data-bs-target', '#clientModal');

    tdAction.classList.add('text-center');
    tdAction.appendChild(deleteBtn);
    tdAction.appendChild(editBtn);
    tr.appendChild(tdAction);
    tbody.appendChild(tr);
  });
  populateClientsSelect();
}

function loadClientListener() {
  const clientModal = document.querySelector('#clientModal');
  const form = document.querySelector('#clientModal form');
  const submit = document.querySelector('#clientModal [type="submit"]');

  submit.addEventListener('click', function (event) {
    event.preventDefault();
    const operationType = form.getAttribute('data-operation-type');
    if (operationType === 'add') {
      insertClient(form).then(() => {
        displayClients();
      });
    } else {
      updateClient(form.getAttribute('data-id'), form).then(() => {
        displayClients();
        form.removeAttribute('data-id');
      })
    }
    closeModal('#clientModal');
  });

  clientModal.addEventListener('show.bs.modal', function (event) {
    if (event.relatedTarget.classList.contains('add-button')) {
      const label = document.getElementById('clientModalLabel');
      label.textContent = 'Add Client';
      const form = document.querySelector('#clientModal form');
      form.setAttribute('data-operation-type', 'add');
    }

    if (event.relatedTarget.classList.contains('edit-btn')) {
      const label = document.getElementById('clientModalLabel');
      label.textContent = 'Edit Client';
      const form = document.querySelector('#clientModal form');
      form.setAttribute('data-operation-type', 'edit');
      const row = event.relatedTarget.closest('[data-client-id]');
      const id = row.getAttribute('data-client-id');
      form.setAttribute('data-id', id);

      getClient(id).then(data => {
        form.querySelector('#client-firstname').value = data['first_name'];
        form.querySelector('#client-lastname').value = data['last_name'];
        form.querySelector('#client-middlename').value = data['middle_name'];
        form.querySelector('#client-extension').value = data['name_extension'];
        form.querySelector('#client-email').value = data['email'];
        form.querySelector('#client-contact').value = data['contact_number'];
      });
    }
  });

  clientModal.addEventListener('hidden.bs.modal', function () {
    const form = document.querySelector('#clientModal form');
    form.reset();
  });


  const deleteClientModal = document.querySelector('#deleteClientModal');
  const submitDeleteForm = document.querySelector('#deleteClientModal [type="submit"]');

  deleteClientModal.addEventListener('show.bs.modal', event => {
    const row = event.relatedTarget.closest('tr');
    const email = row.getAttribute('data-client-email');
    const id = row.getAttribute('data-client-id');
    deleteClientModal.querySelector('#clientInfo').textContent = email;
    submitDeleteForm.setAttribute('data-client-id', id);
  });

  submitDeleteForm.addEventListener('click', event => {
    event.preventDefault();
    const id = submitDeleteForm.getAttribute('data-client-id');
    deleteClient(id).then(displayClients);
    closeModal('#deleteClientModal');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadClientListener();
  displayClients();
});