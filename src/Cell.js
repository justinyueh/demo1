import React, { useState, useRef } from "react";
import classNames from "classnames";
import Popup from "./Popup";
import t from "./locales";

export default function Cell({ item, name, editable, onChange }) {
  const inputEl = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(item[name]);
  const [valueCache] = useState(item[name]);
  const [messages, setMessages] = useState([]);
  const [popup, setPopup] = useState(false);

  const canEdit = editable || item.isAdd;

  function handleBlur() {
    // Check phone number format.
    if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/.test(value)) {
      setMessages([t("text2")]);
      setPopup(true);
      return;
    }
    setEditMode(false);
    if (value !== item[name]) {
      onChange(item.key, name, item.id, value, valueCache, item.isAdd);
    }
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "Enter":
        handleBlur();
        break;
      case "Escape":
        setEditMode(false);
        break;
      default:
        break;
    }
  }

  return (
    <td
      className={classNames("table__td", {
        "table__td--changed": value !== valueCache
      })}
      onDoubleClick={() => {
        if (!canEdit) {
          return;
        }
        setEditMode(true);
        setTimeout(() => {
          if (inputEl.current) {
            inputEl.current.focus();
          }
        }, 100);
      }}
    >
      {editMode ? (
        <input
          type="text"
          value={value}
          className="table__input"
          ref={inputEl}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      ) : (
        <>{item[name]}</>
      )}
      {popup ? (
        <Popup
          messages={messages}
          onClose={() => {
            setPopup(false);
          }}
        />
      ) : null}
    </td>
  );
}
