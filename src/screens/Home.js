import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import Carousal from '../components/Carousal'

export default function Home() {

  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);

  const loadData = async () => {
    let response = await fetch('http://localhost:4000/api/FoodData',
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      },
    );
    response = await response.json();
    setFoodItem(response[0]);
    setFoodCat(response[1]);
  }

  useEffect(
    () => {
      loadData();
    }, []
  );

  const imgStyle = { maxHeight: "400px", objectFit: "cover", width: "100%" };
  return (
    <>
      <div><NavBar /></div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" >
          <div className="carousel-inner">
            <div className='carousel-caption' style={{ zIndex: '10' }}>
              <div className="d-flex justify-content-center">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={search}
                  onChange={(e) => { setSearch(e.target.value) }}
                />
              </div>
            </div>
            <div className="carousel-item active">
              <img src="/car1.jpg" className="d-block w-100" style={imgStyle} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/car2.jpg" className="d-block w-100" style={imgStyle} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="/car3.jpg" className="d-block w-100" style={imgStyle} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      <div className='container-fluid mx-4 px-1 overflow-hidden'>
        {
          foodCat.length !== 0 ? (
            foodCat.map((data) => {
              const filteredItems = foodItem.filter(
                (item) =>
                  item.CategoryName === data.CategoryName &&
                  (search.trim() === "" || item.name.toLowerCase().includes(search.toLowerCase()))
              );
              return filteredItems.length > 0 ? (
                <div key={data._id} className="row mb-3">
                  <div className="fs-3 m-3">{data.CategoryName}</div>
                  {filteredItems.map((filterItem) => (
                    <div key={filterItem._id} className="col-12 col-md-6 col-lg-3">
                      <Card name={filterItem.name} img={filterItem.img} options={filterItem.options[0]} />
                    </div>
                  ))}
                </div>
              ) : null;
            })
          ) : (
            <div>No Categories Found</div>
          )
        }
      </div>
      <div><Footer /></div>
    </>
  )
}