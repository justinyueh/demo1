import React from "react";
import t from "./locales";

export default function Popup({ messages, onClose }) {
  return (
    <div className="popup">
      <div className="popup__body">
        {messages.length ? (
          <ul>
            {messages.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        ) : (
          <div className="popup__text">{t("text1")}</div>
        )}
      </div>
      <div className="popup__footer">
        <button onClick={onClose}>{t("Close")}</button>
      </div>
    </div>
  );
}
