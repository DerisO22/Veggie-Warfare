export const generateRandomRGBAColor = () => {
    const red = `${Math.floor(Math.random() * 255)}`;
    const blue = `${Math.floor(Math.random() * 255)}`;
    const green = `${Math.floor(Math.random() * 255)}`;

    return `rgba(${red}, ${blue}, ${green}, 0.7)`;
}