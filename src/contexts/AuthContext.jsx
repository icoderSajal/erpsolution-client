import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/*
  AuthProvider responsibilities:
  - store token & user
  - on login: save token, fetch permissions
  - on mount: try load token from localStorage and refresh user & permissions
*/
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState([]); // from UserPermission model
  const [userRoutePermissions, setUserRoutePermissions] = useState([]); // endpoints

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // simple token expiry check
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
            setLoading(false);
            return;
          }
          // fetch user/basic info from backend (we stored user in token id)
          const resUser = await api.get(`/auth/profile`).catch(() => null);
          if (resUser && resUser.data?.user) {
            setUser(resUser.data.user);
            
          } else {
            // fallback: decode token for id and email if present
            setUser({
              _id: decoded.id,
              email: decoded.email,
              role: decoded.role,
            });
          }
          // fetch permissions

          await loadPermissions(decoded.id); //comment this for now
        } catch (err) {
          console.warn("Auth init failed", err);
          logout();
        }
      }
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data?.token) {
      const t = res.data.token;
      localStorage.setItem("token", t);
      setToken(t);
      // save user
      const u = res.data.user;
      setUser(u);
      // load permissions
      await loadPermissions(u._id); //comment for now
      return { success: true };
    }
    return { success: false, message: res.data?.msg || "Login failed" };
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data?.token) {
      const t = res.data.token;
      const u = res.data.user;
      localStorage.setItem("token", t);
      setToken(t);
      setUser(u);
      await loadPermissions(u._id);
      return { success: true };
    }
    return { success: false, message: res.data?.msg || "Registration failed" };
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUserPermissions([]);
    setUserRoutePermissions([]);
    toast.success(`User Logout Successfully`);
  };

  const loadPermissions = async (userId) => {
    try {
      const [upRes, urpRes] = await Promise.all([
        api.get(`/user/permissions/${userId}`).catch(() => null),
        api.get(`/user/route-permissions/${userId}`).catch(() => null),
      ]);

      if (upRes && upRes.data && upRes.data.up) {
        setUserPermissions(upRes.data.up.permissions || []);
      } else {
        setUserPermissions([]);
      }

      if (urpRes && urpRes.data && urpRes.data.urp) {
        setUserRoutePermissions(urpRes.data.urp.routes || []);
      } else {
        setUserRoutePermissions([]);
      }
    } catch (err) {
      console.error("Failed to load permissions", err);
      setUserPermissions([]);
      setUserRoutePermissions([]);
    }
  };

  // helper: check if user has a permission by name and action (action numeric: 0 create, 1 read, 2 edit, 3 delete)
  const hasPermission = (permissionName, action = 1) => {
    // check userPermissions (module-level)
    const p = userPermissions.find(
      (x) =>
        x.permissionName.toLowerCase() === String(permissionName).toLowerCase()
    );
    if (
      p &&
      Array.isArray(p.permissionValues) &&
      p.permissionValues.includes(action)
    ) {
      return true;
    }
    // check route-specific permissions (permissionName may be endpoint)
    const route = userRoutePermissions.find(
      (r) => r.routerEndpoint === permissionName
    );
    if (
      route &&
      Array.isArray(route.permissionValues) &&
      route.permissionValues.includes(action)
    ) {
      return true;
    }
    return false;
  };

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
    userPermissions,
    userRoutePermissions,
    hasPermission,
    reloadPermissions: () => user && loadPermissions(user._id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
