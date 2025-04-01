// src/components/NoteForm.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addNote, updateNote } from "../redux/notesSlice";
import { Modal } from "react-responsive-modal";
import { Note } from "../types";

interface NoteFormProps {
  open: boolean;
  onClose: () => void;
  note?: Note | null;
}


const NoteForm: React.FC<NoteFormProps> = ({ open, onClose, note }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tagId, setTagId] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setText(note.text);
      setTagId("");
    } else {
      setTitle("");
      setText("");
      setTagId(null);
    }
  }, [note]);

  const handleSubmit = () => {
    if (note) {
      dispatch(updateNote({ ...note, title, text, tagId }));
    } else {
      dispatch(addNote(title, text, tagId));
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} center>
      <h2>{note ? "Редактировать заметку" : "Добавить заметку"}</h2>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Содержание"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="ID тега (если есть)"
        value={tagId || ""}
        onChange={(e) => setTagId(e.target.value ? e.target.value : null)}
      />
      <button onClick={handleSubmit}>
        {note ? "Сохранить изменения" : "Сохранить заметку"}
      </button>
    </Modal>
  );
};

export default NoteForm;
