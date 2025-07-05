// TODO: replace all of these with enums

export const AddPokemonFieldIds = Object.freeze({
    ID: "id",
    Name: "name",
    HP: "hp",
    Type: "type",
    Set: "set",
    FlavorText: "flavorText",
});

export const LoginFieldIds = Object.freeze({
    Username: "username",
    Password: "password",
});

export const RegisterFieldIds = Object.freeze({
    Username: "username",
    Password: "password",
    ConfirmPassword: "confirmPassword",
});

export enum SeverityLevel {
    Success = "success",
    Info = "info",
    Warn = "warn",
    Error = "error",
    Secondary = "secondary",
    Contrast  = "contrast",
}

export enum PokemonFormMode {
    Add = "add",
    Edit = "edit",
    None = "none",
}

export enum CategoriesFormMode {
    Types = "types",
    Sets = "sets",
    None = "none",
}

export const LOCAL_STORAGE_TOKEN_KEY = "pokemondb_token";
