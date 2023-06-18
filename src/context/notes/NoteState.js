import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const noteInitial = []

  const [notes, setNotes] = useState(noteInitial)


  // Get all notes
  const getNotes = async () => {

    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4YjEwZDNiOGQ3MWU1ZmQ3M2RkODViIn0sImlhdCI6MTY4NjgzNTQxMX0.GtMrdXgZsvXe2xKQMMTV__TFYZJKkxs7AxI5pgAfw_g"
      },
    });


    // Logic to get all notes in client
    const json = await response.json();
    setNotes(json);
  }

  

  // Add a note
  const addNote = async (title, description, tag) => {

    // API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4YjEwZDNiOGQ3MWU1ZmQ3M2RkODViIn0sImlhdCI6MTY4NjgzNTQxMX0.GtMrdXgZsvXe2xKQMMTV__TFYZJKkxs7AxI5pgAfw_g"
      },
      body: JSON.stringify({ title, description, tag }),
    });



    // Logic to add note in client
    const note = await response.json()
    setNotes(notes.concat(note))

  }



  // Delete a note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4YjEwZDNiOGQ3MWU1ZmQ3M2RkODViIn0sImlhdCI6MTY4NjgzNTQxMX0.GtMrdXgZsvXe2xKQMMTV__TFYZJKkxs7AxI5pgAfw_g"
      }
    });
    const json = await response.json();

    // Logic to delete note in client
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes);
  }



  // Edit a note
  const editNote = async (id, title, description, tag) => {

    // API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQ4YjEwZDNiOGQ3MWU1ZmQ3M2RkODViIn0sImlhdCI6MTY4NjgzNTQxMX0.GtMrdXgZsvXe2xKQMMTV__TFYZJKkxs7AxI5pgAfw_g"
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json =await response.json();


    // Logic to edit note in client
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index <= newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }

    setNotes(newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;