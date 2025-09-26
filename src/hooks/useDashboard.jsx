import { useState, useEffect } from "react";
import { FaUsers, FaChurch, FaCoins, FaCalendarAlt } from "react-icons/fa";
import { countMpinosByFiangonana } from "../services/mpinoService";
import { countByFiangonana } from "../services/fiangonanaService";
import { sommeVolas } from "../services/fahatongavanaService";
import { countBySampana } from "../services/sampanaManagService";
import { listeActivity } from "../services/activityService";  // ajout
import { afficherToastErreur, getBackendMessage } from "../utils/toast.js";

export const useDashboard = () => {
  const [activePeriod, setActivePeriod] = useState("year"); // week, month, year
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState("charts");

  const [nombreMembres, setNombreMembres] = useState(0);
  const [nombreEglises, setNombreEglises] = useState(0);
  const [sommeVola, setSommeVola] = useState(0);
  const [nombreMpinoParSampana, setNombreMpinoParSampana] = useState(0);

  // ajout pour activité
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchNombreMembres = async () => {
    try {
      const res = await countMpinosByFiangonana(activePeriod, selectedMonth, selectedYear);
      console.log('count', res);
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

  const fetchRecentActivities = async () => {
    try {
      const res = await listeActivity({
        page: 1,
        per_page: 5, // par ex. limiter aux 5 derniers
        period: activePeriod,
        month: selectedMonth,
        year: selectedYear,
      });
      console.log("donne activity",res);
      setRecentActivities(res.results?.data || []); // dépend structure backend
    } catch (err) {
      afficherToastErreur(getBackendMessage(err));
    }
  };

  useEffect(() => {
    fetchSommeVola();
    fetchcountByMpinoParSampana();
    fetchNombreMembres();
    fetchNombreEglise();
    fetchRecentActivities(); // ajout activité
  }, [activePeriod, selectedMonth, selectedYear]);

  const stats = [
    { id: 1, title: "Nombre de mpino", value: nombreMembres, icon: <FaUsers className="dashboard-card-icon" /> },
    { id: 2, title: "Églises", value: nombreEglises, icon: <FaChurch className="dashboard-card-icon" /> },
    { id: 3, title: "Dons reçus", value: `${sommeVola} Ar`, icon: <FaCoins className="dashboard-card-icon" /> },
    { id: 4, title: "Mpino dans les départements", value: nombreMpinoParSampana, icon: <FaCalendarAlt className="dashboard-card-icon" /> },
  ];

  return {
    activePeriod,
    setActivePeriod,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    viewMode,
    setViewMode,
    stats,
    recentActivities,
  };
};
