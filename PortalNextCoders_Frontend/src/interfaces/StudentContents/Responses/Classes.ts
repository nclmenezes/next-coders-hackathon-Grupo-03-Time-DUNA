export type ClassDto = {
  id: number;
  studentId: number;
  title: string;
  description: string;
  currentSubModuleId: number;  
  activeCurrentSubModule: boolean;
  startDate: Date;
  endDate: Date;
  statusProgress: StatusProgress;
  trails: TrailDto[]
};

export type TrailDto = {
  id: number;
  title: string;
  description: string;
  isAllowed: boolean;
  statusProgress: StatusProgress;
  modules: ModuleDto[]
};

export type ModuleDto = {
  id: number;
  title: string;
  trailId: number | 0;
  description: string;
  limitDate: string;
  isAllowed: boolean;
  statusProgress: StatusProgress;
  subModules: SubModuleDto[]
};

export type SubModuleDto = {
  id: number;
  title: string;
  description: string;
  subModuleTypeId: number;
  isAllowed: boolean;
  releaseTrial : boolean;
  statusProgress: StatusProgress;
  sections: SectionDto[]
};

export type HandsOnDto = {
  id: number,
  studentClassId: number,
  trailId: number,
  moduleId: number,
  subModuleId: number,
  contentId: number,
  link: string,
  register: boolean,
  handsOnTypeId: number,
  maxDate: string,
  createdAt: string,
  createdBy: string,
  updatedAt: string,
  updatedBy: string,
  deletedAt: string,
  deletedBy: string,
  isDeleted: null,
  includedDate: string
};

export type HandsOnLink = {
  link: string,
  handsOnTypeId: 1 | 2 | null,
};

export type SectionDto = {
  id: number;
  title: string;
  description: string;
  content: ContentDto;
};

export type ContentDto = {
  id: number;
  contentType: ContentType;
  assessmentId: number;
  title: string;
  description: string;
  link: string;
  duration: number;
  isCompleted: boolean;
  isAllowed: boolean;
  creationDate: Date;
  orderNumber: number;
  linkDescription: string;
  handsOn: {handsOnTypeId: 1 | 2 | null, link: string}
};

export type ContentType = {
  id: number;
  type: string;
};

export type StatusProgress = {
  totalTime: number;
  concluidedTime: number;
  concluidedPercent: number;
  assessmentId: number | null;
};

export interface SaveContentDto {
  contentId: number;
};