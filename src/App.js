import Axios from 'axios'
import { useState } from 'react'
import * as XLSX from 'xlsx'
function App() {
  const [employeeList, setEmployeeList] = useState([]);
  var checkButton;


  const [items, setitems] = useState([]);
  // const [newname, setnewName] = useState("dol");
  // const [newage, setnewAge] = useState(5);
  // const [newcountry, setnewCountry] = useState("th");
  // const [newposition, setnewPosition] = useState("dev");
  // const [newwage, setnewWage] = useState(2000);
  //ดึงข้อมูลจากpathมาเก็บไว้ในemployeeList
  const getEmployee = () => {
    Axios.get('http://localhost:3001/employee').then((response) => {
      setEmployeeList(response.data);
    })

  }
  //functionสำหรับการเอาข้อมูลจากinpitไปเก็บไว้บนpath
  // const addEmployee = ()=>{
  //   Axios.post('http://localhost:3001/create',{
  //     name: name
  //   }).then(() =>{
  //     setEmployeeList([
  //       ...employeeList,//เก็ยข้อมูลตัวเก่าไม่ให้หาย
  //       {
  //         name:name
  //       }
  //     ])
  //   })
  // }
  const updateName = (id, newname, newage, newcountry, newposition, newwage) => {
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
  }
  const loopItem = () =>{
    for (let index = 0; index < items.length; index++) {
      updateName(items[index].id, items[index].name, (items[index].age).toString(), items[index].country, items[index].position, (items[index].wage).toString())
      
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
  const checkbuttom = (dID,valID) => {
    if (dID == valID) {
      console.log("dID and valID is same")
    }else{
      console.log("dID and valID is not same")
    }

  }

  return (
    <div className="App container">
      <h1>infomation</h1>
      <div className="infomation">
        {/* -----------------------------phase1 CRUD data connect database-----------------------------------------  */}
      </div>

      <br />
      <div>



        {/* ดึงข้อมูลออกมาเพื่อแสดงผล */}
        <button className="btn btn-primary" onClick={getEmployee}>show</button>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcel(file);
          }}

        />

        {/* {
          //ข้อมูลที่ได้ทั้งหมดของexcel
          items.map((d) => (
              <div>
                <button className="btn btn-primary" onClick={() => { updateName(d.id, d.name, (d.age).toString(), d.country, d.position, (d.wage).toString()) }}>update</button>
              </div>
              
          ))
        } */}
              {
                //ข้อมูลที่ได้ทั้งหมดของexcel
                
                // items.map((d, index) => ( 

                  
              // <div key={index}>
              //   <button className="btn btn-primary" onClick={() => { checkButton(d.id, val.id) }}>update</button>
              // </div>
                  <div >
                  <button className="btn btn-primary" onClick={() => { loopItem() }}>update</button>
                </div>

              // ))
              }


        {/* <button className="btn btn-primary" onClick={addEmployee}>submit</button>  */}

        {/* -----------------------------phase2 read file excel-----------------------------------------                */}
        {/* <input
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
</table> */}


      </div>
    </div>
  );
}

export default App;
// import { ReactExcel, readFile, generateObjects } from '@ramonak/react-excel';
// import { useState } from 'react';

// const App = () => {
//   const [initialData, setInitialData] = useState(undefined);
//   const [currentSheet, setCurrentSheet] = useState({});

//   const handleUpload = (event) => {
//     const file = event.target.files[0];
//     //read excel file
//     readFile(file)
//       .then((readedData) => setInitialData(readedData))
//       .catch((error) => console.error(error));
//   };

//   const save = () => {
//     const result = generateObjects(currentSheet);
//     //save array of objects to backend
//     fetch("/api/save", {
//         method: 'POST',
//         body: JSON.stringify(result)
//     });
//     console.log(currentSheet)
//   };

//   return (
//     <>
//       <input
//         type='file'
//         accept='.xlsx'
//         onChange={handleUpload}
//       />
//       <ReactExcel
//         initialData={initialData}
//         onSheetUpdate={(currentSheet) => setCurrentSheet(currentSheet)}
//         activeSheetClassName='active-sheet'
//         reactExcelClassName='react-excel'
//       />
//       <button onClick={save}>
//           Save to API
//       </button>
//     </>
//   );
// }
// export default App;