export const getEnvVariables = () => {
    // en el build esto ocasiona error con el vite, se tiene que una por una
    // import.meta.env;
    // return {
    //     ...import.meta.env
    // };
    return {
        VITE_API_URL: import.meta.env.VITE_API_URL,
    }
}
