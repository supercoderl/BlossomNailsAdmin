export const getRandomImageUrl = (urls) => {
    const randomIndex = Math.floor(Math.random() * urls.length);
    return urls[randomIndex];
};