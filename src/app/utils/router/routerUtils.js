

const isModal = (location, previousLocation) => {
    return !!((location.state && location.state.modal) && previousLocation !== location);
};

const getLocation = (location, previousLocation) => {
    if (!isModal(location, previousLocation)) {
        return location;
    }
    if (!previousLocation && location.pathname.endsWith('/add')) {
        //FIXME if we don't have a previous location when we close the popup we need to avoid to go back
        return {
            ...location,
            pathname: location.pathname.replace(/\/add/, ''),
        };
    }
    return previousLocation;
};

export { isModal, getLocation };
