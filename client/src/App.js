import './App.scss';
import About from './pages/About';
import Main from './pages/Main';
import Choose from './pages/Choose';
import Doodles from './pages/Doodles';
import Contact from './pages/Contact';
import Section from './components/Section';
import Cart from './pages/Cart';
import { AppProvider } from './context';
import { SceneChangeProvider } from './sceneChangeContext';
import { NavTop, NavBottom } from './components/Navigation';
import bgImg from './components/imgs/bg.jpg';
import trail from './pages/imgs/main/trail.svg';
import zagluwka from './pages/imgs/main/zagluwka.jpg';

function App() {
	return (
		<img
			src={zagluwka}
			alt="temp"
			style={{ width: '100vw', height: '100vh', objectFit: 'cover' }}
		/>
	);
	return (
		<div className="App">
			<AppProvider>
				<SceneChangeProvider>
					<Section className="root">
						<img src={bgImg} alt="bg" className="bg-img" />
						<img src={trail} id="trail-bg" className="trail" alt="trail" />
						<Main />
						<About />
						<Choose />
						<Doodles />
						<Contact />
						<NavTop />
						<NavBottom />
						<Cart />
					</Section>
				</SceneChangeProvider>
			</AppProvider>
		</div>
	);
}

export default App;
