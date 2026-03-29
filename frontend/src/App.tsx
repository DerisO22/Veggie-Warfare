import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';
import './styles/login_screen.css';
import Game from './Game';

function App() {
    return (
        <>
            <SignedOut>
                <div className="login_screen_container">
                    <div className='background_filter'></div>

                    <div className='login_info'>
                        <div className="login_logo_container">
                            <img className="logo_image" src="../../../../public/game_logo.webp"></img>
                        </div>

                        <h2 className='notify'>Looks Like You're Not Signed In!</h2>

                        <div className="login_container">
                            <SignIn appearance={{ theme: dark }}/>    
                        </div>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                <Game />
            </SignedIn>
        </>
    );
}

export default App;