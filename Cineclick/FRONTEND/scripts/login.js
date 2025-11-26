const API_URL = 'http://127.0.0.1:3000'; 

function toggleForms() {
  const form_login = document.getElementById('formLogin');
  const form_register = document.getElementById('formRegister');
  const title = document.querySelector('.card-title');

  if (form_register.style.display === 'none') {
    form_login.style.display = 'none';
    form_register.style.display = 'block';
    title.textContent = 'Registro';
  } else {
    form_login.style.display = 'block';
    form_register.style.display = 'none';
    title.textContent = 'Inicio de Sesión';
  }
}

function handleSuccess(userId, authKey) {
  localStorage.clear(); // Limpiar todo antes de guardar nuevos datos
  localStorage.setItem('user_id', userId);
  localStorage.setItem('user_auth_key', authKey);
  window.location.href = '/Cineclick/FRONTEND/views/PW_Home.html';
}

// --- Registro ---
async function validateRegister(event) {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const newPwd = document.getElementById('newPwd').value;
  const confirmPwd = document.getElementById('confirmPwd').value;

  if (newPwd !== confirmPwd) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  const data = {
    name: document.getElementById('newName').value,
    email: document.getElementById('newEmail').value,
    password: newPwd,
    confirm_password: confirmPwd,
  };

  try {
    const response = await fetch(API_URL + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('¡Registro exitoso! Por favor inicia sesión.');
      form.reset();
      form.classList.remove('was-validated');
      toggleForms();
    } else {
      const errorText = await response.text();
      alert('Fallo en el registro: ' + errorText);
    }
  } catch (err) {
    alert('Error de conexión con el servidor.');
  }
}

// --- Login ---
async function validateLogin(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('pwd').value;

  try {
    const response = await fetch(API_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      handleSuccess(data.user_id, data.auth_key);
    } else {
      const errorText = await response.text();
      alert('Login fallido: ' + errorText);
    }
  } catch (err) {
    alert('Error de conexión con el servidor.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formLogin').addEventListener('submit', validateLogin);
  document.getElementById('formRegister').addEventListener('submit', validateRegister);
});
