import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './SearchBar.scss';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    navigate(`explores?s=${searchTerm}`);
  };

  return (
    <>
    <div className="button-home">
    <input
        className="search-bar"
        placeholder="Silahkan Cari Disini"
        value={searchTerm}
        onChange={handleChange}
      ></input>
      <button className="btnCari" onClick={handleSearch}>Cari</button>
    </div>
    </>
  );
}
