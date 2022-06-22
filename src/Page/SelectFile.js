
import Axios from 'axios'
import { useEffect, useState, React, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
const SelectFile = ({ logout }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeList_temp, setEmployeeList_temp] = useState([]);
  const [items, setitems] = useState([]);
  const [employeeList_error, setEmployeeList_error] = useState([]);
  const [employeeList_error_length, setEmployeeList_error_length] = useState(null);
  const [stateUpdate, setStateUpdate] = useState("");
  const [file, setFile] = useState(null);
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
    checktemp()
  }, [])
  useEffect(() => {
    console.log(items)
    delEmployee()
  }, [items])

  const checktemp = () => {
    Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
    })
  }


  const delEmployee = async () => {
    await Axios.delete('http://localhost:3001/delete')
    setEmployeeList_error([]);
    setEmployeeList_error_length(null)
    console.log('aaaaaaa')
    loopItem_employee_temp()
    // readExcel(file)
  }
  useEffect(() => {
    check_length_error()
  }, [employeeList_error])
  const check_length_error = async () => {
    if (employeeList_error_length === 0) {
      for (let index = 0; index < items.length; index++) {
        await updateEmployee(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      }
    }
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
  const updateEmployee_temp = async (id, newname, newage, newcountry, newposition, newwage) => {
    await Axios.post('http://localhost:3001/update_temp', {
      id: id,
      name: newname,
      age: newage,
      country: newcountry,
      position: newposition,
      wage: newwage
    })
  }

  const loopItem_employee_temp = async () => {
    console.log("bbbbbb")
    console.log(items)
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())

    } 
    check_length_error()
    checktemp()
    // window.location.reload(false)
    // window.location.reload(false);

  }
  //functionอ่านข้อมูลจากexcel 
  /**
   * 
   * @param {file} file 
   * @description //functionอ่านข้อมูลจากexcel 
   */
  const readExcel = (file) => {
    return new Promise((resolve, reject) => {

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
    // promise.then((d) => {
    //   setitems(d);
    //   console.log(items)
    // })
  }

  // const ref = useRef();

  // const reset = () => {
  //   ref.current.value = "";
  // }
  async function handleSubmit(event) {
    event.preventDefault();
    const valueexcel = await readExcel(file)
    setitems(valueexcel)
  }


  return (
    <div className="App container">
      <h1>Excel upload web</h1>
      <div>
        {/* ดึงข้อมูลออกมาเพื่อแสดงผล */}
        {/* <input
          type="file"
          ref={ref}
          onChange={(e) => {

            const file = e.target.files[0];

            readExcel(file);
          }} */}

        {/* /> */}
      </div>
      <div >
        {/* <button className="btn btn-primary"
          onClick={() => { delEmployee() }}

        >update</button> */}

      </div>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <div>
        <h3>record error</h3>



      </div>
      {/* <div>
        <button onClick={delete_api}>click</button>
      </div> */}
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Excel upload</Form.Label>
          <Form.Control
            autoFocus
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button block="true" size="lg" type="submit">
          update
        </Button>
      </Form>
      <div>
        {employeeList_error.map((val, index) => {
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
        <h1>count error = {employeeList_error_length}</h1>
        <h1>count item = {items.length}</h1>
        {/* <button onClick={reset}>reset</button> */}
      </div>
    </div>
  );
}

export default SelectFile;
