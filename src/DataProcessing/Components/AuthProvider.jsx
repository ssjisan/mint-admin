import { useEffect, useState } from "react";

export default function AuthProvider() {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  useEffect(() => {
    const data = sessionStorage.getItem("auth");

    if (data) {
      const parsedData = JSON.parse(data);

      setAuth({
        user: parsedData.user,
        token: parsedData.token,
      });
    }
  }, []);

  return {
    auth,
    setAuth,
  };
}
