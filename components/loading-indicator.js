export function LoadingIndicator ({ className }) {
  return (
    <span className={`loading-ellipsis ${className ? className : ''}`}>
      <span>&bull;</span>
      <span>&bull;</span>
      <span>&bull;</span>
    </span>
  )
}

export default LoadingIndicator
