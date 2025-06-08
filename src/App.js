import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Selector from './Selector'

const App = () => {
    const mountRef = useRef(null)
    const sceneRef = useRef(null)

    const sphere_options = [
        { value: 'poisson', label: 'Poisson Surface Reconstruction' },
        { value: 'marching_cubes', label: 'Marching Cubes' },
        { value: 'marching_tetrahedra', label: 'Marching Tetrahedra' },
        { value: 'poisson_simplified', label: 'Poisson Surface Simplified' },
        { value: 'marching_cubes_simplified', label: 'Marching Cubes Simplified' },
        { value: 'marching_tetrahedra_simplified', label: 'Marching Tetrahedra Simplified' },
    ]

    const bunny_options = [
        { value: 'Bunny10m', label: 'Bunny 10.000 points' },
        { value: 'Bunny5m', label: 'Bunny 5.000 points' },
        { value: 'Bunny1m', label: 'Bunny 1.000 points' },
        { value: 'Bunny500', label: 'Bunny 500 points' },
    ]

    const [selectedMesh, setSelectedMesh] = useState('poisson')

    useEffect(() => {
        const mount = mountRef.current
        const getSize = () => ({
            width: mount.clientWidth,
            height: mount.clientHeight,
        })

        // Scene
        const scene = new THREE.Scene()
        sceneRef.current = scene // Store the scene reference for later use
        scene.background = new THREE.Color(0xf5f5f5) // white-grey

        // Camera
        const { width, height } = getSize()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.set(10, 10, 10) // Position the camera
        camera.lookAt(0, 0, 0)

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        mount.appendChild(renderer.domElement)

        // ArcballControls
        const controls = new ArcballControls(camera, renderer.domElement, scene)
        controls.enablePan = false
        controls.setGizmosVisible(false)

        // Animation loop
        let animationId
        const animate = () => {
            controls.update()
            renderer.render(scene, camera)
            animationId = requestAnimationFrame(animate)
        }
        animate()

        // Handle resize
        const handleResize = () => {
            const { width, height } = getSize()
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height)
        }
        window.addEventListener('resize', handleResize)

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize)
            cancelAnimationFrame(animationId)
            controls.dispose()
            if (mount && renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement)
            }
        }
    }, [])

    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return

        // Remove all existing meshes from the scene
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const obj = scene.children[i]
            if (obj.type === 'Group' || obj.isMesh) {
                scene.remove(obj)
            }
        }

        const loader = new OBJLoader()
        loader.load(
            process.env.PUBLIC_URL + `/${selectedMesh}.obj`,
            (object) => {
                object.traverse((child) => {
                    if (child.isMesh) {
                        // Add mesh material (grey, opaque)
                        child.material = new THREE.MeshBasicMaterial({
                            color: 0xc4c4c4,
                            wireframe: false,
                            opacity: 1,
                            transparent: false,
                        })
                        // Add black wireframe as a separate object
                        const wireframe = new THREE.WireframeGeometry(child.geometry)
                        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }))
                        line.position.copy(child.position)
                        line.rotation.copy(child.rotation)
                        line.scale.copy(child.scale)
                        child.add(line)
                    }
                })
                scene.add(object)
            },
            undefined,
            (error) => {
                console.error('Error loading OBJ:', error)
            }
        )
    }, [selectedMesh])

    return (
        <>
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Selector
                    options={sphere_options}
                    value={selectedMesh}
                    onChange={setSelectedMesh}
                    label="Escull una esfera "
                />
                <Selector
                    options={bunny_options}
                    value={selectedMesh}
                    onChange={setSelectedMesh}
                    label="Escull un conill "
                />
            </div>
            <div
                ref={mountRef}
                style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
            />
        </>
    )
}

export default App
