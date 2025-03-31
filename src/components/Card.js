import React,{createContext,useReducer} from 'react'

export default function Card({name,CategoryName,id,options,description,img}) {
  let priceOption=Object.keys(options);
  const handleAddToCart= ()=>{}
  return (
    <div>
    <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px" }}>
      <img
        src={img}
        className="card-img-top img-fluid w-100"
        style={{ height: "150px", objectFit: "fill" }}
        alt={name}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <div className="container w-100 p-0">
          <div className="d-flex">
            <select className="me-2 bg-primary text-black rounded">
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="bg-primary text-black rounded">
              {priceOption.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-1 fs-5">₹0</div>
        </div>
      </div>
      <hr />
      <button className="btn btn-primary ms-2 mb-2 w-50" onClick={handleAddToCart}>
        Add To Cart
      </button>
    </div>
  </div>
  
  )
}
