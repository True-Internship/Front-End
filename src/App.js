import Axios from 'axios'
import {useState} from 'react'
import * as XLSX from 'xlsx'
function App() {
  const[name,setName] = useState("");
  const[newname,setnewName] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [items, setitems] = useState([]);
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
  //functionอ่านข้อมูลจากexcel
  const readExcel = (file) =>{
    const promise = new Promise((resolve,reject)=>{

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file)

      fileReader.onload=(e)=>{
        const bufferArray=e.target.result;

        const wb = XLSX.read(bufferArray,{type:'buffer'});

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = ((error) =>{
      reject(error);
    });
    });
    promise.then((d) =>{
      setitems(d);
    })
  }

  return (
    <div className="App container">
    <h1>infomation</h1>
    <div className="infomation">
{/* -----------------------------phase1 CRUD data connect database-----------------------------------------  */}
    {/* 
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

      </form>
    </div>
    
    <br/>
    <div>
    <button className="btn btn-primary" onClick={getEmployee}>show</button>

    {/* ดึงข้อมูลออกมาเพื่อแสดงผล */}
    {/* {employeeList.map((val,key) =>{
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

                    <button className="btn btn-primary" onClick={addEmployee}>submit</button>  */}

   {/* -----------------------------phase2 read file excel-----------------------------------------                */}
          <input
              type="file"
              onChange={(e) =>{
              const file = e.target.files[0];
                readExcel(file);
              }}
          
          />
          <table class="table">
  <thead>
    <tr>
      <th scope="col">item</th>
      <th scope="col">description</th>
    </tr>
  </thead>
  <tbody>
    {
      //ข้อมูลที่ได้ทั้งหมดของexcel
      items.map((d)=>(
         <tr key={d.item}>
          <th >{d.item}</th>
          <td>{d.description}</td>
    </tr>
      ))
    }
   
  </tbody>
</table>


    </div>
  </div>
  );
}

export default App;
