const SensorCard = ({ label, value, unit, danger }) => {
  return (
    <div className="sensor-card">
      <span>
        {label}

        {danger && (
          <b className="danger-indicator">
            ⚠
          </b>
        )}
      </span>

      <strong>
        {value} {unit}
      </strong>
    </div>
  )
}

export default SensorCard