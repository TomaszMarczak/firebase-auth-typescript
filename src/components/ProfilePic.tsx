import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BsPersonBoundingBox } from "react-icons/bs";
import { Image } from "react-bootstrap";
import UploadModal from "./UploadModal";

export default function ProfilePic() {
  const { currentUser } = useAuth();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
            <Image
              onClick={() => setModalOpen(true)}
              src={currentUser.photoURL || ""}
              className="rounded-circle d-block mx-auto"
              style={{ width: "10rem", cursor: "pointer" }}
            />
          )}
        </div>
      ) : (
        ""
      )}
      <UploadModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
}
