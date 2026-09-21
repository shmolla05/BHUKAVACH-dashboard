import './App.css'

import { useEffect, useRef, useState } from 'react'

import { evaluateSafety } from './utils/safetyEvaluator'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { generateMissionReport as createMissionReport } from './utils/reportGenerator'

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

    const alerts = evaluateSafety(currentSensors)

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

              <button
  onClick={() =>
    createMissionReport({
      missionHistory,
      missionAlerts,
      sensorData,
      missionSeconds,
    })
  }
>
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