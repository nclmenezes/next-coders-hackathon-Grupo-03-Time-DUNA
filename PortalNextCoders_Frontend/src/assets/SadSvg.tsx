import * as React from "react"

function SadSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.375 26.25a13.125 13.125 0 110-26.25 13.125 13.125 0 010 26.25zm0-24.61a11.484 11.484 0 100 22.97 11.484 11.484 0 000-22.97z"
        fill="#FF2B2B"
      />
      <path
        d="M12.555 10.664h-1.64a1.64 1.64 0 10-3.282 0h-1.64a3.281 3.281 0 116.562 0zM20.758 10.664h-1.64a1.64 1.64 0 00-3.282 0h-1.64a3.281 3.281 0 116.562 0zM12.555 18.867h-1.64a5.742 5.742 0 015.741-5.742v1.64a4.102 4.102 0 00-4.101 4.102z"
        fill="#FF2B2B"
      />
    </svg>
  )
}

export default SadSvg
