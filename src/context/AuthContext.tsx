import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth } from "../firebase";
import authErrors from "../utils/authErrors";
import {
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: string;
  setError: (value: string) => void;
  setLoading: (value: boolean) => void;
  emailPasswordSignup: (email: string, password: string) => Promise<void>;
  emailPasswordLogin: (email: string, password: string) => Promise<void>;
  passwordReset: (email: string) => Promise<void>;
  updateUserName: (name: string | null) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  updateUserProfilePic: (imageURL: string) => Promise<void>;
  deleteUserPhoto: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const emailPasswordSignup = (
    email: string,
    password: string
  ): Promise<void> => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        Object.entries(authErrors).forEach(([key, value]) => {
          if (error.code === "auth/" + key) setError(value);
        });
      });
  };

  const emailPasswordLogin = (
    email: string,
    password: string
  ): Promise<void> => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
        navigate("/", { replace: true });
      })
      .catch((error) => {
        Object.entries(authErrors).forEach(([key, value]) => {
          if (error.code === "auth/" + key) setError(value);
        });
      });
  };

  const passwordReset = (email: string): Promise<void> => {
    return sendPasswordResetEmail(auth, email).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === "auth/" + key) setError(value);
      });
    });
  };

  const updateUserName = (name: string | null): Promise<void> => {
    return updateProfile(currentUser as User, {
      displayName: name,
    });
  };
  const updateUserProfilePic = (url: string | null): Promise<void> => {
    return updateProfile(currentUser as User, {
      photoURL: url,
    });
  };

  const updateUserEmail = (email: string): Promise<void> => {
    return updateEmail(currentUser as User, email).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === "auth/" + key) setError(value);
      });
    });
  };
  const updateUserPassword = (password: string): Promise<void> => {
    return updatePassword(currentUser as User, password).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === "auth/" + key) setError(value);
      });
    });
  };

  const deleteUserPhoto = (): Promise<void> => {
    const currentPhotoURL = currentUser?.photoURL || "";
    if (currentPhotoURL) {
      try {
        if (currentPhotoURL.match(/(firebasestorage.googleapis.com)/gm)) {
          const currentImageName = currentPhotoURL.match(
            /(?<=images%2F)(.*)(?=\?)/gm
          );
          if (currentImageName && (currentImageName?.length as number) > 0) {
            const currentPhotoRef = ref(
              storage,
              "images/" + currentImageName[0]
            );
            deleteObject(currentPhotoRef);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    return updateUserProfilePic("").catch((error) => console.log(error));
  };

  const deleteUserAccount = async (): Promise<void> => {
    await deleteUserPhoto();
    return deleteUser(currentUser as User).then(() => navigate("/"));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    emailPasswordSignup,
    emailPasswordLogin,
    loading,
    setLoading,
    error,
    setError,
    passwordReset,
    updateUserEmail,
    updateUserPassword,
    updateUserName,
    updateUserProfilePic,
    deleteUserPhoto,
    deleteUserAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
