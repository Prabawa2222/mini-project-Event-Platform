export interface Review {
  id: number;
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    profilePicture?: string;
  };
}

export interface CreateReviewDto {
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
}
