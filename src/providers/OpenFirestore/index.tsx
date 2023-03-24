import { camelCase } from "lodash";
import { FC, useEffect, useState } from "react";

const OpenFirestoreProvider: FC = () => {
    const [value, setValue] = useState("");

    useEffect(() => {
        const fn = ({ key }: { key: string }) => {
            if (["Backspace", "Enter"].includes(key)) {
                setValue("");
            } else if (key.length === 1) {
                setValue((old) => old + key);
            }
        };

        window.addEventListener("keydown", fn);

        return () => {
            window.removeEventListener("keydown", fn);
        };
    }, []);

    useEffect(() => {
        if (value === "openfirestore") {
            const pathname = window.location.pathname
                .split('/')
                .map((path, index) => index % 2 ? camelCase(path) : path)
                .join('/')
            window.open(`https://console.firebase.google.com/u/0/project/home-sayer-fr/firestore/data${pathname}`, '_blank');
        }
    }, [value]);

    return null;
};

export default OpenFirestoreProvider;
