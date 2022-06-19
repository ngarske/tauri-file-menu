import { useState, useEffect } from 'react'
import './App.css'
import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { save, open } from "@tauri-apps/api/dialog";
import { listen } from "@tauri-apps/api/event";

function App() {
  const [text, setText] = useState("");
  const [menuPayload, setMenuPayload] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    listen("menu-event", (e) => {
      console.log(e.payload);
      setMenuPayload(e.payload)
      setMenuOpen(true)
    })
  }, []);

  const OpenFile = async () => {
    try {
      let filepath = await open();
      let content = await readTextFile(filepath);
      setText(content);
    } catch (e) {
      console.log(e);
    }
  };

  const SaveFile = async (text) => {
    try {
      let filepath = await save();
      await writeFile({ contents: text, path: filepath, });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      switch (menuPayload) {
        case "open-event":
          OpenFile();
          break;
        case "save-event":
          SaveFile();
          break;

        default:
          break;
      }
      setMenuOpen(false)
    }
  }, [menuOpen]);


  return (
    <div className="App">
      <textarea
        rows={5}
        onChange={(e) => {
          e.preventDefault();
          setText(e.target.value)
        }}
        value={text}>
      </textarea>
    </div>
  )
}

export default App
