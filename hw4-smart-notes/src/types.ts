export interface Note {
  id: string;
  title: string;
  text: string;
  tagId?: string | null; // ID тега, если применимо
}

export interface Tag {
  id: string;
  name: string;
  count: number; // Количество заметок с этим тегом
}
