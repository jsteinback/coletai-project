document.getElementById('logo-link').addEventListener('click', () => {
  location.reload();
});


document.getElementById('btn-sair').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/api/pagina-inicial';
});

