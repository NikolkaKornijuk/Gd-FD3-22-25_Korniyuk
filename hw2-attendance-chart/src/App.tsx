import "./App.css";
import Table from "./components/Table";

function App() {
  function addStudent() {
    const student = prompt("Введите ФИО студента");
    console.log(student);
  }

  function addDate() {
    const date = prompt("Введите новую дату");
    console.log(date);
  }

  return (
    <div className="App">
      <button onClick={addStudent}>Add student</button>
      <button onClick={addDate}>Add date</button>
      <Table />
    </div>
  );
}

export default App;
