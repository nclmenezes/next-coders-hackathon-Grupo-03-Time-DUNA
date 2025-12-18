import storageRepository from "../repositories/storage-repository";

export function authHeader(): { Authorization: string } {
  const token = storageRepository.get("accessToken"); 
  return { Authorization: token ? `Bearer ${token.accessToken}` : "" };
};