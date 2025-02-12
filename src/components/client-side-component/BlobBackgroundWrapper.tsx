"use client"

import dynamic from "next/dynamic"

const BlobBackground = dynamic(() => import("@/components/client-side-component/BlobBackground"), {
    ssr: false,
    loading: () => (
        <svg
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            id="visual"
            viewBox="0 0 900 600"
            width="900"
            height="600"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            version="1.1"
        >
            <rect x="0" y="0" width="900" height="600" fill="#ffe1f2"></rect>
            <g transform="translate(479.44627275391895 284.5897406997549)">
                <path
                    id="blob1"
                    d="M82.9 -85.9C106.9 -58.9 125.5 -29.5 124.8 -0.7C124 28 104.1 56.1 80.1 93.6C56.1 131.1 28 178 0.8 177.3C-26.5 176.5 -53 128 -89.9 90.5C-126.7 53 -173.9 26.5 -182.3 -8.4C-190.7 -43.4 -160.4 -86.7 -123.6 -113.7C-86.7 -140.7 -43.4 -151.4 -7 -144.4C29.5 -137.5 58.9 -112.9 82.9 -85.9"
                    fill="#ffd7e7"
                ></path>
            </g>
        </svg>
    ),
})

function BlobBackgroundWrapper() {
    return <BlobBackground />
}

export default BlobBackgroundWrapper
