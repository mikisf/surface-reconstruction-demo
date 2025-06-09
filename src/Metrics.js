const Metrics = ({ metrics }) => {
    if (!metrics) return null

    return (
        <div
            style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '0px 15px 15px 15px',
                fontSize: '14px',
                maxWidth: '300px',
                zIndex: 1000,
            }}
        >
            <h4>{metrics.name}</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>
                    <strong>Error mitjà:</strong> {metrics.errorMitja}
                </li>
                <li>
                    <strong>RMS:</strong> {metrics.rms}
                </li>
                <li>
                    <strong>Hausdorff:</strong> {metrics.hausdorff}
                </li>
                <li>
                    <strong>Aspect ratio:</strong> {metrics.aspectRatio}
                </li>
                <li>
                    <strong>Qualitat angular:</strong> {metrics.angularQuality}
                </li>
                <li>
                    <strong>Àrea:</strong> {metrics.area}
                </li>
                <li>
                    <strong>hₘᵢₙ/lₘₐₓ:</strong> {metrics.hminLmax}
                </li>
                <li>
                    <strong>València mitjana:</strong> {metrics.valencia}
                </li>
                <li>
                    <strong>#Forats:</strong> {metrics.holes}
                </li>
                <li>
                    <strong>#Vèrtexs:</strong> {metrics.vertices}
                </li>
                <li>
                    <strong>#Triangles:</strong> {metrics.triangles}
                </li>
            </ul>
        </div>
    )
}

export default Metrics
