// RBCModel.jsx
import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'

const RBCModel = (props) => {
  const ref = useRef()
  const { scene } = useGLTF('/assets/models/rbc.glb')

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  )
}

export default RBCModel
