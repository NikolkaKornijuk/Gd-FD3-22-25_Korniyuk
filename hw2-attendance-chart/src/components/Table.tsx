import React, { useState, useEffect } from "react";

interface AttendanceData {
  [student: string]: {
    [date: string]: boolean;
  };
}

const Table: React.FC = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedData = JSON.parse(
        localStorage.getItem("attendanceData") || "{}"
      );
      if (savedData) {
        setStudents(savedData.students || []);
        setDates(savedData.dates || []);
        setAttendance(savedData.attendance || {});
      }
    } catch (error) {
      console.error("Ошибка загрузки данных", error);
    }
  }, []);

  const toggleAttendance = (student: string, date: string) => {
    setAttendance((prev) => ({
      ...prev,
      [student]: {
        ...prev[student],
        [date]: !prev[student]?.[date],
      },
    }));
  };

  const addStudent = () => {
    const name = prompt("Введите имя студента:");
    if (name) setStudents((prev) => [...prev, name]);
  };

  const addDate = () => {
    const date = prompt("Введите дату занятия (гггг-мм-дд):");
    if (date) setDates((prev) => [...prev, date]);
  };

  const saveData = () => {
    setSaving(true);
    const dataToSave = { students, dates, attendance };
    localStorage.setItem("attendanceData", JSON.stringify(dataToSave));
    setTimeout(() => setSaving(false), 2000);
  };

  return (
    <div>
      <button onClick={addStudent}>Добавить студента</button>
      <button onClick={addDate}>Добавить дату</button>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Имя</th>
              {dates.map((date) => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student}>
                <td>{index + 1}</td>
                <td>{student}</td>
                {dates.map((date) => (
                  <td
                    key={date}
                    onClick={() => toggleAttendance(student, date)}
                  >
                    {attendance[student]?.[date]
                      ? "Присутствует"
                      : "Отсутствует"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={saveData} disabled={saving}>
        {saving ? "Идёт сохранение" : "Сохранить"}
      </button>
    </div>
  );
};

export default Table;
