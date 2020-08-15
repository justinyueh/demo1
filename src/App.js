import React, { useState, useEffect } from "react";
import "./styles.css";

import { fetchData } from "./util";
import Cell from "./Cell";
import t from "./locales";
import Popup from "./Popup";

/**
 *
 * @param {String} key
 * @param {Boolean} sortMethod
 */
function createSort(key, sortMethod) {
  if (sortMethod) {
    return (a, b) => {
      if (a[key] < b[key]) {
        return -1;
      }

      if (a[key] > b[key]) {
        return 1;
      }
      return 0;
    };
  }

  return (a, b) => {
    if (a[key] > b[key]) {
      return -1;
    }

    if (a[key] < b[key]) {
      return 1;
    }
    return 0;
  };
}

export default function App() {
  const [selectMap, setSelectMap] = useState({});
  const [selectedKeys, setselectedKeys] = useState([]);
  const [allSelect, setAllSelect] = useState(false);
  const [items, setItems] = useState([]);
  const [sort, setSort] = useState([]); // ['id', true]

  const [updatedMap, setupdatedMap] = useState({});

  const [deletedIds, setDeletedIds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await fetchData();
      setItems(data.items);
      setSelectMap({});
      setselectedKeys([]);
      setAllSelect(false);
    })();
  }, []);

  useEffect(() => {
    setAllSelect(items.length !== 0 && selectedKeys.length === items.length);
  }, [selectedKeys, items.length]);

  function handleCheckChange(event) {
    const key = event.target.dataset.key;
    let newSelectMap = {};
    let newselectedKeys = [];

    // toggle select all rows
    if (key === "0") {
      if (!allSelect) {
        items.forEach((item) => {
          newselectedKeys.push(item.key);
          newSelectMap[item.key] = true;
        });
      }
      // unselect row
    } else if (selectMap[key]) {
      newSelectMap = {
        ...selectMap,
        [key]: false
      };
      selectedKeys.forEach((item) => {
        if (item !== key) {
          newselectedKeys.push(item);
        }
      });

      // select row
    } else {
      newSelectMap = {
        ...selectMap,
        [key]: true
      };
      newselectedKeys = selectedKeys.concat(key);
    }
    setSelectMap(newSelectMap);
    setselectedKeys(newselectedKeys);
  }

  async function handleDelete() {
    if (!selectedKeys.length) {
      return;
    }

    const newItems = [];
    const newDeletedIds = deletedIds.concat([]);

    items.forEach((item) => {
      if (!selectedKeys.includes(item.key)) {
        newItems.push(item);
      } else {
        if (!item.isAdd) {
          newDeletedIds.push(item.id);
        }
      }
    });
    setSelectMap({});
    setAllSelect(false);
    setselectedKeys([]);
    setDeletedIds(newDeletedIds);
    setItems(newItems);
  }

  function handleAdd() {
    setItems(
      items.concat({
        id: "",
        key: String(Date.now()),
        isAdd: true,
        name: "",
        location: "",
        office: "",
        phoneOffice: "",
        phoneCell: ""
      })
    );
  }

  function handleSort(event) {
    const sortKey = event.target.dataset.sort;
    if (!sortKey) {
      return;
    }

    const newItems = items.concat([]);

    // default desc
    let sortMethod = false;

    if (sort[0] === sortKey) {
      sortMethod = !sort[1];
    }

    newItems.sort(createSort(sortKey, sortMethod));

    setItems(newItems);
    setSort([sortKey, sortMethod]);
  }

  function handleInputChange(key, name, id, value, valueCache, isAdd) {
    let itemIndex = 0;
    items.forEach((item, index) => {
      if (item.key === key) {
        itemIndex = index;
      }
    });

    if (!isAdd) {
      let newupdatedMap = {
        ...updatedMap
      };

      if (!newupdatedMap[id]) {
        if (value !== valueCache) {
          newupdatedMap[id] = [name];
        }
      } else {
        const fieldIndex = newupdatedMap[id].indexOf(name);
        if (fieldIndex !== -1) {
          if (valueCache === value) {
            newupdatedMap[id].splice(fieldIndex, 1);
          }
        } else {
          newupdatedMap[id].push(name);
        }
        if (!newupdatedMap[id].length) {
          delete newupdatedMap[id];
        }
      }
      setupdatedMap(newupdatedMap);
    }

    let newItems = items.concat([]);

    newItems.splice(itemIndex, 1, {
      ...items[itemIndex],
      [name]: value
    });

    setItems(newItems);
  }

  function handleUpdate() {
    let newMessages = [];

    const updatedIds = Object.keys(updatedMap);

    let addedRows = [];

    items.forEach((item) => {
      if (item.isAdd) {
        addedRows.push(item);
      }
    });

    if (addedRows.length) {
      newMessages.push(`${t("Add")}: ${addedRows.length}`);
    }

    if (updatedIds.length) {
      newMessages.push(`${t("Update")}: ${updatedIds.join(",")}`);
    }

    if (deletedIds.length) {
      newMessages.push(`${t("Delete")}: ${deletedIds.join(",")}`);
    }

    setMessages(newMessages);
    setPopup(true);
  }

  return (
    <div className="app">
      <header className="app__haeder">{t("title")}</header>
      <table className="table">
        <thead className="table__head" onClick={handleSort}>
          <tr>
            <th rowSpan="2">
              <input
                data-key="0"
                type="checkbox"
                onChange={handleCheckChange}
                checked={allSelect}
              />
            </th>
            <th rowSpan="2" data-sort="id">
              {t("ID")}
            </th>
            <th rowSpan="2" data-sort="name">
              {t("Name")}
            </th>
            <th rowSpan="2" data-sort="location">
              {t("Location")}
            </th>
            <th rowSpan="2" data-sort="office">
              {t("Office")}
            </th>
            <th colSpan="2">{t("Phone")}</th>
          </tr>
          <tr>
            <th data-sort="phoneOffice">{t("Office")}</th>
            <th data-sort="phoneCell">{t("Cell")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.key}
              className={selectMap[item.key] ? "table__row--selected" : ""}
            >
              <td>
                <input
                  data-key={item.key}
                  type="checkbox"
                  onChange={handleCheckChange}
                  checked={selectMap[item.key] || false}
                />
              </td>
              <td>{item.id}</td>
              <Cell item={item} name="name" onChange={handleInputChange} />

              <Cell item={item} name="location" onChange={handleInputChange} />

              <Cell item={item} name="office" onChange={handleInputChange} />

              <Cell
                item={item}
                name="phoneOffice"
                onChange={handleInputChange}
              />

              <Cell
                item={item}
                name="phoneCell"
                editable
                onChange={handleInputChange}
              />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5">
              <button type="button" onClick={handleDelete}>
                {t("Delete")}
              </button>
            </td>
            <td>
              <button type="button" onClick={handleUpdate}>
                {t("Update")}
              </button>
            </td>
            <td>
              <button type="button" onClick={handleAdd}>
                {t("Add")}
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
      {popup ? (
        <Popup
          messages={messages}
          onClose={() => {
            setPopup(false);
          }}
        />
      ) : null}
    </div>
  );
}
