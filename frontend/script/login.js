const loginBtn = document.getElementById('loginBtn');
const loginMessage = document.getElementById('loginMessage');

if (loginBtn) {
  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
      loginMessage.textContent = 'Uzupełnij wszystkie pola';
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = 'notes.html';
      } else {
        loginMessage.textContent = data.message;
      }
    } catch (err) {
      console.error(err);
      loginMessage.textContent = 'Błąd serwera';
    }
  });
}