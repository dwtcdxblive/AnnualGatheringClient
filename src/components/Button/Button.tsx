import "./Button.scss"

const Button = ({ children, secondary }: any) => {
  const isSecondary =  secondary ? "btn btn--secondary" : 'btn'

  return (
    <div id="start" className="">
      <button className={isSecondary}>
        <span className="">{children}</span>
      </button>
    </div>
  )
}

export default Button
