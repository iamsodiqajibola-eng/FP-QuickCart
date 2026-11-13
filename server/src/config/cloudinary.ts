import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

// Every product photo is kept in the quickcart/products folder.

export const PHOTO_FOLDER = "quickcart/products";
export const UPLOAD_FOLDER = `${PHOTO_FOLDER}/uploads`;

// Check whether Cloudinary credentials are available.

export const isCloudinaryReady = Boolean(
  env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret,
);

export const CLOUDINARY_MISSING =
  "Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to server/.env";

// Configure Cloudinary.

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true,
});

// Base URL for product photos.

const PHOTO_URL_START = `https://res.cloudinary.com/${env.cloudinaryCloudName}/image/upload/f_auto,q_auto/`;

// Convert a Cloudinary public ID into a photo URL.

export const photoUrl = (publicId: string) => {
  return PHOTO_URL_START + publicId;
};

// Get a demo product photo using its slug.

export const productPhotoUrl = (slug: string) => {
  return photoUrl(`${PHOTO_FOLDER}/${slug}`);
};

// Check whether a URL belongs to our product photo folder.

export const isOurPhoto = (url: string) => {
  if (
    !isCloudinaryReady ||
    !url.startsWith(PHOTO_URL_START + PHOTO_FOLDER + "/")
  ) {
    return false;
  }

  return /^[\w/-]+$/.test(url.slice(PHOTO_URL_START.length));
};

// Get the public ID of an uploaded admin photo.

export const uploadedPhotoId = (url: string) => {
  if (
    !isCloudinaryReady ||
    !url.startsWith(PHOTO_URL_START + UPLOAD_FOLDER + "/")
  ) {
    return null;
  }

  return url.slice(PHOTO_URL_START.length);
};

// Upload a photo to Cloudinary.

export const uploadPhoto = (bytes: Buffer, publicId: string) => {
  return new Promise<string>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary didn't respond"));
          return;
        }

        resolve(result.public_id);
      },
    );

    upload.end(bytes);
  });
};

// Delete one photo from Cloudinary.

export const deletePhoto = async (publicId: string) => {
  await cloudinary.uploader
    .destroy(publicId, { invalidate: true })
    .catch(() => {});
};

// Delete every photo uploaded by admins.

export const deleteAllUploadedPhotos = async () => {
  if (!isCloudinaryReady) {
    return;
  }

  await cloudinary.api
    .delete_resources_by_prefix(`${UPLOAD_FOLDER}/`)
    .catch(() => {});
};

// List all demo product photo public IDs from Cloudinary.

export const listProductionPhotoIds = async (): Promise<string[]> => {
  if (!isCloudinaryReady) {
    return [];
  }

  const photoIds: string[] = [];
  let nextCursor: string | undefined;

  do {
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: `${PHOTO_FOLDER}/`,
      max_results: 500,
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    });

    photoIds.push(
      ...result.resources.map(
        (resource: { public_id: string }) => resource.public_id,
      ),
    );

    nextCursor = result.next_cursor;
  } while (nextCursor);

  return photoIds;
};
