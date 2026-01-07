const registerBtn = document.getElementById('registerBtn');
const registerMessage = document.getElementById('registerMessage');

if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (!email || !password) {
      registerMessage.textContent = 'Uzupełnij wszystkie pola';
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await res.json();

      if (res.ok) {
        registerMessage.textContent = 'Rejestracja zakończona sukcesem. Przejdź do logowania.';
      } else {
        registerMessage.textContent = data.message;
      }
    } catch (err) {
      console.error(err);
      registerMessage.textContent = 'Błąd serwera';
    }
  });
}