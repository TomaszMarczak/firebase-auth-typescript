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
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  error: string;
  setError: (value: string) => void;
  setLoading: (value: boolean) => void;
  emailPasswordSignup: (email: string, password: string) => void;
  emailPasswordLogin: (email: string, password: string) => void;
  passwordReset: (email: string) => void;
  updateUserProfile: (name: string | null) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
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

  const emailPasswordSignup = (email: string, password: string): void => {
    createUserWithEmailAndPassword(auth, email, password)
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

  const emailPasswordLogin = (email: string, password: string): void => {
    signInWithEmailAndPassword(auth, email, password)
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

  const passwordReset = (email: string): void => {
    sendPasswordResetEmail(auth, email).catch((error) => {
      Object.entries(authErrors).forEach(([key, value]) => {
        if (error.code === "auth/" + key) setError(value);
      });
    });
  };

  //Add profile picture update later
  const updateUserProfile = (name: string | null): Promise<void> => {
    return updateProfile(currentUser as User, {
      displayName: name,
    });
  };

  //TODO + import updatePhoneNumber
  //   const updateUserPhoneNumber = (phone: string): void => {
  //   updatePhoneNumber(currentUser as User, phone)
  //   .catch((error) => {
  //       Object.entries(authErrors).forEach(([key, value]) => {
  //         if (error.code === "auth/" + key) setError(value);
  //       });
  //   }
  // }

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
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
