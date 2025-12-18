import { UNSAFE_NavigationContext } from "react-router-dom";
import { useEffect, useContext } from 'react';
import { History, Update } from "history";

const useBackListener = (callback: (...args: any) => void) => {
    const navigator = useContext(UNSAFE_NavigationContext).navigator as History;
    useEffect(() => {
        const listener = ({ location, action }: Update) => {
            if (action === "POP") callback({ location, action });
        };
        const unListen = navigator.listen(listener);
        return unListen;
    }, [callback, navigator]);
};

export default useBackListener;