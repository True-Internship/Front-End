
import Axios from 'axios'
import { useEffect, useState, React } from 'react'
import * as XLSX from 'xlsx'
const SelectFile = ({ logout }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeList_temp, setEmployeeList_temp] = useState([]);
  const [items, setitems] = useState([]);
  const [employeeList_error, setEmployeeList_error] = useState([]);
  const [employeeList_error_length, setEmployeeList_error_length] = useState(null);
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
    Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
    })

  }, [])
const delEmployee = () => {
    Axios.delete('http://localhost:3001/delete').then((response) => {
      setEmployeeList_error(null);
      setEmployeeList_error_length(0)
    })

  }
  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  const updateEmployee = async (id, newname, newage, newcountry, newposition, newwage) => {
    await Axios.put('http://localhost:3001/update', {
      id: id,
      name: newname,
      age: newage,
      country: newcountry,
      position: newposition,
      wage: newwage
    })
  }

  //เอาข้อมูลจากExcelเข้าdatabase จำลอง
  const updateEmployee_temp = (id, newname, newage, newcountry, newposition, newwage) => {
    Axios.post('http://localhost:3001/update_temp', {
      id: id,
      name: newname,
      age: newage,
      country: newcountry,
      position: newposition,
      wage: newwage
    })
  }
  const deleteEmployee_temp = () => {
    Axios.delete('http://localhost:3001/delete', {
    })
  }

  const loopItem_employee_temp = () => {
    console.log("loop excel into temp")
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())

    }
    window.location.reload(false)
    // window.location.reload(false);
    if (employeeList_error_length == Number(0)) {
      window.location.reload(false)
      for (let index = 0; index < items.length; index++) {
        updateEmployee(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      }
      window.location.reload(false)
    }
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
          onClick={() => {delEmployee();loopItem_employee_temp();}}

        >update</button>

      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <h3>record error</h3>
        <div>
          {employeeList_temp.map((val, index) => {
            // if (val.country == null) {
            //   return <h1 key={index}>{val.id}</h1>
            // }
            return (
              <li key={index}>
                ID :{val.id}<br />
                name :{val.name}<br />
                age :{val.age}
              </li>
            )

          }

          )}
          {/* <h1>count error = {employeeList_error_length}</h1> */}
        </div>


      </div>
      {/* <div>
        <button onClick={delete_api}>click</button>
      </div> */}

    </div>
  );
}

export default SelectFile;
