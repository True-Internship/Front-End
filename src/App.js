import {Route, Routes } from "react-router-dom";
import Login from "./Page/Login";
import SelectFile from "./Page/SelectFile";



function App(){
  return(
    <div>    
      <Routes>
        <Route path="/" exact element={<Login/>}/>
        <Route path="/selectfile" element={<SelectFile/>}/>
      </Routes>

    </div>
  )
}
export default App;