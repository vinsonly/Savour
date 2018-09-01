/*
 * action types
 */

export const LOGIN = 'LOGIN';
export const SIGN_OUT = 'SIGN_OUT';

/*
 * action creators
 */

export function login(user) {
    return { type: LOGIN, user }
}

export function signOut() {
    return {
        type: SIGN_OUT
    }
}
