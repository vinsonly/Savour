export const loadState = () => {
    try {
        let state;
        const serializedState = localStorage.getItem('state');
        if(serializedState) {
            return JSON.parse(serializedState);
        } else {
            return undefined   
        }
    } catch (err) {
        return undefined;
    }
}

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        console.err(err);
    }
}