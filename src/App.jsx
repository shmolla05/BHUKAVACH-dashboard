import './App.css'

import { useEffect, useRef, useState } from 'react'
import { evaluateSafety } from './utils/safetyEvaluator'
import { prototypeSensorData } from './utils/prototypeData'
import ReportPopup from './components/ReportPopup'
import CameraPanel from './components/CameraPanel'
import StatusPanel from './components/StatusPanel'
import SensorInputPanel from './components/SensorInputPanel'
import EnvironmentalMonitoring from './components/EnvironmentalMonitoring'
import MissionData from './components/MissionData'
import SystemStatus from './components/SystemStatus'

import { generateMissionReport as createMissionReport } from './utils/reportGenerator'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [roverActive, setRoverActive] = useState(false)
  const [battery, setBattery] = useState(null)

  const [missionSeconds, setMissionSeconds] = useState(0)
  const [missionHistory, setMissionHistory] = useState([])
  const [missionAlerts, setMissionAlerts] = useState([])
  const [showReportPopup, setShowReportPopup] = useState(false)

  const [sensorData, setSensorData] = useState(prototypeSensorData)

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

          <StatusPanel
  roverActive={roverActive}
  handleRoverToggle={handleRoverToggle}
  isOnline={isOnline}
  battery={battery}
  formatMissionTime={formatMissionTime}
/>

</section>

        <SensorInputPanel
  roverActive={roverActive}
  sensorData={sensorData}
  setSensorData={setSensorData}
/>

        <EnvironmentalMonitoring
  sensorData={sensorData}
  safetyStatus={safetyStatus}
/>

<MissionData
  missionHistory={missionHistory}
/>

        <CameraPanel roverActive={roverActive} />

        <SystemStatus
  hasAlert={hasAlert}
  alerts={alerts}
/>

            </main>

      <ReportPopup
  showReportPopup={showReportPopup}
  setShowReportPopup={setShowReportPopup}
  formatMissionTime={formatMissionTime}
  missionHistory={missionHistory}
  missionAlerts={missionAlerts}
  sensorData={sensorData}
  missionSeconds={missionSeconds}
  createMissionReport={createMissionReport}
/>

    </div>
  )
}

export default App