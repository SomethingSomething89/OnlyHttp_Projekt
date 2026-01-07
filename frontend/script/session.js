export async function checkSession() {
  try {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateStatus() {
  const statusEl = document.getElementById('status');
  if (!statusEl) return;

  const user = await checkSession();
  statusEl.textContent = user
    ? `Zalogowany jako ${user.email}`
    : 'Nie zalogowany';
}

export async function redirectIfLoggedIn() {
  const user = await checkSession();
  if (user) {
    window.location.href = 'notes.html';
  }
}

export async function redirectIfNotLoggedIn() {
  const user = await checkSession();
  if (!user) {
    window.location.href = 'index.html';
  }
}

export async function logout() {
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = 'index.html';
}

