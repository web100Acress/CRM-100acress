import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://13.203.201.65:5001";

export function useRoleDashboardStats(userRole, userId) {
  const [roleStats, setRoleStats] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);
    s.on("connect", () => console.log("[Socket] Connected!"));
    s.on("disconnect", () => console.log("[Socket] Disconnected!"));
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    console.log("[Hook] userRole:", userRole, "userId:", userId);
    if (!socket || !userRole || !userId) return;
    console.log("[Hook] Emitting requestRoleDashboardStats", { role: userRole, userId });
    socket.emit("requestRoleDashboardStats", { role: userRole, userId });
    const handleStats = (stats) => {
      console.log("[Hook] Received roleDashboardStats:", stats);
      setRoleStats(stats);
    };
    socket.on("roleDashboardStats", handleStats);
    return () => socket.off("roleDashboardStats", handleStats);
  }, [socket, userRole, userId]);

  return roleStats;
} 