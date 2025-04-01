// src/components/NoteList.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteNote } from "../redux/notesSlice";
import NoteForm from "./NoteForm";
import { Note } from "../types";

const NoteList: React.FC = () => {
  const notes = useSelector((state: any) => state.notes.notes);
  const dispatch = useDispatch();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleDelete = (id: string) => {
    dispatch(deleteNote(id));
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const closeEditModal = () => {
    setEditingNote(null);
  };

  return (
    <div>
      {notes.length === 0 ? (
        <p>Нет заметок</p>
      ) : (
        notes.map((note: any) => (
          <div key={note.id} className="note-item">
            <h3>{note.title || note.text.slice(0, 10) + "..."}</h3>
            <p>{note.text}</p>
            <button onClick={() => handleEdit(note)}>Редактировать</button>
            <button onClick={() => handleDelete(note.id)}>Удалить</button>
          </div>
        ))
      )}
      {editingNote && (
        <NoteForm
          open={!!editingNote}
          onClose={closeEditModal}
          note={editingNote}
        />
      )}
    </div>
  );
};

export default NoteList;
