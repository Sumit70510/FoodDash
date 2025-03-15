import React from 'react'

export default function Card({name,CategoryName,id,options,description,img}) {
  let priceOption=Object.keys(options);
  return (
    <div>
      <div className="card mt-3" style={{"width":"18rem","maxHeight":"360px"}}>
        <img src={img} className='card-img-top' alt="..."/>
        <div className="card-body">
            <h5 className='card-title'>{name}</h5>
            {/* <p className='card-text'>{description}</p> */}
            <div className="container w-100">
               <select className='m-2 h-100 bg-primary rounded'>
                  {
                    Array.from(
                      Array(6),(e,i)=>{
                        return (
                          <option key={i+1} value={i+1}>{i+1}</option>
                        )
                      }
                    )
                  }
               </select>
               <select className='m-2 h-100 bg-primary rounded'>
                 {
                  priceOption.map((data)=>{
        return(<option key={data} value={data}>
          {data}
        </option>);
                  }
                  )
                 }
               </select>
               <div className='d-inline h-100 fs-5'>
                 Total Price
               </div>
            </div>
        </div>
      </div>
    </div>
  )
}
