// src/components/TagList.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTag } from "../redux/tagsSlice";
import TagForm from "./TagForm";
import { Tag } from "../types";

const TagList: React.FC = () => {
  const tags = useSelector((state: any) => state.tags.tags);
  const dispatch = useDispatch();
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleDelete = (id: string) => {
    dispatch(deleteTag(id));
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
  };

  const closeEditModal = () => {
    setEditingTag(null);
  };

  return (
    <div>
      {tags.length === 0 ? (
        <p>Нет тегов</p>
      ) : (
        tags.map((tag: Tag) => (
          <div key={tag.id} className="tag-item">
            <h3>{tag.name}</h3>
            <button onClick={() => handleEdit(tag)}>Редактировать</button>
            <button onClick={() => handleDelete(tag.id)}>Удалить</button>
          </div>
        ))
      )}
      {editingTag && (
        <TagForm
          open={!!editingTag}
          onClose={closeEditModal}
          tag={editingTag}
        />
      )}
    </div>
  );
};

export default TagList;
