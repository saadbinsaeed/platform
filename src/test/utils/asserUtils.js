import { isImmutable } from 'app/utils/immutable/Immutable';


const expectStateToEqual = (state, expected) => {
    expect(state).toEqual(expected);
    expect(isImmutable(state, true)).toBeTruthy();
};

export { expectStateToEqual };
