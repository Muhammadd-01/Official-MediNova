import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'

const WBCModel = (props) => {
  const ref = useRef()
  const { scene } = useGLTF('/assets/models/wbc.glb')

  return <primitive object={scene} ref={ref} scale={0.5} {...props} />
}

export default WBCModel
