/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import "./UpdateMerchant.scss";
import { supabase } from "../repository/db";
import { useAtom } from "jotai";
import { userStore } from "../stores/stores";
import { useNavigate, useParams } from "react-router-dom";
import { publicUrl } from "../repository/supabase";

export default function UpdateMerchant({ setUpdateMerchant }) {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userStore);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [open, setOpen] = useState(null);
  const [close, setClose] = useState(null);
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [youtube, setYoutube] = useState("");
  const [phone, setPhone] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [merchant, setMerchant] = useState([]);
  const { id } = useParams();

  const getMerchant = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .select()
      .eq("id", id)
      .single();

    if (!error) {
      setMerchant(data);
      setAddress(data?.address);
      setName(data?.title);
      setDescription(data?.description);
      setLatitude(data?.lat);
      setLongitude(data?.lng);
      setOpen(data?.open);
      setClose(data?.close);
      setFacebook(data?.facebook);
      setInstagram(data?.instagram);
      setTwitter(data?.twitter);
      setTiktok(data?.tiktok);
      setYoutube(data?.youtube);
      setPhone(data?.phone);
      setNewAvatarUrl(`${publicUrl}/${id}/${data?.picture}`);
    }
  };

  useEffect(() => {
    getMerchant();
  }, []);

  function handleChange(e) {
    setNewAvatarUrl(URL.createObjectURL(e.target.files[0]));
    setNewAvatar(e.target.files[0]);
  }

  const handleUpdateAvatar = async (merchantId) => {
    const fileName = `${uuidV4()}-${newAvatar?.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`${merchantId}/${fileName}`, newAvatar, {
        cacheControl: "3600",
        upsert: false,
      });

    if (!error) {
      const { data, error } = await supabase
        .from("merchants")
        .update({ picture: fileName })
        .eq("id", merchantId)
        .select()
        .single();

      if (!error) {
        setNewAvatar("");
      }
    }
  };

  const handleUpdateMerchant = async () => {
    const { data, error } = await supabase
      .from("merchants")
      .update({
        title: name,
        address,
        description,
        lat: latitude,
        lng: longitude,
        open,
        close,
        facebook,
        instagram,
        twitter,
        tiktok,
        youtube,
        phone,
        owner: user?.id,
      })
      .eq("id", id)
      .select()
      .single();

    if (!error && newAvatar) {
      await handleUpdateAvatar(data?.id);
      setName("");
      setAddress("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setOpen("");
      setClose("");
      setFacebook("");
      setInstagram("");
      setTwitter("");
      setTiktok("");
      setYoutube("");
      setPhone("");
    }
    if (!error) {
      setUpdateMerchant(false);
    }
  };

  const handleDeleteMerchant = async () => {
    const { error } = await supabase.from("merchants").delete().eq("id", id);
    if (!error) {
      navigate("/users?tab=merchants", { replace: true });
    }
  };
  return (
    <div className="wrapper-create-store">
      <div className="title">Update Toko</div>

      <button className="close-button" onClick={() => setUpdateMerchant(false)}>
        close
      </button>

      <div className="form">
        <input
          type="text"
          placeholder="nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="alamat"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="deskripsi"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="number"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <input
          type="time"
          placeholder="Open"
          value={open}
          onChange={(e) => setOpen(e.target.value)}
        />
        <input
          type="time"
          placeholder="Close"
          value={close}
          onChange={(e) => setClose(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
        />
        <input
          type="text"
          placeholder="Youtube"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
        />
        <input
          type="text"
          placeholder="Facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tiktok"
          value={tiktok}
          onChange={(e) => setTiktok(e.target.value)}
        />
        <input
          type="text"
          placeholder="Twitter"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
        />

        <div className="avatar">
          {newAvatar ? (
            <img className="image" src={newAvatarUrl} alt="" />
          ) : (
            <img className="image" src={newAvatarUrl} alt="" />
          )}
          <div className="btn-wrapper">
            <label htmlFor="image" className="label">
              upload
            </label>
            <input type="file" hidden id="image" onChange={handleChange} />
          </div>
        </div>
        <button onClick={handleUpdateMerchant}>Update</button>
        <button onClick={handleDeleteMerchant}>Delete</button>
      </div>
    </div>
  );
}
