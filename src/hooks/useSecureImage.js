import { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "BaseUrl";

const useSecureImage = (filePath, token) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!filePath || !token) return;

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/file/downloadFile/?filePath=${encodeURIComponent(filePath)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          }
        );
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
        setImageSrc("");
      }
    };

    fetchImage();
  }, [filePath, token]);

  return imageSrc;
};

export default useSecureImage;
