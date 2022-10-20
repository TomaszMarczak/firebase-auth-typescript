import { Modal, Button, ProgressBar, Form } from "react-bootstrap";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

type UploadModalTypes = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function UploadModal({ open, setOpen }: UploadModalTypes) {
  const [file, setFile] = useState<File | null>(null);
  const [bytesTransferred, setBytesTransferred] = useState<number>(0);
  const [totalBytes, setTotalBytes] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const { setError, updateUserProfilePic, deleteUserPhoto } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent) => {
    setUploading(() => true);
    e.preventDefault();
    const fileName = uuidv4();
    const storageRef = ref(storage, "images/" + fileName);
    if (file) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setTotalBytes(snapshot.totalBytes);
          setBytesTransferred(snapshot.bytesTransferred);
        },
        (error) => {
          setUploading(() => false);
          setError("Failed to upload image.");
        },
        () => {
          setUploading(() => false);
          deleteUserPhoto()
            .then(() => {
              getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
                updateUserProfilePic(URL);
                setOpen(false);
                navigate(0);
              });
            })
            .catch((error) => setError(error.code));
        }
      );
    }
  };
  return (
    <Modal show={open} onHide={() => setOpen(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update your profile picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              onChange={(e) => {
                const target = (e.target as HTMLInputElement).files?.item(
                  0
                ) as File;
                setFile(target);
              }}
              type="file"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex flex-row justify-content-end align-items-center gap-3 w-100">
          {uploading && (
            <ProgressBar
              now={bytesTransferred}
              max={totalBytes}
              label={`${Math.round((bytesTransferred / totalBytes) * 100)}%`}
              className="w-75"
            />
          )}
          {file && `${Math.round(file.size / 10000) / 100}Mb`}
          <Button onClick={handleSubmit}>Upload</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
