import {forwardRef} from "react";

type Props = {
    style?: React.CSSProperties;
};

const EnemiesSvg = forwardRef<SVGSVGElement, Props>((({style}, ref) => {

    return <>
        <svg className='enemies' ref={ref} width="40" height="40" viewBox="0 0 120 120"
             xmlns="http://www.w3.org/2000/svg"
             style={{zIndex: 9999, left: 50, position: 'absolute', ...style}}
        >
            <path d="M20 20
           Q20 8 35 8
           H85
           Q100 8 100 20
           V80
           Q100 95 85 88
           Q75 82 65 88
           Q55 94 45 88
           Q35 82 25 88
           Q20 95 20 80
           Z"
                  fill="#FF8C00"/>


            <rect x="38" y="48" width="14" height="6" fill="black" rx="2"/>
            <rect x="68" y="48" width="14" height="6" fill="black" rx="2"/>

            <path d="M30 45 L55 30" stroke="black" strokeWidth="7" strokeLinecap="round"/>
            <path d="M65 30 L90 45" stroke="black" strokeWidth="7" strokeLinecap="round"/>

            <path d="M45 75 Q60 65 75 75" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
    </>
}))

export default EnemiesSvg