export interface PostImageResponse {
  createAt: string;
  uuid: string;
}

export interface Image {
  url: string;
}

export interface DeleteImageResponse {
  timestamp: string;
  message: string;
}
