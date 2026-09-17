import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [roverActive, setRoverActive] = useState(false)
  const [battery, setBattery] = useState(null)

  const [sensorData, setSensorData] = useState({
    oxygen: 20.9,
    co2: 380,
    methane: 0.1,
    temperature: 22.5,
    humidity: 65,
    pressure: 101.3,
  })

  const [isOnline, setIsOnline] = useState(navigator.onLine)

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

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((batteryManager) => {
        const updateBattery = () => {
          setBattery(Math.round(batteryManager.level * 100))
        }

        updateBattery()

        batteryManager.addEventListener('levelchange', updateBattery)

        return () => {
          batteryManager.removeEventListener('levelchange', updateBattery)
        }
      })
    }
  }, [])

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
      <header className="topbar">
        <div>
          <h1>BHUKAVACH</h1>
          <p>Underground Mine Safety & Monitoring System</p>
        </div>

        <div className="topbar-actions">
          <button className="fullscreen-button" onClick={toggleFullscreen}>
            {isFullscreen ? 'EXIT FULL SCREEN' : 'FIT TO SCREEN'}
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

          <div className="status-card">
            <h3>ROVER STATUS</h3>

            <div
              className={`status-value rover-clickable ${
                roverActive ? 'rover-active' : 'rover-inactive'
              }`}
              onClick={() => setRoverActive(!roverActive)}
            >
              {roverActive ? 'ACTIVE' : 'NOT ACTIVE'}
            </div>

            <p>Remote rover connection</p>
          </div>

          <div className="status-card">
            <h3>COMMUNICATION</h3>

            <div
              className={`status-value ${
                isOnline
                  ? 'communication-active'
                  : 'communication-inactive'
              }`}
            >
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>

            <p>Communication link</p>
          </div>

          <div className="status-card">
            <h3>BATTERY</h3>

            <div className="status-value">
              {battery !== null ? `${battery}%` : '--%'}
            </div>

            <p>Device battery</p>
          </div>

          <div className="status-card">
            <h3>MISSION TIME</h3>

            <div className="status-value">00:00:00</div>

            <p>Current operation</p>
          </div>

        </section>


        {/* PROTOTYPE SENSOR INPUT */}

        <section className="sensor-input-section">

          <div className="panel">

            <div className="panel-header">
              <h2>PROTOTYPE SENSOR INPUT</h2>
              <span>MANUAL DATA</span>
            </div>

            <div className="sensor-input-grid">

              {/* OXYGEN */}

              <div className="sensor-control">

                <button
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
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      oxygen: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      oxygen: Number(
                        (sensorData.oxygen + 0.1).toFixed(1)
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
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      co2: Math.max(0, sensorData.co2 - 10),
                    })
                  }
                >
                  −
                </button>

                <input
                  className="sensor-value"
                  type="number"
                  value={sensorData.co2}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      co2: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      co2: sensorData.co2 + 10,
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* METHANE */}

              <div className="sensor-control">

                <button
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
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      methane: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      methane: Number(
                        (sensorData.methane + 0.1).toFixed(1)
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
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(
                        (sensorData.temperature - 0.5).toFixed(1)
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
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      temperature: Number(
                        (sensorData.temperature + 0.5).toFixed(1)
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
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      humidity: Math.max(0, sensorData.humidity - 1),
                    })
                  }
                >
                  −
                </button>

                <input
                  className="sensor-value"
                  type="number"
                  value={sensorData.humidity}
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      humidity: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      humidity: sensorData.humidity + 1,
                    })
                  }
                >
                  +
                </button>

              </div>


              {/* AIR PRESSURE */}

              <div className="sensor-control">

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(
                        (sensorData.pressure - 0.1).toFixed(1)
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
                  onChange={(e) =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(e.target.value),
                    })
                  }
                />

                <button
                  onClick={() =>
                    setSensorData({
                      ...sensorData,
                      pressure: Number(
                        (sensorData.pressure + 0.1).toFixed(1)
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
              <h2>ENVIRONMENTAL MONITORING</h2>
              <span>LIVE DATA</span>
            </div>

            <div className="sensor-grid">

              <div className="sensor-card">
                <span>O₂</span>
                <strong>{sensorData.oxygen} %</strong>
              </div>

              <div className="sensor-card">
                <span>CO₂</span>
                <strong>{sensorData.co2} ppm</strong>
              </div>

              <div className="sensor-card">
                <span>CH₄</span>
                <strong>{sensorData.methane} %</strong>
              </div>

              <div className="sensor-card">
                <span>TEMPERATURE</span>
                <strong>{sensorData.temperature} °C</strong>
              </div>

              <div className="sensor-card">
                <span>HUMIDITY</span>
                <strong>{sensorData.humidity} %</strong>
              </div>

              <div className="sensor-card">
                <span>AIR PRESSURE</span>
                <strong>{sensorData.pressure} kPa</strong>
              </div>

            </div>

          </div>

        </section>


        {/* CAMERAS */}

        <section className="visual-grid">

          <div className="camera-panel">

            <div className="panel-header">
              <h2>HD CAMERA</h2>
              <span>
                {roverActive ? 'CONNECTED' : 'NOT CONNECTED'}
              </span>
            </div>

            <div className="camera-placeholder">
              {roverActive
                ? 'LIVE CAMERA FEED'
                : 'ROVER NOT CONNECTED'}
            </div>

          </div>


          <div className="camera-panel">

            <div className="panel-header">
              <h2>THERMAL CAMERA</h2>
              <span>
                {roverActive ? 'CONNECTED' : 'NOT CONNECTED'}
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

          <h2>SYSTEM STATUS</h2>

          <div className="normal-status">
            ● NORMAL
          </div>

        </section>

      </main>
    </div>
  )
}

export default App