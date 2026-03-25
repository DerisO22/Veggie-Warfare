import '../../styles/abilities.css';

const exampleAbilities = [
    // probs just gonna be a major and minor ability
    "Super Jump",
    "Sprint",
]

const Abilities = () => {
    return (
        <div className="abiltiies_container">
            {exampleAbilities.map((ability, index) => (
                <div key={index} className={`abilities_card card${index}`}>
                    <span>{ability}</span>
                </div>
            ))}
        </div>
    )
}

export default Abilities;