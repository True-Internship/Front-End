import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Page/Login";
import SelectFile from "./Page/SelectFile";
import { useEffect, useState } from 'react'



function App() {
  const [user, setUser] = useState(null)
//ทำให้เมื่อกดrefreshหรือเปลี่ยนpathจะไม่ไปหน้าlogin ต้องกดlogoutเท่านั้น
  useEffect(() =>{
    const Users = localStorage.getItem("user");
    Users && JSON.parse(Users) ? setUser(true) : setUser(false);
  },[])
  useEffect(() =>{
    localStorage.setItem("user",user)
  },[user])


  return (
    <Routes>
      {!user && (
        <Route
          exact path="/"
          element={<Login authenticate={() => setUser(true)} />} />
      )}
      {user && (
        <>
          <Route
            exact path="/selectfile"
            element={<SelectFile logout={() => setUser(false)} />} />
        </>
      )}
      <Route path="/selectfile" element={<Navigate to={user ? "/selectfile" : "/"}/>}/>

    </Routes>


  )
}
export default App;