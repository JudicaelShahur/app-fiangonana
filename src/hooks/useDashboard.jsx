import { useState, useEffect } from "react";
import { FaUsers, FaChurch, FaCoins, FaCalendarAlt } from "react-icons/fa";
import { countMpinosByFiangonana } from "../services/mpinoService";
import { countByFiangonana } from "../services/fiangonanaService";
import { sommeVolas } from "../services/fahatongavanaService";
import { countBySampana } from "../services/sampanaManagService";
import { listeActivity } from "../services/activityService";
import { afficherToastErreur, getBackendMessage } from "../utils/toast.js";

export const useDashboard = () => {
  const [activePeriod, setActivePeriod] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("charts");

  const [nombreMembres, setNombreMembres] = useState(0);
  const [nombreEglises, setNombreEglises] = useState(0);
  const [sommeVola, setSommeVola] = useState(0);
  const [nombreMpinoParSampana, setNombreMpinoParSampana] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDebouncing, setIsDebouncing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [recentActivities, setRecentActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // --- debounce search ---
  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setCurrentPage(1); // reset page when search changes
      setIsDebouncing(false);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchText]);

  // --- fetch stats ---
  const fetchNombreMembres = async () => {
    try {
      const res = await countMpinosByFiangonana(activePeriod, selectedMonth, selectedYear);
      setNombreMembres(res.total_mpinos || 0);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    }
  };

  const fetchNombreEglise = async () => {
    try {
      const res = await countByFiangonana(activePeriod, selectedMonth, selectedYear);
      setNombreEglises(res.total_fiangonanas || 0);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    }
  };

  const fetchSommeVola = async () => {
    try {
      const res = await sommeVolas(activePeriod, selectedMonth, selectedYear);
      setSommeVola(res.results?.total_vola || 0);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    }
  };

  const fetchcountByMpinoParSampana = async () => {
    try {
      const res = await countBySampana(activePeriod, selectedMonth, selectedYear);
      setNombreMpinoParSampana(res.total_mpinos || 0);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    }
  };

  // --- fetch activités backend avec pagination ---
  const fetchRecentActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await listeActivity({
        page: currentPage,
        per_page: perPage,
        period: activePeriod,
        month: selectedMonth,
        year: selectedYear,
        search: debouncedSearch,
      });
      setRecentActivities(res.results?.data || []);
      setTotalPages(res.results?.last_page || 1);
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    } finally {
      setLoadingActivities(false);
    }
  };

  // --- frontend filter (optionnel, si tu veux un filtrage supplémentaire) ---
  useEffect(() => {
    const normalize = (str) =>
      str?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const search = normalize(searchText);

    const filtered = recentActivities.filter((a) =>
      normalize(a.user || "").includes(search) ||
      normalize(a.action || "").includes(search) ||
      normalize(a.target || "").includes(search) ||
      normalize(JSON.stringify(a.meta?.old) || "").includes(search) ||
      normalize(JSON.stringify(a.meta?.new) || "").includes(search)
    );
    setFilteredActivities(filtered);
  }, [recentActivities, searchText]);

   const fetchStats = async () => {
    setLoadingStats(true);
    await Promise.all([
      fetchNombreMembres(),
      fetchNombreEglise(),
      fetchSommeVola(),
      fetchcountByMpinoParSampana()
    ]);
    setLoadingStats(false);
  };
  // --- fetch init & refresh ---
  useEffect(() => {
    fetchRecentActivities();
    fetchStats()
  }, [activePeriod, selectedMonth, selectedYear, currentPage, debouncedSearch]);

  // Pagination helpers
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
  const getPagesArray = () => Array.from({ length: totalPages }, (_, i) => i + 1);

  const stats = [
    { id: 1, title: "Nombre de mpino", value: nombreMembres, icon: <FaUsers className="dashboard-card-icon" /> },
    { id: 2, title: "Églises", value: nombreEglises, icon: <FaChurch className="dashboard-card-icon" /> },
    { id: 3, title: "Dons reçus", value: `${sommeVola} Ar`, icon: <FaCoins className="dashboard-card-icon" /> },
    { id: 4, title: "Mpino dans les départements", value: nombreMpinoParSampana, icon: <FaCalendarAlt className="dashboard-card-icon" /> },
  ];
 

  return {
    activePeriod, setActivePeriod,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    viewMode, setViewMode,
    stats,
    recentActivities,
    filteredActivities,
    searchText, setSearchText,
    isDebouncing,
    currentPage, totalPages, nextPage, prevPage, getPagesArray,
    loadingActivities,
    loadingStats,
  };
};
