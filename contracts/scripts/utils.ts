
/// Addresses are of type 0x{string}, this is for casting purposes 
export function stringToAddress(address: string): `0x${string}` {
    return `0x${address.slice(2, address.length)}`
}