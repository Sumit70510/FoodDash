import React,{createContext,useReducer, useState,useRef, useEffect} from 'react'
import { useDispatchCart,useCart } from './ContextReduce';

export default function Card(props) {
  let priceOption=Object.keys(props.options);
  let data=useCart();  
  let options=props.options;
  let dispatch=useDispatchCart();
  const [qty,setQty] = useState(1);
  const [size,setSize] = useState("");

  const priceRef=useRef();
  let finalPrice=qty*parseInt(options[size]);
  let color="white";
  // let color="linear-gradient(to right,rgb(244, 247, 252),rgb(237, 242, 247))";
  useEffect(()=>{
      setSize(priceRef.current.value);
    },[]);

    const handleAddToCart = async () => {
      let food = [];
      for (const item of data)
       {
         if(item.id===props.foodItem._id&&item.size===size) 
          { 
            // console.log("Found item:");
            food.push(item);
            break;
          }
       }

      if (food.length !== 0) {
          // console.log("HERE Size is Same");
          await dispatch({ type: "UPDATE", id:props.foodItem._id, size: size, price: finalPrice, qty: qty });
          return;
      } 
      // console.log("Adding new Element");
      await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, qty: qty, size: size, price: finalPrice, img: props.foodItem.img });
  };
  
  
  return (
    <div>
     <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" ,background: color }}>
       <img
        src={props.foodItem?.img}
        className="card-img-top img-fluid w-100"
        style={{ height: "150px", objectFit: "fill" }} 
        alt={props.foodItem?.name} 
       />
       <hr style={{ margin: "0px" ,borderWidth:"1px",borderStyle:"solid", borderColor: "black"}}/>
       <div className="card-body text-black"  >
         <h5 className="card-title">{props.foodItem?.name}</h5>
{/* <hr style={{ marginTop: "0px",marginBottom:"0px",marginLeft:"0px",borderWidth:"1px" ,borderColor:"black", background:"black"}}></hr> */}
         <div className="container w-100 p-0">
            <select className="mt-2 me-2 h-100 w-20 bg-primary rounded" onChange={(e)=>setQty(e.target.value)}>
              {Array.from(Array(6), (e, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <select className="m-2 mb-0 h-100 w-20 bg-primary text rounded" ref={priceRef} onChange={(e)=>setSize(e.target.value)} >
              {priceOption.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </select>
            <div className="d-inline ms-2 mb-0 h-100 w-20 fs-5">₹{finalPrice}/-</div>
         </div>
       </div>
      <hr style={{ marginTop: "0px" ,borderWidth:"1px",marginBottom :"8px" ,borderStyle:"solid", borderColor: "black"}}/>
      <button className="btn btn-primary m-2 mt-0 w-max" onClick={handleAddToCart}>
        Add To Cart 
      </button>
     </div>
    </div>
)}