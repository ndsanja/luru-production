/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { productsStore } from "../stores/stores";
import { publicUrl } from "../repository/supabase";
import './CardMenu.scss';

export default function RecomendationMenu() {
  const [products, setProducts] = useAtom(productsStore);

  return (
    <>
      <div className="recomendation-list">
        {products.map((product) => (
          <div className="item-wrapper" key={product.id}>
            <Link to={`/products/${product?.id}`}>
            <img
              src={`${publicUrl}/${product?.id}/${product?.picture}`}
              alt={product.name}
            />
            <div className="text-wrapper">
              <h4 className="title-text">{product.title}</h4>
              <p className="alamat-text">{product.description}</p>
              {/* <p className="description-text">{product.product.}</p> */}
            </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
