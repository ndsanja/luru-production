/* eslint-disable react/prop-types */
import { convertDistance, getDistance } from "geolib";
import { publicUrl } from "../repository/supabase";
import "./CardRecomendation.scss";
import { Link } from "react-router-dom";
import { useGeolocated } from "react-geolocated";

export default function Recomendation({ merchants }) {
  const { coords } = useGeolocated();

  return (
    <>
      <div className="recomendation-list">
        {merchants?.map((merchants) => (
          <div className="item-wrapper" key={merchants?.id}>
            <Link to={`/merchants/${merchants.id}`}>
              <img
                src={`${publicUrl}/${merchants?.id}/${merchants?.picture}`}
                alt={merchants.name}
              />

              <div className="text-wrapper">
                <h4 className="title-text">{merchants.title}</h4>
                <p className="alamat-text">{merchants.address}</p>
                <p className="distance-text">
                  {convertDistance(
                    getDistance(
                      {
                        latitude: Number(coords?.latitude),
                        longitude: Number(coords?.longitude),
                      },
                      {
                        latitude: Number(merchants?.lat),
                        longitude: Number(merchants?.lng),
                      }
                    ),
                    "km"
                  )}{" "}
                  Km
                </p>
                <p className="description-text">{merchants.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
