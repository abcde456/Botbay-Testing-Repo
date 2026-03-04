import { useNavigate } from "react-router-dom";

export const WikiUrl = "https://github.com/UltraFish19/Bot-Bay";

export function switchToPage(path) {
    const navigate = useNavigate();

    return () => {
        navigate(path);
    };
}
