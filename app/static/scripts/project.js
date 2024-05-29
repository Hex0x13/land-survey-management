async function getAllProjects() {
  try {
    const response = await fetch('/projects');
    const data = await response.json();
    if (data.status === 'error') {
      alert(data.message);
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getProject(id) {
  try {
    const response = await fetch(`/project/${id}`);
    const data = await response.json();
    if (data.status === 'error') {
      alert(data.message);
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function deleteProject(id) {
  try {
    const response = await fetch(`/delete-project/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    if (data.status === 'error') {
      alert(data.message);
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}


async function populateClientsSelect() {
  const selectElement = document.getElementById('project-client');
  
  // Clear existing options
  selectElement.innerHTML = '';

  try {
    // Fetch clients
    const clients = await getAllClient();
    // Populate select options
    clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client[0];
      option.textContent = client[1];
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
}

async function populatesurveyorSelect() {
  const selectElement = document.getElementById('project-surveyor');
  
  // Clear existing options
  selectElement.innerHTML = '';

  try {
    // Fetch clients
    const clients = await getAllSurveyor();
    const option = document.createElement('option');
    option.id = 'surveyorSelectPlaceholder';
    option.value = '';
    option.textContent = 'Select Surveyor';
    selectElement.setAttribute('selected', 'selected');
    option.disabled = true;
    selectElement.appendChild(option);
    // Populate select options
    clients.forEach(client => {
      const option = document.createElement('option');
      option.value = client[0];
      option.textContent = client[1];
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
  selectElement.value = '';
}

function isSurveyorAdded(surveyorId) {
  const existingSurveyors = document.querySelectorAll('#addedSurveyor td:first-child');
  for (const surveyor of existingSurveyors) {
    if (surveyor.textContent === surveyorId) {
      return true;
    }
  }
  return false;
}

function displayUploadedFiles(imgUploadUploadedFiles) {
  const imageContainer = document.getElementById('img-upload-uploaded-images');
  imageContainer.innerHTML = '';

  if (imgUploadUploadedFiles && imgUploadUploadedFiles.length <= 0) {
      const noImageElement = document.createElement("p");
      noImageElement.textContent = "No images available.";
      imageContainer.appendChild(noImageElement);
  }

  imgUploadUploadedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const div = document.createElement('div');
      div.classList.add('card', 'rounded');
      
      div.innerHTML = `
        <img src="${e.target.result}" class="card-img-top" alt="${file.name}">
        <div class="card-body text-center rounded-bottom">
          <button type="button" class="btn btn-danger btn-sm remove-image" data-index="${index}">Remove</button>
        </div>
      `;
      imageContainer.appendChild(div);

      div.querySelector('.remove-image').addEventListener('click', function() {
        imgUploadUploadedFiles.splice(index, 1);
        displayUploadedFiles(imgUploadUploadedFiles);
      });

    };
    reader.readAsDataURL(file);

  });
}


function fillFormWithProjectData(projectData) {
    // Populate form fields with project data
    document.getElementById('project-name').value = projectData.Name;
    document.getElementById('project-client').value = projectData.client_id;

    const startTime = new Date(projectData.time_started).toISOString().slice(0, 16);
    const endTime = new Date(projectData.time_ended).toISOString().slice(0, 16);

    // Set the values of the datetime-local input fields
    document.getElementById('project-start').value = startTime;
    document.getElementById('project-end').value = endTime;

    document.getElementById('project-description').value = projectData.Description;

    // Populate address details
    document.getElementById('land-parcel-legal').value = projectData.Legal_Description;
    document.getElementById('land-parcel-street').value = projectData.Street;
    document.getElementById('land-parcel-subdivision').value = projectData.Subdivision;
    document.getElementById('land-parcel-city').value = projectData.City;
    document.getElementById('land-parcel-province').value = projectData.Province;
    document.getElementById('land-parcel-zipcode').value = projectData.ZipCode;
    document.getElementById('land-parcel-area').value = projectData.area;

  
  const surveyorTableBody = document.getElementById('addedSurveyor');
  surveyorTableBody.innerHTML = '';
  projectData.surveyors.forEach(surveyor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="surveyor-id">${surveyor[0]}</td>
      <td>${surveyor[1]}</td>
      <td>${surveyor[3]}</td>
      <td>
        <button type="button" class="btn btn-danger btn-sm remove-surveyor">Remove</button>
      </td>
    `;
    surveyorTableBody.appendChild(row);

    row.querySelector('.remove-surveyor').addEventListener('click', function() {
      row.remove();
    }, { once: true });
  });

}


// Function to create a project card
function createProjectCard(project) {
  const card = document.createElement('div');
  card.classList.add('card', 'm-2', 'p-3');

  const image = document.createElement('img');
  image.style.width = '200px';
  image.style.height = '200px';
  image.style.objectFit = 'cover';
  image.style.objectPosition = 'bottom';
  image.classList.add('card-img-top');
  // Set the image source based on project data
  // Assuming project data contains imageURL property
  if (project.image) {
    image.src = 'static/uploads/' + project.image.url; // Assuming first image URL is used
  } else {
    image.src = 'static/images/no-image.png';
  }
  image.alt = 'first project image';
  card.appendChild(image);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body', 'lss-bg-white');

  const title = document.createElement('h5');
  title.classList.add('card-title', 'lss-bg-white', 'lss-fg-black', 'text-center');
  title.textContent = project.Name;
  cardBody.appendChild(title);

  const footer = document.createElement('div');
  footer.classList.add('card-footer', 'd-flex', 'justify-content-end', 'align-items-end');

  const clientName = document.createElement('p');
  clientName.classList.add('bg-transparent', 'lss-fg-black', 'p-0', 'my-0', 'mr-auto', 'w-100');
  clientName.style.maxWidth = '90px';
  clientName.style.textWrap = 'nowrap';
  clientName.style.overflow = 'hidden';
  clientName.style.textOverflow = 'ellipsis';
  clientName.textContent = project.full_name;
  footer.appendChild(clientName);

  const viewButton = document.createElement('button');
  const viewIcon = document.createElement('i');
  viewIcon.classList.add('icon', 'view', 'bg-transparent', 'border-0');
  viewButton.classList.add('bg-transparent', 'border-0', 'trigger-view');
  viewButton.setAttribute('data-id', project.ID);
  viewButton.setAttribute('data-bs-toggle', 'modal');
  viewButton.setAttribute('data-bs-target', '#projectViewModal');
  viewButton.appendChild(viewIcon);
  footer.appendChild(viewButton);

  const editButton = document.createElement('button');
  const editIcon = document.createElement('i');
  editIcon.classList.add('icon', 'pencil-box', 'bg-transparent', 'border-0');
  editButton.classList.add('bg-transparent', 'border-0', 'edit-toggler');
  editButton.setAttribute('data-id', project.ID);
  editButton.setAttribute('data-bs-toggle', 'modal');
  editButton.setAttribute('data-bs-target', '#projectModal');
  editButton.appendChild(editIcon);
  footer.appendChild(editButton);

  const deleteButton = document.createElement('button');
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('icon', 'trash-fill', 'bg-transparent', 'border-0');
  deleteButton.classList.add('bg-transparent', 'border-0');
  deleteButton.setAttribute('data-id', project.ID);
  deleteButton.setAttribute('data-name', project.Name);
  deleteButton.setAttribute('data-bs-toggle', 'modal');
  deleteButton.setAttribute('data-bs-target', '#deleteProjectModal');
  deleteButton.appendChild(deleteIcon);
  footer.appendChild(deleteButton);

  card.appendChild(cardBody);
  card.appendChild(footer);

  return card;
}

// Function to display all projects
async function displayProjects() {
  const projectCardsContainer = document.getElementById('projectCards');
  projectCardsContainer.innerHTML = '';

  try {
    const projects = await getAllProjects();
    document.querySelector('#dashboard .project.number').textContent = projects.length;
    projects.forEach(project => {
      const card = createProjectCard(project);
      projectCardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayProjectDetails(project) {
  const projectViewImage = document.getElementById('projectViewImage');
  const projectViewName = document.getElementById('projectViewName');
  const projectViewClient = document.getElementById('projectViewClient');
  const projectViewStartDate = document.getElementById('projectViewStartDate');
  const projectViewEndDate = document.getElementById('projectViewEndDate');
  const projectViewDescription = document.getElementById('projectViewDescription');
  const projectViewAddress = document.getElementById('projectViewAddress');
  const projectViewSurveyors = document.getElementById('projectViewSurveyors');
  const projectViewImages = document.getElementById('projectViewImages');

  projectViewSurveyors.innerHTML = '';
  projectViewImages.innerHTML = '';
  projectViewImage.style.height = '300px';
  projectViewImage.style.width = '271px';
  projectViewImage.style.objectFit = 'cover';

  // Set project details
  projectViewImage.src = (project.images.length > 0)? 'static/uploads/' + project.images[0].url : 'static/images/no-image.png';
  projectViewName.textContent = project.Name;
  projectViewClient.textContent = `${project.client_first_name} ${project.client_last_name}`;
  projectViewClient.setAttribute('data-client-id', project.client_id);
  projectViewStartDate.textContent = formatDate(project.time_started);
  projectViewEndDate.textContent = formatDate(project.time_ended);
  projectViewDescription.textContent = project.Description;
  projectViewAddress.textContent = `${project.Legal_Description}, ${project.Street}, ${project.Subdivision}, ${project.City}, ${project.Province}, ${project.ZipCode}`;

  // Populate surveyors
  project.surveyors.forEach(surveyor => {
    const listItem = document.createElement('tr');
    listItem.setAttribute('surveyor-id', surveyor[0]);
    listItem.setAttribute('scope', 'row');

    const name = document.createElement('td');
    name.classList.add('text-center');
    name.textContent = surveyor[1];
    listItem.appendChild(name);

    const email = document.createElement('td');
    email.textContent = surveyor[2];
    email.classList.add('text-center');
    listItem.appendChild(email);

    
    const title = document.createElement('td');
    title.textContent = surveyor[4];
    title.classList.add('text-center');
    listItem.appendChild(title);
  
    const contact = document.createElement('td');
    contact.textContent = surveyor[3];
    contact.classList.add('text-center');
    listItem.appendChild(contact);

    projectViewSurveyors.appendChild(listItem);
  });

  // Populate images
  project.images.forEach(image => {
    const imageCol = document.createElement('div');
    imageCol.classList.add('col-md-3', 'mb-3');
    const imageElement = document.createElement('img');
    imageElement.src = 'static/uploads/' + image.url;
    imageElement.classList.add('img-fluid', 'rounded');
    imageCol.appendChild(imageElement);
    projectViewImages.appendChild(imageCol);
  });

}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}


document.addEventListener('DOMContentLoaded', () => {
  const imgUploadUploadedFiles = [];
  const projectModal = document.getElementById('projectModal');

  document.getElementById('img-upload-project-files').addEventListener('change', function(event) {
    const files = Array.from(event.target.files);

    files.forEach(file => {
      if (!imgUploadUploadedFiles.some(f => f.name === file.name)) {
        imgUploadUploadedFiles.push(file);
      }
    });

    displayUploadedFiles(imgUploadUploadedFiles);
  });


  const surveyorSelect = document.getElementById('project-surveyor');
  surveyorSelect.addEventListener('change', function() {
    // Retrieve selected surveyor information
    const selectedSurveyorId = this.value;
    const selectedSurveyorName = this.options[this.selectedIndex].text;

    // Check if the surveyor is already added
    if (!isSurveyorAdded(selectedSurveyorId)) {
      // Add selected surveyor to the addedSurveyor table
      const tableBody = document.getElementById('addedSurveyor');
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td class="surveyor-id">${selectedSurveyorId}</td>
        <td>${selectedSurveyorName}</td>
        <td>Title</td>
        <td><button class="btn btn-danger btn-sm remove-surveyor">Remove</button></td>
      `;
      tableBody.appendChild(newRow);

      // Add event listener to remove surveyor button
      newRow.querySelector('.remove-surveyor').addEventListener('click', function() {
        newRow.remove();
      }, { once: true });
    }
    surveyorSelect.value = '';
  });


  const form = document.getElementById('projectForm');
  const submit = form.querySelector('[type="submit"]');
  submit.addEventListener('click', function(event) {
    event.preventDefault();
    
    // Create FormData object to gather form data
    const formData = new FormData(form);

    // Gather data from image uploader
    const uploadedImages = document.getElementById('img-upload-project-files').files;
    for (let i = 0; i < uploadedImages.length; ++i) {
      formData.append('uploadedImage', uploadedImages[i]);
    }

    // Gather data from surveyor select (if any)
    const tableBody = document.getElementById('addedSurveyor');
    const surveyors = tableBody.querySelectorAll('.surveyor-id');
    surveyors.forEach(surveyor => {
      formData.append('surveyor_id', surveyor.textContent);
    })
    const projectID = projectModal.getAttribute('data-project-id')
    if (projectID) {
      fetch('/update-project/'+projectID, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'error') {
          alert(data.message);
        } else {
          displayProjects();
          form.reset();
        }
      })
      .then(() => {
        closeModal('#projectModal');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    } else {
      fetch('/add-project', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'error') {
          alert(data.message);
        } else {
          displayProjects();
          form.reset();
        }
      })
      .then(() => {
        closeModal('#projectModal');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  });


  const deleteModal = document.querySelector('#deleteProjectModal');
  const delFormSubmitBtn = deleteModal.querySelector('[type="submit"]');
  delFormSubmitBtn.addEventListener('click', event => {
    event.preventDefault();
    const id = deleteModal.getAttribute('data-project-id');
    deleteProject(id);
    closeModal('#deleteProjectModal');
    displayProjects();
  });

  projectModal.addEventListener('hidden.bs.modal', () => {
    form.reset();
    projectModal.removeAttribute('data-project-id')
    surveyorSelect.value = '';
  });

  projectModal.addEventListener('show.bs.modal', (event) => {
    const edit = event.relatedTarget.closest('.edit-toggler');
    if (edit) {
      const id = edit.getAttribute('data-id');
      getProject(id).then(fillFormWithProjectData);
      projectModal.setAttribute('data-project-id', id);
    }
  });


  displayProjects();
});