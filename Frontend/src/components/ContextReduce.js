import React,{createContext,useContext,useReducer} from 'react';
const cartStateContext=createContext();
const cartDispatchContext=createContext();

const reducer =(state,action)=>
  {
    switch(action.type)
     {
        case "ADD" :  return [...state,{id:action.id,name:action.name,qty:action.qty,size:action.size,price:action.price,img:action.img}]
        case "REMOVE" :
         let newarr=[...state]
         newarr.splice(action.index,1)
         return newarr;
         case "UPDATE":
          let arr = [...state];
          arr.forEach((food, index) => {
          if(food.id === action.id && food.size === action.size) { 
            arr[index] = { 
                ...food,
                qty: parseInt(food.qty) + parseInt(action.qty),  
                price: food.price + action.price  
             };
            }
            });
          return arr;
         case "DROP" :
            let empARR=[];
            return empARR;
        default : console.log("Error In Reducer");
     }
  }

export const CartProvider=({children})=> 
{
  const [state,dispatch]=useReducer(reducer,[]);  
  return(
     <cartDispatchContext.Provider value={dispatch}>
        <cartStateContext.Provider value={state}>
           {children} 
        </cartStateContext.Provider>
     </cartDispatchContext.Provider>
   )
}
export const useCart=()=>useContext(cartStateContext);
export const useDispatchCart=()=>useContext(cartDispatchContext);