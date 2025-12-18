import * as React from "react"

function SmileSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1521_720)" fill="#67A10F">
        <path d="M13.625 26.25a13.125 13.125 0 110-26.25 13.125 13.125 0 010 26.25zm0-24.61a11.484 11.484 0 100 22.97 11.484 11.484 0 000-22.97z" />
        <path d="M12.805 10.664h-1.64a1.64 1.64 0 10-3.282 0h-1.64a3.281 3.281 0 116.562 0zM21.008 10.664h-1.64a1.64 1.64 0 00-3.282 0h-1.64a3.281 3.281 0 116.562 0zM13.625 20.508a6.562 6.562 0 01-6.563-6.563h1.641a4.922 4.922 0 109.844 0h1.64a6.563 6.563 0 01-6.562 6.563z" />
      </g>
      <defs>
        <clipPath id="clip0_1521_720">
          <path fill="#fff" transform="translate(.5)" d="M0 0H26.25V26.25H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default SmileSvg
