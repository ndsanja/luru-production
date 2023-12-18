import { Link } from "react-router-dom";

export default function ProductItem({
  id,
  title,
  picture,
  address,
  description,
}) {
  // console.log(id)
  return (
    <div className="container">
      <div className="item-container">
        <Link to={`/products/${id}`}>
          <img src={picture} alt={title} />
        </Link>
        <div className="item-text">
          <h4>{title}</h4>
          <h5>{address}</h5>
        </div>
      </div>
    </div>
  );
}
