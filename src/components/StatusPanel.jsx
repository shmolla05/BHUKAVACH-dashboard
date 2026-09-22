const StatusPanel = ({
  roverActive,
  handleRoverToggle,
  isOnline,
  battery,
  formatMissionTime,
}) => {
  return (
    <>

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

        </>
)
}

export default StatusPanel