const Lights = () => {
    return (
        <>
            <ambientLight
                intensity={0.4}
            />
            
            {/* Fill light for daytime */}
            <directionalLight 
                position={[0, 30, -30]}
                castShadow 
                intensity={1.5} 
                shadow-camera-left={-100}  
                shadow-camera-right={100}
                shadow-camera-top={400}
                shadow-camera-bottom={-400}
                shadow-camera-far={500}    
                shadow-mapSize={[2048, 2048]} 
            />

            {/* <pointLight castShadow position={[-20, 100, 0]} intensity={1000000.5}/> */}
        </>
    )
}

export default Lights;