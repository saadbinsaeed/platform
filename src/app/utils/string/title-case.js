// @flow
const toTitleCase = (phrase: string) => {
    if (!phrase) {
        return phrase;
    }
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export default toTitleCase;
