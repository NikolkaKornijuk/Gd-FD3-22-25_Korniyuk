import React from "react";
import "./App.css";

type ItemsProps = {
  name: string;
  price: number;
  count: number;
  url: string;
};

function MyTable({ headerNames, items }) {
  return (
    <table>
      <thead>
        <tr>
          {headerNames.map((item) => (
            <th key={item}> {item} </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.name}>
            <td>{item.name}</td>
            <td>{item.price}</td>
            <td>{item.count}</td>
            <td>
              <img src={item.url} alt={item.name} width="50" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableRow() {}

function App() {
  const items: ItemsProps[] = [
    {
      name: "Comp1",
      price: 12,
      count: 3,
      url: "https://irecommend.ru/sites/default/files/product-images/2251700/PmkJtuy1955ZLusWjjwv8g.jpg",
    },
    {
      name: "Comp2",
      price: 15,
      count: 6,
      url: "https://overclockers.ru/st/legacy/blog/370824/119347_O.jpg",
    },
    {
      name: "Comp3",
      price: 19,
      count: 1,
      url: "https://i.pinimg.com/originals/d3/5a/18/d35a18ee8ce9a46f1b8e0adc8f26c834.jpg",
    },
  ];

  const tableHeaderNames: string[] = [
    "Наименование",
    "Цена",
    "Остаток",
    "Картинка",
  ];

  return (
    <div className="App">
      <header className="App-header"></header>
      <MyTable headerNames={tableHeaderNames} items={items} />
    </div>
  );
}

export default App;
