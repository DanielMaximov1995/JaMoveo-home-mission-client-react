
type LogoProps = {
    className : string
}

const Logo = (props : LogoProps) => {
    const { className } = props

  return (
    <div className={`text-jamoveo-primary ml-2 font-bold text-xl uppercase tracking-wide ${className}`}>
      jamoveo
    </div>
  )
}

export default Logo