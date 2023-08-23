"use server";

import prisma from "@/db";

export async function muteReviewNotification(reviewId) {
  await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      notifEnable: false,
    },
  });
}

export async function unMuteReviewNotification(reviewId) {
  await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      notifEnable: true,
    },
  });
}
