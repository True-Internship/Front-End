import { keys } from '@material-ui/core/styles/createBreakpoints';
import Axios from 'axios'
import { useEffect, useState, React } from 'react'
import * as XLSX from 'xlsx'
const SelectFile = ({ logout }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeList_temp, setEmployeeList_temp] = useState([]);
  const [items, setitems] = useState([]);
  const [employeeList_error, setEmployeeList_error] = useState([]);
  const [stateUpdate, setStateUpdate] = useState("");
  // รายชื่อพนักงานทั้งหมดที่อยู่ในdatabaseจริง
  useEffect(() => {
    Axios.get('http://localhost:3001/employee').then((response) => {
      setEmployeeList(response.data);
    })
  }, [])


  // เรียกfunctionนี้เพื่อเอาข้อมูลจากExcelเข้าtemp (databaseจำลอง)
  useEffect(() => {
    Axios.get('http://localhost:3001/employee_temp').then((response) => {
      setEmployeeList_temp(response.data);
    })
  }, [])

  useEffect(() => {
    Axios.get('http://localhost:3001/employee_temp_check_country')
      .then(response => setEmployeeList_error(response.data))
      .catch(err => console.log(err))
  }, [])

  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  const updateEmployee = (id, newname, newage, newcountry, newposition, newwage) => {
    Axios.put('http://localhost:3001/update', {
      id: id,
      name: newname,
      age: newage,
      country: newcountry,
      position: newposition,
      wage: newwage


    }).then((response) => {
      setEmployeeList(
        employeeList.map((val) => {
          return val.id == id ? {
            id: id,
            name: newname,
            age: newage,
            country: newcountry,
            position: newposition,
            wage: newwage
          } : val;
        })
      )
    })
    console.log('data on excel is active')
  }

  //เอาข้อมูลจากExcelเข้าdatabase จำลอง
  const updateEmployee_temp = (id, newname, newage, newcountry, newposition, newwage) => {
    console.log("bbbb")
    Axios.put('http://localhost:3001/update_temp', {
      id: id,
      name: newname,
      age: newage,
      country: newcountry,
      position: newposition,
      wage: newwage
    })
  }

  const loopItem_employee_temp = () => {
    console.log("loop excel into temp")
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())

    }
  window.location.reload(false);    
    if (Object.keys(employeeList_error).length == 0) {
      for (let index = 0; index < items.length; index++) {
        updateEmployee(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      }
    }

    // console.log(employeeList_temp.length === 0)
  }
  //functionอ่านข้อมูลจากexcel
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = ((error) => {
        reject(error);
      });
    });
    promise.then((d) => {
      setitems(d);
    })
  }


  return (
    <div className="App container">
      <h1>Excel upload web</h1>
      <div>
        {/* ดึงข้อมูลออกมาเพื่อแสดงผล */}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}

        />
      </div>
      <div >
        <button className="btn btn-primary" 
        onClick={() => {loopItem_employee_temp()}}
        
        >update</button>

      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <h3>record error</h3>
          <div>
              {employeeList_error.map((val,index) => {
                if (val.country == null){
                  return <h1 key={index}>{val.id}</h1>
                }
              }       
                // <li key={val.id}>
                //   ID :{val.id}<br />
                //   name :{val.name}<br />
                //   age :{val.age}
                // </li>
              )}
              <h1>{stateUpdate}</h1>
              <h1>count error = {Object.keys(employeeList_error).length}</h1>

          </div>


      </div>
      {/* <div>
        <button onClick={delete_api}>click</button>
      </div> */}

    </div>
  );
}

export default SelectFile;
