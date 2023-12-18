import Discount from "../components/CardDiscount";
import RecomendationMenu from "../components/CardMenu";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../repository/db";
import { publicUrl } from "../repository/supabase";
import { HiCog6Tooth, HiHeart, HiOutlineHeart, HiPlus } from "react-icons/hi2";
import { FaWhatsapp, FaTiktok, FaInstagram } from "react-icons/fa";
import "./MerchantDetail.scss";
import UpdateMerchant from "../components/UpdateMerchant";
import CreateProduct from "../components/CreateProduct";
import { useAtom } from "jotai";
import { productsStore, userStore } from "../stores/stores";
import { useGeolocated } from "react-geolocated";
import { convertDistance, getDistance } from "geolib";

export default function MerchantDetail() {
  const [merchant, setMerchant] = useState(null);
  const { id } = useParams();
  const [updateMerchant, setUpdateMerchant] = useState(false);
  const [createProduct, setCreateProduct] = useState(false);
  const [user, setUser] = useAtom(userStore);
  const [isLike, setIsLike] = useState(false);
  const [products, setProducts] = useAtom(productsStore);

  const { coords } = useGeolocated();

  const getMerchant = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .select()
      .eq("id", id)
      .single();

    if (!error) {
      setMerchant(data);
    }
  };

  const getProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select()
      .eq("merchant_id", id);

    if (!error) {
      setProducts(data);
    }
  };

  const handleGetLike = async () => {
    const { data, error } = await supabase
      .from("merchant_likes")
      .select()
      .match({ user_id: user?.id, merchant_id: id })
      .single();

    if (data?.user_id === user?.id && data?.merchant_id === id) {
      setIsLike(true);
    }
  };

  useEffect(() => {
    getMerchant();
    getProducts();
  }, [id]);

  useEffect(() => {
    handleGetLike();
  }, [id, user]);

  const handleLike = async () => {
    const { data, error } = await supabase
      .from("merchant_likes")
      .insert({ user_id: user?.id, merchant_id: id })
      .select();

    if (!error) {
      setIsLike(true);
    }
  };

  const handleDislike = async () => {
    const { error } = await supabase
      .from("merchant_likes")
      .delete()
      .match({ user_id: user?.id, merchant_id: id });

    if (!error) {
      setIsLike(false);
    }
  };

  return (
    <>
      <section className="merchant">
        <div className="merchant-image">
          <img src={`${publicUrl}/${merchant?.id}/${merchant?.picture}`} />
        </div>
        <div className="merchant-text">
          <h1 className="merchant-title">{merchant?.title}</h1>
          <p className="merchant-address">{merchant?.address}</p>
          <p className="merchant-distance">
            {convertDistance(
              getDistance(
                {
                  latitude: Number(coords?.latitude),
                  longitude: Number(coords?.longitude),
                },
                {
                  latitude: Number(merchant?.lat),
                  longitude: Number(merchant?.lng),
                }
              ),
              "km"
            )}{" "}
            Km
          </p>

          <p className="merchant-description">{merchant?.description}</p>
          <p className="merchant-status">
            {merchant?.open} - {merchant?.close}
          </p>
          <div className="button-options">
            {merchant?.owner === user?.id && (
              <button onClick={() => setCreateProduct(true)} className="option">
                <HiPlus />
              </button>
            )}
            {isLike ? (
              <button onClick={handleDislike} className="option">
                <HiHeart />
              </button>
            ) : (
              <button onClick={handleLike} className="option">
                <HiOutlineHeart />
              </button>
            )}

            {merchant?.owner === user?.id && (
              <button
                onClick={() => setUpdateMerchant(true)}
                className="option"
              >
                <HiCog6Tooth />
              </button>
            )}
          </div>
          <div className="button-contact">
            <FaInstagram className="btn-socmed" />{" "}
            <FaTiktok className="btn-socmed" />{" "}
            <FaWhatsapp className="btn-socmed" />
          </div>
        </div>
      </section>
      <section>
        <h2 className="discount-title">Spesial Offer</h2>
        <div className="discount">
          <Discount />
        </div>
      </section>
      <section>
        <div className="card-item">
          <h2 className="recomendation-title">Rekomendasi</h2>
          <RecomendationMenu merchantId={id} />
        </div>
      </section>
      {updateMerchant && (
        <UpdateMerchant setUpdateMerchant={setUpdateMerchant} />
      )}
      {createProduct && (
        <CreateProduct setCreateProduct={setCreateProduct} merchantId={id} />
      )}
    </>
  );
}
