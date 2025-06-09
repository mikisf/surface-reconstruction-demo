import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import Selector from './Selector'

const App = () => {
    const mountRef = useRef(null)
    const sceneRef = useRef(null)

    const sphere_options = [
        { value: 'poisson.obj/poisson_points.ply', label: 'Poisson Surface Reconstruction' },
        { value: 'marching_cubes.obj/marching_cubes_grid.ply', label: 'Marching Cubes' },
        { value: 'marching_tetrahedra.obj/marching_tetrahedra_mesh.obj', label: 'Marching Tetrahedra' },
        { value: 'poisson_simplified.obj', label: 'Poisson Surface Simplified' },
        { value: 'marching_cubes_simplified.obj', label: 'Marching Cubes Simplified' },
        { value: 'marching_tetrahedra_simplified.obj', label: 'Marching Tetrahedra Simplified' },
    ]

    const bunny_options = [
        { value: 'Bunny10m.obj/Bunny.ply', label: 'Bunny 10.000 points' },
        { value: 'Bunny5m.obj/Bunny.ply', label: 'Bunny 5.000 points' },
        { value: 'Bunny1m.obj/Bunny.ply', label: 'Bunny 1.000 points' },
        { value: 'Bunny500.obj/Bunny.ply', label: 'Bunny 500 points' },
    ]

    const [selectedMesh, setSelectedMesh] = useState('poisson.obj/poisson_points.ply')
    const [showWireframe, setShowWireframe] = useState(true)
    const [showInputData, setShowInputData] = useState(false)

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

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.position.set(10, 20, 10)
        scene.add(directionalLight)

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

        // Remove all existing objects from the scene except lights and camera
        for (let i = scene.children.length - 1; i >= 0; i--) {
            const obj = scene.children[i]
            if (!(obj.isLight || obj.isCamera)) {
                scene.remove(obj)
            }
        }

        const meshParts = selectedMesh.split('/')
        console.log('Loading mesh parts:', meshParts)
        meshParts.forEach((part, index) => {
            if (part.endsWith('.obj')) {
                const loader = new OBJLoader()
                loader.load(
                    process.env.PUBLIC_URL + `/${part}`,
                    (object) => {
                        object.traverse((child) => {
                            if (index === 0) {
                                if (child.isMesh && child.geometry && child.geometry.isBufferGeometry) {
                                    // Compute flat normals
                                    child.geometry.computeVertexNormals()

                                    // Apply flat-shaded material
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: 0xc4c4c4,
                                        flatShading: true,
                                    })

                                    // Wireframe overlay
                                    const wireframe = new THREE.WireframeGeometry(child.geometry)
                                    const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0x000000 }))
                                    line.name = 'wireframe'
                                    line.visible = showWireframe
                                    child.add(line)
                                }
                            } else {
                                if (child.isMesh && child.geometry && child.geometry.isBufferGeometry) {
                                    // Remove the mesh's material so only the wireframe is visible
                                    child.material = new THREE.MeshBasicMaterial({ visible: false })

                                    // Wireframe overlay
                                    const wireframe = new THREE.WireframeGeometry(child.geometry)
                                    const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0xffff00 }))
                                    line.name = 'inputData'
                                    line.visible = showInputData
                                    child.add(line)
                                }
                            }
                        })

                        scene.add(object)
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading OBJ:', error)
                    }
                )
            } else if (part.endsWith('.ply')) {
                const loader = new PLYLoader()
                loader.load(
                    process.env.PUBLIC_URL + `/${part}`,
                    (geometry) => {
                        const material = new THREE.PointsMaterial({
                            color: 0xffff00,
                            size: 0.1,
                        })
                        const pcd = new THREE.Points(geometry, material)
                        pcd.name = 'inputData'
                        pcd.visible = showInputData
                        scene.add(pcd)
                    },
                    undefined,
                    (error) => {
                        console.error('Error loading PLY:', error)
                    }
                )
            }
        })
    }, [selectedMesh])

    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return

        scene.traverse((child) => {
            if (child.isMesh) {
                const wireframe = child.children.find((c) => c.name === 'wireframe')
                if (wireframe) {
                    wireframe.visible = showWireframe
                }
            }
        })
    }, [showWireframe])

    useEffect(() => {
        const scene = sceneRef.current
        if (!scene) return

        scene.traverse((child) => {
            if (child.name === 'inputData') {
                child.visible = showInputData
            }
        })
    }, [showInputData])

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
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                        type="checkbox"
                        checked={showWireframe}
                        onChange={(e) => setShowWireframe(e.target.checked)}
                    />
                    Show wireframe
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                        type="checkbox"
                        checked={showInputData}
                        onChange={(e) => setShowInputData(e.target.checked)}
                    />
                    Show input data
                </label>
            </div>
            <div
                ref={mountRef}
                style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}
            />
        </>
    )
}

export default App
