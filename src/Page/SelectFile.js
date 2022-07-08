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
  const [checkInside, setCheckInside] = useState(false)
  const [stateChecktwocolumn, setStateChecktwocolumn] = useState("")
  const [messageUpdateFalse, setMessageUpdateFalse] = useState("")
  const [resultCheckLengthError, setResultCheckLengthError] = useState("")

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
    checkTempError()
  }, [employeeList_error_length])
  useEffect(() => {
    delEmployee()
  }, [items])



  const checkTempError = async () => {
    await Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
    })
    // console.log(listColumn,"list column")
    // console.log(Object.keys(employeeList[0]),"list column database")
    // try {
    //   setListColumnDatabase(Object.keys(employeeList[0]))
    // } catch (error) { 
    // }

  }
  const delEmployee = async () => {
    await Axios.delete('http://localhost:3001/delete')
    // setEmployeeList_error([]);
    // setEmployeeList_error_length(null)
    loopItem_employee_temp()
    // readExcel(file)
  }


  const check_length_error = () => {

    if (employeeList_error.length === 0) {
      // console.log(count1, "count1")
      for (let index = 0; index < items.length; index++) {
        updateEmployee(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      }
      console.log("update employee success!!")
      console.log("true")
      setResultCheckLengthError("true")

    } else {
      setMessageUpdateFalse("don't update")
      setResultCheckLengthError("false")
      console.log("false")

      console.log("not update")
    }
    setCount(count + 1)
  }

  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  useEffect(() => {
    updateEmployee()
  }, [])
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
  useEffect(() => {
    updateEmployee_temp()
  }, [])
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
  //เขียนข้อมูลในitemลงdatabase temp
  const loopItem_employee_temp = async () => {
    // console.log(items)
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())

    }
    checkTempError()

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
    // console.log(listErrorFull)
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
  //วางไฟล์excel ->ข้อมูลจะเข้าconst items
  async function handleSubmit(event) {
    event.preventDefault();
    //set data in excel
    const valueexcel = await readExcel(file)
    setitems(valueexcel)
    console.log("read file excel")
    try {
      if (JSON.stringify(Object.keys(items[0])) == JSON.stringify(Object.keys(employeeList[0]))) {
        console.log("compare fileds is true")
        console.log(Object.keys(items[0]))
        console.log(Object.keys(employeeList[0]))
        setStateChecktwocolumn("true")
        delEmployee()// clean data in temp and query data in temp database
        // check_length_error()
        setCount(0)
        setCheckInside(!checkInside)//ปิด เปิด show error
        updateData()
      } else {
        console.log("compare fileds is false")
        setStateChecktwocolumn("false")
        console.log(Object.keys(items[0]))
        console.log(Object.keys(employeeList[0]))
      }
    } catch (error) {
    }



    // delEmployee()
    // check_length_error()
    // setCount(0)

  }

  // async function updateDatabaseMain(event) {
  //   event.preventDefault();
  //   delEmployee()
  //   check_length_error()
  //   setCount(0)
  //   setCheckInside(!checkInside)
  // }
  // async function checktwocolumn(event) {
  //   event.preventDefault();
  //   try {
  //     if (JSON.stringify(Object.keys(items[0])) == JSON.stringify(Object.keys(employeeList[0]))) {
  //       console.log("compare fileds is true")
  //       console.log(Object.keys(items[0]))
  //       console.log(Object.keys(employeeList[0]))
  //       setStateChecktwocolumn("true")
  //       delEmployee()// clean data in temp and query data in temp database
  //       // check_length_error()
  //       setCount(0)
  //       setCheckInside(!checkInside)//ปิด เปิด show error
  //       updateData()
  //     } else {
  //       console.log("compare fileds is false")
  //       setStateChecktwocolumn("false")
  //       console.log(Object.keys(items[0]))
  //       console.log(Object.keys(employeeList[0]))
  //     }
  //   } catch (error) {
  //   }

  // }

  const updateData = () => {
    check_length_error()

  }

  return (
    <div className="App container">
      <h1>Excel upload web</h1>
      <div>
        <button onClick={logout}>Logout</button>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Control
            autoFocus
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Form.Group>
        <Button block="true" size="lg" type="submit">
          upload file
        </Button>
      </Form>
      {/* 
      <Form onSubmit={checktwocolumn}>
        <Button block="true" size="lg" type="submit">
          compare fileds
        </Button>
      </Form> */}

      <div>
        {stateChecktwocolumn === "false" ?
          <div><h1>warnning fileds error</h1></div>
          : <div></div>

        }


        {resultCheckLengthError === "true" ?
          <div>
            <h1>success update</h1>
          </div>
          :
          <div>
            {resultCheckLengthError === "false" ?
              <div>
                <h1>record error</h1>
                <button onClick={(e) => get_error(e)}>Show Error</button>
              </div>
              :
              <div></div>
            }
          </div>
        }
        {show ?
          <div>
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
        <h1>result = {resultCheckLengthError}</h1>
        {/* <button onClick={checkTwoColumn}>compare to</button> */}

        {/* <button onClick={reset}>reset</button> */}
      </div>
    </div>
  );
}
export default SelectFile;
