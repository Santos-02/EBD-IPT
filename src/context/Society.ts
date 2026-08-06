const Society = {
    UPA: "UPA",
    UMP: "UMP",
    UPH: "UPH",
    SAF: "SAF",
} as const;

export type Society = typeof Society[keyof typeof Society];

//export default Society;