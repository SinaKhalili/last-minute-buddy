import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { supabase } from "../../database/supabase";

export default function Avatar({
  url,
  size,
  onUpload,
}: {
  url: string;
  size: number;
  onUpload: (url: string) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <Flex justifyContent="center" flexDir="column" alignItems="center">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          h={size}
          w={size}
          borderRadius="6px"
        />
      ) : (
        <Image
          src={
            "https://sdzfoliimaqiexsuffjc.supabase.co/storage/v1/object/public/defaults/default_profile_square.png"
          }
          alt="Avatar"
          h={size}
          w={size}
          borderRadius="6px"
        />
      )}
      <FormLabel htmlFor="single" mt="16px">
        {uploading ? "Uploading ..." : "Upload Profile Photo"}
      </FormLabel>
      <input
        style={{
          visibility: "hidden",
          position: "absolute",
        }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
      />
    </Flex>
  );
}
