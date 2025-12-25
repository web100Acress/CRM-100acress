// ============================================
// 3. src/pages/Onboarding/hooks/useOnboarding.js
// ============================================

import { useState, useEffect } from 'react';
import { onboardingService } from '../services/onboardingService';

export const useOnboarding = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchList = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await onboardingService.fetchList();
      setList(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to load onboarding list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const filteredList = list.filter(it => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return it.status !== "completed";
    if (filterStatus === "completed") return it.status === "completed";
    return true;
  });

  const stats = {
    total: list.length,
    active: list.filter(it => it.status !== "completed").length,
    completed: list.filter(it => it.status === "completed").length,
  };

  return {
    list,
    filteredList,
    stats,
    loading,
    error,
    filterStatus,
    setFilterStatus,
    fetchList,
  };
};