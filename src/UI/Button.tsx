export type Button = {
    value: string,
    className: string,
    onClick: () => void
}
export default function Button({value, className,onClick}: Button) {
    return <button className={className} onClick={onClick}>{value}</button>
}