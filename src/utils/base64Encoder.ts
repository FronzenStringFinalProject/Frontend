export async function base64Encoder(blob: Blob): Promise<string> {
    return await new Promise<string>(async (resolve) => {

        const fileReader = new FileReader();
        fileReader.readAsDataURL(blob);
        fileReader.onloadend = () => {
            let base64EncodedString = fileReader.result!.toString();
            resolve(base64EncodedString);
        }
    })
}