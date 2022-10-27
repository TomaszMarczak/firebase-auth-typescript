import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BsPersonBoundingBox, BsTrash } from "react-icons/bs";
import { Image } from "react-bootstrap";
import UploadModal from "./UploadModal";
import { useNavigate } from "react-router-dom";

export default function ProfilePic() {
  const { currentUser, deleteUserPhoto } = useAuth();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <>
      {currentUser ? (
        <div>
          {!currentUser?.photoURL ? (
            <div>
              <div
                style={{ fontSize: "6em", cursor: "pointer" }}
                className="d-flex flex-column align-items-center my-2"
                onClick={() => setModalOpen(true)}
              >
                <BsPersonBoundingBox />
              </div>
            </div>
          ) : (
            <div className="position-relative">
              <Image
                onClick={() => setModalOpen(true)}
                src={currentUser.photoURL || ""}
                id="profilePicture"
                className="rounded-circle d-block mx-auto my-2"
                style={{
                  width: "10rem",
                  height: "10rem",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
              />
              <span
                onClick={() => {
                  deleteUserPhoto().then(() => navigate(0));
                }}
                id="delete-trash"
                className="hover-scale-2"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <BsTrash />
              </span>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
      <UploadModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}
