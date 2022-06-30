import Axios from 'axios'
import { useEffect, useState, React } from 'react'
import * as XLSX from 'xlsx'
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
const SelectFile = ({ logout }) => {
  const [employeeList, setEmployeeList] = useState([]);
  const [employeeList_temp, setEmployeeList_temp] = useState([]);
  const [items, setitems] = useState([]);
  const [employeeList_error, setEmployeeList_error] = useState([]);
  const [employeeList_error_length, setEmployeeList_error_length] = useState(null);
  const [file, setFile] = useState(null);
  const [count, setCount] = useState(0);
  // รายชื่อพนักงานทั้งหมดที่อยู่ในdatabaseจริง
  const [listErrorFull, setListErrorFull] = useState([])
  const [show, setShow] = useState(false)
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
  }, [employeeList_error_length])
  useEffect(() => {
    delEmployee()
  }, [items])
  useEffect(() => {
    check_length_error()
  }, [employeeList_error])


  const checktemp = async() => {
    await Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
    })
  }
  const delEmployee = async () => {
    await Axios.delete('http://localhost:3001/delete')
    // setEmployeeList_error([]);
    // setEmployeeList_error_length(null)
    loopItem_employee_temp()
    // readExcel(file)
  }


  const check_length_error = () => {
    var count1 = 0
    setCount(count + 1)
    console.log(count1, "count1")
    console.log(employeeList_error.length, "check error real DB")//0 length
    count1 += employeeList_error.length
    console.log(count, "count usestate")
    if (count1 === 0 && count === 1) {
      console.log("update employee success!!")
      console.log(count1, "count1")
      for (let index = 0; index < items.length; index++) {
        updateEmployee(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      }
    } else {
      console.log("not update")
    }
  }

  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  useEffect(()=>{
    updateEmployee()
  },[])
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
  useEffect(()=>{
    updateEmployee_temp()
  },[])
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
    console.log(items, "write data in DB")
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())

    }
    checktemp()
  }
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
  }
  const get_error = async (e) => {
    errList();
    setShow(!show)
    if (show === true) {
      setListErrorFull([])
    }
    console.log(listErrorFull)
  }

  const errList = () => {
    Object.keys(employeeList_error).forEach(function (count) { //key == 0,1
      var list_null = []
      Object.keys(employeeList_error[count]).forEach(function (key) { //key == 0,1
        if (employeeList_error[count][key] == null) {
          list_null.push(key)
        }
      })

      if (list_null.length != 0) {
        listErrorFull.push([employeeList_error[count], list_null])
        list_null = []
      }
    });
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const valueexcel = await readExcel(file)
    setitems(valueexcel)
    delEmployee()
    check_length_error()
    setCount(0)
  }

  return (
    <div className="App container">
      <h1>Excel upload web</h1>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
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
        <h1>record error</h1>


        {show ?
          <div>
            <div>can't update table employee</div>
            {listErrorFull.map((data, i) => {
              return (
                <div key={i}>
                  {data.map((value, j) => {
                    return (
                      <div key={j}>
                        {JSON.stringify(value)}
                      </div>
                    )
                  })}
                  <br />
                </div>
              )
            })}
          </div> : <h1></h1>}

        <h1>count error = {employeeList_error_length}</h1>
        <h1>count item = {items.length}</h1>
        <button onClick={(e) => get_error(e)}>Show Error</button>
        {/* <button onClick={reset}>reset</button> */}
      </div>
    </div>
  );
}
export default SelectFile;
