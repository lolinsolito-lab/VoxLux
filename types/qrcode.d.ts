declare module 'qrcode' {
    export function toDataURL(
        text: string,
        options?: any,
        cb?: (error: any, url: string) => void
    ): Promise<string>;
}
