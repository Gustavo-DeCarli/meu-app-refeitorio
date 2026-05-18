import { Redirect } from "expo-router";
import { useUser } from "../contexts/UserContext";

export default function Index() {
    const { user } = useUser();

    if (user) {
        return <Redirect href="/home" />;
    }

    return <Redirect href="/login" />;
}
