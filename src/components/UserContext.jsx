import { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState("grumpy19");

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}
