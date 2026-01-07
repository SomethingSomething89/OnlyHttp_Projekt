const notesList = document.getElementById('notesList');
const addNoteBtn = document.getElementById('addNoteBtn');
const noteText = document.getElementById('noteText');

async function fetchNotes() {
  try {
    const res = await fetch('/api/my-items', { credentials: 'include' });
	
	if (res.status === 401) {
      alert('Sesja wygasła');
      window.location.href = 'index.html';
      return;
    }

    const notes = await res.json();

    if (!res.ok) throw new Error(notes.message);

    notesList.innerHTML = '';

    notes.forEach(note => {
      const li = document.createElement('li');

      const textSpan = document.createElement('span');
      textSpan.textContent = note.text;

      // EDIT
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edytuj';
      editBtn.onclick = () => editNote(note.id, note.text);

      // DELETE
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Usuń';
      deleteBtn.onclick = () => deleteNote(note.id);

      li.appendChild(textSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      notesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
}

// ADD
if (addNoteBtn) {
  addNoteBtn.addEventListener('click', async () => {
    const text = noteText.value.trim();
    if (!text) return alert('Wpisz treść notatki');

    await fetch('/api/my-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      credentials: 'include'
    });

    noteText.value = '';
    fetchNotes();
  });
}

// EDIT
async function editNote(id, oldText) {
  const newText = prompt('Edytuj notatkę:', oldText);
  if (!newText) return;

  await fetch(`/api/my-items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: newText }),
    credentials: 'include'
  });

  fetchNotes();
}

// DELETE
async function deleteNote(id) {
  if (!confirm('Na pewno usunąć notatkę?')) return;

  await fetch(`/api/my-items/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  fetchNotes();
}

fetchNotes();
