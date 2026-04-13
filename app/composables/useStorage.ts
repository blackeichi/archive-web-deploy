import imageCompression from "browser-image-compression";

export function useStorage() {
  const supabase = useSupabaseClient();

  async function uploadImage(file: File) {
    if (!file) {
      throw new Error("파일이 없습니다.");
    }

    if (!file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    // 이미지 최적화
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    });

    const ext = compressedFile.name.split(".").pop()?.toLowerCase() || "jpg";

    const safeName = compressedFile.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-");

    const filePath = `/${Date.now()}-${safeName}.${ext}`;

    const { error } = await supabase.storage
      .from("posts")
      .upload(filePath, compressedFile, {
        // 1시간 동안 캐시
        cacheControl: "3600",
        // 기존 파일이 있을 경우 덮어쓸지 여부
        upsert: false,
        contentType: compressedFile.type,
      });

    if (error) throw error;

    const { data } = supabase.storage.from("posts").getPublicUrl(filePath);

    return {
      path: filePath,
      url: data.publicUrl,
    };
  }

  return { uploadImage };
}
