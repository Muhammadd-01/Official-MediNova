import React, { useState, useEffect } from "react"

function LazyImage({ src, alt, className }) {
  const [imageSrc, setImageSrc] = useState(
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
  )

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
    }
  }, [src])

  return <img src={imageSrc || "/placeholder.svg"} alt={alt} className={className} loading="lazy" />
}

export default LazyImage

