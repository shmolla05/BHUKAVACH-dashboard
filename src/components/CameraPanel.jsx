const CameraPanel = ({ roverActive }) => {
  return (
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
  {roverActive ? (
    <img
      src="http://192.0.0.4:8080/video"
      alt="Live rover camera feed"
    />
  ) : (
    'ROVER NOT CONNECTED'
  )}
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
  )
}

export default CameraPanel