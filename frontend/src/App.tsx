import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

function App() {
	return (
		<Canvas>
			{/* Add your 3D objects here */}
			<mesh>
				<boxGeometry args={[1, 1, 1]} />
				<meshNormalMaterial />
			</mesh>
			<ambientLight intensity={0.5} />
			<OrbitControls />
		</Canvas>
	);
}

export default App;
