export function saveFile({
  data,
  filename,
  type = "application/pdf",
}: {
  data: Blob | Uint8Array | ArrayBuffer | string;
  filename: string;
  type?: string;
}) {
  let blob: Blob;

  if (data instanceof Blob) {
    blob = data;
  } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    blob = new Blob([data], { type });
  } else if (typeof data === "string") {
    // base64 or data URL
    if (data.startsWith("data:")) {
      const byteString = atob(data.split(",")[1]);
      const mimeString = data.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([ab], { type: mimeString });
    } else {
      // assume plain base64
      const byteString = atob(data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      blob = new Blob([ab], { type });
    }
  } else {
    throw new Error("Unsupported data type");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
