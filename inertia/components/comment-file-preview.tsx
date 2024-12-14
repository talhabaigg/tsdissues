const FilePreview = ({ file }: { file: File | string }) => {
  // Logic for rendering file preview
  // Similar to the renderFilePreview function you previously had
  const renderFilePreview = (file: File | string) => {
    if (!file) return null;

    const BASE_URL = "http://127.0.0.1:8000/storage/";

    const isFileObject = file instanceof File;
    const fileUrl = isFileObject
      ? URL.createObjectURL(file)
      : `${BASE_URL}${file}`;

    const fileType = isFileObject
      ? file.type.split("/")[0]
      : file.split(".").pop()?.toLowerCase();

    if (
      fileType === "image" ||
      ["png", "jpg", "jpeg", "gif"].includes(fileType)
    ) {
      return (
        <img
          src={fileUrl}
          alt="Uploaded"
          className="w-full max-h-64 rounded-lg object-contain border p-1"
        />
      );
    }

    if (fileType === "video" || ["mp4", "avi", "mov"].includes(fileType)) {
      return (
        <video controls className="w-full max-h-64">
          <source src={fileUrl} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType === "pdf") {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline text-sm"
        >
          <img
            src="/PDF_file_icon.svg"
            className="w-24 h-24 -ml-2"
            alt="pdf image"
          />
          View PDF
        </a>
      );
    }

    return <span className="text-gray-500">Unsupported file type</span>;
  };

  return <div>{renderFilePreview(file)}</div>;
};

export { FilePreview };
