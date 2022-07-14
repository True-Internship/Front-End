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
  const [isClick, setIsClick] = useState(false)
  const [codeState, setCodeState] = useState("")

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
  // useEffect(() => {
  //   checkTempError()
  // }, [employeeList_error_length])


  const checkTempError = async (booleanCom) => {
    await Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
      check_length_error(response.data.length, booleanCom)

    })
    // console.log(listColumn,"list column")
    // console.log(Object.keys(employeeList[0]),"list column database")
    // try {
    //   setListColumnDatabase(Object.keys(employeeList[0]))
    // } catch (error) { 
    // }
  }
  useEffect(() => {
    delEmployee()
  }, [items])


  const delEmployee = async () => {

    await Axios.delete('http://localhost:3001/delete').then(() => {
      loopItem_employee_temp()

    })
    // setEmployeeList_error_length(null)
    // readExcel(file)
  }

  ///////////////////////////////////////////////////////////////

  const check_length_error = (length, booleanCom) => {
    try {
      if ((length === 0) && (JSON.stringify(Object.keys(items[0])) == JSON.stringify(Object.keys(employeeList[0])))) {
        console.log("into check obj")
        if (booleanCom) {
          console.log("into update employee")
          for (let index = 0; index < items.length; index++) {
            updateEmployee(
              items[index].companygroup,
              items[index].companyname,
              items[index].empid,
              items[index].identification,
              items[index].b_dd,
              items[index].b_mm,
              items[index].b_yyyy,
              items[index].salutation_thai,
              items[index].thai_firstname,
              items[index].thai_lastname,
              items[index].Thai_Fullname,
              items[index].salutation_eng,
              items[index].eng_firstname,
              items[index].eng_lastname,
              items[index].position,
              items[index].email,
              items[index].positioncode,
              items[index].phone_No,
              items[index].province,
              items[index].worksite,
              items[index].employment_Type,
              items[index].worktype,
              items[index].Report,
              items[index].SalLessThan15k,
              items[index].joindate,
              items[index].business_SIM,
              items[index].Nation,
              items[index].vip,
              items[index].ConsentDM,
            )

          }
          console.log("update employee success!!")
          setResultCheckLengthError("true")
        } else {
          console.log("company code and group code is not macth")
        }
      } else {
        setMessageUpdateFalse("don't update employee")
        setResultCheckLengthError("false")
        console.log("update employee not success!!")
      }
    } catch (error) {

    }
    setCount(count + 1)
  }

  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  useEffect(() => {
    updateEmployee()
  }, [])
  const updateEmployee = async (
    newcompanygroup,
    newcompanyname,
    newempid,
    newidentification,
    newb_dd,
    newb_mm,
    newb_yyyy,
    newsalutation_thai,
    newthai_firstname,
    newthai_lastname,
    newThai_Fullname,
    newsalutation_eng,
    neweng_firstname,
    neweng_lastname,
    newposition,
    newemail,
    newpositioncode,
    newphone_No,
    newprovince,
    newworksite,
    newemployment_Type,
    newworktype,
    newReport,
    newSalLessThan15k,
    newjoindate,
    newbusiness_SIM,
    newNation,
    newvip,
    newConsentDM
  ) => {
    await Axios.put('http://localhost:3001/update', {
      companygroup: newcompanygroup,
      companyname: newcompanyname,
      empid: newempid,
      identification: newidentification,
      b_dd: newb_dd,
      b_mm: newb_mm,
      b_yyyy: newb_yyyy,
      salutation_thai: newsalutation_thai,
      thai_firstname: newthai_firstname,
      thai_lastname: newthai_lastname,
      Thai_Fullname: newThai_Fullname,
      salutation_eng: newsalutation_eng,
      eng_firstname: neweng_firstname,
      eng_lastname: neweng_lastname,
      position: newposition,
      email: newemail,
      positioncode: newpositioncode,
      phone_No: newphone_No,
      province: newprovince,
      worksite: newworksite,
      employment_Type: newemployment_Type,
      worktype: newworktype,
      Report: newReport,
      SalLessThan15k: newSalLessThan15k,
      joindate: newjoindate,
      business_SIM: newbusiness_SIM,
      Nation: newNation,
      vip: newvip,
      ConsentDM: newConsentDM,
    })
  }

  //เอาข้อมูลจากExcelเข้าdatabase จำลอง
  // useEffect(() => {
  //   updateEmployee_temp()
  // }, [])
  const updateEmployee_temp = async (
    newcompanygroup,
    newcompanyname,
    newempid,
    newidentification,
    newb_dd,
    newb_mm,
    newb_yyyy,
    newsalutation_thai,
    newthai_firstname,
    newthai_lastname,
    newThai_Fullname,
    newsalutation_eng,
    neweng_firstname,
    neweng_lastname,
    newposition,
    newemail,
    newpositioncode,
    newphone_No,
    newprovince,
    newworksite,
    newemployment_Type,
    newworktype,
    newReport,
    newSalLessThan15k,
    newjoindate,
    newbusiness_SIM,
    newNation,
    newvip,
    newConsentDM) => {
    await Axios.post('http://localhost:3001/update_temp', {
      companygroup: newcompanygroup,
      companyname: newcompanyname,
      empid: newempid,
      identification: newidentification,
      b_dd: newb_dd,
      b_mm: newb_mm,
      b_yyyy: newb_yyyy,
      salutation_thai: newsalutation_thai,
      thai_firstname: newthai_firstname,
      thai_lastname: newthai_lastname,
      Thai_Fullname: newThai_Fullname,
      salutation_eng: newsalutation_eng,
      eng_firstname: neweng_firstname,
      eng_lastname: neweng_lastname,
      position: newposition,
      email: newemail,
      positioncode: newpositioncode,
      phone_No: newphone_No,
      province: newprovince,
      worksite: newworksite,
      employment_Type: newemployment_Type,
      worktype: newworktype,
      Report: newReport,
      SalLessThan15k: newSalLessThan15k,
      joindate: newjoindate,
      business_SIM: newbusiness_SIM,
      Nation: newNation,
      vip: newvip,
      ConsentDM: newConsentDM,
    }).then((response) => {
      checkCompositeCode(newcompanygroup, newcompanyname)
    })
  }
  // useEffect(() => {
  //   checkCompositeCode()
  // }, [codeState])

  const checkCompositeCode = async (newcompanygroup, newcompanyname) => {
    await Axios.post("http://localhost:3001/check_composite_code", {
      GroupCode: newcompanygroup,
      CompanyCode: newcompanyname,
    }).then((response) => {
      if (items.length != 0) {
        if (response.data.message) {
          checkTempError(false)
          console.log("CompositeCode message false")
        } else {
          checkTempError(true)
          console.log("CompositeCode message true")
        }
      }
    })

  }

  //เขียนข้อมูลในitemลงdatabase temp
  const loopItem_employee_temp = async () => {
    for (let index = 0; index < items.length; index++) {
      updateEmployee_temp(
        items[index].companygroup,
        items[index].companyname,
        items[index].empid,
        items[index].identification,
        items[index].b_dd,
        items[index].b_mm,
        items[index].b_yyyy,
        items[index].salutation_thai,
        items[index].thai_firstname,
        items[index].thai_lastname,
        items[index].Thai_Fullname,
        items[index].salutation_eng,
        items[index].eng_firstname,
        items[index].eng_lastname,
        items[index].position,
        items[index].email,
        items[index].positioncode,
        items[index].phone_No,
        items[index].province,
        items[index].worksite,
        items[index].employment_Type,
        items[index].worktype,
        items[index].Report,
        items[index].SalLessThan15k,
        items[index].joindate,
        items[index].business_SIM,
        items[index].Nation,
        items[index].vip,
        items[index].ConsentDM,
      )

    }

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
    setIsClick(!isClick)
    const valueexcel = await readExcel(file)
    setitems(valueexcel)
    console.log("read file excel")
    const checkCompare = JSON.stringify(Object.keys(valueexcel[0])) == JSON.stringify(Object.keys(employeeList[0]))
    try {
      if (checkCompare) {
        console.log("compare fileds is true")
        setStateChecktwocolumn("true")
        delEmployee()// clean data in temp and query data in temp database
        // check_length_error()
        setCount(0)
        setCheckInside(!checkInside)//ปิด เปิด show error
      } else {
        console.log("compare fileds is false")
        setStateChecktwocolumn("false")
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
        {stateChecktwocolumn === "true" ?
          <div>
            {isClick ?
              <div>
                {resultCheckLengthError === "true" ?
                  <div><h1>success</h1></div>
                  :
                  <div>
                    {resultCheckLengthError === "false" ?
                      <div>
                        <h1>record error</h1>
                        <button onClick={(e) => get_error(e)}>Show Error</button>
                      </div>
                      :
                      <div><h1>company code and group code is not macth</h1></div>
                    }
                    {/* <h1>record error</h1>
                    <button onClick={(e) => get_error(e)}>Show Error</button> */}
                  </div>
                }
              </div>
              :
              <div></div>

            }

          </div>
          : <div>
            {stateChecktwocolumn === "false" ?
              <div><h1>Warnning Column error</h1></div>
              :
              <div></div>
            }
          </div>

        }


        {/* {resultCheckLengthError === "true" ?
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
              <div>

              </div>
            }
          </div>

        } */}






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
        {/* <button onClick={checkTwoColumn}>compare to</button> */}

        {/* <button onClick={reset}>reset</button> */}
      </div>
    </div>
  );
}
export default SelectFile;
