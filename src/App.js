import Axios from 'axios'
import {useState} from 'react'
function App() {
  const[name,setName] = useState("");
  const[newname,setnewName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);

  //ดึงข้อมูลจากpathมาเก็บไว้ในemployeeList
  const getEmployee = () =>{
    Axios.get('http://localhost:3001/employee').then((response)=>{
      setEmployeeList(response.data);
    })

  }
  //functionสำหรับการเอาข้อมูลจากinpitไปเก็บไว้บนpath
  const addEmployee = ()=>{
    Axios.post('http://localhost:3001/create',{
      name: name
    }).then(() =>{
      setEmployeeList([
        ...employeeList,//เก็ยข้อมูลตัวเก่าไม่ให้หาย
        {
          name:name
        }
      ])
    })
  }
  const updateName = (id) =>{
    Axios.put('http://localhost:3001/update',{
      name:newname, id:id
    }).then((response)=>{
      setEmployeeList(
        employeeList.map((val) =>{
          return val.id == id ?{
            name:newname,
            id:id
          }:val;
        })
      )
    })
  }

  return (
    <div className="App container">
    <h1>infomation</h1>
    <div className="infomation">
      <form action="">
          <div className="mb-3">
            <label htmlFor="name" className="form-lable">Name:</label>
            <input 
              type="text" 
              classname="form-control" 
              placeholder="Enter name"
              //รับค่ามาจากinput และsetname
              onChange={(event) =>{
                setName(event.target.value)
              }}
            />
          </div>
          <button className="btn btn-primary" onClick={addEmployee}>submit</button>
          
      </form>
    </div>
    <br/>
    <div>
    <button className="btn btn-primary" onClick={getEmployee}>show</button>

    {/* ดึงข้อมูลออกมาเพื่อแสดงผล */}
    {employeeList.map((val,key) =>{
            return(
              <div>
                <div>
                  <h1>{val.id}</h1>
                  <h1>{val.name}</h1>
                </div>
                <div>
                <input 
                  type="text" 
                  classname="form-control" 
                  placeholder="Update now..."
                  onChange={(event) =>{
                    setnewName(event.target.value)
                  }}
            />
            <button className="btn btn-primary" onClick={() => {updateName(val.id)}}>update</button>
                </div>
                
              </div>

              
            )
          })}
    </div>
  </div>
  );
}

export default App;
