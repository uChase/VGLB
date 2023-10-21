"use server";

import prisma from "@/db";
import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import imageType from "image-type";
import { revalidatePath } from "next/cache";

dotenv.config();

const cloudFlareUrl = "https://d38r4fcwx16olc.cloudfront.net";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

export async function pushImage(
  image,
  username,
  userId,
  currentImage,
  imageVersion
) {
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: "us-west-1",
  });

  let base64Image = image.split(";base64,").pop();
  let buff = Buffer.from(base64Image, "base64");

  // Check if it's an image
  const type = imageType(buff);

  if (!type) {
    throw new Error("The file provided is not an image.");
  }

  // Further validate that it's not an SVG file (as these can contain malicious scripts)
  if (type.mime === "image/svg+xml") {
    throw new Error("SVG files are not allowed.");
  }

  if (buff.length > 1000 * 1000) {
    throw new Error(
      "The image is too large. Please upload an image of size less than 1MB."
    );
  }
  console.log(currentImage);
  if (currentImage != "https://d38r4fcwx16olc.cloudfront.net/default.jpg") {
    const deleteParams = {
      Bucket: "devvglb",
      Key: `profilepictures/${currentImage.split("/").pop()}`, // ie the profilespic/...
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
    console.log("ran jan");
  }
  const newImageVersion = 1 + parseInt(imageVersion);

  let params = {
    Bucket: "devvglb",
    Key: `profilepictures/${userId}_${newImageVersion}.jpg`, // File name you want to save as
    Body: buff,
    ContentEncoding: "base64", // required
    ContentType: type.mime, // required. Notice the back ticks
  };

  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    const imageUrl = `${cloudFlareUrl}/profilepictures/${userId}_${newImageVersion}.jpg`;

    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl, imageVersion: newImageVersion },
    });
  } catch (error) {
    throw new Error(error);
  }
}
