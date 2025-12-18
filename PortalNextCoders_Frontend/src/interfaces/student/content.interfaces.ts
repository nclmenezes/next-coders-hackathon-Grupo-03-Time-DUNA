export interface IContent {
  contentId: number;
  sectionId: number;
  name: string;
  description: string;
  contentType: string;
  link: string;
  isCompleted: boolean;
  nextContentId: number;
  createdAt: Date | string;
}

export interface IContentItem {
  contentId: number;
  contentTitle: string;
  contentType: string;
  isCompleted: boolean;
  isAllowed?: boolean;
}

export interface IContentProgress {
  sectionId: number;
  sectionTitle: string;
  studentProgress: number;
  contents: IContentItem[];
}
