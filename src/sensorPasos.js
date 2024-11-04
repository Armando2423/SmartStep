import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const SensorPasos = () => {
  const chartContainerRef = useRef(null);

  // Función para generar fechas y valores aleatorios por hora
  const generateData = (startDate, endDate) => {
    const data = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      for (let hour = 0; hour < 24; hour++) {
        // Establecer la hora actual en el objeto Date
        currentDate.setHours(hour, 0, 0, 0);

        // Generar un valor aleatorio entre 0 y 10000
        const randomValue = Math.floor(Math.random() * 10000);

        // Convertir la fecha a un timestamp UNIX
        const timestamp = Math.floor(currentDate.getTime() / 1000);

        data.push({ time: timestamp, value: randomValue });
      }

      // Avanzar un día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });

    const lineSeries = chart.addLineSeries({
      color: '#4CAF50',
      lineWidth: 2,
    });

    const data = generateData('2024-08-01', '2024-08-10');
    lineSeries.setData(data);
    chart.timeScale().fitContent();

    // Configuración del eje X (Tiempo) y eje Y (Número de Pasos)
    chart.applyOptions({
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      localization: {
        timeFormatter: (timestamp) => {
          const date = new Date(timestamp * 1000);
          return `${date.getHours()}:00 ${date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}`;
        },
      },
      priceScale: {
        position: 'right',
        labelFormatter: (value) => `${value} pasos`,
      },
    });

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div>
      <h1>Pasos</h1>
      <div ref={chartContainerRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

export default SensorPasos;
