export default function Table() {
  return <table></table>;

  /* <table>
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
  </table>; */
}
