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
  // รายชื่อพนักงานทั้งหมดที่อยู่ในdatabaseจริง
  const [listErrorFull, setListErrorFull] = useState([])
  const [show, setShow] = useState(false)
  const [checkInside, setCheckInside] = useState(false)
  const [stateChecktwocolumn, setStateChecktwocolumn] = useState("")
  const [messageUpdateFalse, setMessageUpdateFalse] = useState("")
  const [resultCheckLengthError, setResultCheckLengthError] = useState("")
  const [isClick, setIsClick] = useState(false)
  const [codeState, setCodeState] = useState("")
  const [listIDNotTH1RecordNotFalse, setListIDNotTH1RecordNotFalse] = useState([])
  const [listIDNotTH1RecordFalse, setListIDNotTH1RecordFalse] = useState([])
  const [aCom, setACom] = useState([])
  var c = []
  var dictID = []
  var dictCom = []
  var AdictID = []
  // var listIDNotTH1RecordFalse = []
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


  const checkTempError = async () => {//pass
    await Axios.get('http://localhost:3001/employee_temp_check_country').then((response) => {
      setEmployeeList_error(response.data);
      setEmployeeList_error_length(response.data.length)
      // console.log(employeeList_error, "qwe")
      errListRecordFalse(response.data)
      errListRecordNotFalse(response.data)
      
      check_length_error(employeeList_error)

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


  const delEmployee = async () => {//pass

    await Axios.delete('http://localhost:3001/delete').then(() => {
      loopItem_employee_temp()

    })
    // setEmployeeList_error_length(null)
    // readExcel(file)
  }

  ///////////////////////////////////////////////////////////////
  useEffect(() => {
    check_length_error()
  }, [resultCheckLengthError])

  const check_length_error = () => {//pass
    // console.log(employeeList_error, "poi1")
    try {
      if ((employeeList_error.length === 0) && (JSON.stringify(Object.keys(items[0])) == JSON.stringify(Object.keys(employeeList[0])))) {
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
        // setMessageUpdateFalse("don't update employee")
        setResultCheckLengthError("false")
        console.log("update employee not success!!1")
      }
    } catch (error) {

    }
  }

  //เอาข้อมูลจากExcelเข้าdatabaseจริง
  useEffect(() => {
    updateEmployee()
  }, [])
  const updateEmployee = async (//pass
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
  const updateEmployee_temp = async (//pass
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
    })
    checkTempError()
  }
  // useEffect(() => {
  //   checkCompositeCode()
  // }, [codeState])

  // const checkCompositeCode = async (newcompanygroup, newcompanyname) => {
  //   return new Promise((resolve, reject) => {
  //     Axios.post("http://localhost:3001/check_composite_code", {
  //       GroupCode: newcompanygroup,
  //       CompanyCode: newcompanyname,
  //     }).then((response) => {
  //       if (items.length != 0) {
  //         if (response.data.message) {
  //           // checkTempError(false, value)
  //           //console.log("CompositeCode message false")
  //           resolve("false")
  //         } else {
  //           // checkTempError(true, value)
  //           //console.log("CompositeCode message true")
  //           resolve("true")
  //         }
  //       } else {
  //         resolve("true")
  //       }
  //     })
  //   });

  // }
  // const checkID_NO = async (identify, nation, newempid) => {
  //   return new Promise((resolve, reject) => {
  //     if (nation === "TH") {
  //       if (String(identify).length === 13) {
  //         const totleCheckSumDigit = (checkSumDigitIDNO(String(identify)))
  //         const lastDigitlist = String(identify).split("")
  //         const lastIndecDigit = lastDigitlist[lastDigitlist.length - 1]
  //         if (String(totleCheckSumDigit) === String(lastIndecDigit)) {
  //           resolve('true')
  //         } else {
  //           //console.log("it not identify Thailand id", newempid)
  //           resolve('false')
  //         }
  //       } else {
  //         //console.log("length identify must have 13 digit id", newempid)
  //         resolve('false')

  //       }
  //     } else {
  //       //console.log("nation is not TH id", newempid)
  //       resolve('true')
  //     }
  //   })
  // }
  const checkSumDigitIDNO = (number, lastIndex) => {
    const calculate = (parseInt(number[0]) * 13) + (parseInt(number[1]) * 12) + (parseInt(number[2]) * 11) + (parseInt(number[3]) * 10) + (parseInt(number[4]) * 9) + (parseInt(number[5]) * 8) + (parseInt(number[6]) * 7) + (parseInt(number[7]) * 6) + (parseInt(number[8]) * 5) + (parseInt(number[9]) * 4) + (parseInt(number[10]) * 3) + (parseInt(number[11]) * 2)
    const findMod = (11 - (calculate % 11)) % 10
    return String(findMod) === String(lastIndex)
  }

  //เขียนข้อมูลในitemลงdatabase temp
  const loopItem_employee_temp = async () => {//pass
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
  const readExcel = (file) => {//pass
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
    var list_null = []

    console.log(listIDNotTH1RecordFalse,"record false in err")
    console.log(listIDNotTH1RecordNotFalse,"record not false in err")
    Object.keys(employeeList_error).forEach(function (count) { //key == 0,1,... ถ้าเช็คแล้วมีerror
      Object.keys(employeeList_error[count]).forEach(function (key) { //key == 0,1
        if (Object.values(employeeList_error[count]).includes(null)) {
          if (employeeList_error[count][key] == null) {
            list_null.push(key)
          }else{
            for (let i = 0; i < listIDNotTH1RecordFalse.length; i++) {
              if (Object.values(employeeList_error[count]["empid"]).includes(listIDNotTH1RecordFalse[i]) && !(list_null.includes("identify"))) {
                list_null.push("identify")
              }
              
            }
          }

        } else {
          if (!(list_null.includes("identify"))) {
            list_null.push("identify")
            // console.log(employeeList_error[count], "else")
          }

        }
      })
      if (list_null.length != 0) {
        listErrorFull.push([employeeList_error[count], list_null])
        list_null = []
      }
      // console.log(Object.values(employeeList_error[3]["empid"]))
      //   console.log(Object.values(employeeList_error[3]["empid"]).includes(listIDNotTH1RecordFalse[0]))

      list_null = []
    });
    // errList2(employeeList_error);
    setShow(!show)
    if (show === true) {
      setListErrorFull([])
    }
    // console.log(listErrorFull)
  }

  const errListRecordNotFalse = (employeeList_error) => {//หาlistที่ถูกแล้วcheck identify
    var props = ["companygroup", "companyname", "empid", "identification", "b_dd", "b_mm", "b_yyyy", "salutation_thai", "thai_firstname",
      "thai_lastname", "Thai_Fullname", "salutation_eng", "eng_firstname", "eng_lastname", "position", "email", "positioncode", "phone_No",
      "province", "worksite", "employment_Type", "worktype", "Report", "SalLessThan15k", "joindate", "business_SIM", "Nation", "vip", "ConsentDM"
    ];

    var results = items.filter(function (o1) {
      // filter out (!) items in result2
      return !employeeList_error.some(function (o2) {
        return o1.empid === o2.empid;          // assumes unique id
      });
    }).map(function (o) {
      // use reduce to make objects with only the required properties
      // and map to apply this to the filtered array as a whole
      return props.reduce(function (newo, empid) {
        newo[empid] = o[empid];
        return newo;
      }, {});
    });
    const resultIdentify = results.filter(result => !(checkSumDigitIDNO(result.identification.toString(), String(result.identification)[String(result.identification).length - 1])))
    // console.log(resultIdentify, "result state")//list ที่ไม่เป็นerror แต่identifyผิด
    const b = []
    for (let i = 0; i < resultIdentify.length; i++) {
      // console.log(String(resultIdentify[i]["empid"]), "result state")
      //setListIDNotTH1RecordNotFalse([...listIDNotTH1RecordFalse, ([...resultIdentify[i]["empid"]])])
      b.push(resultIdentify[i]["empid"])//id ของlist ที่ไม่เป็นerror แต่identifyผิด
    }

    setListIDNotTH1RecordNotFalse([...listIDNotTH1RecordNotFalse, ...b])
    setEmployeeList_error([...employeeList_error, ...resultIdentify])

  }

  const errListRecordFalse = (employeeList_error) => {//หาlistที่ถูกแล้วcheck identify
    console.log(employeeList_error,"987")
    const resultIdentify = employeeList_error.filter(emerr => !(checkSumDigitIDNO(emerr.identification.toString(), String(emerr.identification)[String(emerr.identification).length - 1])))
    const b = []// empidที่ผิดแล้วอยู่ในlist err
    for (let i = 0; i < resultIdentify.length; i++) {
      // console.log(String(resultIdentify[i]["empid"]), "result state")
      //setListIDNotTH1RecordNotFalse([...listIDNotTH1RecordFalse, ([...resultIdentify[i]["empid"]])])
      b.push(resultIdentify[i]["empid"])//id ของlist ที่ไม่เป็นerror แต่identifyผิด
    }
    setListIDNotTH1RecordFalse([...listIDNotTH1RecordFalse, ...b])

  }
  // const errList2 = (employeeList_error) => {
  //   console.log(employeeList_error)
  //   var list_null = []
  //   Object.keys(employeeList_error).forEach(function (count) { //key == 0,1,... ถ้าเช็คแล้วมีerror
  //     Object.keys(employeeList_error[count]).forEach(function (key) { //key == 0,1
  //       if (employeeList_error[count][key] == null || employeeList_error[count][key] == " ") {
  //         list_null.push(key)
  //       }
  //     })
  //     // console.log(id_KV[1],": id_KV[1]") // true false of id
  //     // console.log(k1,"k1") // key of temp
  //     // console.log(id_KV[0],": id_KV[0]") // key od id
  //     // if (id_KV[1] === "false" && k1 === id_KV[0]) {
  //     //   list_null.push("identify")
  //     // }
  //     // if (com_KV[1] === "false"&& k1 === com_KV[0]) {
  //     //   list_null.push("group and name is not match")
  //     // }

  //     // for (let i = 0; i < aID.length; i++) {
  //     //   for (let j = 0; j < aCom.length; j++) {
  //     //     const keyOfID = aID[i].key
  //     //     const valueOfID = aID[i].value
  //     //     // console.log(keyOfID, "id")
  //     //     // console.log(valueOfID, "id")

  //     //     const keyOfCom = aCom[j].key
  //     //     const valueOfCom = aCom[j].value
  //     //     // console.log(keyOfCom, "com")
  //     //     // console.log(valueOfCom, "com")
  //     //     if (keyOfID === keyOfCom && (valueOfID === "false")) {
  //     //       if (k1 === keyOfID) {
  //     //         console.log(keyOfID, "id")
  //     //         console.log("identify error")
  //     //         list_null.push("identify")
  //     //       } else {

  //     //       }
  //     //     }
  //     //     if (keyOfID === keyOfCom && (valueOfCom === "false")) {
  //     //       if (k1 === keyOfCom) {
  //     //         console.log(keyOfCom, "com")
  //     //         console.log("composite error")
  //     //         list_null.push("composite")
  //     //       }
  //     //     }
  //     //   }
  //     // }
  //     // for (let i = 0; i < aCom.length; i++) {
  //     //   const keyOfCom = aCom[i].key
  //     //   const valueOfCom = aCom[i].value
  //     //   console.log(keyOfCom, "com")
  //     //   console.log(valueOfCom, "com")
  //     // }


  //     if (list_null.length != 0) {
  //       listErrorFull.push([employeeList_error[count], list_null])
  //       list_null = []
  //     }
  //   });
  // }


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
        setCheckInside(!checkInside)//ปิด เปิด show error
      } else {
        console.log("compare fileds is false")
        setStateChecktwocolumn("false")
      }
    } catch (error) {
    }
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
                      <div></div>
                    }
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



        <h1>count error = {employeeList_error.length}</h1>
        <h1>count item = {items.length}</h1>
        {/* <button onClick={checkTwoColumn}>compare to</button> */}

        {/* <button onClick={reset}>reset</button> */}
      </div>
    </div>
  );
}
export default SelectFile;
