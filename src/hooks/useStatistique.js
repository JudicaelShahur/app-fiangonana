import { useState, useEffect } from "react";
import { countFahatongavanaByFiangonana } from "../services/fahatongavanaService";
import { countMpinosByFiangonana, countMpinosVaovaoByFiangonana, countMpinoParKartie } from "../services/mpinoService";

export default function useStatistique() {
  const [statsData, setStatsData] = useState({
    totalMpino: 0,
    fahatongavana: 0,
    mpinoVaovao: 0,
    mpinoMpitandrina: 0,
    totalMandray: 0,
    percentageMpinoVaovao: 0,
    mpinoParKartie: [],
  });

  const [chartData, setChartData] = useState({});
  const [activePeriod, setActivePeriod] = useState("month");
  const [viewMode, setViewMode] = useState("charts");

  const monthNames = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Août", "Sep", "Oct", "Nov", "Déc"
  ];

  //  MPINO PAR KARTIE 
  const fetchMpinoParKartieData = async () => {
    try {
      const res = await countMpinoParKartie(activePeriod); // week, month, year, all
      setStatsData(prev => ({
        ...prev,
        mpinoParKartie: res.results || [],
      }));

      // Préparer les labels et data pour ChartJS
      if (res.results && res.results.length > 0) {
        const labels = res.results.map(k => k.nom_kar);
        const data = res.results.map(k => k.total_mpino);

        const kariteChartData = {
          labels,
          datasets: [
            {
              label: "Nombre de Mpino par Kartie",
              data,
              backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"], // couleurs différentes
              borderRadius: 4,
            },
          ],
        };


        setChartData(prev => ({ ...prev, karite: kariteChartData }));
      }
    } catch (err) {
      console.error("Erreur récupération mpino par kartie:", err);
    }
  };

  //  TOTAL MPINO 
  const fetchNombreMembres = async () => {
    try {
      const res = await countMpinosByFiangonana();
      const stats = res?.stats_globaux || {};
      const totalMpino = res?.total_mpinos || 0;
      const totalMandray = stats.mpandray || 0;

      const percentageMpandray = totalMpino > 0 ? ((totalMandray / totalMpino) * 100).toFixed(2) : 0;

      const mpinoStats = {
        manambady: stats.manambady || 0,
        vitaSoratra: stats.vita_soratra || 0,
        vitaMariage: stats.vita_mariage || 0,
        vitaBatisa: stats.vita_batisa || 0,
        mpandray: stats.mpandray || 0,
        tsyManambady: stats.non_manambady || 0,
        tsyVitaSoratra: stats.non_vita_soratra || 0,
        tsyVitaMariage: stats.non_vita_mariage || 0,
        tsyVitaBatisa: stats.non_vita_batisa || 0,
        tsyMandray: stats.non_mpandray || 0,
      };

      setStatsData(prev => ({
        ...prev,
        totalMpino,
        totalMandray,
        percentageMpandray,
        mpinoStats,
      }));

      // Graphique global mpino
      const mpinoData = {
        labels: Object.keys(mpinoStats).map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        datasets: [
          {
            data: Object.values(mpinoStats),
            backgroundColor: [
              "#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0",
              "#03A9F4", "#8BC34A", "#FFC107", "#FF5722", "#607D8B"
            ],
            borderWidth: 0,
          },
        ],
      };
      setChartData(prev => ({ ...prev, mpino: mpinoData }));

      // Graphique mpandray vs tsy mandray
      const mpandrayData = {
        labels: ["Mpandray", "Tsy mandray"],
        datasets: [
          {
            data: [totalMandray, totalMpino - totalMandray],
            backgroundColor: ["#4CAF50", "#FF5722"],
            borderWidth: 0,
          },
        ],
      };
      setChartData(prev => ({ ...prev, mpandray: mpandrayData }));

    } catch (err) {
      console.error("Erreur récupération mpino:", err);
    }
  };

  //  MPINO VAOVAO 
  const fetchMpinoVaovao = async () => {
    try {
      const res = await countMpinosVaovaoByFiangonana(activePeriod);
      setStatsData(prev => ({
        ...prev,
        mpinoVaovao: res.total_mpino_vaovao || 0,
        percentageMpinoVaovao: res.percentage_mpino_vaovao || 0,
      }));
    } catch (err) {
      console.error("Erreur récupération mpino vaovao:", err);
    }
  };

  //  FAHATONGAVANA 
  const loadStats = async () => {
    try {
      const response = await countFahatongavanaByFiangonana(activePeriod);

      if (response.results?.type === "par_fiangonana") {
        const fiangStats = response.results.results;

        const labels = fiangStats.map(f => f.fiangonana);
        const percentageUnique = fiangStats.map(f => f.percentage_unique);
        const averagePercentage = fiangStats.map(f => f.average_percentage);

        const parFiangonanaData = {
          labels,
          datasets: [
            { label: "% Présence unique", data: percentageUnique, backgroundColor: "rgba(78,115,223,0.6)", borderRadius: 6 },
            { label: "% Moyenne journalière", data: averagePercentage, backgroundColor: "rgba(28,200,138,0.6)", borderRadius: 6 },
          ],
        };

        setChartData(prev => ({ ...prev, parFiangonana: parFiangonanaData }));

        const totalPresent = fiangStats.reduce((sum, f) => sum + f.total_present, 0);
        setStatsData(prev => ({ ...prev, fahatongavana: totalPresent }));
        return;
      }

      const { total_present, average_percentage, percentage_unique, details } = response.results || {};
      setStatsData(prev => ({
        ...prev,
        fahatongavana: total_present || 0,
        average_percentage: average_percentage || 0,
        percentage_unique: percentage_unique
      }));

      let labels = [], data = [];

      if (details && details.length > 0) {
        if (activePeriod === "week") {
          labels = details.map(d => new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" }));
          data = details.map(d => d.present);
        } else if (activePeriod === "month") {
          labels = details.map(d => `Jour ${new Date(d.date).getDate()}`);
          data = details.map(d => d.present);
        } else if (activePeriod === "year") {
          const groupedByMonth = {};
          details.forEach(d => {
            const month = new Date(d.date).getMonth() + 1;
            if (!groupedByMonth[month]) groupedByMonth[month] = { present: 0 };
            groupedByMonth[month].present += d.present;
          });
          const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => a - b);
          labels = sortedMonths.map(m => monthNames[m - 1]);
          data = sortedMonths.map(m => groupedByMonth[m].present);
        }
      }

      const fahatongavanaData = {
        labels,
        datasets: [{ label: "Fahatongavana", data, borderColor: "#4e73df", backgroundColor: "rgba(78, 115, 223, 0.2)", tension: 0.3, fill: true, pointRadius: 4, pointBackgroundColor: "#4e73df", pointBorderColor: "#fff" }],
      };

      setChartData(prev => ({ ...prev, fahatongavana: fahatongavanaData }));

    } catch (err) {
      console.error("Erreur chargement statistiques:", err);
    }
  };

  //  CHARGEMENT DES STATS 
  useEffect(() => {
    loadStats();
    fetchNombreMembres();
    fetchMpinoVaovao();
    fetchMpinoParKartieData(); 
  }, [activePeriod]);

  return {
    statsData,
    chartData,
    activePeriod,
    setActivePeriod,
    viewMode,
    setViewMode,
  };
}
