import React,{createContext,useReducer, useState,useRef, useEffect} from 'react'
import { useDispatchCart,useCart } from './ContextReduce';

export default function Card(props) {
  let priceOption = Object.keys(props.options || {});
  let data = useCart();
  let options = props.options || {};
  let dispatch = useDispatchCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");

  const priceRef = useRef();
  let finalPrice = qty * parseInt(options[size] || 0);

  useEffect(() => {
    if (priceRef.current) setSize(priceRef.current.value || "");
  }, []);

  const handleAddToCart = async () => {
    let food = [];
    for (const item of data) {
      if (item.id === props.foodItem._id && item.size === size) {
        food.push(item);
        break;
      }
    }

    if (food.length !== 0) {
      await dispatch({ type: "UPDATE", id: props.foodItem._id, size: size, price: finalPrice, qty: qty });
      return;
    }

    await dispatch({ type: "ADD", id: props.foodItem._id, name: props.foodItem.name, qty: qty, size: size, price: finalPrice, img: props.foodItem.img });
  };

  return (
    <div className="surface rounded-xl overflow-hidden border border-gray-700 p-3">
      <img src={props.foodItem?.img} alt={props.foodItem?.name} className="w-full h-40 object-cover rounded-md" />
      <div className="mt-3">
        <h5 className="text-white text-lg">{props.foodItem?.name}</h5>

        <div className="flex items-center gap-2 mt-3">
          <select className="h-9 px-2 rounded bg-transparent border border-gray-700" onChange={(e) => setQty(e.target.value)} value={qty}>
            {Array.from(Array(6), (e, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select className="h-9 px-2 rounded bg-transparent border border-gray-700" ref={priceRef} onChange={(e) => setSize(e.target.value)}>
            {priceOption.map((data) => (
              <option key={data} value={data}>
                {data}
              </option>
            ))}
          </select>

          <div className="ml-auto text-white font-semibold">₹{finalPrice}/-</div>
        </div>

        <button className="mt-3 w-full bg-orange-500 hover:bg-orange-600 py-2 rounded text-white" onClick={handleAddToCart}>
          Add To Cart
        </button>
      </div>
    </div>
  );
}
)}