export function fakeAjax() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

export async function fetchData() {
  await fakeAjax();
  const data = {
    items: [
      {
        id: 1,
        name: "Alice",
        location: "Sh",
        office: "a",
        phoneOffice: "1235",
        phoneCell: "13910000005"
      },
      {
        id: 2,
        name: "Bob",
        location: "Sh",
        office: "c",
        phoneOffice: "1232",
        phoneCell: "13910000002"
      },
      {
        id: 3,
        name: "Carol",
        location: "Sh",
        office: "b",
        phoneOffice: "1233",
        phoneCell: "13910000006"
      }
    ]
  };
  let timestamp = Date.now();

  data.items.forEach((item) => {
    item.isAdd = false;
    item.key = String(timestamp++);
  });
  return data;
}
