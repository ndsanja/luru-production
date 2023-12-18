/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./MerchantItem.scss";
import { publicUrl } from "../repository/supabase";

export default function MerchantItem({ id, title, picture, address }) {
  return (
    <div className="container">
      <Link to={`/merchants/${id}`}>
        <img src={`${publicUrl}/${id}/${picture}`} alt={title} />
      </Link>
      <div className="text-wrapper">
      <h5 className="title-text">{title}</h5>
      <h5 className="title-address">{address}</h5>
      </div>
    </div>
  );
}
