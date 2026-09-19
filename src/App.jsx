import './App.css'
import { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [roverActive, setRoverActive] = useState(false)
  const [battery, setBattery] = useState(null)

  const [missionSeconds, setMissionSeconds] = useState(0)
  const [missionHistory, setMissionHistory] = useState([])
  const [missionAlerts, setMissionAlerts] = useState([])
  const [showReportPopup, setShowReportPopup] = useState(false)

  const [sensorData, setSensorData] = useState({
    oxygen: 20.9,
    co2: 380,
    methane: 0.1,
    temperature: 22.5,
    humidity: 65,
    pressure: 101.3,
  })

  const sensorDataRef = useRef(sensorData)

  useEffect(() => {
    sensorDataRef.current = sensorData
  }, [sensorData])

  // Mission timer + one-second data recording
  useEffect(() => {
    if (!roverActive) {
      return
    }

    const missionInterval = setInterval(() => {
  setMissionSeconds((seconds) => {
    const nextSeconds = seconds + 1
    const currentSensors = sensorDataRef.current

    setMissionHistory((history) => [
      ...history,
      {
        time: nextSeconds,
        oxygen: currentSensors.oxygen,
        co2: currentSensors.co2,
        methane: currentSensors.methane,
        temperature: currentSensors.temperature,
        humidity: currentSensors.humidity,
        pressure: currentSensors.pressure,
      },
    ])

    const alerts = []

    if (currentSensors.oxygen < safetyLimits.oxygenMin) {
      alerts.push(`Low Oxygen: ${currentSensors.oxygen}%`)
    }

    if (currentSensors.co2 > safetyLimits.co2Max) {
      alerts.push(`High CO₂: ${currentSensors.co2} ppm`)
    }

    if (currentSensors.methane > safetyLimits.methaneMax) {
      alerts.push(`High Methane: ${currentSensors.methane}%`)
    }

    if (currentSensors.temperature > safetyLimits.temperatureMax) {
      alerts.push(`High Temperature: ${currentSensors.temperature}°C`)
    }

    if (currentSensors.humidity > safetyLimits.humidityMax) {
      alerts.push(`High Humidity: ${currentSensors.humidity}%`)
    }

    if (
      currentSensors.pressure < safetyLimits.pressureMin ||
      currentSensors.pressure > safetyLimits.pressureMax
    ) {
      alerts.push(`Abnormal Air Pressure: ${currentSensors.pressure} kPa`)
    }

    if (alerts.length > 0) {
      setMissionAlerts((existingAlerts) => [
        ...existingAlerts,
        {
          time: nextSeconds,
          alerts,
        },
      ])
    }

    return nextSeconds
  })
}, 1000)

    return () => clearInterval(missionInterval)
  }, [roverActive])

  const safetyLimits = {
    oxygenMin: 19.5,
    co2Max: 5000,
    methaneMax: 1.0,
    temperatureMax: 40,
    humidityMax: 90,
    pressureMin: 90,
    pressureMax: 110,
  }

  const safetyStatus = {
    oxygen: sensorData.oxygen < safetyLimits.oxygenMin,

    co2: sensorData.co2 > safetyLimits.co2Max,

    methane: sensorData.methane > safetyLimits.methaneMax,

    temperature: sensorData.temperature > safetyLimits.temperatureMax,

    humidity: sensorData.humidity > safetyLimits.humidityMax,

    pressure:
      sensorData.pressure < safetyLimits.pressureMin ||
      sensorData.pressure > safetyLimits.pressureMax,
  }

  const alerts = []

  if (safetyStatus.oxygen) {
    alerts.push('OXYGEN LEVEL IS LOW')
  }

  if (safetyStatus.co2) {
    alerts.push('CO₂ LEVEL IS HIGH')
  }

  if (safetyStatus.methane) {
    alerts.push('METHANE LEVEL IS HIGH')
  }

  if (safetyStatus.temperature) {
    alerts.push('TEMPERATURE IS HIGH')
  }

  if (safetyStatus.humidity) {
    alerts.push('HUMIDITY IS HIGH')
  }

  if (safetyStatus.pressure) {
    alerts.push('AIR PRESSURE OUT OF RANGE')
  }

  const hasAlert = alerts.length > 0

  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Toggle rover
  const handleRoverToggle = () => {
  if (!roverActive) {
    // Starting a new mission
    setMissionSeconds(0)
    setMissionHistory([])
    setMissionAlerts([])
    setShowReportPopup(false)
    setRoverActive(true)
  } else {
    // Ending the current mission
    setRoverActive(false)
    setShowReportPopup(true)
  }
}

  // Detect internet/network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Device battery
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((batteryManager) => {
        const updateBattery = () => {
          setBattery(Math.round(batteryManager.level * 100))
        }

        updateBattery()

        batteryManager.addEventListener('levelchange', updateBattery)

        return () => {
          batteryManager.removeEventListener(
            'levelchange',
            updateBattery
          )
        }
      })
    }
  }, [])

  const formatMissionTime = () => {
    const hours = Math.floor(missionSeconds / 3600)

    const minutes = Math.floor(
      (missionSeconds % 3600) / 60
    )

    const seconds = missionSeconds % 60

    return `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  const formatMissionSeconds = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(
    seconds
  ).padStart(2, '0')}`
}

  const generateMissionReport = () => {
  const doc = new jsPDF()

  const reportDate = new Date().toLocaleString()

  doc.setFontSize(20)
  doc.text('BHUKAVACH MISSION REPORT', 14, 20)

  doc.setFontSize(11)
  doc.text(`Mission Date: ${reportDate}`, 14, 30)
  doc.text(`Mission Duration: ${formatMissionTime()}`, 14, 37)
  doc.text(
    `Recorded Data Points: ${missionHistory.length}`,
    14,
    44
  )

  doc.setFontSize(14)
  doc.text('Mission Summary', 14, 56)

  const latestData =
    missionHistory.length > 0
      ? missionHistory[missionHistory.length - 1]
      : sensorData

      const recordedData =
  missionHistory.length > 0
    ? missionHistory
    : [sensorData]

const getStatistics = (key) => {
  const values = recordedData.map((item) => Number(item[key]))

  const min = Math.min(...values)
  const max = Math.max(...values)
  const average =
    values.reduce((sum, value) => sum + value, 0) /
    values.length

  return {
    min,
    max,
    average,
  }
}

const statistics = [
  ['Oxygen (O₂)', '%', getStatistics('oxygen')],
  ['Carbon Dioxide (CO₂)', 'ppm', getStatistics('co2')],
  ['Methane (CH₄)', '%', getStatistics('methane')],
  ['Temperature', '°C', getStatistics('temperature')],
  ['Humidity', '%', getStatistics('humidity')],
  ['Air Pressure', 'kPa', getStatistics('pressure')],
]

  autoTable(doc, {
    startY: 62,
    head: [['Parameter', 'Value']],
    body: [
      ['Oxygen (O₂)', `${latestData.oxygen}%`],
      ['Carbon Dioxide (CO₂)', `${latestData.co2} ppm`],
      ['Methane (CH₄)', `${latestData.methane}%`],
      ['Temperature', `${latestData.temperature} °C`],
      ['Humidity', `${latestData.humidity}%`],
      ['Air Pressure', `${latestData.pressure} kPa`],
    ],
  })

  const statisticsStartY = doc.lastAutoTable.finalY + 12

doc.setFontSize(14)
doc.text('Mission Statistics', 14, statisticsStartY)

const statisticsRows = statistics.map(
  ([parameter, unit, values]) => [
    parameter,
    `${values.min.toFixed(2)} ${unit}`,
    `${values.max.toFixed(2)} ${unit}`,
    `${values.average.toFixed(2)} ${unit}`,
  ]
)

autoTable(doc, {
  startY: statisticsStartY + 5,
  head: [['Parameter', 'Minimum', 'Maximum', 'Average']],
  body: statisticsRows,
  styles: {
    fontSize: 8,
  },
})

  const alertStartY = doc.lastAutoTable.finalY + 15

  doc.setFontSize(14)
  doc.text('Mission Alerts', 14, alertStartY)

  if (missionAlerts.length === 0) {
  doc.setFontSize(10)
  doc.text(
    'NO SAFETY ALERTS RECORDED DURING THE MISSION',
    14,
    alertStartY + 8
  )
} else {
    const alertRows = []

    missionAlerts.forEach((event) => {
      event.alerts.forEach((alert) => {
        alertRows.push([
          formatMissionSeconds(event.time),
          alert,
        ])
      })
    })

    autoTable(doc, {
      startY: alertStartY + 5,
      head: [['Mission Time', 'Alert']],
      body: alertRows,
    })
  }

  let dataStartY

if (missionAlerts.length === 0) {
  dataStartY = alertStartY + 28
} else {
  dataStartY = doc.lastAutoTable.finalY + 20
}

  doc.setFontSize(14)
  doc.text('Mission Data', 14, dataStartY)

  const dataRows = missionHistory.map((data) => [
    formatMissionSeconds(data.time),
    data.oxygen,
    data.co2,
    data.methane,
    data.temperature,
    data.humidity,
    data.pressure,
  ])

  autoTable(doc, {
    startY: dataStartY + 5,
    head: [[
      'Time',
      'O₂ %',
      'CO₂ ppm',
      'CH₄ %',
      'Temp °C',
      'Humidity %',
      'Pressure kPa',
    ]],
    body: dataRows,
    styles: {
      fontSize: 7,
    },
  })

  if (doc.lastAutoTable.finalY > 210) {
  doc.addPage()
}

  if (doc.lastAutoTable.finalY > 210) {
  doc.addPage()
}

const temperatureGraphY =
  doc.lastAutoTable.finalY + 15

doc.setFontSize(14)
doc.text(
  'Temperature Trend',
  14,
  temperatureGraphY
)

if (missionHistory.length > 0) {
  const graphStartX = 30
  const graphStartY = temperatureGraphY + 10
  const graphWidth = 155
  const graphHeight = 70

  const temperatures = missionHistory.map(
    (data) => Number(data.temperature)
  )

  const actualMin = Math.min(...temperatures)
  const actualMax = Math.max(...temperatures)

  // Add visual space around the actual temperature range
  let graphMin
  let graphMax

  if (actualMin === actualMax) {
    graphMin = actualMin - 1
    graphMax = actualMax + 1
  } else {
    const range = actualMax - actualMin
    const padding = Math.max(range * 0.1, 1)

    graphMin = actualMin - padding
    graphMax = actualMax + padding
  }

  const graphRange = graphMax - graphMin

  // Graph border
  doc.setDrawColor(120, 120, 120)
  doc.rect(
    graphStartX,
    graphStartY,
    graphWidth,
    graphHeight
  )

  // Horizontal grid lines and Y-axis labels
  doc.setFontSize(7)

  for (let i = 0; i <= 4; i++) {
    const ratio = i / 4

    const y =
      graphStartY +
      graphHeight -
      ratio * graphHeight

    const temperature =
      graphMin + ratio * graphRange

    doc.setDrawColor(220, 220, 220)

    if (i > 0 && i < 4) {
      doc.line(
        graphStartX,
        y,
        graphStartX + graphWidth,
        y
      )
    }

    doc.setTextColor(40, 40, 40)

    doc.text(
      `${temperature.toFixed(1)} °C`,
      8,
      y + 2
    )
  }

  // X-axis time labels
  const totalPoints = missionHistory.length

  const timePositions = [
    0,
    Math.floor((totalPoints - 1) / 2),
    totalPoints - 1,
  ]

  timePositions.forEach((index) => {
    const data = missionHistory[index]

    const x =
      totalPoints === 1
        ? graphStartX
        : graphStartX +
          (index / (totalPoints - 1)) *
            graphWidth

    const timeLabel =
      formatMissionSeconds(data.time)

    doc.setFontSize(7)
    doc.setTextColor(40, 40, 40)

    doc.text(
      timeLabel,
      x - 8,
      graphStartY + graphHeight + 8
    )

    doc.setDrawColor(150, 150, 150)

    doc.line(
      x,
      graphStartY + graphHeight,
      x,
      graphStartY + graphHeight + 3
    )
  })

  // X-axis title
  doc.setFontSize(8)

  doc.text(
    'Mission Time',
    graphStartX + 65,
    graphStartY + graphHeight + 17
  )

  // Temperature line
  doc.setDrawColor(80, 80, 80)
  doc.setLineWidth(1)

  for (let i = 0; i < missionHistory.length - 1; i++) {
    const current = missionHistory[i]
    const next = missionHistory[i + 1]

    const x1 =
      graphStartX +
      (i / (missionHistory.length - 1)) *
        graphWidth

    const x2 =
      graphStartX +
      ((i + 1) /
        (missionHistory.length - 1)) *
        graphWidth

    const y1 =
      graphStartY +
      graphHeight -
      ((current.temperature - graphMin) /
        graphRange) *
        graphHeight

    const y2 =
      graphStartY +
      graphHeight -
      ((next.temperature - graphMin) /
        graphRange) *
        graphHeight

    doc.line(x1, y1, x2, y2)
  }

  // Show a visible point when temperature is constant
  if (
    missionHistory.length > 1 &&
    actualMin === actualMax
  ) {
    const constantY =
      graphStartY +
      graphHeight -
      ((actualMin - graphMin) /
        graphRange) *
        graphHeight

    doc.setLineWidth(1.5)

    doc.line(
      graphStartX,
      constantY,
      graphStartX + graphWidth,
      constantY
    )
  }
}
doc.save('BHUKAVACH-Mission-Report.pdf')
}

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="dashboard">

      {/* TOP BAR */}

      <header className="topbar">

        <div>
          <h1>BHUKAVACH</h1>

          <p>
            Underground Mine Safety & Monitoring System
          </p>
        </div>

        <div className="topbar-actions">

          <button
            className="fullscreen-button"
            onClick={toggleFullscreen}
          >
            {isFullscreen
              ? 'EXIT FULL SCREEN'
              : 'FIT TO SCREEN'}
          </button>

          <div className="system-status">

            <span className="status-dot"></span>

            SYSTEM READY

          </div>

        </div>

      </header>


      <main className="dashboard-content">

        {/* OVERVIEW */}

        <section className="overview-grid">

          {/* ROVER STATUS */}

          <div className="status-card">

            <h3>ROVER STATUS</h3>

            <div
              className={`status-value rover-clickable ${
                roverActive
                  ? 'rover-active'
                  : 'rover-inactive'
              }`}
              onClick={handleRoverToggle}
            >
              {roverActive
                ? 'ACTIVE'
                : 'NOT ACTIVE'}
            </div>

            <p>
              Remote rover connection
            </p>

          </div>


          {/* COMMUNICATION */}

          <div className="status-card">

            <h3>COMMUNICATION</h3>

            <div
              className={`status-value ${
                isOnline
                  ? 'communication-active'
                  : 'communication-inactive'
              }`}
            >
              {isOnline
                ? 'ONLINE'
                : 'OFFLINE'}
            </div>

            <p>
              Communication link
            </p>

          </div>


          {/* BATTERY */}

          <div className="status-card">

            <h3>BATTERY</h3>

            <div className="status-value">

              {battery !== null
                ? `${battery}%`
                : '--%'}

            </div>

            <p>
              Device battery
            </p>

          </div>


          {/* MISSION TIME */}

          <div className="status-card">

            <h3>MISSION TIME</h3>

            <div className="status-value">
              {formatMissionTime()}
            </div>

            <p>
              Current operation
            </p>

          </div>

        </section>


        {/* PROTOTYPE SENSOR INPUT */}

        <section className="sensor-input-section">

          <div className="panel">

            <div className="panel-header">

              <h2>
                PROTOTYPE SENSOR INPUT
              </h2>

              <span>
                {roverActive
                  ? 'MANUAL DATA'
                  : 'ROVER INACTIVE'}
              </span>

            </div>


            <div className="sensor-input-grid">

              {/* OXYGEN */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      oxygen: Number(
                        Math.max(
                          0,
                          sensorData.oxygen - 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  step="0.1"
                  value={sensorData.oxygen}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      oxygen: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      oxygen: Number(
                        (
                          sensorData.oxygen + 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* CO2 */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      co2: Math.max(
                        0,
                        sensorData.co2 - 10
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  value={sensorData.co2}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      co2: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      co2:
                        sensorData.co2 + 10,
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* METHANE */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      methane: Number(
                        Math.max(
                          0,
                          sensorData.methane - 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  step="0.1"
                  value={sensorData.methane}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      methane: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      methane: Number(
                        (
                          sensorData.methane + 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* TEMPERATURE */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(
                        (
                          sensorData.temperature - 0.5
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  step="0.5"
                  value={sensorData.temperature}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(
                        (
                          sensorData.temperature + 0.5
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* HUMIDITY */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      humidity: Math.max(
                        0,
                        sensorData.humidity - 1
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  value={sensorData.humidity}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      humidity: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      humidity:
                        sensorData.humidity + 1,
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* AIR PRESSURE */}

              <div className="sensor-control">

                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(
                        (
                          sensorData.pressure - 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  −
                </button>


                <input
                  className="sensor-value"
                  type="number"
                  step="0.1"
                  value={sensorData.pressure}
                  disabled={!roverActive}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(
                        e.target.value
                      ),
                    })
                  }
                />


                <button
                  disabled={!roverActive}
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(
                        (
                          sensorData.pressure + 0.1
                        ).toFixed(1)
                      ),
                    })
                  }
                >
                  +
                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ENVIRONMENTAL MONITORING */}

        <section className="monitoring-section">

          <div className="panel">

            <div className="panel-header">

              <h2>
                ENVIRONMENTAL MONITORING
              </h2>

              <span>
                LIVE DATA
              </span>

            </div>


            <div className="sensor-grid">

              {/* OXYGEN */}

              <div className="sensor-card">

                <span>
                  O₂

                  {safetyStatus.oxygen && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.oxygen} %
                </strong>

              </div>


              {/* CO2 */}

              <div className="sensor-card">

                <span>
                  CO₂

                  {safetyStatus.co2 && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.co2} ppm
                </strong>

              </div>


              {/* METHANE */}

              <div className="sensor-card">

                <span>
                  CH₄

                  {safetyStatus.methane && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.methane} %
                </strong>

              </div>


              {/* TEMPERATURE */}

              <div className="sensor-card">

                <span>
                  TEMPERATURE

                  {safetyStatus.temperature && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.temperature} °C
                </strong>

              </div>


              {/* HUMIDITY */}

              <div className="sensor-card">

                <span>
                  HUMIDITY

                  {safetyStatus.humidity && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.humidity} %
                </strong>

              </div>


              {/* AIR PRESSURE */}

              <div className="sensor-card">

                <span>
                  AIR PRESSURE

                  {safetyStatus.pressure && (
                    <b className="danger-indicator">
                      ⚠
                    </b>
                  )}

                </span>

                <strong>
                  {sensorData.pressure} kPa
                </strong>

              </div>

            </div>

          </div>

        </section>

{/* MISSION DATA */}

<section className="mission-data-section">

  <div className="panel">

    <div className="panel-header">
      <h2>MISSION DATA</h2>
      <span>RECORDED EVERY SECOND</span>
    </div>

    <div className="mission-chart-grid">

      {/* TEMPERATURE */}

      <div className="mission-chart-card">

        <h3>TEMPERATURE</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#e05252"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>


      {/* HUMIDITY */}

      <div className="mission-chart-card">

        <h3>HUMIDITY</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#4da6ff"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>


      {/* OXYGEN */}

      <div className="mission-chart-card">

        <h3>O₂</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="oxygen"
                stroke="#45e07b"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>


      {/* CO2 */}

      <div className="mission-chart-card">

        <h3>CO₂</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="co2"
                stroke="#f0b44d"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>


      {/* METHANE */}

      <div className="mission-chart-card">

        <h3>CH₄</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="methane"
                stroke="#c77dff"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>


      {/* AIR PRESSURE */}

      <div className="mission-chart-card">

        <h3>AIR PRESSURE</h3>

        {missionHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">

            <LineChart data={missionHistory}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#9da2a5"
                strokeWidth={2}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            NO DATA
          </div>
        )}

      </div>

    </div>

  </div>

</section>

        {/* CAMERAS */}

        <section className="visual-grid">

          {/* HD CAMERA */}

          <div className="camera-panel">

            <div className="panel-header">

              <h2>
                HD CAMERA
              </h2>

              <span>
                {roverActive
                  ? 'CONNECTED'
                  : 'NOT CONNECTED'}
              </span>

            </div>


            <div className="camera-placeholder">

              {roverActive
                ? 'LIVE CAMERA FEED'
                : 'ROVER NOT CONNECTED'}

            </div>

          </div>


          {/* THERMAL CAMERA */}

          <div className="camera-panel">

            <div className="panel-header">

              <h2>
                THERMAL CAMERA
              </h2>

              <span>
                {roverActive
                  ? 'CONNECTED'
                  : 'NOT CONNECTED'}
              </span>

            </div>


            <div className="camera-placeholder thermal">

              {roverActive
                ? 'LIVE THERMAL FEED'
                : 'ROVER NOT CONNECTED'}

            </div>

          </div>

        </section>


        {/* SYSTEM STATUS */}

        <section className="alert-panel">

          <h2>
            SYSTEM STATUS
          </h2>

          <div
            className={
              hasAlert
                ? 'alert-status'
                : 'normal-status'
            }
          >

            {hasAlert
              ? alerts.map((alert, index) => (
                  <div key={index}>
                    ⚠ {alert}
                  </div>
                ))
              : '● NORMAL'}

          </div>

        </section>

            </main>

      {showReportPopup && (
        <div className="report-popup-overlay">
          <div className="report-popup">
            <h2>MISSION COMPLETED</h2>

            <p>The rover mission has ended successfully.</p>

            <p>
              Mission Duration:{' '}
              <strong>{formatMissionTime()}</strong>
            </p>

            <div className="report-popup-actions">
              <button onClick={() => setShowReportPopup(false)}>
                CLOSE
              </button>

              <button onClick={generateMissionReport}>
  GENERATE REPORT
</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default App