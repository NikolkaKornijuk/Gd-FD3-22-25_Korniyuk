// src/components/App.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NoteForm from "./components/NoteForm";
import TagForm from "./components/TagForm";
import NoteList from "./components/NoteList";
import TagList from "./components/TagList";
import { addNote } from "../src/redux/notesSlice";
import { addTag } from "../src/redux/tagsSlice";
import "react-responsive-modal/styles.css";
import "./App.css";

const App: React.FC = () => {
  const [isNoteFormOpen, setNoteFormOpen] = useState(false);
  const [isTagFormOpen, setTagFormOpen] = useState(false);
  const dispatch = useDispatch();

  // Предзагрузка данных
  useEffect(() => {
    const initialTags = ["Work", "Personal", "Important"];
    const initialNotes = [
      { title: "First Note", text: "This is my first note.", tagId: null },
      { title: "Second Note", text: "This is my second note.", tagId: null },
      { title: "Third Note", text: "This is my third note.", tagId: null },
      { title: "Fourth Note", text: "This is my fourth note.", tagId: null },
      { title: "Fifth Note", text: "This is my fifth note.", tagId: null },
      { title: "Sixth Note", text: "This is my sixth note.", tagId: null },
      { title: "Seventh Note", text: "This is my seventh note.", tagId: null },
      { title: "Eighth Note", text: "This is my eighth note.", tagId: null },
      { title: "Ninth Note", text: "This is my ninth note.", tagId: null },
      { title: "Tenth Note", text: "This is my tenth note.", tagId: null },
    ];

    initialTags.forEach((tag) => dispatch(addTag(tag)));
    initialNotes.forEach((note) =>
      dispatch(addNote(note.text, note.text, note.tagId))
    );
  }, [dispatch]);

  return (
    <div className="app-container">
      <div className="app-container__header">
        <h1>hw4 Smart Notes</h1>
        <div className="header__buttons">
          <button onClick={() => setNoteFormOpen(true)}>Добавить заметку</button>
          <button onClick={() => setTagFormOpen(true)}>Добавить тег</button>
        </div>
      </div>
      <div className="app-container__content">
        <div className="content-notes">
          <NoteForm
            open={isNoteFormOpen}
            onClose={() => setNoteFormOpen(false)}
          />
          <div className="notes-container">
            <h2>Список заметок</h2>
            <NoteList />
          </div>
        </div>
        <div className="content-tags">
          <TagForm open={isTagFormOpen} onClose={() => setTagFormOpen(false)} />
          <div className="tags-container">
            <h2>Список тегов</h2>
            <TagList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
