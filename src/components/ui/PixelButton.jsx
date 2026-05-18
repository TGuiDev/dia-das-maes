import './PixelButton.css'

export default function PixelButton({ onClick, disabled = false, text, subtitle }) {
  return (
    <button
      className={`pixel-button ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="pixel-button-text">{text}</span>
      {subtitle && <span className="pixel-button-subtitle">{subtitle}</span>}
    </button>
  )
}
