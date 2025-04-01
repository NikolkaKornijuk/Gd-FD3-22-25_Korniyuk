// src/components/TagForm.tsx
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTag, renameTag } from "../redux/tagsSlice";
import { Modal } from "react-responsive-modal";
import { Tag } from "../types";

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

const TagForm: React.FC<TagFormProps> = ({ open, onClose, tag }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    } else {
      setName("");
    }
  }, [tag]);

  const handleSubmit = () => {
    if (tag) {
      dispatch(renameTag({ id: tag.id, name }));
    } else {
      dispatch(addTag(name));
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} center>
      <h2>{tag ? "Редактировать тег" : "Добавить тег"}</h2>
      <input
        type="text"
        placeholder="Имя тега"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSubmit}>
        {tag ? "Сохранить изменения" : "Добавить тег"}
      </button>
    </Modal>
  );
};

export default TagForm;
